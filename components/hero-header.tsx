'use client'

import { motion } from 'motion/react'
import { Dumbbell, Brain, Flame, LogOut, User as UserIcon } from 'lucide-react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { type GameState, titleForLevel, xpForLevel } from '@/lib/game'
import { createClient } from '@/lib/supabase/client'
import { type User } from '@supabase/supabase-js'

function StatChip({
  icon,
  label,
  value,
  color,
}: {
  icon: React.ReactNode
  label: string
  value: number
  color: string
}) {
  return (
    <div
      className="flex flex-1 items-center gap-3 rounded-md border border-border bg-card/60 px-3 py-2.5 backdrop-blur-sm"
      style={{ boxShadow: `inset 0 0 12px ${color}22` }}
    >
      <span
        className="flex size-9 shrink-0 items-center justify-center rounded-md"
        style={{ color, backgroundColor: `${color}1a`, boxShadow: `0 0 10px ${color}55` }}
      >
        {icon}
      </span>
      <div className="min-w-0">
        <div className="font-sans text-[10px] uppercase tracking-widest text-muted-foreground">
          {label}
        </div>
        <div className="font-sans text-xl font-bold leading-none" style={{ color }}>
          {value}
        </div>
      </div>
    </div>
  )
}

export function HeroHeader({ 
  state, 
  user 
}: { 
  state: GameState
  user?: User | null 
}) {
  const router = useRouter()
  const supabase = createClient()

  const need = xpForLevel(state.level)
  const pct = Math.min(100, Math.round((state.xp / need) * 100))

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.refresh()
  }

  return (
    <section className="relative overflow-hidden rounded-lg border border-border bg-card/50 p-5 backdrop-blur-sm box-glow-cyan sm:p-6">
      <div className="pointer-events-none absolute -right-16 -top-16 size-52 rounded-full bg-[var(--neon-magenta)] opacity-10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-20 -left-10 size-52 rounded-full bg-[var(--neon-cyan)] opacity-10 blur-3xl" />

      {/* Top Bar: User Badge & Logout Button */}
      <div className="mb-4 flex items-center justify-between border-b border-border/50 pb-3">
        <div className="flex items-center gap-2">
          <UserIcon className="size-4 text-[var(--neon-cyan)]" />
          <span className="font-sans text-xs tracking-wider text-muted-foreground">
            {user?.email ?? 'AGENT_UNAUTHENTICATED'}
          </span>
        </div>

        {user && (
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 rounded-md border border-rose-500/50 bg-rose-950/20 px-2.5 py-1 text-xs font-bold text-rose-400 transition hover:bg-rose-500/20 hover:text-rose-300"
          >
            <LogOut className="size-3.5" />
            <span>LOGOUT</span>
          </button>
        )}
      </div>

      <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center">
        {/* Avatar */}
        <div className="relative shrink-0 self-start sm:self-center">
          <motion.div
            animate={{ boxShadow: ['0 0 0 2px var(--neon-cyan)', '0 0 22px 2px var(--neon-cyan)', '0 0 0 2px var(--neon-cyan)'] }}
            transition={{ duration: 2.4, repeat: Infinity }}
            className="relative size-20 overflow-hidden rounded-md sm:size-24"
          >
            <Image
              src="/avatar-cyber.png"
              alt="Player avatar"
              fill
              sizes="96px"
              className="object-cover"
              priority
            />
          </motion.div>
          <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 rounded-sm border border-[var(--neon-cyan)] bg-background px-2 py-0.5 font-sans text-xs font-bold text-[var(--neon-cyan)] text-glow-cyan">
            LVL {state.level}
          </span>
        </div>

        {/* Identity + XP */}
        <div className="min-w-0 flex-1">
          <p className="font-sans text-[11px] uppercase tracking-[0.3em] text-[var(--neon-magenta)] text-glow-magenta">
            Active Title
          </p>
          <h1 className="mt-1 truncate font-sans text-2xl font-bold tracking-wide text-foreground sm:text-3xl">
            {titleForLevel(state.level)}
          </h1>

          <div className="mt-4">
            <div className="mb-1.5 flex items-center justify-between font-sans text-xs uppercase tracking-wider text-muted-foreground">
              <span>XP to next level</span>
              <span className="text-[var(--neon-cyan)]">
                {state.xp} / {need}
              </span>
            </div>
            <div className="relative h-4 overflow-hidden rounded-full border border-border bg-background/70">
              <motion.div
                className="h-full rounded-full"
                style={{
                  background:
                    'linear-gradient(90deg, var(--neon-cyan), var(--neon-magenta))',
                  boxShadow: '0 0 12px var(--neon-cyan)',
                }}
                initial={false}
                animate={{ width: `${pct}%` }}
                transition={{ type: 'spring', stiffness: 120, damping: 20 }}
              />
              <div className="pointer-events-none absolute inset-0 flex items-center justify-center font-sans text-[10px] font-bold tracking-widest text-foreground/90">
                {pct}%
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="relative mt-5 flex flex-col gap-3 sm:flex-row">
        <StatChip
          icon={<Dumbbell className="size-5" />}
          label="Strength"
          value={state.str}
          color="var(--neon-magenta)"
        />
        <StatChip
          icon={<Brain className="size-5" />}
          label="Discipline"
          value={state.disc}
          color="var(--neon-cyan)"
        />
        <StatChip
          icon={<Flame className="size-5" />}
          label="Streak"
          value={state.streak}
          color="var(--neon-amber)"
        />
      </div>
    </section>
  )
}