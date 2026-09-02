'use client'

import { motion } from 'motion/react'
import { useMemo } from 'react'

const NEON = [
  'var(--neon-cyan)',
  'var(--neon-magenta)',
  'var(--neon-lime)',
  'var(--neon-amber)',
]

type Props = {
  /** number of particles */
  count?: number
  /** spread radius in px */
  radius?: number
}

/**
 * A one-shot confetti / particle burst. Mount it (usually with a unique key)
 * to trigger the animation; it plays once and is safe to unmount after ~1s.
 */
export function ParticleBurst({ count = 22, radius = 90 }: Props) {
  const particles = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => {
        const angle = (Math.PI * 2 * i) / count + Math.random() * 0.5
        const dist = radius * (0.5 + Math.random() * 0.5)
        return {
          id: i,
          x: Math.cos(angle) * dist,
          y: Math.sin(angle) * dist,
          color: NEON[i % NEON.length],
          size: 4 + Math.random() * 6,
          rotate: Math.random() * 360,
        }
      }),
    [count, radius],
  )

  return (
    <div className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-visible">
      {particles.map((p) => (
        <motion.span
          key={p.id}
          initial={{ x: 0, y: 0, opacity: 1, scale: 1, rotate: 0 }}
          animate={{ x: p.x, y: p.y, opacity: 0, scale: 0.3, rotate: p.rotate }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          style={{
            position: 'absolute',
            width: p.size,
            height: p.size,
            borderRadius: 2,
            backgroundColor: p.color,
            boxShadow: `0 0 8px ${p.color}`,
          }}
        />
      ))}
    </div>
  )
}
