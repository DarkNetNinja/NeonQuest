'use client'

import { motion } from 'motion/react'
import { Crown, Flame, Palette, BarChart3, Infinity as InfinityIcon, RotateCcw } from 'lucide-react'
import { type GameState } from '@/lib/game'

// Lemon Squeezy checkout link for Pro Guild.
const CHECKOUT_URL = 'https://neonquest.lemonsqueezy.com/checkout/buy/4434d9a3-8b79-450d-9d0a-6941392df71a'

function StreakCard({ streak }: { streak: number }) {
  const flames = Math.min(streak, 7)
  return (
    <div className="relative overflow-hidden rounded-lg border border-border bg-card/60 p-5 backdrop-blur-sm"
      style={{ boxShadow: 'inset 0 0 20px color-mix(in oklch, var(--neon-amber) 12%, transparent)' }}
    >
      <div className="flex items-center gap-2 font-sans text-xs uppercase tracking-widest text-[var(--neon-amber)]">
        <Flame className="size-4" /> Active Streak
      </div>
      <div className="mt-3 flex items-end gap-2">
        <motion.span
          key={streak}
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 260, damping: 16 }}
          className="font-sans text-5xl font-bold leading-none text-[var(--neon-amber)]"
          style={{ textShadow: '0 0 16px var(--neon-amber)' }}
        >
          {streak}
        </motion.span>
        <span className="pb-1 font-mono text-sm text-muted-foreground">
          {streak === 1 ? 'day' : 'days'}
        </span>
      </div>
      <div className="mt-4 flex gap-1.5">
        {Array.from({ length: 7 }).map((_, i) => (
          <motion.span
            key={i}
            animate={i < flames ? { opacity: [0.6, 1, 0.6] } : {}}
            transition={{ duration: 1.6, repeat: Infinity, delay: i * 0.15 }}
            className="h-1.5 flex-1 rounded-full"
            style={{
              backgroundColor: i < flames ? 'var(--neon-amber)' : 'var(--border)',
              boxShadow: i < flames ? '0 0 8px var(--neon-amber)' : undefined,
            }}
          />
        ))}
      </div>
      <p className="mt-3 font-mono text-xs text-muted-foreground">
        {streak === 0
          ? 'Complete a task today to ignite your streak.'
          : 'Keep going — miss a day and it resets to zero.'}
      </p>
    </div>
  )
}

const PERKS = [
  { icon: Palette, label: 'Custom avatars & themes' },
  { icon: BarChart3, label: 'Advanced analytics' },
  { icon: InfinityIcon, label: 'Unlimited habits' },
]

function ProGuildCard() {
  return (
    <div className="relative overflow-hidden rounded-lg border border-[var(--neon-magenta)]/50 bg-card/60 p-5 backdrop-blur-sm box-glow-magenta">
      <div className="pointer-events-none absolute -right-10 -top-10 size-32 rounded-full bg-[var(--neon-magenta)] opacity-20 blur-2xl" />
      <div className="relative">
        <div className="flex items-center gap-2 font-sans text-sm font-bold uppercase tracking-widest text-[var(--neon-magenta)] text-glow-magenta">
          <Crown className="size-5" /> Pro Guild
        </div>
        <p className="mt-2 font-mono text-sm text-muted-foreground">
          Ascend beyond the free tier and unlock elite operator gear.
        </p>
        <ul className="mt-4 space-y-2">
          {PERKS.map((perk) => (
            <li key={perk.label} className="flex items-center gap-2.5 font-mono text-sm text-foreground">
              <perk.icon className="size-4 shrink-0 text-[var(--neon-cyan)]" />
              {perk.label}
            </li>
          ))}
        </ul>
        <motion.a
          href={CHECKOUT_URL}
          target="_blank"
          rel="noopener noreferrer"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          className="mt-5 flex items-center justify-center gap-2 rounded-md py-3 font-sans text-sm font-bold uppercase tracking-widest text-background"
          style={{
            background: 'linear-gradient(90deg, var(--neon-magenta), var(--neon-cyan))',
            boxShadow: '0 0 20px color-mix(in oklch, var(--neon-magenta) 60%, transparent)',
          }}
        >
          <Crown className="size-4" /> Unlock Pro Guild
        </motion.a>
        <p className="mt-2 text-center font-mono text-[11px] text-muted-foreground">
          $4.99/mo for 4 months · cancel anytime
        </p>
      </div>
    </div>
  )
}

export function SidePanel({
  state,
  onReset,
}: {
  state: GameState
  onReset: () => void
}) {
  return (
    <aside className="flex flex-col gap-5">
      <StreakCard streak={state.streak} />
      <ProGuildCard />
      <button
        type="button"
        onClick={() => {
          if (confirm('Reset all progress? This cannot be undone.')) onReset()
        }}
        className="flex items-center justify-center gap-2 rounded-md border border-border py-2.5 font-mono text-xs uppercase tracking-widest text-muted-foreground transition-colors hover:border-destructive hover:text-destructive"
      >
        <RotateCcw className="size-3.5" /> Reset Progress
      </button>
    </aside>
  )
}
