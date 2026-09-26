import { useState } from 'react'
import clsx from 'clsx'
import { CheckCircle2, ChevronDown, Circle, Clock, Dumbbell } from 'lucide-react'
import { Button } from '../ui/Button'
import { weekdayShort } from '../../lib/calculations'
import { getWorkoutVisual } from '../../lib/workoutVisuals'
import type { WorkoutDay } from '../../types'

export function WorkoutDayCard({
  workout,
  isToday,
  onToggleComplete,
}: {
  workout: WorkoutDay
  isToday: boolean
  onToggleComplete: () => void
}) {
  const [expanded, setExpanded] = useState(isToday)
  const [checked, setChecked] = useState<Record<string, boolean>>({})

  const allChecked = workout.exercises.every((ex) => checked[ex.name])
  const { icon: Icon, color } = getWorkoutVisual(workout.title)
  const doneCount = workout.exercises.filter((ex) => checked[ex.name]).length

  return (
    <div
      className={clsx(
        'relative overflow-hidden rounded-2xl border bg-[var(--color-surface)] p-4 transition',
        workout.completed
          ? 'border-[var(--color-good)]/40'
          : isToday
            ? 'border-[var(--color-brand)]/50 shadow-[0_0_0_1px_var(--color-brand)/10]'
            : 'border-[var(--color-border)]',
      )}
    >
      {isToday && !workout.completed && (
        <span className="absolute inset-x-0 top-0 h-[3px] bg-[var(--color-brand)]" />
      )}
      {workout.completed && <span className="absolute inset-x-0 top-0 h-[3px] bg-[var(--color-good)]" />}

      <button className="flex w-full items-center justify-between gap-3 text-left" onClick={() => setExpanded((e) => !e)}>
        <div className="flex items-center gap-3">
          <div
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl"
            style={{ backgroundColor: `color-mix(in srgb, ${color} 16%, transparent)` }}
          >
            <Icon size={19} style={{ color }} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span
                className={clsx(
                  'rounded-full px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide',
                  isToday ? 'bg-[var(--color-brand)] text-white' : 'bg-[var(--color-surface-3)] text-[var(--color-text-secondary)]',
                )}
              >
                {weekdayShort(workout.dayOfWeek)}
              </span>
              {isToday && !workout.completed && <span className="text-[10px] font-bold uppercase tracking-wide text-[var(--color-brand)]">Today</span>}
            </div>
            <p className="mt-0.5 text-sm font-bold">{workout.title}</p>
            <p className="text-xs text-[var(--color-text-secondary)]">{workout.focus}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {workout.completed && (
            <span className="flex items-center gap-1 rounded-full bg-[var(--color-good)]/15 px-2 py-1 text-[11px] font-semibold text-[var(--color-good)]">
              <CheckCircle2 size={13} /> Done
            </span>
          )}
          <ChevronDown size={16} className={clsx('text-[var(--color-text-secondary)] transition-transform', expanded && 'rotate-180')} />
        </div>
      </button>

      {expanded && (
        <div className="mt-4 animate-in">
          <div className="mb-3 flex items-center gap-2 text-xs">
            <span className="flex items-center gap-1 rounded-full bg-[var(--color-surface-3)] px-2.5 py-1 text-[var(--color-text-secondary)]">
              <Clock size={12} /> {workout.durationMin} min
            </span>
            <span className="flex items-center gap-1 rounded-full bg-[var(--color-surface-3)] px-2.5 py-1 text-[var(--color-text-secondary)]">
              <Dumbbell size={12} /> {workout.exercises.length} exercises
            </span>
            {!workout.completed && (
              <span className="tabular ml-auto text-[var(--color-text-muted)]">{doneCount}/{workout.exercises.length}</span>
            )}
          </div>
          <ul className="mb-4 space-y-1.5">
            {workout.exercises.map((ex) => (
              <li key={ex.name}>
                <button
                  onClick={() => setChecked((c) => ({ ...c, [ex.name]: !c[ex.name] }))}
                  className="flex w-full items-center justify-between rounded-lg px-2 py-1.5 text-left hover:bg-[var(--color-surface-2)]"
                >
                  <span className="flex items-center gap-2 text-sm">
                    {checked[ex.name] ? (
                      <CheckCircle2 size={16} style={{ color }} />
                    ) : (
                      <Circle size={16} className="text-[var(--color-text-muted)]" />
                    )}
                    <span className={clsx(checked[ex.name] && 'text-[var(--color-text-secondary)] line-through')}>{ex.name}</span>
                  </span>
                  <span className="tabular shrink-0 rounded-md bg-[var(--color-surface-3)] px-2 py-0.5 text-[11px] font-semibold text-[var(--color-text-secondary)]">
                    {ex.sets > 1 ? `${ex.sets}×${ex.reps}` : ex.reps}
                  </span>
                </button>
              </li>
            ))}
          </ul>
          <Button
            className="w-full"
            variant={workout.completed ? 'secondary' : 'primary'}
            disabled={!workout.completed && !allChecked}
            onClick={onToggleComplete}
          >
            {workout.completed ? 'Mark as not done' : allChecked ? 'Complete workout' : 'Check off all exercises'}
          </Button>
        </div>
      )}
    </div>
  )
}
