import NextAuth, { type NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import bcrypt from "bcryptjs";
import { prisma } from "@/server/db/prisma";
import { fallbackUsers } from "@/server/auth/fallback-store";

const providers: NextAuthConfig["providers"] = [
  Credentials({
    name: "Credentials",
    credentials: {
      email: { label: "Email", type: "email" },
      password: { label: "Password", type: "password" }
    },
    authorize: async (credentials) => {
      if (!credentials?.email || !credentials.password) return null;
      const email = String(credentials.email).trim().toLowerCase();

      if (!process.env.DATABASE_URL) {
        const localUser = fallbackUsers.get(email);
        if (!localUser) return null;
        const validLocal = await bcrypt.compare(credentials.password as string, localUser.passwordHash);
        if (!validLocal) return null;
        return { id: localUser.id, email: localUser.email, name: localUser.name, role: localUser.role };
      }

      const user = await prisma.user.findUnique({ where: { email } });
      if (!user?.passwordHash) return null;
      const valid = await bcrypt.compare(credentials.password as string, user.passwordHash);
      if (!valid) return null;
      return { id: user.id, email: user.email, name: user.name, role: user.role };
    }
  })
];

if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  providers.unshift(
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          scope:
            "openid email profile https://www.googleapis.com/auth/gmail.readonly https://www.googleapis.com/auth/calendar.readonly"
        }
      }
    })
  );
}

export const authConfig: NextAuthConfig = {
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  providers,
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error"
  },
  callbacks: {
    jwt: async ({ token, user }) => {
      if (user) token.role = (user as { role?: string }).role ?? "USER";
      return token;
    },
    session: async ({ session, token }) => {
      if (session.user) {
        session.user.id = token.sub ?? "";
        session.user.role = (token.role as string) ?? "USER";
      }
      return session;
    }
  }
};

export const { auth, handlers, signIn, signOut } = NextAuth(authConfig);
