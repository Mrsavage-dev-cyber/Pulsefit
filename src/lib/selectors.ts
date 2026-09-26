import type { AppState, DailyStats, Meal, WorkoutDay } from '../types'
import { isoWeekdayIndex, todayISO } from './calculations'

export function getTodayISO(): string {
  return todayISO()
}

export function getTodayStats(state: AppState): DailyStats {
  const today = getTodayISO()
  return state.dailyStats.find((d) => d.date === today) ?? { date: today, steps: 0, waterMl: 0, sleepHours: 0 }
}

export function getTodayMeals(state: AppState): Meal[] {
  const today = getTodayISO()
  return state.meals.filter((m) => m.date === today)
}

export function sumMacros(meals: Meal[]) {
  return meals.reduce(
    (acc, m) => ({
      calories: acc.calories + m.calories,
      protein: acc.protein + m.protein,
      carbs: acc.carbs + m.carbs,
      fat: acc.fat + m.fat,
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0 },
  )
}

export function getTodayWorkout(state: AppState): WorkoutDay | undefined {
  const idx = isoWeekdayIndex(getTodayISO())
  return state.workoutPlan.find((w) => w.dayOfWeek === idx)
}

export function getWeeklyAdherence(state: AppState): { completed: number; total: number } {
  const total = state.workoutPlan.length
  const completed = state.workoutPlan.filter((w) => w.completed).length
  return { completed, total }
}

export function getLatestWeight(state: AppState): number | null {
  if (state.weightEntries.length === 0) return null
  const sorted = [...state.weightEntries].sort((a, b) => a.date.localeCompare(b.date))
  return sorted[sorted.length - 1].weightKg
}
