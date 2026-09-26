import { Card } from '../ui/Card'
import { Ring } from '../ui/Ring'
import { Droplet, Footprints, Moon, Plus, Scale } from 'lucide-react'
import type { DailyStats, Targets } from '../../types'

interface StatsRowProps {
  stats: DailyStats
  targets: Targets
  latestWeight: number | null
  weeklyChangeKg: number
  onLogWater: () => void
}

const WATER_GOAL_ML = 2500
const SLEEP_GOAL_H = 8

export function StatsRow({ stats, targets, latestWeight, weeklyChangeKg, onLogWater }: StatsRowProps) {
  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
      <Card className="flex flex-col items-center gap-2 text-center">
        <Ring value={stats.steps} max={targets.stepGoal} size={64} strokeWidth={7} color="var(--color-aqua)">
          <Footprints size={18} className="text-[var(--color-aqua)]" />
        </Ring>
        <div>
          <p className="tabular text-sm font-bold">{stats.steps.toLocaleString()}</p>
          <p className="text-[10px] text-[var(--color-text-secondary)]">of {targets.stepGoal.toLocaleString()} steps</p>
        </div>
      </Card>

      <button
        onClick={onLogWater}
        className="relative flex flex-col items-center gap-2 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4 text-center transition active:scale-[0.98]"
      >
        <span className="absolute right-2.5 top-2.5 flex h-5 w-5 items-center justify-center rounded-full bg-[var(--color-brand)]/15 text-[var(--color-brand)]">
          <Plus size={12} />
        </span>
        <Ring value={stats.waterMl} max={WATER_GOAL_ML} size={64} strokeWidth={7} color="var(--color-brand)">
          <Droplet size={18} className="text-[var(--color-brand)]" />
        </Ring>
        <div>
          <p className="tabular text-sm font-bold">{(stats.waterMl / 1000).toFixed(1)}L</p>
          <p className="text-[10px] text-[var(--color-text-secondary)]">of {(WATER_GOAL_ML / 1000).toFixed(1)}L water</p>
        </div>
      </button>

      <Card className="flex flex-col items-center gap-2 text-center">
        <Ring value={stats.sleepHours} max={SLEEP_GOAL_H} size={64} strokeWidth={7} color="var(--color-violet)">
          <Moon size={18} className="text-[var(--color-violet)]" />
        </Ring>
        <div>
          <p className="tabular text-sm font-bold">{stats.sleepHours.toFixed(1)}h</p>
          <p className="text-[10px] text-[var(--color-text-secondary)]">of {SLEEP_GOAL_H}h sleep</p>
        </div>
      </Card>

      <Card className="flex flex-col items-center gap-2 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[var(--color-surface-3)]">
          <Scale size={22} className="text-[var(--color-orange)]" />
        </div>
        <div>
          <p className="tabular text-sm font-bold">{latestWeight ? `${latestWeight.toFixed(1)} kg` : '—'}</p>
          <p className="text-[10px] text-[var(--color-text-secondary)]">
            {weeklyChangeKg === 0 ? 'steady this week' : `${weeklyChangeKg > 0 ? '+' : ''}${weeklyChangeKg.toFixed(1)} kg this week`}
          </p>
        </div>
      </Card>
    </div>
  )
}
