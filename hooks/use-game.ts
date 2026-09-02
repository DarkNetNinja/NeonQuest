'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import {
  type GameState,
  type Habit,
  type StatReward,
  daysBetween,
  defaultState,
  todayKey,
  xpForLevel,
} from '@/lib/game'

const STORAGE_KEY = 'neonquest.save.v1'

/** Reconcile a loaded state with the current calendar day. */
function rollOver(state: GameState): GameState {
  const today = todayKey()
  if (state.lastActiveDate === today) return state

  // Reset daily completion flags for a new day.
  const habits = state.habits.map((h) => ({ ...h, completedToday: false }))

  let streak = state.streak
  if (state.lastActiveDate) {
    const gap = daysBetween(state.lastActiveDate, today)
    // Missing a full day (gap > 1) breaks the streak.
    if (gap > 1) streak = 0
  }

  return { ...state, habits, streak }
}

export type CompletionEffect = {
  id: string
  xp: number
  statLabel: 'STR' | 'DISC'
  statAmount: number
}

export function useGame() {
  const [state, setState] = useState<GameState>(defaultState)
  const [loaded, setLoaded] = useState(false)
  const [leveledUpTo, setLeveledUpTo] = useState<number | null>(null)
  const levelRef = useRef(1)

  // Load from localStorage once on mount.
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) {
        const parsed = JSON.parse(raw) as GameState
        const rolled = rollOver(parsed)
        setState(rolled)
        levelRef.current = rolled.level
      }
    } catch {
      // ignore corrupt saves
    }
    setLoaded(true)
  }, [])

  // Persist on every change (after initial load).
  useEffect(() => {
    if (!loaded) return
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    } catch {
      // storage full / unavailable
    }
  }, [state, loaded])

  const applyXp = useCallback((prev: GameState, gainedXp: number): GameState => {
    let xp = prev.xp + gainedXp
    let level = prev.level
    while (xp >= xpForLevel(level)) {
      xp -= xpForLevel(level)
      level += 1
    }
    return { ...prev, xp, level, totalXp: prev.totalXp + gainedXp }
  }, [])

  const completeHabit = useCallback(
    (id: string) => {
      const today = todayKey()
      setState((prev) => {
        const habit = prev.habits.find((h) => h.id === id)
        if (!habit || habit.completedToday) return prev

        const habits = prev.habits.map((h) =>
          h.id === id ? { ...h, completedToday: true, lastCompleted: today } : h,
        )

        // The streak advances once per day, on the first completion of that day.
        const streak = prev.lastActiveDate === today ? prev.streak : prev.streak + 1

        let next: GameState = {
          ...prev,
          habits,
          lastActiveDate: today,
          streak,
          str: prev.str + (habit.reward.stat === 'STR' ? habit.reward.amount : 0),
          disc: prev.disc + (habit.reward.stat === 'DISC' ? habit.reward.amount : 0),
        }
        next = applyXp(next, habit.xp)

        if (next.level > levelRef.current) {
          levelRef.current = next.level
          // Defer modal trigger out of the reducer.
          queueMicrotask(() => setLeveledUpTo(next.level))
        }
        return next
      })
    },
    [applyXp],
  )

  const addHabit = useCallback(
    (name: string, xp: number, reward: StatReward) => {
      setState((prev) => {
        const habit: Habit = {
          id: `h${Date.now()}`,
          name: name.trim() || 'New Quest',
          xp,
          reward,
          completedToday: false,
          lastCompleted: null,
        }
        return { ...prev, habits: [...prev.habits, habit] }
      })
    },
    [],
  )

  const removeHabit = useCallback((id: string) => {
    setState((prev) => ({ ...prev, habits: prev.habits.filter((h) => h.id !== id) }))
  }, [])

  const resetGame = useCallback(() => {
    const fresh = defaultState()
    levelRef.current = 1
    setState(fresh)
  }, [])

  const dismissLevelUp = useCallback(() => setLeveledUpTo(null), [])

  return {
    state,
    loaded,
    leveledUpTo,
    completeHabit,
    addHabit,
    removeHabit,
    resetGame,
    dismissLevelUp,
  }
}
