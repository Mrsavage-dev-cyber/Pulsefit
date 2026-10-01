import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { LogOut, RefreshCw, RotateCcw } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { useAuth } from '../context/AuthContext'
import { Card, CardHeader } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { challengeLabel } from '../lib/recommendations'
import { ACTIVITY_LABELS, EXPERIENCE_LABELS, FOOD_PREFERENCE_LABELS, GOAL_LABELS } from '../lib/labels'
import { generateTargets, PlanGenerationError } from '../lib/planGenerator'

export function Settings() {
  const { state, dispatch } = useApp()
  const { user, signOut } = useAuth()
  const navigate = useNavigate()
  const [justRecalculated, setJustRecalculated] = useState(false)
  const [recalculating, setRecalculating] = useState(false)
  const [recalcError, setRecalcError] = useState('')

  const { profile, targets } = state
  if (!profile || !targets) return null

  async function recalc() {
    if (!profile) return
    setRecalculating(true)
    setRecalcError('')
    try {
      const newTargets = await generateTargets(profile)
      dispatch({ type: 'RECALC_TARGETS', targets: newTargets })
      setJustRecalculated(true)
      setTimeout(() => setJustRecalculated(false), 2500)
    } catch (err) {
      setRecalcError(err instanceof PlanGenerationError ? err.message : 'Something went wrong recalculating your targets.')
    } finally {
      setRecalculating(false)
    }
  }

  function restart() {
    const confirmed = window.confirm(
      'This clears all your PulseFit demo data (profile, meals, weigh-ins, workouts, check-ins) and restarts onboarding. Continue?',
    )
    if (!confirmed) return
    dispatch({ type: 'RESET' })
    navigate('/onboarding', { replace: true })
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-extrabold tracking-tight">Settings</h1>

      <Card>
        <CardHeader title="Your profile" />
        <dl className="grid grid-cols-2 gap-y-3 text-sm">
          <Field label="Name" value={profile.name} />
          <Field label="Age" value={`${profile.age}`} />
          <Field label="Sex" value={profile.sex} className="capitalize" />
          <Field label="Height" value={`${profile.heightCm} cm`} />
          <Field label="Current weight" value={`${profile.currentWeightKg} kg`} />
          <Field label="Goal weight" value={`${profile.goalWeightKg} kg`} />
          <Field label="Goal" value={GOAL_LABELS[profile.goal]} />
          <Field label="Activity level" value={ACTIVITY_LABELS[profile.activityLevel]} />
          <Field label="Experience" value={EXPERIENCE_LABELS[profile.experience]} />
          <Field label="Workout days/week" value={`${profile.workoutDaysPerWeek}`} />
        </dl>

        <p className="mb-1.5 mt-4 text-xs font-semibold text-[var(--color-text-secondary)]">Food preferences</p>
        <div className="mb-4 flex flex-wrap gap-1.5">
          {profile.foodPreferences.map((f) => (
            <span key={f} className="rounded-full bg-[var(--color-surface-3)] px-2.5 py-1 text-[11px] font-semibold">
              {FOOD_PREFERENCE_LABELS[f]}
            </span>
          ))}
        </div>

        <p className="mb-1.5 text-xs font-semibold text-[var(--color-text-secondary)]">Current challenges</p>
        <div className="flex flex-wrap gap-1.5">
          {profile.challenges.length === 0 ? (
            <span className="text-xs text-[var(--color-text-muted)]">None reported</span>
          ) : (
            profile.challenges.map((c) => (
              <span key={c} className="rounded-full bg-[var(--color-surface-3)] px-2.5 py-1 text-[11px] font-semibold">
                {challengeLabel(c)}
              </span>
            ))
          )}
        </div>
      </Card>

      <Card>
        <CardHeader title="Your targets" subtitle="Recalculated by Gemini from your current profile and weight" />
        <div className="grid grid-cols-2 gap-3 text-sm sm:grid-cols-3">
          <Field label="Calories" value={`${targets.calorieTarget.toLocaleString()} kcal`} />
          <Field label="Protein" value={`${targets.proteinG} g`} />
          <Field label="Carbs" value={`${targets.carbG} g`} />
          <Field label="Fat" value={`${targets.fatG} g`} />
          <Field label="Step goal" value={targets.stepGoal.toLocaleString()} />
          <Field
            label="Weekly weight target"
            value={`${targets.weeklyWeightChangeKg > 0 ? '+' : ''}${targets.weeklyWeightChangeKg.toFixed(2)} kg`}
          />
        </div>
        <Button variant="secondary" className="mt-4 w-full" onClick={() => void recalc()} disabled={recalculating}>
          <RefreshCw size={15} /> {recalculating ? 'Recalculating…' : justRecalculated ? 'Targets updated' : 'Recalculate targets'}
        </Button>
        {recalcError && <p className="mt-2 text-xs text-[var(--color-critical)]">{recalcError}</p>}
      </Card>


      <Card>
        <CardHeader title="Account" subtitle={user?.email} />
        <Button variant="secondary" className="w-full" onClick={signOut}>
          <LogOut size={15} /> Sign out
        </Button>
      </Card>

      <Card className="border-[var(--color-critical)]/30">
        <CardHeader title="Reset demo data" subtitle="Clears everything stored locally and restarts onboarding" />
        <Button variant="secondary" className="w-full text-[var(--color-critical)]" onClick={restart}>
          <RotateCcw size={15} /> Restart onboarding
        </Button>
      </Card>

      <p className="px-1 text-[11px] leading-relaxed text-[var(--color-text-muted)]">
        PulseFit stores all data locally in this browser only. Nothing is sent to a server other than Google's Gemini
        API when you use AI food scanning, generate your plan, or recalculate targets, and clearing your browser data
        will remove it.
      </p>
    </div>
  )
}

function Field({ label, value, className }: { label: string; value: string; className?: string }) {
  return (
    <div>
      <dt className="text-[11px] text-[var(--color-text-secondary)]">{label}</dt>
      <dd className={`font-semibold ${className ?? ''}`}>{value}</dd>
    </div>
  )
}
