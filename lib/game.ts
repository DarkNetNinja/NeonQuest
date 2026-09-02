export type StatKey = 'STR' | 'DISC' | 'STK'

export type StatReward = {
  stat: 'STR' | 'DISC'
  amount: number
}

export type Habit = {
  id: string
  name: string
  xp: number
  reward: StatReward
  completedToday: boolean
  lastCompleted: string | null // ISO date string (yyyy-mm-dd)
}

export type GameState = {
  xp: number // xp within the current level
  level: number
  totalXp: number
  str: number
  disc: number
  streak: number
  lastActiveDate: string | null
  habits: Habit[]
}

export const TITLES = [
  'Novice Runner',
  'Byte Seeker',
  'Data Ronin',
  'Neon Adept',
  'Circuit Breaker',
  'Grid Hunter',
  'Chrome Vanguard',
  'Ghost Operator',
  'System Overlord',
  'Legendary Netrunner',
]

// XP needed to advance FROM the given level to the next.
export function xpForLevel(level: number): number {
  return 100 + (level - 1) * 50
}

export function titleForLevel(level: number): string {
  const idx = Math.min(level - 1, TITLES.length - 1)
  return `Level ${level} ${TITLES[idx]}`
}

export function todayKey(): string {
  return new Date().toISOString().slice(0, 10)
}

export function daysBetween(a: string, b: string): number {
  const da = new Date(a + 'T00:00:00')
  const db = new Date(b + 'T00:00:00')
  return Math.round((db.getTime() - da.getTime()) / 86_400_000)
}

export const STAT_META: Record<
  'STR' | 'DISC',
  { label: string; full: string; colorVar: string }
> = {
  STR: { label: 'STR', full: 'Strength', colorVar: 'var(--neon-magenta)' },
  DISC: { label: 'DISC', full: 'Discipline', colorVar: 'var(--neon-cyan)' },
}

export function defaultState(): GameState {
  return {
    xp: 0,
    level: 1,
    totalXp: 0,
    str: 0,
    disc: 0,
    streak: 0,
    lastActiveDate: null,
    habits: [
      {
        id: 'h1',
        name: '30-Min Gym Session',
        xp: 20,
        reward: { stat: 'STR', amount: 15 },
        completedToday: false,
        lastCompleted: null,
      },
      {
        id: 'h2',
        name: 'Read 10 Pages',
        xp: 15,
        reward: { stat: 'DISC', amount: 10 },
        completedToday: false,
        lastCompleted: null,
      },
      {
        id: 'h3',
        name: 'Drink 2L Water',
        xp: 10,
        reward: { stat: 'STR', amount: 8 },
        completedToday: false,
        lastCompleted: null,
      },
      {
        id: 'h4',
        name: 'Code for 1 Hour',
        xp: 25,
        reward: { stat: 'DISC', amount: 20 },
        completedToday: false,
        lastCompleted: null,
      },
    ],
  }
}
