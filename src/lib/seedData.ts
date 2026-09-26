import type { DailyStats, Meal, Targets } from '../types'
import { daysAgoISO, formatDate } from './calculations'

function mulberry32(seed: number) {
  return function () {
    seed |= 0
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

export function seedDailyStats(targets: Targets): DailyStats[] {
  const rand = mulberry32(7)
  const stats: DailyStats[] = []
  for (let i = 14; i >= 1; i--) {
    const date = daysAgoISO(i)
    const steps = Math.round(targets.stepGoal * (0.6 + rand() * 0.6))
    const waterMl = Math.round(1600 + rand() * 1400)
    const sleepHours = Math.round((6 + rand() * 2.5) * 10) / 10
    stats.push({ date, steps, waterMl, sleepHours })
  }
  stats.push({
    date: formatDate(new Date()),
    steps: Math.round(targets.stepGoal * 0.42),
    waterMl: 900,
    sleepHours: 7.1,
  })
  return stats
}

export function seedTodayMeals(targets: Targets): Meal[] {
  const today = formatDate(new Date())
  const meals: Meal[] = [
    {
      id: 'm-1',
      date: today,
      mealType: 'breakfast',
      name: 'Greek yogurt, oats & berries',
      calories: 420,
      protein: 32,
      carbs: 48,
      fat: 10,
    },
    {
      id: 'm-2',
      date: today,
      mealType: 'lunch',
      name: 'Grilled chicken & rice bowl',
      calories: 610,
      protein: 48,
      carbs: 65,
      fat: 14,
    },
    {
      id: 'm-3',
      date: today,
      mealType: 'snack',
      name: 'Protein shake & almonds',
      calories: 260,
      protein: 24,
      carbs: 12,
      fat: 12,
    },
  ]
  // keep seeded meals well under target so the dashboard shows remaining budget
  const total = meals.reduce((s, m) => s + m.calories, 0)
  if (total > targets.calorieTarget * 0.85) {
    return meals.slice(0, 2)
  }
  return meals
}
