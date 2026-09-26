import { generateWorkoutPlan } from './workoutPlans'
import type { AppState, Challenge, Targets, WorkoutDay } from '../types'

export interface Adaptation {
  targets: Targets
  workoutPlan: WorkoutDay[]
  challenges: Challenge[]
  workoutDaysPerWeek: number
  changes: string[]
}

export function computeAdaptation(state: AppState, issues: Challenge[]): Adaptation | null {
  if (!state.profile || !state.targets) return null

  const changes: string[] = []
  let { calorieTarget, proteinG, carbG, fatG, stepGoal } = state.targets
  let workoutDaysPerWeek = state.profile.workoutDaysPerWeek
  let regenerateWorkout = false

  if (issues.includes('plateau')) {
    const nextCalories = Math.max(1200, Math.round((calorieTarget - 150) / 10) * 10)
    changes.push(`Calorie target adjusted: ${calorieTarget} → ${nextCalories} kcal`)
    calorieTarget = nextCalories

    const nextSteps = stepGoal + 1000
    changes.push(`Step goal increased: ${stepGoal.toLocaleString()} → ${nextSteps.toLocaleString()}`)
    stepGoal = nextSteps
  }

  if (issues.includes('hunger')) {
    const bump = 15
    const nextProtein = proteinG + bump
    const nextCarb = Math.max(0, carbG - bump)
    changes.push(`Protein increased to ${nextProtein}g (redistributed from carbs) to help manage hunger`)
    proteinG = nextProtein
    carbG = nextCarb
  }

  if (issues.includes('lack_of_time')) {
    regenerateWorkout = true
    changes.push('Workouts shortened to fit a tighter schedule')
  }

  if (issues.includes('low_energy')) {
    const nextDays = Math.max(2, workoutDaysPerWeek - 1)
    if (nextDays !== workoutDaysPerWeek) {
      changes.push(`Training days reduced to ${nextDays}/week to allow more recovery`)
    }
    workoutDaysPerWeek = nextDays
    regenerateWorkout = true
  }

  if (issues.includes('injury_pain')) {
    regenerateWorkout = true
    changes.push('Workout plan switched to low-impact, joint-friendly movements')
  }

  if (changes.length === 0) return null

  const challenges = Array.from(new Set([...state.profile.challenges, ...issues]))

  const workoutPlan = regenerateWorkout
    ? generateWorkoutPlan(state.profile.goal, state.profile.experience, workoutDaysPerWeek, challenges)
    : state.workoutPlan

  return {
    targets: { ...state.targets, calorieTarget, proteinG, carbG, fatG, stepGoal },
    workoutPlan,
    challenges,
    workoutDaysPerWeek,
    changes,
  }
}
