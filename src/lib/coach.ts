import { rollingAverage } from './calculations'
import type { AppState } from '../types'

export interface CoachInsight {
  tone: 'good' | 'warning' | 'info'
  message: string
}

export function getCoachInsight(state: AppState): CoachInsight {
  const { targets, meals, dailyStats, weightEntries, workoutPlan, profile } = state
  if (!targets || !profile) return { tone: 'info', message: 'Complete onboarding to unlock your coach insights.' }

  const today = dailyStats[dailyStats.length - 1]
  const todayMeals = meals.filter((m) => m.date === today?.date)
  const consumed = todayMeals.reduce((s, m) => s + m.calories, 0)
  const protein = todayMeals.reduce((s, m) => s + m.protein, 0)
  const remaining = targets.calorieTarget - consumed

  const hour = new Date().getHours()

  if (remaining < -150) {
    return {
      tone: 'warning',
      message: `You're ${Math.abs(remaining)} kcal over today's target. A lighter dinner or an extra 20-minute walk can help balance it out.`,
    }
  }

  if (hour >= 15 && protein < targets.proteinG * 0.5) {
    return {
      tone: 'warning',
      message: `Protein is at ${protein}g of ${targets.proteinG}g with the day winding down. Add a protein-rich snack like Greek yogurt or a shake.`,
    }
  }

  if (today && today.steps < targets.stepGoal * 0.4 && hour >= 17) {
    return {
      tone: 'info',
      message: `You're at ${today.steps.toLocaleString()} steps today, below your ${targets.stepGoal.toLocaleString()} goal. A 15-minute walk after dinner closes most of the gap.`,
    }
  }

  const weights = [...weightEntries].sort((a, b) => a.date.localeCompare(b.date)).map((w) => w.weightKg)
  const avg = rollingAverage(weights, 7).filter((v): v is number => v !== null)
  if (avg.length >= 14) {
    const change = avg[avg.length - 1] - avg[avg.length - 14]
    if (profile.goal === 'lose_fat' && Math.abs(change) < 0.2) {
      return {
        tone: 'warning',
        message: 'Your average weight has barely moved in 2 weeks. Consider trimming 150 kcal from your target or adding 1,000 steps a day.',
      }
    }
    if (profile.goal === 'lose_fat' && change < -0.2) {
      return {
        tone: 'good',
        message: `Nice work — your 7-day average is trending down and you're on pace with your goal. Keep logging consistently.`,
      }
    }
  }

  const todayWorkout = workoutPlan.find((w) => w.dayOfWeek === (new Date().getDay() + 6) % 7)
  if (todayWorkout && !todayWorkout.completed) {
    return {
      tone: 'info',
      message: `Today's session "${todayWorkout.title}" (${todayWorkout.durationMin} min) is still open. Knock it out to stay on your weekly plan.`,
    }
  }

  return {
    tone: 'good',
    message: `You're ${remaining >= 0 ? remaining : 0} kcal from target with ${protein}g protein logged. Solid, steady progress today.`,
  }
}

export interface WeightInsight {
  weeklyChangeKg: number
  messages: string[]
}

export function getWeightInsights(state: AppState): WeightInsight {
  const { weightEntries, profile } = state
  const sorted = [...weightEntries].sort((a, b) => a.date.localeCompare(b.date))
  const values = sorted.map((w) => w.weightKg)
  const avg = rollingAverage(values, 7)

  const lastAvg = [...avg].reverse().find((v) => v !== null) ?? null
  const idxLast = avg.lastIndexOf(lastAvg)
  const weekAgoAvg = idxLast >= 7 ? avg[idxLast - 7] : null

  const weeklyChangeKg = lastAvg !== null && weekAgoAvg !== null ? Math.round((lastAvg - weekAgoAvg) * 10) / 10 : 0

  const messages: string[] = []

  if (values.length >= 10) {
    const recentRaw = values.slice(-7)
    const swing = Math.max(...recentRaw) - Math.min(...recentRaw)
    if (swing > 0.8) {
      messages.push('Your daily weight fluctuates day to day, but your 7-day average smooths out the water-weight noise — trust the trend line over any single reading.')
    }
  }

  if (idxLast !== null && idxLast >= 14) {
    const twoWeeksAgoAvg = avg[idxLast - 14]
    if (twoWeeksAgoAvg !== null && lastAvg !== null && Math.abs(lastAvg - twoWeeksAgoAvg) < 0.3) {
      messages.push('Your average weight has not changed much in 2 weeks. Consider reducing calories by ~150 kcal or increasing your step target.')
    }
  }

  if (profile?.goal === 'lose_fat' && weeklyChangeKg < 0) {
    messages.push(`Your 7-day average is trending down — you're on track toward your goal weight.`)
  } else if (profile?.goal === 'gain_muscle' && weeklyChangeKg > 0) {
    messages.push(`Your 7-day average is trending up — good pace for lean gains without excess fat gain.`)
  }

  if (messages.length === 0) {
    messages.push('Keep logging daily — insights get sharper with more consistent weigh-ins.')
  }

  return { weeklyChangeKg, messages }
}
