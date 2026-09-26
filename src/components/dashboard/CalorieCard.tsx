import { Card } from '../ui/Card'
import { Ring } from '../ui/Ring'
import { ProgressBar } from '../ui/ProgressBar'
import type { Targets } from '../../types'

interface CalorieCardProps {
  targets: Targets
  consumed: number
  protein: number
  carbs: number
  fat: number
}

export function CalorieCard({ targets, consumed, protein, carbs, fat }: CalorieCardProps) {
  const remaining = targets.calorieTarget - consumed
  const over = remaining < 0

  return (
    <Card className="animate-in">
      <div className="flex items-center gap-5">
        <Ring value={consumed} max={targets.calorieTarget} size={124} strokeWidth={11} color={over ? 'var(--color-critical)' : 'var(--color-brand)'}>
          <div className="text-center">
            <p className="tabular text-2xl font-extrabold leading-none">{Math.abs(remaining)}</p>
            <p className="mt-1 text-[10px] font-medium text-[var(--color-text-secondary)]">{over ? 'kcal over' : 'kcal left'}</p>
          </div>
        </Ring>
        <div className="flex-1">
          <p className="text-xs text-[var(--color-text-secondary)]">Today's calories</p>
          <p className="tabular text-xl font-bold">
            {consumed.toLocaleString()} <span className="text-sm font-normal text-[var(--color-text-secondary)]">/ {targets.calorieTarget.toLocaleString()} kcal</span>
          </p>
          <div className="mt-3 space-y-2">
            <ProgressBar value={protein} max={targets.proteinG} color="var(--color-brand)" label="Protein" valueLabel={`${protein}/${targets.proteinG}g`} />
            <ProgressBar value={carbs} max={targets.carbG} color="var(--color-orange)" label="Carbs" valueLabel={`${carbs}/${targets.carbG}g`} />
            <ProgressBar value={fat} max={targets.fatG} color="var(--color-violet)" label="Fat" valueLabel={`${fat}/${targets.fatG}g`} />
          </div>
        </div>
      </div>
    </Card>
  )
}
