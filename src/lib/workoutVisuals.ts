import { Activity, Dumbbell, Flame, Footprints, HeartPulse, Shield, type LucideIcon } from 'lucide-react'

interface WorkoutVisual {
  icon: LucideIcon
  color: string
}

const VISUALS: Record<string, WorkoutVisual> = {
  'Upper Body Push': { icon: Dumbbell, color: 'var(--color-orange)' },
  'Lower Body Strength': { icon: Footprints, color: 'var(--color-violet)' },
  'Upper Body Pull': { icon: Dumbbell, color: 'var(--color-aqua)' },
  'Full Body Strength': { icon: Dumbbell, color: 'var(--color-brand)' },
  'Core & Conditioning': { icon: Flame, color: 'var(--color-red)' },
  'Active Recovery': { icon: HeartPulse, color: 'var(--color-aqua)' },
  'Low-Impact Full Body': { icon: Shield, color: 'var(--color-violet)' },
}

const DEFAULT_VISUAL: WorkoutVisual = { icon: Activity, color: 'var(--color-brand)' }

export function getWorkoutVisual(title: string): WorkoutVisual {
  return VISUALS[title] ?? DEFAULT_VISUAL
}
