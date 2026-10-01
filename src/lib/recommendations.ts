import type { Challenge } from '../types'

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
