import { useState } from 'react'
import { Clock, Plus, RefreshCw, Sparkles } from 'lucide-react'
import { Card, CardHeader } from '../ui/Card'
import { Button } from '../ui/Button'
import { useApp } from '../../context/AppContext'
import { generateMealPlan, PlanGenerationError } from '../../lib/planGenerator'
import { formatPlanTime, todayISO } from '../../lib/calculations'
import type { PlannedMeal } from '../../types'

export function MealPlanCard() {
  const { state, dispatch } = useApp()
  const { profile, targets, mealPlan } = state
  const [generating, setGenerating] = useState(false)
  const [error, setError] = useState('')

  if (!profile || !targets) return null

  async function regenerate() {
    if (!profile || !targets) return
    setGenerating(true)
    setError('')
    try {
      const plan = await generateMealPlan(profile, targets)
      dispatch({ type: 'SET_MEAL_PLAN', mealPlan: plan })
    } catch (err) {
      setError(err instanceof PlanGenerationError ? err.message : 'Something went wrong generating your meal plan.')
    } finally {
      setGenerating(false)
    }
  }

  function logMeal(meal: PlannedMeal) {
    dispatch({
      type: 'ADD_MEAL',
      meal: {
        id: `meal-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        date: todayISO(),
        mealType: meal.mealType,
        name: meal.name,
        calories: meal.calories,
        protein: meal.protein,
        carbs: meal.carbs,
        fat: meal.fat,
        note: meal.note,
      },
    })
  }

  return (
    <Card>
      <CardHeader
        title="Your meal plan"
        subtitle={mealPlan ? 'What & when to eat, from Gemini' : 'Let Gemini plan what & when to eat'}
        action={
          <Button size="sm" variant="secondary" onClick={() => void regenerate()} disabled={generating}>
            {mealPlan ? <RefreshCw size={14} /> : <Sparkles size={14} />}
            {generating ? 'Generating…' : mealPlan ? 'Regenerate' : 'Generate'}
          </Button>
        }
      />
      {error && <p className="mb-3 text-xs text-[var(--color-critical)]">{error}</p>}
      {!mealPlan && !generating && (
        <p className="text-xs text-[var(--color-text-secondary)]">
          Get a full day's plan tailored to your calorie and macro targets, with a recommended time to eat each meal.
        </p>
      )}
      {mealPlan && (
        <div className="space-y-1.5">
          {mealPlan.meals.map((meal, i) => (
            <div
              key={i}
              className="flex items-center justify-between gap-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-2)] px-3.5 py-2.5"
            >
              <div className="flex items-center gap-3">
                <div className="flex w-16 shrink-0 items-center gap-1 text-[11px] font-semibold text-[var(--color-text-secondary)]">
                  <Clock size={12} /> {formatPlanTime(meal.time)}
                </div>
                <div>
                  <p className="text-sm font-medium">{meal.name}</p>
                  <p className="text-[11px] text-[var(--color-text-secondary)]">
                    {meal.calories} kcal · P {meal.protein}g · C {meal.carbs}g · F {meal.fat}g
                  </p>
                </div>
              </div>
              <button
                onClick={() => logMeal(meal)}
                aria-label={`Log ${meal.name}`}
                className="flex shrink-0 items-center gap-1 rounded-full bg-[var(--color-surface-3)] px-2.5 py-1 text-xs font-semibold text-[var(--color-text-secondary)] hover:text-[var(--color-text)]"
              >
                <Plus size={13} /> Log
              </button>
            </div>
          ))}
        </div>
      )}
    </Card>
  )
}
