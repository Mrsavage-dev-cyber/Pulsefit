import type { Goal } from '../types'

export interface PlanStyle {
  label: string
  description: string
}

export function getPlanStyle(goal: Goal): PlanStyle {
  if (goal === 'gain_muscle') {
    return { label: 'Hypertrophy — bulking phase', description: 'Heavier loads, longer rest, extra sets on the main lift for size and strength.' }
  }
  if (goal === 'lose_fat') {
    return { label: 'Fat-loss circuit', description: 'Higher reps, shorter rest, and a cardio finisher on every session to maximize burn.' }
  }
  return { label: 'Balanced maintenance', description: 'Standard volume and rest to hold onto strength and conditioning.' }
}
