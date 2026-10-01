import type { PointsState, Targets } from '../types'

export const WORKOUT_COMPLETE_POINTS = 50
export const NUTRITION_GOAL_POINTS = 30

export function emptyPoints(): PointsState {
  return { total: 0, awardedWorkoutIds: [], awardedNutritionDates: [] }
}

export function awardWorkoutPoints(points: PointsState, workoutId: string): PointsState {
  if (points.awardedWorkoutIds.includes(workoutId)) return points
  return {
    ...points,
    total: points.total + WORKOUT_COMPLETE_POINTS,
    awardedWorkoutIds: [...points.awardedWorkoutIds, workoutId],
  }
}

export function revokeWorkoutPoints(points: PointsState, workoutId: string): PointsState {
  if (!points.awardedWorkoutIds.includes(workoutId)) return points
  return {
    ...points,
    total: Math.max(0, points.total - WORKOUT_COMPLETE_POINTS),
    awardedWorkoutIds: points.awardedWorkoutIds.filter((id) => id !== workoutId),
  }
}

export function nutritionGoalMet(consumed: { calories: number; protein: number }, targets: Targets): boolean {
  const withinCalories = Math.abs(consumed.calories - targets.calorieTarget) <= targets.calorieTarget * 0.1
  const hitProtein = consumed.protein >= targets.proteinG
  return withinCalories && hitProtein
}

export function awardNutritionPoints(points: PointsState, dateISO: string): PointsState {
  if (points.awardedNutritionDates.includes(dateISO)) return points
  return {
    ...points,
    total: points.total + NUTRITION_GOAL_POINTS,
    awardedNutritionDates: [...points.awardedNutritionDates, dateISO],
  }
}
