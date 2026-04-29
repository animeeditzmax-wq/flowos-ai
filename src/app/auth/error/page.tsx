import Link from "next/link";

export default function AuthErrorPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#EBDBC2] px-4">
      <section className="w-full max-w-md rounded-2xl border border-white/60 bg-white/50 p-6 text-slate-800 backdrop-blur-xl">
        <h1 className="text-2xl font-semibold">Authentication setup needed</h1>
        <p className="mt-2 text-sm">Google sign-in is currently unavailable. Use email login/signup or configure Google OAuth keys in environment variables.</p>
        <Link href="/auth/signin" className="mt-4 inline-block rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white">Back to login</Link>
      </section>
    </main>
  );
}
