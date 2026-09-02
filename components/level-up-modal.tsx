'use client'

import { AnimatePresence, motion } from 'motion/react'
import { useEffect } from 'react'
import { titleForLevel } from '@/lib/game'
import { ParticleBurst } from '@/components/particle-burst'
import { playLevelUp } from '@/lib/sound'

export function LevelUpModal({
  level,
  onClose,
}: {
  level: number | null
  onClose: () => void
}) {
  useEffect(() => {
    if (level !== null) playLevelUp()
  }, [level])

  return (
    <AnimatePresence>
      {level !== null && (
        <motion.div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-background/85 p-4 backdrop-blur-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          {/* big radial burst */}
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <ParticleBurst count={44} radius={260} />
          </div>

          <motion.div
            onClick={(e) => e.stopPropagation()}
            initial={{ scale: 0.6, opacity: 0, y: 30 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.7, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 200, damping: 18 }}
            className="relative w-full max-w-sm overflow-hidden rounded-xl border-2 border-[var(--neon-cyan)] bg-card p-8 text-center box-glow-cyan"
          >
            <motion.p
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.4, repeat: Infinity }}
              className="font-sans text-sm font-bold uppercase tracking-[0.4em] text-[var(--neon-magenta)] text-glow-magenta"
            >
              Level Up
            </motion.p>

            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.1, type: 'spring', stiffness: 260, damping: 12 }}
              className="my-4 font-sans text-7xl font-bold text-[var(--neon-cyan)] text-glow-cyan"
            >
              {level}
            </motion.div>

            <p className="font-mono text-sm uppercase tracking-widest text-muted-foreground">
              New Rank Achieved
            </p>
            <p className="mt-1 font-sans text-lg font-bold tracking-wide text-foreground">
              {titleForLevel(level)}
            </p>

            <button
              type="button"
              onClick={onClose}
              className="mt-6 w-full rounded-md bg-[var(--neon-cyan)] py-3 font-sans text-sm font-bold uppercase tracking-widest text-background transition-opacity hover:opacity-90"
              style={{ boxShadow: '0 0 18px color-mix(in oklch, var(--neon-cyan) 55%, transparent)' }}
            >
              Continue
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
