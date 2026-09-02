import Link from "next/link"

export default function AuthErrorPage() {
  return (
    <main className="flex min-h-svh items-center justify-center p-6">
      <div className="w-full max-w-md rounded-lg border border-destructive/50 bg-card p-8 text-center shadow-[0_0_22px_oklch(0.63_0.24_20/30%)]">
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-destructive">System Fault</p>
        <h1 className="mt-3 font-sans text-2xl font-bold text-balance">Authentication failed</h1>
        <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
          {"The link may have expired or already been used. Try logging in again to re-establish the connection."}
        </p>
        <Link
          href="/auth/login"
          className="box-glow-cyan mt-6 inline-flex items-center justify-center rounded-md bg-primary px-5 py-2.5 font-sans text-sm font-bold uppercase tracking-wider text-primary-foreground transition-transform hover:scale-[1.02]"
        >
          Back to Login
        </Link>
      </div>
    </main>
  )
}
