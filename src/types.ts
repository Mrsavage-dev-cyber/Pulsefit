export type Sex = 'male' | 'female'

export type Goal = 'lose_fat' | 'gain_muscle' | 'maintain'

export type ActivityLevel = 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active'

export type Experience = 'beginner' | 'intermediate' | 'advanced'

export type FoodPreference =
  | 'omnivore'
  | 'vegetarian'
  | 'vegan'
  | 'pescatarian'
  | 'low_carb'
  | 'dairy_free'
  | 'gluten_free'

export type Challenge =
  | 'hunger'
  | 'low_energy'
  | 'lack_of_time'
  | 'plateau'
  | 'injury_pain'
  | 'motivation'
  | 'poor_sleep'

export interface UserProfile {
  name: string
  age: number
  sex: Sex
  heightCm: number
  currentWeightKg: number
  goalWeightKg: number
  goal: Goal
  activityLevel: ActivityLevel
  experience: Experience
  workoutDaysPerWeek: number
  foodPreferences: FoodPreference[]
  challenges: Challenge[]
  createdAt: string
}

export interface Targets {
  bmr: number
  tdee: number
  calorieTarget: number
  proteinG: number
  carbG: number
  fatG: number
  stepGoal: number
  weeklyWeightChangeKg: number
}

export interface WeightEntry {
  id: string
  date: string // ISO yyyy-mm-dd
  weightKg: number
}

export type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack'

export interface Meal {
  id: string
  date: string // ISO yyyy-mm-dd
  mealType: MealType
  name: string
  calories: number
  protein: number
  carbs: number
  fat: number
  note?: string
}

export interface Exercise {
  name: string
  sets: number
  reps: string
  restSec?: number
}

export interface WorkoutDay {
  id: string
  dayOfWeek: number // 0 = Monday .. 6 = Sunday
  title: string
  focus: string
  durationMin: number
  exercises: Exercise[]
  completed: boolean
}

export interface DailyStats {
  date: string
  steps: number
  waterMl: number
  sleepHours: number
}

export interface ChatProposal {
  targets: Targets
  workoutDaysPerWeek: number
  workoutPlan: WorkoutDay[]
  changes: string[]
  applied: boolean
}

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  proposal?: ChatProposal
}

export interface PointsState {
  total: number
  awardedWorkoutIds: string[]
  awardedNutritionDates: string[]
}

export interface PlannedMeal {
  mealType: MealType
  time: string // 24-hour "HH:MM"
  name: string
  calories: number
  protein: number
  carbs: number
  fat: number
  note?: string
}

export interface MealPlan {
  meals: PlannedMeal[]
  generatedAt: string // ISO datetime
}

export interface AppState {
  profile: UserProfile | null
  targets: Targets | null
  weightEntries: WeightEntry[]
  meals: Meal[]
  workoutPlan: WorkoutDay[]
  dailyStats: DailyStats[]
  coachMessages: ChatMessage[]
  currentWeekStart: string
  points: PointsState
  mealPlan: MealPlan | null
}
