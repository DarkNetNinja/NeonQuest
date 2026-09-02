"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"

type Mode = "login" | "signup"

export function AuthCard({ mode }: { mode: Mode }) {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const isLogin = mode === "login"

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    const supabase = createClient()

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) {
          // Genericize the credential signal to avoid account enumeration.
          setError(
            error.message.toLowerCase().includes("confirm")
              ? "Please confirm your email before logging in."
              : "Invalid email or password.",
          )
          return
        }
        router.push("/")
        router.refresh()
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo:
              process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL ?? `${window.location.origin}/auth/callback`,
          },
        })
        if (error) {
          setError(error.message)
          return
        }
        router.push("/auth/sign-up-success")
      }
    } catch {
      setError("Something went wrong. Try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="relative flex min-h-svh items-center justify-center overflow-hidden p-6">
      {/* Ambient neon glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/3 h-72 w-72 -translate-x-1/2 rounded-full opacity-30 blur-3xl"
        style={{ background: "radial-gradient(circle, var(--neon-magenta), transparent 70%)" }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute right-1/4 bottom-1/4 h-72 w-72 rounded-full opacity-20 blur-3xl"
        style={{ background: "radial-gradient(circle, var(--neon-cyan), transparent 70%)" }}
      />

      <div className="box-glow-cyan relative w-full max-w-md rounded-lg border border-border bg-card/90 p-8 backdrop-blur">
        <div className="text-center">
          <p className="font-mono text-xs uppercase tracking-[0.35em] text-neon-magenta">NeonQuest</p>
          <h1 className="mt-2 font-sans text-3xl font-bold uppercase tracking-wide text-balance text-glow-cyan">
            {isLogin ? "Jack In" : "New Runner"}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {isLogin ? "Authenticate to resume your run." : "Register your profile to start leveling up."}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-4">
          <label className="flex flex-col gap-1.5">
            <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground">Email</span>
            <input
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="rounded-md border border-input bg-background/60 px-3 py-2.5 font-mono text-sm text-foreground outline-none transition focus:border-neon-cyan focus:ring-1 focus:ring-neon-cyan"
              placeholder="runner@grid.net"
            />
          </label>

          <label className="flex flex-col gap-1.5">
            <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground">Password</span>
            <input
              type="password"
              required
              autoComplete={isLogin ? "current-password" : "new-password"}
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="rounded-md border border-input bg-background/60 px-3 py-2.5 font-mono text-sm text-foreground outline-none transition focus:border-neon-cyan focus:ring-1 focus:ring-neon-cyan"
              placeholder="••••••••"
            />
          </label>

          {error && (
            <p
              role="alert"
              className="rounded-md border border-destructive/50 bg-destructive/10 px-3 py-2 text-sm text-destructive"
            >
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="box-glow-magenta mt-2 rounded-md bg-accent px-5 py-3 font-sans text-sm font-bold uppercase tracking-widest text-accent-foreground transition-transform hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Connecting..." : isLogin ? "Enter the Grid" : "Create Profile"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          {isLogin ? "No profile yet? " : "Already a runner? "}
          <Link
            href={isLogin ? "/auth/sign-up" : "/auth/login"}
            className="font-semibold text-neon-cyan underline-offset-4 hover:underline"
          >
            {isLogin ? "Sign up" : "Log in"}
          </Link>
        </p>
      </div>
    </main>
  )
}
