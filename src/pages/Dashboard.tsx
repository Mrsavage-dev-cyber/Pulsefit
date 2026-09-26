import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Settings } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { CalorieCard } from '../components/dashboard/CalorieCard'
import { WorkoutCard } from '../components/dashboard/WorkoutCard'
import { StatsRow } from '../components/dashboard/StatsRow'
import { AICoachCard } from '../components/dashboard/AICoachCard'
import { QuickActions } from '../components/dashboard/QuickActions'
import { AddMealModal } from '../components/modals/AddMealModal'
import { AddWeightModal } from '../components/modals/AddWeightModal'
import { LogWaterModal } from '../components/modals/LogWaterModal'
import { getLatestWeight, getTodayMeals, getTodayStats, getTodayWorkout, sumMacros } from '../lib/selectors'
import { getCoachInsight, getWeightInsights } from '../lib/coach'

const GOAL_LABEL: Record<string, string> = {
  lose_fat: 'Losing fat',
  gain_muscle: 'Building muscle',
  maintain: 'Maintaining weight',
}

export function Dashboard() {
  const { state } = useApp()
  const [mealModalOpen, setMealModalOpen] = useState(false)
  const [weightModalOpen, setWeightModalOpen] = useState(false)
  const [waterModalOpen, setWaterModalOpen] = useState(false)

  if (!state.profile || !state.targets) return null

  const todayStats = getTodayStats(state)
  const todayMeals = getTodayMeals(state)
  const macros = sumMacros(todayMeals)
  const workout = getTodayWorkout(state)
  const insight = getCoachInsight(state)
  const { weeklyChangeKg } = getWeightInsights(state)
  const latestWeight = getLatestWeight(state)

  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening'

  return (
    <div className="space-y-4">
      <div className="animate-in flex items-start justify-between">
        <div>
          <p className="text-sm text-[var(--color-text-secondary)]">{greeting}, {state.profile.name.split(' ')[0]}</p>
          <h1 className="text-2xl font-extrabold tracking-tight">{GOAL_LABEL[state.profile.goal]}</h1>
        </div>
        <Link
          to="/settings"
          aria-label="Settings"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-secondary)] transition hover:text-[var(--color-text)]"
        >
          <Settings size={16} />
        </Link>
      </div>

      <CalorieCard targets={state.targets} consumed={macros.calories} protein={macros.protein} carbs={macros.carbs} fat={macros.fat} />

      <WorkoutCard workout={workout} />

      <StatsRow
        stats={todayStats}
        targets={state.targets}
        latestWeight={latestWeight}
        weeklyChangeKg={weeklyChangeKg}
        onLogWater={() => setWaterModalOpen(true)}
      />

      <AICoachCard insight={insight} />

      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-[var(--color-text-secondary)]">Quick actions</p>
        <QuickActions onLogMeal={() => setMealModalOpen(true)} onLogWeight={() => setWeightModalOpen(true)} />
      </div>

      <AddMealModal open={mealModalOpen} onClose={() => setMealModalOpen(false)} />
      <AddWeightModal open={weightModalOpen} onClose={() => setWeightModalOpen(false)} />
      <LogWaterModal open={waterModalOpen} onClose={() => setWaterModalOpen(false)} />
    </div>
  )
}
