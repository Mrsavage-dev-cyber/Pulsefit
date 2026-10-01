import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import clsx from 'clsx'
import { Activity, ArrowLeft, ArrowRight, Check, Sparkles } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { Button } from '../components/ui/Button'
import { FormField, TextInput } from '../components/ui/FormField'
import { generatePlan, PlanGenerationError } from '../lib/planGenerator'
import { challengeLabel } from '../lib/recommendations'
import type {
  ActivityLevel,
  Challenge,
  Experience,
  FoodPreference,
  Goal,
  MealPlan,
  Sex,
  Targets,
  UserProfile,
  WorkoutDay,
} from '../types'

const GOAL_OPTIONS: { value: Goal; title: string; desc: string }[] = [
  { value: 'lose_fat', title: 'Lose fat', desc: 'Calorie deficit with strength training to preserve muscle' },
  { value: 'gain_muscle', title: 'Gain muscle', desc: 'Calorie surplus with progressive overload training' },
  { value: 'maintain', title: 'Maintain weight', desc: 'Stay at your current weight and build healthy habits' },
]

const ACTIVITY_OPTIONS: { value: ActivityLevel; title: string; desc: string }[] = [
  { value: 'sedentary', title: 'Sedentary', desc: 'Desk job, little to no exercise' },
  { value: 'light', title: 'Light', desc: 'Light exercise 1-3 days/week' },
  { value: 'moderate', title: 'Moderate', desc: 'Moderate exercise 3-5 days/week' },
  { value: 'active', title: 'Active', desc: 'Hard exercise 6-7 days/week' },
  { value: 'very_active', title: 'Very active', desc: 'Physical job or twice-daily training' },
]

const EXPERIENCE_OPTIONS: { value: Experience; title: string }[] = [
  { value: 'beginner', title: 'Beginner' },
  { value: 'intermediate', title: 'Intermediate' },
  { value: 'advanced', title: 'Advanced' },
]

const FOOD_PREFERENCES: { value: FoodPreference; label: string }[] = [
  { value: 'omnivore', label: 'No restrictions' },
  { value: 'vegetarian', label: 'Vegetarian' },
  { value: 'vegan', label: 'Vegan' },
  { value: 'pescatarian', label: 'Pescatarian' },
  { value: 'low_carb', label: 'Low-carb' },
  { value: 'dairy_free', label: 'Dairy-free' },
  { value: 'gluten_free', label: 'Gluten-free' },
]

const CHALLENGES: Challenge[] = ['hunger', 'low_energy', 'lack_of_time', 'plateau', 'injury_pain', 'motivation', 'poor_sleep']

type Draft = {
  name: string
  age: string
  sex: Sex
  heightCm: string
  currentWeightKg: string
  goalWeightKg: string
  goal: Goal
  activityLevel: ActivityLevel
  experience: Experience
  workoutDaysPerWeek: number
  foodPreferences: FoodPreference[]
  challenges: Challenge[]
}

const initialDraft: Draft = {
  name: '',
  age: '',
  sex: 'male',
  heightCm: '',
  currentWeightKg: '',
  goalWeightKg: '',
  goal: 'lose_fat',
  activityLevel: 'moderate',
  experience: 'beginner',
  workoutDaysPerWeek: 4,
  foodPreferences: [],
  challenges: [],
}

const STEP_TITLES = ['About you', 'Your goal', 'Activity & training', 'Food preferences', 'Current challenges', 'Your plan']

export function Onboarding() {
  const { dispatch } = useApp()
  const navigate = useNavigate()
  const [step, setStep] = useState(0)
  const [draft, setDraft] = useState<Draft>(initialDraft)

  const canProceed = useMemo(() => {
    switch (step) {
      case 0:
        return draft.name.trim().length > 0 && Number(draft.age) > 0 && Number(draft.heightCm) > 0 && Number(draft.currentWeightKg) > 0 && Number(draft.goalWeightKg) > 0
      case 1:
        return !!draft.goal
      case 2:
        return !!draft.activityLevel && !!draft.experience
      case 3:
        return true
      case 4:
        return true
      default:
        return true
    }
  }, [step, draft])

  const previewProfile: UserProfile | null = useMemo(() => {
    if (!canProceed && step < 5) return null
    if (!draft.age || !draft.heightCm || !draft.currentWeightKg || !draft.goalWeightKg) return null
    return {
      name: draft.name || 'there',
      age: Number(draft.age),
      sex: draft.sex,
      heightCm: Number(draft.heightCm),
      currentWeightKg: Number(draft.currentWeightKg),
      goalWeightKg: Number(draft.goalWeightKg),
      goal: draft.goal,
      activityLevel: draft.activityLevel,
      experience: draft.experience,
      workoutDaysPerWeek: draft.workoutDaysPerWeek,
      foodPreferences: draft.foodPreferences.length ? draft.foodPreferences : ['omnivore'],
      challenges: draft.challenges,
      createdAt: new Date().toISOString(),
    }
  }, [draft, canProceed, step])

  const [plan, setPlan] = useState<{ targets: Targets; workoutPlan: WorkoutDay[]; mealPlan: MealPlan } | null>(null)
  const [generating, setGenerating] = useState(false)
  const [genError, setGenError] = useState('')

  function toggleMulti<T>(list: T[], value: T): T[] {
    return list.includes(value) ? list.filter((v) => v !== value) : [...list, value]
  }

  async function generate() {
    if (!previewProfile) return
    setGenerating(true)
    setGenError('')
    try {
      const result = await generatePlan(previewProfile)
      setPlan(result)
    } catch (err) {
      setGenError(err instanceof PlanGenerationError ? err.message : 'Something went wrong generating your plan.')
    } finally {
      setGenerating(false)
    }
  }

  useEffect(() => {
    if (step === 5 && !plan && !generating && !genError) {
      void generate()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step])

  function finish() {
    if (!previewProfile || !plan) return
    dispatch({
      type: 'ONBOARD',
      profile: previewProfile,
      targets: plan.targets,
      workoutPlan: plan.workoutPlan,
      mealPlan: plan.mealPlan,
    })
    navigate('/', { replace: true })
  }

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-md flex-col px-5 py-8">
      <div className="mb-6 flex items-center gap-2">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--color-brand)]">
          <Activity size={20} className="text-white" />
        </div>
        <span className="text-xl font-extrabold tracking-tight">PulseFit</span>
      </div>

      <div className="mb-6">
        <div className="mb-2 flex items-center justify-between text-xs text-[var(--color-text-secondary)]">
          <span>{STEP_TITLES[step]}</span>
          <span className="tabular">{step + 1} / {STEP_TITLES.length}</span>
        </div>
        <div className="flex gap-1.5">
          {STEP_TITLES.map((_, i) => (
            <div
              key={i}
              className={clsx('h-1.5 flex-1 rounded-full', i <= step ? 'bg-[var(--color-brand)]' : 'bg-[var(--color-surface-3)]')}
            />
          ))}
        </div>
      </div>

      <div className="flex-1 animate-in" key={step}>
        {step === 0 && (
          <div className="space-y-4">
            <FormField label="Your name">
              <TextInput value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} placeholder="Alex" />
            </FormField>
            <div className="grid grid-cols-2 gap-3">
              <FormField label="Age">
                <TextInput
                  type="number"
                  inputMode="numeric"
                  value={draft.age}
                  onChange={(e) => setDraft({ ...draft, age: e.target.value })}
                  placeholder="28"
                />
              </FormField>
              <FormField label="Sex">
                <div className="flex gap-2">
                  {(['male', 'female'] as Sex[]).map((s) => (
                    <button
                      key={s}
                      onClick={() => setDraft({ ...draft, sex: s })}
                      className={clsx(
                        'flex-1 rounded-xl border px-3 py-2.5 text-sm font-medium capitalize',
                        draft.sex === s
                          ? 'border-[var(--color-brand)] bg-[var(--color-brand)]/10 text-[var(--color-text)]'
                          : 'border-[var(--color-border)] bg-[var(--color-surface-2)] text-[var(--color-text-secondary)]',
                      )}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </FormField>
            </div>
            <FormField label="Height (cm)">
              <TextInput
                type="number"
                inputMode="numeric"
                value={draft.heightCm}
                onChange={(e) => setDraft({ ...draft, heightCm: e.target.value })}
                placeholder="175"
              />
            </FormField>
            <div className="grid grid-cols-2 gap-3">
              <FormField label="Current weight (kg)">
                <TextInput
                  type="number"
                  inputMode="decimal"
                  value={draft.currentWeightKg}
                  onChange={(e) => setDraft({ ...draft, currentWeightKg: e.target.value })}
                  placeholder="82"
                />
              </FormField>
              <FormField label="Goal weight (kg)">
                <TextInput
                  type="number"
                  inputMode="decimal"
                  value={draft.goalWeightKg}
                  onChange={(e) => setDraft({ ...draft, goalWeightKg: e.target.value })}
                  placeholder="75"
                />
              </FormField>
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="space-y-3">
            {GOAL_OPTIONS.map((opt) => (
              <OptionCard
                key={opt.value}
                selected={draft.goal === opt.value}
                title={opt.title}
                desc={opt.desc}
                onClick={() => setDraft({ ...draft, goal: opt.value })}
              />
            ))}
          </div>
        )}

        {step === 2 && (
          <div className="space-y-5">
            <div>
              <p className="mb-2 text-xs font-semibold text-[var(--color-text-secondary)]">Activity level</p>
              <div className="space-y-2">
                {ACTIVITY_OPTIONS.map((opt) => (
                  <OptionCard
                    key={opt.value}
                    compact
                    selected={draft.activityLevel === opt.value}
                    title={opt.title}
                    desc={opt.desc}
                    onClick={() => setDraft({ ...draft, activityLevel: opt.value })}
                  />
                ))}
              </div>
            </div>
            <div>
              <p className="mb-2 text-xs font-semibold text-[var(--color-text-secondary)]">Training experience</p>
              <div className="flex gap-2">
                {EXPERIENCE_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => setDraft({ ...draft, experience: opt.value })}
                    className={clsx(
                      'flex-1 rounded-xl border px-3 py-2.5 text-sm font-medium',
                      draft.experience === opt.value
                        ? 'border-[var(--color-brand)] bg-[var(--color-brand)]/10'
                        : 'border-[var(--color-border)] bg-[var(--color-surface-2)] text-[var(--color-text-secondary)]',
                    )}
                  >
                    {opt.title}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="mb-2 text-xs font-semibold text-[var(--color-text-secondary)]">
                Workout days per week: <span className="tabular text-[var(--color-text)]">{draft.workoutDaysPerWeek}</span>
              </p>
              <input
                type="range"
                min={2}
                max={6}
                value={draft.workoutDaysPerWeek}
                onChange={(e) => setDraft({ ...draft, workoutDaysPerWeek: Number(e.target.value) })}
                className="w-full accent-[var(--color-brand)]"
              />
            </div>
          </div>
        )}

        {step === 3 && (
          <div>
            <p className="mb-3 text-sm text-[var(--color-text-secondary)]">Select any that apply. We'll shape your meal suggestions around these.</p>
            <div className="flex flex-wrap gap-2">
              {FOOD_PREFERENCES.map((opt) => (
                <Chip
                  key={opt.value}
                  label={opt.label}
                  selected={draft.foodPreferences.includes(opt.value)}
                  onClick={() => setDraft({ ...draft, foodPreferences: toggleMulti(draft.foodPreferences, opt.value) })}
                />
              ))}
            </div>
          </div>
        )}

        {step === 4 && (
          <div>
            <p className="mb-3 text-sm text-[var(--color-text-secondary)]">What's making progress hard right now? Select all that apply.</p>
            <div className="flex flex-wrap gap-2">
              {CHALLENGES.map((c) => (
                <Chip
                  key={c}
                  label={challengeLabel(c)}
                  selected={draft.challenges.includes(c)}
                  onClick={() => setDraft({ ...draft, challenges: toggleMulti(draft.challenges, c) })}
                />
              ))}
            </div>
          </div>
        )}


        {step === 5 && previewProfile && generating && (
          <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
            <Sparkles size={24} className="animate-pulse text-[var(--color-brand)]" />
            <p className="text-sm font-medium text-[var(--color-text-secondary)]">Gemini is building your nutrition targets and workout plan…</p>
          </div>
        )}

        {step === 5 && previewProfile && !generating && genError && (
          <div className="space-y-4">
            <p className="text-sm text-[var(--color-critical)]">{genError}</p>
            <Button className="w-full" onClick={() => void generate()}>
              Try again
            </Button>
          </div>
        )}

        {step === 5 && plan && previewProfile && (
          <div className="space-y-4">
            <div className="rounded-2xl border border-[var(--color-brand)]/30 bg-[var(--color-brand)]/10 p-4">
              <div className="mb-1 flex items-center gap-1.5 text-[var(--color-brand)]">
                <Sparkles size={16} />
                <span className="text-xs font-bold uppercase tracking-wide">Your personalized plan</span>
              </div>
              <p className="text-3xl font-extrabold tabular">{plan.targets.calorieTarget.toLocaleString()} <span className="text-base font-medium text-[var(--color-text-secondary)]">kcal/day</span></p>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <MacroStat label="Protein" value={plan.targets.proteinG} color="var(--color-brand)" />
              <MacroStat label="Carbs" value={plan.targets.carbG} color="var(--color-orange)" />
              <MacroStat label="Fat" value={plan.targets.fatG} color="var(--color-violet)" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-2)] p-3">
                <p className="text-xs text-[var(--color-text-secondary)]">Step goal</p>
                <p className="text-lg font-bold tabular">{plan.targets.stepGoal.toLocaleString()}</p>
              </div>
              <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-2)] p-3">
                <p className="text-xs text-[var(--color-text-secondary)]">Weekly weight target</p>
                <p className="text-lg font-bold tabular">
                  {plan.targets.weeklyWeightChangeKg > 0 ? '+' : ''}
                  {plan.targets.weeklyWeightChangeKg.toFixed(2)} kg
                </p>
              </div>
            </div>
            <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-2)] p-3">
              <p className="mb-1 text-xs font-semibold text-[var(--color-text-secondary)]">
                Meal plan · {plan.mealPlan.meals.length} meals/snacks
              </p>
              <p className="text-[11px] leading-relaxed text-[var(--color-text-muted)]">
                {plan.mealPlan.meals.map((m) => m.name).join(' · ')}
              </p>
            </div>
            <p className="rounded-xl bg-[var(--color-surface-2)] p-3 text-[11px] leading-relaxed text-[var(--color-text-muted)]">
              This plan was generated by Gemini and is general wellness guidance, not medical advice. Consult a
              qualified healthcare professional before starting a new nutrition or exercise program, especially if
              you have any medical conditions.
            </p>
          </div>
        )}
      </div>

      <div className="mt-6 flex gap-3">
        {step > 0 && (
          <Button variant="secondary" onClick={() => setStep((s) => s - 1)}>
            <ArrowLeft size={16} /> Back
          </Button>
        )}
        {step < STEP_TITLES.length - 1 ? (
          <Button className="flex-1" disabled={!canProceed} onClick={() => setStep((s) => s + 1)}>
            Next <ArrowRight size={16} />
          </Button>
        ) : (
          <Button className="flex-1" onClick={finish} disabled={!plan}>
            <Check size={16} /> Start using PulseFit
          </Button>
        )}
      </div>
    </div>
  )
}

function OptionCard({
  title,
  desc,
  selected,
  onClick,
  compact,
}: {
  title: string
  desc: string
  selected: boolean
  onClick: () => void
  compact?: boolean
}) {
  return (
    <button
      onClick={onClick}
      className={clsx(
        'w-full rounded-xl border text-left transition',
        compact ? 'px-3.5 py-2.5' : 'px-4 py-3.5',
        selected
          ? 'border-[var(--color-brand)] bg-[var(--color-brand)]/10'
          : 'border-[var(--color-border)] bg-[var(--color-surface-2)] hover:border-[var(--color-border-strong)]',
      )}
    >
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold">{title}</span>
        {selected && <Check size={16} className="text-[var(--color-brand)]" />}
      </div>
      <p className="mt-0.5 text-xs text-[var(--color-text-secondary)]">{desc}</p>
    </button>
  )
}

function Chip({ label, selected, onClick }: { label: string; selected: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={clsx(
        'rounded-full border px-3.5 py-2 text-xs font-semibold transition',
        selected
          ? 'border-[var(--color-brand)] bg-[var(--color-brand)] text-white'
          : 'border-[var(--color-border)] bg-[var(--color-surface-2)] text-[var(--color-text-secondary)]',
      )}
    >
      {label}
    </button>
  )
}

function MacroStat({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-2)] p-3 text-center">
      <div className="mx-auto mb-1.5 h-1.5 w-6 rounded-full" style={{ backgroundColor: color }} />
      <p className="text-base font-bold tabular">{value}g</p>
      <p className="text-[11px] text-[var(--color-text-secondary)]">{label}</p>
    </div>
  )
}
