import { Bandage, BatteryLow, Clock, Flame, Moon, TrendingDown, Utensils, type LucideIcon } from 'lucide-react'
import type { Challenge } from '../types'

interface ChallengeVisual {
  icon: LucideIcon
  color: string
}

const VISUALS: Record<Challenge, ChallengeVisual> = {
  hunger: { icon: Utensils, color: 'var(--color-orange)' },
  low_energy: { icon: BatteryLow, color: 'var(--color-yellow)' },
  lack_of_time: { icon: Clock, color: 'var(--color-aqua)' },
  poor_sleep: { icon: Moon, color: 'var(--color-violet)' },
  motivation: { icon: Flame, color: 'var(--color-red)' },
  plateau: { icon: TrendingDown, color: 'var(--color-brand)' },
  injury_pain: { icon: Bandage, color: 'var(--color-warning)' },
}

export function getChallengeVisual(challenge: Challenge): ChallengeVisual {
  return VISUALS[challenge]
}
