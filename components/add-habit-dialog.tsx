'use client'

import { AnimatePresence, motion } from 'motion/react'
import { Plus, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { type StatReward } from '@/lib/game'

type Props = {
  onAdd: (name: string, xp: number, reward: StatReward) => void
}

const STAT_OPTIONS: { key: 'STR' | 'DISC'; label: string; color: string }[] = [
  { key: 'STR', label: 'Strength', color: 'var(--neon-magenta)' },
  { key: 'DISC', label: 'Discipline', color: 'var(--neon-cyan)' },
]

export function AddHabitDialog({ onAdd }: Props) {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState('')
  const [stat, setStat] = useState<'STR' | 'DISC'>('STR')
  const [amount, setAmount] = useState(15)
  const [xp, setXp] = useState(20)

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false)
    }
    if (open) window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  function reset() {
    setName('')
    setStat('STR')
    setAmount(15)
    setXp(20)
  }

  function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim()) return
    onAdd(name, xp, { stat, amount })
    reset()
    setOpen(false)
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex w-full items-center justify-center gap-2 rounded-lg border-2 border-dashed border-[var(--neon-cyan)]/50 bg-card/30 py-4 font-sans text-sm font-bold uppercase tracking-widest text-[var(--neon-cyan)] transition-colors hover:border-[var(--neon-cyan)] hover:bg-[var(--neon-cyan)]/10"
      >
        <Plus className="size-5" /> Add New Task
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-50 flex items-end justify-center bg-background/80 p-4 backdrop-blur-sm sm:items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
          >
            <motion.form
              onClick={(e) => e.stopPropagation()}
              onSubmit={submit}
              initial={{ y: 40, opacity: 0, scale: 0.98 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 40, opacity: 0, scale: 0.98 }}
              transition={{ type: 'spring', stiffness: 220, damping: 24 }}
              className="w-full max-w-md rounded-lg border border-border bg-card p-6 box-glow-magenta"
            >
              <div className="mb-5 flex items-center justify-between">
                <h2 className="font-sans text-xl font-bold tracking-wide text-[var(--neon-magenta)] text-glow-magenta">
                  New Quest
                </h2>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label="Close"
                  className="rounded-md p-1 text-muted-foreground hover:text-foreground"
                >
                  <X className="size-5" />
                </button>
              </div>

              <label className="mb-4 block">
                <span className="mb-1.5 block font-sans text-xs uppercase tracking-widest text-muted-foreground">
                  Task name
                </span>
                <input
                  autoFocus
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Meditate 10 minutes"
                  className="w-full rounded-md border border-border bg-background/70 px-3 py-2.5 font-mono text-foreground outline-none placeholder:text-muted-foreground focus:border-[var(--neon-cyan)] focus:ring-1 focus:ring-[var(--neon-cyan)]"
                />
              </label>

              <div className="mb-4">
                <span className="mb-1.5 block font-sans text-xs uppercase tracking-widest text-muted-foreground">
                  Stat category
                </span>
                <div className="grid grid-cols-2 gap-3">
                  {STAT_OPTIONS.map((opt) => {
                    const active = stat === opt.key
                    return (
                      <button
                        key={opt.key}
                        type="button"
                        onClick={() => setStat(opt.key)}
                        className="rounded-md border-2 px-3 py-2.5 font-sans text-sm font-bold uppercase tracking-wider transition-colors"
                        style={{
                          borderColor: active ? opt.color : 'var(--border)',
                          color: active ? opt.color : 'var(--muted-foreground)',
                          backgroundColor: active ? `${opt.color}1a` : 'transparent',
                          boxShadow: active ? `0 0 12px ${opt.color}66` : undefined,
                        }}
                      >
                        {opt.label}
                      </button>
                    )
                  })}
                </div>
              </div>

              <div className="mb-6 grid grid-cols-2 gap-4">
                <label className="block">
                  <span className="mb-1.5 block font-sans text-xs uppercase tracking-widest text-muted-foreground">
                    Stat reward: {amount}
                  </span>
                  <input
                    type="range"
                    min={5}
                    max={30}
                    step={1}
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    className="w-full accent-[var(--neon-magenta)]"
                  />
                </label>
                <label className="block">
                  <span className="mb-1.5 block font-sans text-xs uppercase tracking-widest text-muted-foreground">
                    XP reward: {xp}
                  </span>
                  <input
                    type="range"
                    min={5}
                    max={50}
                    step={5}
                    value={xp}
                    onChange={(e) => setXp(Number(e.target.value))}
                    className="w-full accent-[var(--neon-lime)]"
                  />
                </label>
              </div>

              <button
                type="submit"
                disabled={!name.trim()}
                className="w-full rounded-md bg-[var(--neon-cyan)] py-3 font-sans text-sm font-bold uppercase tracking-widest text-background transition-opacity hover:opacity-90 disabled:opacity-40"
                style={{ boxShadow: '0 0 18px color-mix(in oklch, var(--neon-cyan) 55%, transparent)' }}
              >
                Deploy Quest
              </button>
            </motion.form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
