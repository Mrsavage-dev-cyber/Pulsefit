import { useState } from 'react'
import clsx from 'clsx'
import { CheckCircle2, MessageCircleHeart, Sparkles } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { Card, CardHeader } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { EmptyState } from '../components/ui/EmptyState'
import { challengeLabel, generateRecommendation } from '../lib/recommendations'
import { getChallengeVisual } from '../lib/challengeVisuals'
import { computeAdaptation } from '../lib/adaptation'
import { todayISO } from '../lib/calculations'
import type { Challenge } from '../types'

const ISSUES: Challenge[] = ['hunger', 'low_energy', 'lack_of_time', 'poor_sleep', 'motivation', 'plateau', 'injury_pain']

function formatCheckInDate(iso: string): string {
  const d = new Date(iso + 'T00:00:00')
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
}

function daysSince(iso: string): number {
  const d = new Date(iso + 'T00:00:00')
  return Math.round((Date.now() - d.getTime()) / 86400000)
}

export function CheckIn() {
  const { state, dispatch } = useApp()
  const [selected, setSelected] = useState<Challenge[]>([])
  const [notes, setNotes] = useState('')
  const [recommendation, setRecommendation] = useState<string | null>(null)
  const [appliedChanges, setAppliedChanges] = useState<string[]>([])

  function toggle(issue: Challenge) {
    setSelected((s) => (s.includes(issue) ? s.filter((i) => i !== issue) : [...s, issue]))
    setRecommendation(null)
    setAppliedChanges([])
  }

  function generate() {
    const rec = generateRecommendation(selected, notes)
    setRecommendation(rec)

    const adaptation = computeAdaptation(state, selected)
    if (adaptation) {
      dispatch({
        type: 'APPLY_ADAPTATION',
        targets: adaptation.targets,
        workoutPlan: adaptation.workoutPlan,
        challenges: adaptation.challenges,
        workoutDaysPerWeek: adaptation.workoutDaysPerWeek,
      })
      setAppliedChanges(adaptation.changes)
    } else {
      setAppliedChanges([])
    }

    dispatch({
      type: 'ADD_CHECKIN',
      checkIn: { id: `c-${Date.now()}`, date: todayISO(), issues: selected, notes, recommendation: rec },
    })
    setSelected([])
    setNotes('')
  }

  const history = [...state.checkIns].reverse()
  const lastCheckIn = history[0]

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-extrabold tracking-tight">Check-in</h1>
        {history.length > 0 && (
          <span className="rounded-full bg-[var(--color-surface-3)] px-3 py-1 text-xs font-semibold text-[var(--color-text-secondary)]">
            {history.length} logged
          </span>
        )}
      </div>

      <Card className="animate-in border-[var(--color-brand)]/25 bg-gradient-to-br from-[var(--color-brand)]/10 to-transparent">
        <div className="flex items-start gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[var(--color-brand)]/15">
            <MessageCircleHeart size={20} className="text-[var(--color-brand)]" />
          </div>
          <div>
            <p className="text-sm font-bold">How's it going?</p>
            <p className="mt-0.5 text-xs text-[var(--color-text-secondary)]">
              {lastCheckIn
                ? `Last check-in ${daysSince(lastCheckIn.date)===0 ? 'today' : `${daysSince(lastCheckIn.date)}d ago`} — flag what's slowing you down and PulseFit adjusts your plan.`
                : "Flag what's slowing you down and PulseFit adjusts your calories, macros, or workouts to match."}
            </p>
          </div>
        </div>
      </Card>

      <Card className="animate-in">
        <CardHeader title="What is making progress difficult right now?" subtitle="Select all that apply" />
        <div className="mb-4 flex flex-wrap gap-2">
          {ISSUES.map((issue) => {
            const { icon: Icon, color } = getChallengeVisual(issue)
            const active = selected.includes(issue)
            return (
              <button
                key={issue}
                onClick={() => toggle(issue)}
                className={clsx(
                  'flex items-center gap-1.5 rounded-full border px-3.5 py-2 text-xs font-semibold transition',
                  active ? 'border-transparent text-white' : 'border-[var(--color-border)] bg-[var(--color-surface-2)] text-[var(--color-text-secondary)]',
                )}
                style={active ? { backgroundColor: color } : undefined}
              >
                <Icon size={14} style={active ? undefined : { color }} />
                {challengeLabel(issue)}
              </button>
            )
          })}
        </div>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Anything else you want to note? (optional)"
          rows={3}
          className="mb-4 w-full resize-none rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-2)] px-3.5 py-2.5 text-sm outline-none placeholder:text-[var(--color-text-muted)] focus:border-[var(--color-brand)]"
        />
        <Button className="w-full" disabled={selected.length === 0} onClick={generate}>
          <Sparkles size={16} /> Get my recommendation
        </Button>
      </Card>

      {recommendation && (
        <Card className="animate-in border-[var(--color-brand)]/30 bg-[var(--color-brand)]/10">
          <div className="flex gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--color-brand)]/20 text-[var(--color-brand)]">
              <Sparkles size={16} />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-[var(--color-text-secondary)]">Adaptive recommendation</p>
              <p className="mt-1 whitespace-pre-line text-sm leading-relaxed">{recommendation}</p>
            </div>
          </div>
        </Card>
      )}

      {appliedChanges.length > 0 && (
        <Card className="animate-in border-[var(--color-good)]/30 bg-[var(--color-good)]/10">
          <p className="mb-2 text-xs font-bold uppercase tracking-wide text-[var(--color-text-secondary)]">Applied to your plan</p>
          <ul className="space-y-1.5">
            {appliedChanges.map((c, i) => (
              <li key={i} className="flex gap-2 text-sm">
                <CheckCircle2 size={15} className="mt-0.5 shrink-0 text-[var(--color-good)]" />
                <span>{c}</span>
              </li>
            ))}
          </ul>
        </Card>
      )}

      <Card className="animate-in">
        <CardHeader title="Past check-ins" />
        {history.length === 0 ? (
          <EmptyState icon={MessageCircleHeart} title="No check-ins yet" description="Your check-in history will appear here." />
        ) : (
          <div className="space-y-2">
            {history.map((c) => (
              <div key={c.id} className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-2)] p-3.5">
                <p className="mb-2 text-xs font-semibold text-[var(--color-text-secondary)]">{formatCheckInDate(c.date)}</p>
                <div className="mb-2 flex flex-wrap gap-1.5">
                  {c.issues.map((i) => {
                    const { icon: Icon, color } = getChallengeVisual(i)
                    return (
                      <span
                        key={i}
                        className="flex items-center gap-1 rounded-full bg-[var(--color-surface-3)] px-2 py-0.5 text-[10px] font-semibold"
                      >
                        <Icon size={10} style={{ color }} /> {challengeLabel(i)}
                      </span>
                    )
                  })}
                </div>
                {c.notes && <p className="mb-1 text-xs italic text-[var(--color-text-muted)]">"{c.notes}"</p>}
                {c.recommendation && (
                  <p className="whitespace-pre-line text-xs leading-relaxed text-[var(--color-text-secondary)]">{c.recommendation}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  )
}
