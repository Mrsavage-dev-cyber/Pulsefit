import type { ActivityLevel, Experience, FoodPreference, Goal } from '../types'

export const GOAL_LABELS: Record<Goal, string> = {
  lose_fat: 'Lose fat',
  gain_muscle: 'Gain muscle',
  maintain: 'Maintain weight',
}

export const ACTIVITY_LABELS: Record<ActivityLevel, string> = {
  sedentary: 'Sedentary',
  light: 'Light',
  moderate: 'Moderate',
  active: 'Active',
  very_active: 'Very active',
}

export const EXPERIENCE_LABELS: Record<Experience, string> = {
  beginner: 'Beginner',
  intermediate: 'Intermediate',
  advanced: 'Advanced',
}

export const FOOD_PREFERENCE_LABELS: Record<FoodPreference, string> = {
  omnivore: 'No restrictions',
  vegetarian: 'Vegetarian',
  vegan: 'Vegan',
  pescatarian: 'Pescatarian',
  low_carb: 'Low-carb',
  dairy_free: 'Dairy-free',
  gluten_free: 'Gluten-free',
}
