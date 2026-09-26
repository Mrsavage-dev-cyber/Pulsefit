import { useMemo, useState } from 'react'
import { Plus, Search, Trash2 } from 'lucide-react'
import type { FoodPreference, Goal, Meal, MealType } from '../../types'
import { filterByPreferences, getAllFoodsForGoal, searchFoods, type IndianFood } from '../../lib/indianFoods'

const SECTIONS: { type: MealType; label: string }[] = [
  { type: 'breakfast', label: 'Breakfast' },
  { type: 'lunch', label: 'Lunch' },
  { type: 'dinner', label: 'Dinner' },
  { type: 'snack', label: 'Snacks' },
]

export function MealList({
  meals,
  goal,
  foodPreferences,
  onAdd,
  onQuickAdd,
  onCustom,
  onDelete,
}: {
  meals: Meal[]
  goal: Goal
  foodPreferences: FoodPreference[]
  onAdd: (type: MealType) => void
  onQuickAdd: (type: MealType, food: IndianFood) => void
  onCustom: (type: MealType, name: string) => void
  onDelete: (id: string) => void
}) {
  return (
    <div className="space-y-4">
      {SECTIONS.map((section) => {
        const items = meals.filter((m) => m.mealType === section.type)
        const total = items.reduce((s, m) => s + m.calories, 0)
        return (
          <div key={section.type}>
            <div className="mb-2 flex items-center justify-between">
              <p className="text-sm font-semibold">
                {section.label} <span className="tabular font-normal text-[var(--color-text-secondary)]">· {total} kcal</span>
              </p>
              <button
                onClick={() => onAdd(section.type)}
                className="flex items-center gap-1 rounded-full bg-[var(--color-surface-3)] px-2.5 py-1 text-xs font-semibold text-[var(--color-text-secondary)] hover:text-[var(--color-text)]"
              >
                <Plus size={13} /> Add
              </button>
            </div>

            <QuickAddSearch
              type={section.type}
              goal={goal}
              foodPreferences={foodPreferences}
              onQuickAdd={onQuickAdd}
              onCustom={onCustom}
            />

            {items.length === 0 ? (
              <p className="rounded-xl border border-dashed border-[var(--color-border)] px-3 py-3 text-xs text-[var(--color-text-muted)]">
                Nothing logged yet
              </p>
            ) : (
              <div className="space-y-1.5">
                {items.map((meal) => (
                  <div key={meal.id} className="flex items-center justify-between rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-2)] px-3.5 py-2.5">
                    <div>
                      <p className="text-sm font-medium">{meal.name}</p>
                      <p className="text-[11px] text-[var(--color-text-secondary)]">
                        P {meal.protein}g · C {meal.carbs}g · F {meal.fat}g
                      </p>
                      {meal.note && <p className="mt-0.5 text-[11px] italic text-[var(--color-text-muted)]">{meal.note}</p>}
                    </div>
                    <div className="flex items-center gap-3">
                      <p className="tabular text-sm font-semibold">{meal.calories}</p>
                      <button
                        onClick={() => onDelete(meal.id)}
                        aria-label={`Delete ${meal.name}`}
                        className="rounded-full p-1.5 text-[var(--color-text-muted)] transition hover:bg-[var(--color-critical)]/10 hover:text-[var(--color-critical)]"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

function QuickAddSearch({
  type,
  goal,
  foodPreferences,
  onQuickAdd,
  onCustom,
}: {
  type: MealType
  goal: Goal
  foodPreferences: FoodPreference[]
  onQuickAdd: (type: MealType, food: IndianFood) => void
  onCustom: (type: MealType, name: string) => void
}) {
  const [text, setText] = useState('')
  const [open, setOpen] = useState(false)

  const foods = useMemo(() => filterByPreferences(getAllFoodsForGoal(goal), foodPreferences), [goal, foodPreferences])
  const matches = useMemo(() => (text.trim().length >= 2 ? searchFoods(text, foods) : []), [text, foods])

  function selectFood(food: IndianFood) {
    onQuickAdd(type, food)
    setText('')
    setOpen(false)
  }

  function addCustom() {
    if (!text.trim()) return
    onCustom(type, text.trim())
    setText('')
    setOpen(false)
  }

  return (
    <div className="relative mb-2">
      <div className="flex items-center gap-2 rounded-xl border border-dashed border-[var(--color-border)] bg-[var(--color-surface-2)] px-3 py-2">
        <Search size={14} className="shrink-0 text-[var(--color-text-muted)]" />
        <input
          value={text}
          onChange={(e) => {
            setText(e.target.value)
            setOpen(true)
          }}
          onFocus={() => setOpen(true)}
          onBlur={() => setOpen(false)}
          onKeyDown={(e) => {
            if (e.key !== 'Enter') return
            if (matches[0]) selectFood(matches[0])
            else addCustom()
          }}
          placeholder="Type a food to add..."
          autoComplete="off"
          className="w-full min-w-0 flex-1 bg-transparent text-sm text-[var(--color-text)] outline-none placeholder:text-[var(--color-text-muted)]"
        />
      </div>

      {open && text.trim().length >= 2 && (
        <div className="absolute z-10 mt-1.5 w-full space-y-1 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-2)] p-1.5 shadow-xl">
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
          <button
            onMouseDown={(e) => {
              e.preventDefault()
              addCustom()
            }}
            className="flex w-full items-center gap-1.5 rounded-lg px-2.5 py-2 text-left text-xs font-semibold text-[var(--color-brand)] hover:bg-[var(--color-surface-3)]"
          >
            <Plus size={12} /> Add "{text.trim()}" as a custom item
          </button>
        </div>
      )}
    </div>
  )
}
