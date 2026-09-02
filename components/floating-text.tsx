'use client'

import { AnimatePresence, motion } from 'motion/react'

export type FloatItem = {
  id: string
  label: string
  color: string
}

/**
 * Renders floating "+20 XP" / "+15 STR" texts that rise and fade.
 * Anchored to its relatively-positioned parent.
 */
export function FloatingText({ items }: { items: FloatItem[] }) {
  return (
    <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
      <AnimatePresence>
        {items.map((item, i) => (
          <motion.span
            key={item.id}
            initial={{ y: 0, opacity: 0, scale: 0.6 }}
            animate={{ y: -46 - i * 22, opacity: 1, scale: 1 }}
            exit={{ opacity: 0, y: -80 }}
            transition={{ duration: 0.9, ease: 'easeOut' }}
            className="absolute font-sans text-lg font-bold tracking-wider"
            style={{ color: item.color, textShadow: `0 0 10px ${item.color}` }}
          >
            {item.label}
          </motion.span>
        ))}
      </AnimatePresence>
    </div>
  )
}
