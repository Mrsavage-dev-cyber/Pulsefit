import { useNavigate } from 'react-router-dom'
import { Card, CardHeader } from '../ui/Card'
import { Button } from '../ui/Button'
import { EmptyState } from '../ui/EmptyState'
import { CheckCircle2, Clock, Dumbbell } from 'lucide-react'
import type { WorkoutDay } from '../../types'

export function WorkoutCard({ workout }: { workout: WorkoutDay | undefined }) {
  const navigate = useNavigate()

  if (!workout) {
    return (
      <Card>
        <CardHeader title="Today's workout" />
        <EmptyState icon={Dumbbell} title="Rest day" description="No session scheduled today — recovery is part of the plan." />
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader
        title="Today's workout"
        action={
          workout.completed ? (
            <span className="flex items-center gap-1 rounded-full bg-[var(--color-good)]/15 px-2.5 py-1 text-xs font-semibold text-[var(--color-good)]">
              <CheckCircle2 size={13} /> Done
            </span>
          ) : undefined
        }
      />
      <p className="text-lg font-bold">{workout.title}</p>
      <p className="mb-3 text-xs text-[var(--color-text-secondary)]">{workout.focus}</p>
      <div className="mb-3 flex items-center gap-4 text-xs text-[var(--color-text-secondary)]">
        <span className="flex items-center gap-1"><Clock size={13} /> {workout.durationMin} min</span>
        <span className="flex items-center gap-1"><Dumbbell size={13} /> {workout.exercises.length} exercises</span>
      </div>
      <ul className="mb-4 space-y-1">
        {workout.exercises.slice(0, 3).map((ex) => (
          <li key={ex.name} className="flex justify-between text-sm">
            <span className="text-[var(--color-text)]">{ex.name}</span>
            <span className="tabular text-[var(--color-text-secondary)]">{ex.sets}×{ex.reps}</span>
          </li>
        ))}
        {workout.exercises.length > 3 && (
          <li className="text-xs text-[var(--color-text-muted)]">+{workout.exercises.length - 3} more</li>
        )}
      </ul>
      <Button className="w-full" onClick={() => navigate('/workouts')} disabled={workout.completed}>
        {workout.completed ? 'Workout complete' : 'Start workout'}
      </Button>
    </Card>
  )
}
