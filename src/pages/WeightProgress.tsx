import { useState } from 'react'
import { Plus, TrendingDown, TrendingUp } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { Card, CardHeader } from '../components/ui/Card'
import { SegmentedControl } from '../components/ui/SegmentedControl'
import { Button } from '../components/ui/Button'
import { EmptyState } from '../components/ui/EmptyState'
import { WeightChart } from '../components/weight/WeightChart'
import { AddWeightModal } from '../components/modals/AddWeightModal'
import { getWeightInsights } from '../lib/coach'
import { Scale } from 'lucide-react'

const RANGE_OPTIONS = [
  { label: '7D', value: '7' },
  { label: '30D', value: '30' },
  { label: '90D', value: '90' },
] as const

export function WeightProgress() {
  const { state } = useApp()
  const [range, setRange] = useState<'7' | '30' | '90'>('30')
  const [modalOpen, setModalOpen] = useState(false)

  const { profile, targets, weightEntries } = state
  if (!profile || !targets) return null

  if (weightEntries.length === 0) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-extrabold tracking-tight">Weight Progress</h1>
        <EmptyState icon={Scale} title="No entries yet" description="Log your first weigh-in to start tracking trends." action={<Button onClick={() => setModalOpen(true)}>Add weight entry</Button>} />
        <AddWeightModal open={modalOpen} onClose={() => setModalOpen(false)} />
      </div>
    )
  }

  const sorted = [...weightEntries].sort((a, b) => a.date.localeCompare(b.date))
  const { weeklyChangeKg, messages } = getWeightInsights(state)
  const isGoodDirection = profile.goal === 'lose_fat' ? weeklyChangeKg <= 0 : profile.goal === 'gain_muscle' ? weeklyChangeKg >= 0 : true

  const startWeight = sorted[0].weightKg
  const currentWeight = sorted[sorted.length - 1].weightKg
  const toGo = Math.abs(currentWeight - profile.goalWeightKg)
  const atGoal = toGo < 0.1
  const toGoLabel = atGoal ? 'At goal' : currentWeight > profile.goalWeightKg ? 'to lose' : 'to gain'

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-extrabold tracking-tight">Weight Progress</h1>
        <Button size="sm" onClick={() => setModalOpen(true)}>
          <Plus size={15} /> Log weight
        </Button>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <Card className="animate-in text-center">
          <p className="text-[11px] font-semibold text-[var(--color-text-secondary)]">Starting</p>
          <p className="tabular mt-1 text-xl font-extrabold">{startWeight.toFixed(1)}</p>
          <p className="text-[10px] text-[var(--color-text-muted)]">kg</p>
        </Card>
        <Card className="animate-in text-center border-[var(--color-brand)]/30">
          <p className="text-[11px] font-semibold text-[var(--color-text-secondary)]">Current</p>
          <p className="tabular mt-1 text-xl font-extrabold text-[var(--color-brand)]">{currentWeight.toFixed(1)}</p>
          <p className="text-[10px] text-[var(--color-text-muted)]">kg</p>
        </Card>
        <Card className="animate-in text-center">
          <p className="text-[11px] font-semibold text-[var(--color-text-secondary)]">
            {atGoal ? toGoLabel : `To go (${toGoLabel})`}
          </p>
          <p className="tabular mt-1 text-xl font-extrabold">{atGoal ? '🎉' : toGo.toFixed(1)}</p>
          <p className="text-[10px] text-[var(--color-text-muted)]">{atGoal ? '' : 'kg'}</p>
        </Card>
      </div>

      <Card className="animate-in">
        <CardHeader
          title="Trend"
          subtitle={`Goal: ${profile.goalWeightKg} kg`}
          action={<SegmentedControl options={[...RANGE_OPTIONS]} value={range} onChange={setRange} />}
        />

        <div
          className={`mb-3 flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-semibold ${
            isGoodDirection ? 'bg-[var(--color-good)]/10 text-[var(--color-good)]' : 'bg-[var(--color-warning)]/10 text-[var(--color-warning)]'
          }`}
        >
          {weeklyChangeKg <= 0 ? <TrendingDown size={16} /> : <TrendingUp size={16} />}
          You are {weeklyChangeKg === 0 ? 'steady' : `${weeklyChangeKg < 0 ? 'down' : 'up'} ${Math.abs(weeklyChangeKg).toFixed(1)} kg`} this week
        </div>

        <WeightChart
          entries={sorted}
          rangeDays={Number(range)}
          goalWeightKg={profile.goalWeightKg}
          startWeightKg={sorted[0].weightKg}
          startDate={sorted[0].date}
          weeklyRateKg={targets.weeklyWeightChangeKg}
        />
      </Card>

      <Card className="animate-in">
        <CardHeader title="Insights" />
        <ul className="space-y-2.5">
          {messages.map((m, i) => (
            <li key={i} className="flex gap-2 text-sm text-[var(--color-text-secondary)]">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--color-brand)]" />
              <span>{m}</span>
            </li>
          ))}
        </ul>
      </Card>

      <AddWeightModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  )
}
