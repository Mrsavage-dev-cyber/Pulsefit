import type { Challenge } from '../types'

const ADVICE: Record<Challenge, string> = {
  hunger:
    'Increase protein and fiber-rich foods (legumes, vegetables, whole grains) and redistribute calories toward larger, more filling meals earlier in the day.',
  low_energy:
    'Check that carb intake supports your training days, prioritize consistent meal timing, and make sure you are close to your sleep goal.',
  lack_of_time:
    'Shorten workouts to 30 minutes using supersets and compound lifts, and favor a step-count target over long cardio sessions.',
  plateau:
    'Adjust your calorie target by roughly 150 kcal or nudge your step goal up by 1,000 steps for 1-2 weeks, then reassess.',
  injury_pain:
    'Stop any movement that causes pain immediately, swap to low-impact alternatives, and consult a qualified healthcare professional before continuing that pattern.',
  motivation:
    'Shrink the goal to one small daily action (a single workout, one logged meal), track streaks, and revisit your "why" from onboarding.',
  poor_sleep:
    'Aim for a consistent wind-down routine, cap caffeine after early afternoon, and treat 7-8 hours of sleep as part of your training plan, not separate from it.',
}

const LABELS: Record<Challenge, string> = {
  hunger: 'Hunger',
  low_energy: 'Low energy',
  lack_of_time: 'No time',
  plateau: 'Plateau',
  injury_pain: 'Pain / injury',
  motivation: 'Motivation',
  poor_sleep: 'Poor sleep',
}

export function challengeLabel(c: Challenge): string {
  return LABELS[c]
}

export function generateRecommendation(issues: Challenge[], notes: string): string {
  if (issues.length === 0) {
    return 'Add at least one challenge above so PulseFit can tailor a recommendation for you.'
  }

  const parts = issues.map((issue) => `${LABELS[issue]}: ${ADVICE[issue]}`)
  let result = parts.join('\n\n')

  if (notes.trim().length > 0) {
    result += `\n\nNote logged: "${notes.trim()}" — keep this in mind for your next check-in to track whether things improve.`
  }

  return result
}
