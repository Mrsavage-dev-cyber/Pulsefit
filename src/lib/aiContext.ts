import { Type } from '@google/genai'
import type { Exercise, MealPlan, MealType, Targets, UserProfile, WorkoutDay } from '../types'

export class PlanGenerationError extends Error {}

export const TARGETS_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    bmr: { type: Type.NUMBER, description: 'Basal metabolic rate in kcal/day' },
    tdee: { type: Type.NUMBER, description: 'Total daily energy expenditure in kcal/day' },
    calorieTarget: { type: Type.NUMBER, description: 'Daily calorie target adjusted for the goal' },
    proteinG: { type: Type.NUMBER, description: 'Daily protein target in grams' },
    carbG: { type: Type.NUMBER, description: 'Daily carbohydrate target in grams' },
    fatG: { type: Type.NUMBER, description: 'Daily fat target in grams' },
    stepGoal: { type: Type.NUMBER, description: 'Daily step goal, rounded to the nearest 500' },
    weeklyWeightChangeKg: { type: Type.NUMBER, description: 'Target weekly weight change in kg (negative for loss, positive for gain, 0 for maintenance)' },
  },
  required: ['bmr', 'tdee', 'calorieTarget', 'proteinG', 'carbG', 'fatG', 'stepGoal', 'weeklyWeightChangeKg'],
}

export const EXERCISE_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    name: { type: Type.STRING },
    sets: { type: Type.NUMBER },
    reps: { type: Type.STRING, description: 'A rep range or duration, e.g. "8-10", "12/side", "45s", "15 min"' },
    restSec: { type: Type.NUMBER, description: 'Rest between sets in seconds, 0 for cardio/finisher entries' },
  },
  required: ['name', 'sets', 'reps', 'restSec'],
}

export const WORKOUT_DAY_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    dayOfWeek: { type: Type.NUMBER, description: '0 = Monday .. 6 = Sunday' },
    title: { type: Type.STRING },
    focus: { type: Type.STRING, description: 'Short muscle groups / focus summary, e.g. "Chest, shoulders, triceps"' },
    durationMin: { type: Type.NUMBER },
    exercises: { type: Type.ARRAY, items: EXERCISE_SCHEMA },
  },
  required: ['dayOfWeek', 'title', 'focus', 'durationMin', 'exercises'],
}

export const PLANNED_MEAL_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    mealType: { type: Type.STRING, description: 'One of: breakfast, lunch, dinner, snack' },
    time: { type: Type.STRING, description: 'Time of day to eat this, 24-hour format "HH:MM", e.g. "07:30" or "19:30"' },
    name: { type: Type.STRING, description: 'Short dish name, e.g. "Grilled chicken tikka with roti"' },
    calories: { type: Type.NUMBER },
    protein: { type: Type.NUMBER, description: 'Grams' },
    carbs: { type: Type.NUMBER, description: 'Grams' },
    fat: { type: Type.NUMBER, description: 'Grams' },
    note: { type: Type.STRING, description: 'Optional short portion/prep note, e.g. "200g, grilled not fried"' },
  },
  required: ['mealType', 'time', 'name', 'calories', 'protein', 'carbs', 'fat'],
}

export const MEAL_PLAN_SCHEMA = {
  type: Type.ARRAY,
  description: "A full day's meals and snacks, spread across the day, that add up close to the daily targets",
  items: PLANNED_MEAL_SCHEMA,
}

const VALID_MEAL_TYPES: MealType[] = ['breakfast', 'lunch', 'dinner', 'snack']

export interface RawPlannedMeal {
  mealType: string
  time: string
  name: string
  calories: number
  protein: number
  carbs: number
  fat: number
  note?: string
}

export function toMealPlan(raw: RawPlannedMeal[]): MealPlan {
  const meals = raw
    .map((m) => ({
      mealType: (VALID_MEAL_TYPES as string[]).includes(m.mealType) ? (m.mealType as MealType) : ('snack' as MealType),
      time: m.time,
      name: m.name,
      calories: Math.round(m.calories),
      protein: Math.round(m.protein),
      carbs: Math.round(m.carbs),
      fat: Math.round(m.fat),
      note: m.note,
    }))
    .sort((a, b) => a.time.localeCompare(b.time))
  return { meals, generatedAt: new Date().toISOString() }
}

export interface RawWorkoutDay {
  dayOfWeek: number
  title: string
  focus: string
  durationMin: number
  exercises: Exercise[]
}

export function toWorkoutPlan(raw: RawWorkoutDay[]): WorkoutDay[] {
  return raw
    .map((day, i) => ({
      id: `w-${i}`,
      dayOfWeek: Math.min(6, Math.max(0, Math.round(day.dayOfWeek))),
      title: day.title,
      focus: day.focus,
      durationMin: Math.round(day.durationMin),
      exercises: day.exercises,
      completed: false,
    }))
    .sort((a, b) => a.dayOfWeek - b.dayOfWeek)
}

export function profileSummary(profile: UserProfile): string {
  return `
- Name: ${profile.name}
- Age: ${profile.age}
- Sex: ${profile.sex}
- Height: ${profile.heightCm} cm
- Current weight: ${profile.currentWeightKg} kg
- Goal weight: ${profile.goalWeightKg} kg
- Goal: ${profile.goal}
- Activity level: ${profile.activityLevel}
- Training experience: ${profile.experience}
- Workout days per week: ${profile.workoutDaysPerWeek}
- Food preferences: ${profile.foodPreferences.join(', ') || 'none specified'}
- Reported challenges: ${profile.challenges.join(', ') || 'none'}
`.trim()
}

export function targetsSummary(targets: Targets): string {
  return `Calories: ${targets.calorieTarget} kcal, Protein: ${targets.proteinG}g, Carbs: ${targets.carbG}g, Fat: ${targets.fatG}g, Steps: ${targets.stepGoal}, Weekly weight target: ${targets.weeklyWeightChangeKg} kg`
}

export function workoutPlanSummary(plan: WorkoutDay[]): string {
  return plan
    .map((w) => `Day ${w.dayOfWeek} — ${w.title} (${w.focus}, ${w.durationMin} min): ${w.exercises.map((e) => e.name).join(', ')}`)
    .join('\n')
}
