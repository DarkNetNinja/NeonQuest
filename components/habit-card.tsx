'use client'

import { AnimatePresence, motion } from 'motion/react'
import { Check, Trash2, Zap } from 'lucide-react'
import { useState } from 'react'
import { type Habit, STAT_META } from '@/lib/game'
import { FloatingText, type FloatItem } from '@/components/floating-text'
import { ParticleBurst } from '@/components/particle-burst'
import { playComplete } from '@/lib/sound'

export function HabitCard({
  habit,
  onComplete,
  onRemove,
}: {
  habit: Habit
  onComplete: (id: string) => void
  onRemove: (id: string) => void
}) {
  const [burstKey, setBurstKey] = useState(0)
  const [floats, setFloats] = useState<FloatItem[]>([])
  const stat = STAT_META[habit.reward.stat]
  const done = habit.completedToday

  function handleComplete() {
    if (done) return
    playComplete()
    setBurstKey((k) => k + 1)
    const now = Date.now()
    setFloats([
      { id: `xp-${now}`, label: `+${habit.xp} XP`, color: 'var(--neon-lime)' },
      { id: `st-${now}`, label: `+${habit.reward.amount} ${stat.label}`, color: stat.colorVar },
    ])
    window.setTimeout(() => setFloats([]), 1000)
    onComplete(habit.id)
  }

  return (
    <motion.li
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="group relative flex items-center gap-4 overflow-hidden rounded-lg border border-border bg-card/60 p-4 backdrop-blur-sm transition-colors"
      style={done ? { borderColor: 'var(--neon-lime)' } : undefined}
    >
      {/* left accent tick */}
      <span
        className="absolute inset-y-0 left-0 w-1"
        style={{ backgroundColor: done ? 'var(--neon-lime)' : stat.colorVar, opacity: done ? 1 : 0.6 }}
      />

      <div className="relative min-w-0 flex-1 pl-1">
        <h3
          className="truncate font-sans text-base font-semibold tracking-wide"
          style={done ? { color: 'var(--neon-lime)' } : undefined}
        >
          {habit.name}
        </h3>
        <div className="mt-1.5 flex flex-wrap items-center gap-2 font-sans text-xs">
          <span
            className="inline-flex items-center gap-1 rounded-sm px-2 py-0.5 font-bold"
            style={{ color: stat.colorVar, backgroundColor: `${stat.colorVar}1a` }}
          >
            +{habit.reward.amount} {stat.label}
          </span>
          <span className="inline-flex items-center gap-1 rounded-sm bg-[var(--neon-lime)]/10 px-2 py-0.5 font-bold text-[var(--neon-lime)]">
            <Zap className="size-3" /> +{habit.xp} XP
          </span>
        </div>
      </div>

      {/* remove */}
      <button
        type="button"
        onClick={() => onRemove(habit.id)}
        aria-label={`Delete ${habit.name}`}
        className="shrink-0 rounded-md p-2 text-muted-foreground opacity-0 transition-opacity hover:bg-destructive/20 hover:text-destructive focus-visible:opacity-100 group-hover:opacity-100"
      >
        <Trash2 className="size-4" />
      </button>

      {/* complete button */}
      <div className="relative shrink-0">
        <FloatingText items={floats} />
        {burstKey > 0 && <ParticleBurst key={burstKey} />}
        <motion.button
          type="button"
          whileTap={{ scale: 0.88 }}
          whileHover={done ? undefined : { scale: 1.06 }}
          onClick={handleComplete}
          disabled={done}
          aria-label={done ? `${habit.name} completed` : `Complete ${habit.name}`}
          className="relative flex size-14 items-center justify-center rounded-full border-2 font-sans transition-colors"
          style={
            done
              ? {
                  borderColor: 'var(--neon-lime)',
                  color: 'var(--neon-lime)',
                  backgroundColor: 'color-mix(in oklch, var(--neon-lime) 18%, transparent)',
                  boxShadow: '0 0 16px var(--neon-lime)',
                }
              : {
                  borderColor: 'var(--neon-cyan)',
                  color: 'var(--neon-cyan)',
                  backgroundColor: 'color-mix(in oklch, var(--neon-cyan) 10%, transparent)',
                  boxShadow: '0 0 14px color-mix(in oklch, var(--neon-cyan) 55%, transparent)',
                }
          }
        >
          <AnimatePresence mode="wait" initial={false}>
            {done ? (
              <motion.span
                key="done"
                initial={{ scale: 0, rotate: -90 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', stiffness: 300, damping: 15 }}
              >
                <Check className="size-6" strokeWidth={3} />
              </motion.span>
            ) : (
              <motion.span
                key="go"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="font-sans text-xs font-bold uppercase tracking-widest"
              >
                Go
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>
      </div>
    </motion.li>
  )
}
