'use client'

import { useEffect, useState } from 'react'
import { AnimatePresence } from 'motion/react'
import { Gamepad2 } from 'lucide-react'
import { type User } from '@supabase/supabase-js'
import { createClient } from '@/lib/supabase/client'
import { useGame } from '@/hooks/use-game'
import { HeroHeader } from '@/components/hero-header'
import { HabitCard } from '@/components/habit-card'
import { AddHabitDialog } from '@/components/add-habit-dialog'
import { SidePanel } from '@/components/side-panel'
import { LevelUpModal } from '@/components/level-up-modal'

export default function Page() {
  const [user, setUser] = useState<User | null>(null)
  const supabase = createClient()

  const {
    state,
    leveledUpTo,
    completeHabit,
    addHabit,
    removeHabit,
    resetGame,
    dismissLevelUp,
  } = useGame()

  useEffect(() => {
    // 1. Get initial session
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user)
    })

    // 2. Listen for auth changes (login/logout)
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => authListener.subscription.unsubscribe()
  }, [supabase])

  const completed = state.habits.filter((h) => h.completedToday).length
  const total = state.habits.length

  return (
    <main className="mx-auto min-h-screen w-full max-w-6xl px-4 py-6 sm:px-6 sm:py-10">
      {/* Brand bar */}
      <header className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <span className="flex size-9 items-center justify-center rounded-md border border-[var(--neon-cyan)] text-[var(--neon-cyan)] box-glow-cyan">
            <Gamepad2 className="size-5" />
          </span>
          <span className="font-sans text-lg font-bold tracking-[0.2em] text-foreground">
            NEON<span className="text-[var(--neon-cyan)] text-glow-cyan">QUEST</span>
          </span>
        </div>
        <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
          {completed}/{total} quests today
        </span>
      </header>

      {/* HeroHeader with User Props */}
      <HeroHeader state={state} user={user} />

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_320px]">
        {/* Habit dashboard */}
        <section>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-sans text-sm font-bold uppercase tracking-widest text-muted-foreground">
              Daily Quests
            </h2>
          </div>

          <ul className="flex flex-col gap-3">
            <AnimatePresence initial={false}>
              {state.habits.map((habit) => (
                <HabitCard
                  key={habit.id}
                  habit={habit}
                  onComplete={completeHabit}
                  onRemove={removeHabit}
                />
              ))}
            </AnimatePresence>
          </ul>

          {state.habits.length === 0 && (
            <p className="rounded-lg border border-dashed border-border py-8 text-center font-mono text-sm text-muted-foreground">
              No quests yet. Add one to start earning XP.
            </p>
          )}

          <div className="mt-4">
            <AddHabitDialog onAdd={addHabit} />
          </div>
        </section>

        {/* Side panel */}
        <SidePanel state={state} onReset={resetGame} />
      </div>

      <footer className="mt-10 text-center font-mono text-xs text-muted-foreground">
        Cloud sync active via Supabase. Complete quests daily to keep your streak alive.
      </footer>

      <LevelUpModal level={leveledUpTo} onClose={dismissLevelUp} />
    </main>
  )
}