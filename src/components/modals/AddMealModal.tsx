import { useEffect, useMemo, useState } from 'react'
import { Modal } from '../ui/Modal'
import { Button } from '../ui/Button'
import { FormField, TextInput } from '../ui/FormField'
import { useApp } from '../../context/AppContext'
import type { MealType } from '../../types'
import { todayISO } from '../../lib/calculations'
import { filterByPreferences, getAllFoodsForGoal, searchFoods, type IndianFood } from '../../lib/indianFoods'
import clsx from 'clsx'

const MEAL_TYPES: { value: MealType; label: string }[] = [
  { value: 'breakfast', label: 'Breakfast' },
  { value: 'lunch', label: 'Lunch' },
  { value: 'dinner', label: 'Dinner' },
  { value: 'snack', label: 'Snack' },
]

const SNACK_TIMES = ['Between breakfast & lunch', 'Between lunch & dinner', 'After dinner']

export interface MealPrefill {
  name: string
  calories: number
  protein: number
  carbs: number
  fat: number
  unit?: string
  baseQty?: number
}

export function AddMealModal({
  open,
  onClose,
  defaultType = 'breakfast',
  prefill,
  initialName,
}: {
  open: boolean
  onClose: () => void
  defaultType?: MealType
  prefill?: MealPrefill | null
  initialName?: string
}) {
  const { state, dispatch } = useApp()
  const [mealType, setMealType] = useState<MealType>(defaultType)
  const [name, setName] = useState('')
  const [qty, setQty] = useState('')
  const [calories, setCalories] = useState('')
  const [protein, setProtein] = useState('')
  const [carbs, setCarbs] = useState('')
  const [fat, setFat] = useState('')
  const [note, setNote] = useState('')
  const [error, setError] = useState('')
  const [activeFood, setActiveFood] = useState<MealPrefill | null>(null)
  const [showSuggestions, setShowSuggestions] = useState(false)

  const goalFoods = useMemo(
    () => (state.profile ? filterByPreferences(getAllFoodsForGoal(state.profile.goal), state.profile.foodPreferences) : []),
    [state.profile],
  )
  const matches = useMemo(
    () => (name.trim().length >= 2 ? searchFoods(name, goalFoods) : []),
    [name, goalFoods],
  )

  useEffect(() => {
    if (!open) return
    setMealType(defaultType)
    setNote('')
    setShowSuggestions(false)
    if (prefill) {
      setActiveFood(prefill)
      setName(prefill.name)
      setQty(prefill.baseQty != null ? String(prefill.baseQty) : '')
      setCalories(String(prefill.calories))
      setProtein(String(prefill.protein))
      setCarbs(String(prefill.carbs))
      setFat(String(prefill.fat))
    } else {
      setActiveFood(null)
      setName(initialName ?? '')
      setQty('')
      setCalories('')
      setProtein('')
      setCarbs('')
      setFat('')
    }
    setError('')
  }, [open, prefill, initialName, defaultType])

  function reset() {
    setName('')
    setQty('')
    setCalories('')
    setProtein('')
    setCarbs('')
    setFat('')
    setNote('')
    setActiveFood(null)
    setShowSuggestions(false)
    setError('')
  }

  function handleClose() {
    reset()
    onClose()
  }

  function handleNameChange(value: string) {
    setName(value)
    setShowSuggestions(true)
    if (activeFood && value !== activeFood.name) setActiveFood(null)
  }

  function selectFood(food: IndianFood) {
    setActiveFood(food)
    setName(food.name)
    setQty(String(food.baseQty))
    setCalories(String(food.calories))
    setProtein(String(food.protein))
    setCarbs(String(food.carbs))
    setFat(String(food.fat))
    setShowSuggestions(false)
  }

  function handleQtyChange(value: string) {
    setQty(value)
    if (!activeFood || activeFood.baseQty == null) return
    const q = Number(value)
    if (!value || Number.isNaN(q) || q <= 0) return
    const ratio = q / activeFood.baseQty
    setCalories(String(Math.round(activeFood.calories * ratio)))
    setProtein(String(Math.round(activeFood.protein * ratio)))
    setCarbs(String(Math.round(activeFood.carbs * ratio)))
    setFat(String(Math.round(activeFood.fat * ratio)))
  }

  function submit() {
    if (!name.trim()) {
      setError('Give this meal a name.')
      return
    }
    if (!calories || Number(calories) <= 0) {
      setError('Enter a calorie amount greater than 0.')
      return
    }
    dispatch({
      type: 'ADD_MEAL',
      meal: {
        id: `meal-${Date.now()}`,
        date: todayISO(),
        mealType,
        name: name.trim(),
        calories: Number(calories),
        protein: Number(protein) || 0,
        carbs: Number(carbs) || 0,
        fat: Number(fat) || 0,
        note: note.trim() || undefined,
      },
    })
    handleClose()
  }

  return (
    <Modal open={open} onClose={handleClose} title="Log a meal">
      <div className="space-y-4">
        <div>
          <span className="mb-1.5 block text-xs font-semibold text-[var(--color-text-secondary)]">Meal</span>
          <div className="grid grid-cols-4 gap-2">
            {MEAL_TYPES.map((t) => (
              <button
                key={t.value}
                onClick={() => setMealType(t.value)}
                className={clsx(
                  'rounded-lg border px-2 py-2 text-xs font-semibold',
                  mealType === t.value
                    ? 'border-[var(--color-brand)] bg-[var(--color-brand)]/10'
                    : 'border-[var(--color-border)] bg-[var(--color-surface-2)] text-[var(--color-text-secondary)]',
                )}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>
        <FormField label="Meal name" hint="Start typing to find a matching Indian dish">
          <div className="relative">
            <TextInput
              value={name}
              onChange={(e) => handleNameChange(e.target.value)}
              onFocus={() => setShowSuggestions(true)}
              onBlur={() => setShowSuggestions(false)}
              placeholder="Chicken & rice bowl"
              autoComplete="off"
            />
            {showSuggestions && matches.length > 0 && (
              <div className="mt-1.5 space-y-1 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-2)] p-1.5">
                {matches.map((food) => (
                  <button
                    key={food.name}
                    onMouseDown={(e) => {
                      e.preventDefault()
                      selectFood(food)
                    }}
                    className="flex w-full items-center justify-between rounded-lg px-2.5 py-2 text-left text-xs hover:bg-[var(--color-surface-3)]"
                  >
                    <span className="font-medium">{food.name}</span>
                    <span className="shrink-0 text-[var(--color-text-secondary)]">
                      {food.calories} kcal / {food.baseQty} {food.unit}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </FormField>

        {activeFood?.unit && (
          <FormField label={`Quantity (${activeFood.unit})`} hint={`Macros scale from ${activeFood.baseQty} ${activeFood.unit} — e.g. enter 250 for 250g, or 1 for 1 ${activeFood.unit}`}>
            <TextInput
              type="number"
              inputMode="decimal"
              value={qty}
              onChange={(e) => handleQtyChange(e.target.value)}
              placeholder={String(activeFood.baseQty)}
            />
          </FormField>
        )}

        <FormField label="Calories (kcal)">
          <TextInput type="number" inputMode="numeric" value={calories} onChange={(e) => setCalories(e.target.value)} placeholder="550" />
        </FormField>
        <div className="grid grid-cols-3 gap-3">
          <FormField label="Protein (g)">
            <TextInput type="number" inputMode="numeric" value={protein} onChange={(e) => setProtein(e.target.value)} placeholder="40" />
          </FormField>
          <FormField label="Carbs (g)">
            <TextInput type="number" inputMode="numeric" value={carbs} onChange={(e) => setCarbs(e.target.value)} placeholder="55" />
          </FormField>
          <FormField label="Fat (g)">
            <TextInput type="number" inputMode="numeric" value={fat} onChange={(e) => setFat(e.target.value)} placeholder="15" />
          </FormField>
        </div>

        {mealType === 'snack' && (
          <div>
            <span className="mb-1.5 block text-xs font-semibold text-[var(--color-text-secondary)]">When (optional)</span>
            <div className="flex flex-wrap gap-1.5">
              {SNACK_TIMES.map((t) => (
                <button
                  key={t}
                  onClick={() => setNote(note === t ? '' : t)}
                  className={clsx(
                    'rounded-full border px-2.5 py-1 text-xs font-semibold',
                    note === t
                      ? 'border-[var(--color-brand)] bg-[var(--color-brand)]/10 text-[var(--color-brand)]'
                      : 'border-[var(--color-border)] bg-[var(--color-surface-2)] text-[var(--color-text-secondary)]',
                  )}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
        )}

        <FormField label="Note (optional)">
          <TextInput value={note} onChange={(e) => setNote(e.target.value)} placeholder="e.g. after dinner, before workout" />
        </FormField>

        {error && <p className="text-xs text-[var(--color-critical)]">{error}</p>}
        <Button className="w-full" onClick={submit}>Add meal</Button>
      </div>
    </Modal>
  )
}
