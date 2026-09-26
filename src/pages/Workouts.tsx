import clsx from 'clsx'
import { CheckCircle2, Flame, Gauge, Moon, TrendingUp } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { Card, CardHeader } from '../components/ui/Card'
import { ProgressBar } from '../components/ui/ProgressBar'
import { WorkoutDayCard } from '../components/workouts/WorkoutDayCard'
import { getWorkoutVisual } from '../lib/workoutVisuals'
import { getPlanStyle } from '../lib/workoutPlans'
import { getWeeklyAdherence } from '../lib/selectors'
import { isoWeekdayIndex, todayISO, weekdayShort } from '../lib/calculations'
import type { Goal } from '../types'

const GOAL_ICONS: Record<Goal, typeof TrendingUp> = {
  gain_muscle: TrendingUp,
  lose_fat: Flame,
  maintain: Gauge,
}

export function Workouts() {
  const { state, dispatch } = useApp()
  const { workoutPlan, profile } = state
  if (!profile) return null

  const { completed, total } = getWeeklyAdherence(state)
  const todayIdx = isoWeekdayIndex(todayISO())
  const planStyle = getPlanStyle(profile.goal)
  const GoalIcon = GOAL_ICONS[profile.goal]

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-extrabold tracking-tight">Workouts</h1>

      <Card className="animate-in border-[var(--color-brand)]/25 bg-gradient-to-br from-[var(--color-brand)]/10 to-transparent">
        <div className="flex items-start gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[var(--color-brand)]/15">
            <GoalIcon size={20} className="text-[var(--color-brand)]" />
          </div>
          <div>
            <p className="text-sm font-bold">{planStyle.label}</p>
            <p className="mt-0.5 text-xs text-[var(--color-text-secondary)]">{planStyle.description}</p>
          </div>
        </div>
      </Card>

      <Card className="animate-in">
        <CardHeader title="This week's adherence" subtitle={`${completed} of ${total} sessions completed`} />
        <ProgressBar value={completed} max={total} color="var(--color-good)" />

        <div className="mt-4 grid grid-cols-7 gap-1.5">
          {Array.from({ length: 7 }, (_, dayOfWeek) => {
            const workout = workoutPlan.find((w) => w.dayOfWeek === dayOfWeek)
            const isToday = dayOfWeek === todayIdx
            if (!workout) {
              return (
                <div
                  key={dayOfWeek}
                  className={clsx(
                    'flex flex-col items-center gap-1 rounded-xl border py-2.5 text-[10px] font-semibold',
                    isToday ? 'border-[var(--color-border-strong)]' : 'border-transparent',
                    'text-[var(--color-text-muted)]',
                  )}
                >
                  <Moon size={14} />
                  <span>{weekdayShort(dayOfWeek)}</span>
                </div>
              )
            }
            const { icon: Icon, color } = getWorkoutVisual(workout.title)
            return (
              <div
                key={dayOfWeek}
                className={clsx(
                  'flex flex-col items-center gap-1 rounded-xl border py-2.5 text-[10px] font-semibold',
                  isToday ? 'border-[var(--color-brand)]/50' : 'border-transparent',
                )}
              >
                {workout.completed ? (
                  <CheckCircle2 size={14} className="text-[var(--color-good)]" />
                ) : (
                  <Icon size={14} style={{ color }} />
                )}
                <span className={workout.completed ? 'text-[var(--color-good)]' : 'text-[var(--color-text-secondary)]'}>
                  {weekdayShort(dayOfWeek)}
                </span>
              </div>
            )
          })}
        </div>
      </Card>

      <div className="space-y-3">
        {workoutPlan.map((w) => (
          <WorkoutDayCard
            key={w.id}
            workout={w}
            isToday={w.dayOfWeek === todayIdx}
            onToggleComplete={() => dispatch({ type: 'TOGGLE_WORKOUT', id: w.id })}
          />
        ))}
      </div>
    </div>
  )
}
