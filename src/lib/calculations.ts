import type { ActivityLevel, Challenge, Goal, Sex, Targets, UserProfile } from '../types'

const ACTIVITY_MULTIPLIERS: Record<ActivityLevel, number> = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  active: 1.725,
  very_active: 1.9,
}

export function calculateBMR(sex: Sex, weightKg: number, heightCm: number, age: number): number {
  const base = 10 * weightKg + 6.25 * heightCm - 5 * age
  return sex === 'male' ? base + 5 : base - 161
}

export function calculateTDEE(bmr: number, activityLevel: ActivityLevel): number {
  return bmr * ACTIVITY_MULTIPLIERS[activityLevel]
}

// ~7,500 kcal of surplus/deficit per kg of body weight changed — rounded so a
// 2 kg/month bulk lands on a clean 500 kcal/day surplus and a 1 kg/month cut
// lands on a clean 250 kcal/day deficit (both scale from the same constant).
const KCAL_PER_KG = 7500
const DAYS_PER_MONTH = 30

// Target rate of change for each goal, in kg per month.
function targetMonthlyRateKgForGoal(goal: Goal): number {
  if (goal === 'lose_fat') return -1
  if (goal === 'gain_muscle') return 2
  return 0
}

function calorieAdjustmentForGoal(goal: Goal, tdee: number): number {
  const monthlyRateKg = targetMonthlyRateKgForGoal(goal)
  const dailyAdjustment = Math.round((monthlyRateKg * KCAL_PER_KG) / DAYS_PER_MONTH)
  // Safety cap: never push the adjustment past 25% of maintenance either way.
  const cap = Math.round(tdee * 0.25)
  return Math.max(-cap, Math.min(cap, dailyAdjustment))
}

function weeklyWeightChangeForGoal(goal: Goal): number {
  const monthlyRateKg = targetMonthlyRateKgForGoal(goal)
  return Math.round(((monthlyRateKg * 7) / DAYS_PER_MONTH) * 100) / 100
}

function proteinPerKgForGoal(goal: Goal, challenges: Challenge[]): number {
  let base = goal === 'maintain' ? 1.7 : 2.0
  if (challenges.includes('hunger')) base += 0.15
  return base
}

function stepGoalFor(activityLevel: ActivityLevel, goal: Goal, challenges: Challenge[]): number {
  let steps = 8000
  if (activityLevel === 'sedentary') steps = 7000
  if (activityLevel === 'light') steps = 8000
  if (activityLevel === 'moderate') steps = 9000
  if (activityLevel === 'active') steps = 10000
  if (activityLevel === 'very_active') steps = 11000
  if (goal === 'lose_fat') steps += 1000
  if (challenges.includes('lack_of_time')) steps -= 1000
  return Math.max(5000, Math.round(steps / 500) * 500)
}

export function computeTargets(profile: UserProfile): Targets {
  const bmr = calculateBMR(profile.sex, profile.currentWeightKg, profile.heightCm, profile.age)
  const tdee = calculateTDEE(bmr, profile.activityLevel)
  const adjustment = calorieAdjustmentForGoal(profile.goal, tdee)
  const calorieTarget = Math.round((tdee + adjustment) / 10) * 10

  const proteinPerKg = proteinPerKgForGoal(profile.goal, profile.challenges)
  const proteinG = Math.round(profile.currentWeightKg * proteinPerKg)
  const proteinKcal = proteinG * 4

  const fatPct = profile.goal === 'lose_fat' ? 0.28 : 0.3
  const fatG = Math.round((calorieTarget * fatPct) / 9)
  const fatKcal = fatG * 9

  const remainingKcal = Math.max(calorieTarget - proteinKcal - fatKcal, 0)
  const carbG = Math.round(remainingKcal / 4)

  return {
    bmr: Math.round(bmr),
    tdee: Math.round(tdee),
    calorieTarget,
    proteinG,
    carbG,
    fatG,
    stepGoal: stepGoalFor(profile.activityLevel, profile.goal, profile.challenges),
    weeklyWeightChangeKg: weeklyWeightChangeForGoal(profile.goal),
  }
}

export function bmi(weightKg: number, heightCm: number): number {
  const m = heightCm / 100
  return weightKg / (m * m)
}

export function rollingAverage(values: number[], windowSize: number): (number | null)[] {
  const result: (number | null)[] = []
  for (let i = 0; i < values.length; i++) {
    if (i < windowSize - 1) {
      result.push(null)
      continue
    }
    const window = values.slice(i - windowSize + 1, i + 1)
    const avg = window.reduce((a, b) => a + b, 0) / window.length
    result.push(Math.round(avg * 10) / 10)
  }
  return result
}

export function formatDate(d: Date): string {
  return d.toISOString().slice(0, 10)
}

export function todayISO(): string {
  return formatDate(new Date())
}

export function daysAgoISO(days: number): string {
  const d = new Date()
  d.setDate(d.getDate() - days)
  return formatDate(d)
}

export function dayLabel(iso: string): string {
  const d = new Date(iso + 'T00:00:00')
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
}

export function weekdayShort(dayOfWeek: number): string {
  return ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][dayOfWeek]
}

export function isoWeekdayIndex(iso: string): number {
  const d = new Date(iso + 'T00:00:00')
  const jsDay = d.getDay() // 0 = Sunday
  return (jsDay + 6) % 7 // 0 = Monday
}
