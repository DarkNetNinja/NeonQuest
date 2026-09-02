import Link from "next/link"

export default function SignUpSuccessPage() {
  return (
    <main className="flex min-h-svh items-center justify-center p-6">
      <div className="box-glow-cyan w-full max-w-md rounded-lg border border-border bg-card p-8 text-center">
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-neon-cyan">Transmission Sent</p>
        <h1 className="mt-3 font-sans text-2xl font-bold text-balance text-glow-cyan">Check your inbox</h1>
        <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
          {
            "We've dispatched a confirmation link to your email. Verify your account to activate your runner profile, then jack back in."
          }
        </p>
        <Link
          href="/auth/login"
          className="box-glow-cyan mt-6 inline-flex items-center justify-center rounded-md bg-primary px-5 py-2.5 font-sans text-sm font-bold uppercase tracking-wider text-primary-foreground transition-transform hover:scale-[1.02]"
        >
          Return to Login
        </Link>
      </div>
    </main>
  )
}
