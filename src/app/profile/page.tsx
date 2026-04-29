import { auth } from "@/server/auth/options";
import { redirect } from "next/navigation";

export default async function ProfilePage() {
  const session = await auth();
  if (!session?.user) redirect("/auth/signin");

  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-2xl font-semibold">Profile</h1>
      <div className="mt-4 rounded-xl border border-white/10 bg-slate-900/50 p-4 text-sm">
        <p>Name: {session.user.name ?? "Not provided"}</p>
        <p>Email: {session.user.email ?? "Not provided"}</p>
        <p>Role: {session.user.role}</p>
      </div>
    </main>
  );
}
