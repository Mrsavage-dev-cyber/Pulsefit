import { useEffect, useMemo, useState } from 'react'
import { ChevronDown, Flame, Leaf, Plus, Search, UtensilsCrossed, IceCreamCone } from 'lucide-react'
import { Card, CardHeader } from '../ui/Card'
import {
  CATEGORY_LABELS,
  filterByDietType,
  filterByPreferences,
  getAllFoodsForGoal,
  getIndianFoodSections,
  searchFoods,
  type DietFilter,
  type FoodCategory,
} from '../../lib/indianFoods'
import type { FoodPreference, Goal } from '../../types'
import type { MealPrefill } from '../modals/AddMealModal'

const GOAL_SUBTITLE: Record<Goal, string> = {
  gain_muscle: 'High-calorie, high-protein picks for bulking',
  lose_fat: 'High-protein, lighter meals for cutting',
  maintain: 'Balanced everyday meals',
}

const CATEGORY_ORDER: FoodCategory[] = ['meals', 'highCalSnacks', 'lowCalSnacks', 'desserts']

const CATEGORY_ICONS: Record<FoodCategory, typeof UtensilsCrossed> = {
  meals: UtensilsCrossed,
  highCalSnacks: Flame,
  lowCalSnacks: Leaf,
  desserts: IceCreamCone,
}

const PREVIEW_COUNT = 4

const DIET_FILTERS: { value: DietFilter; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'veg', label: 'Veg' },
  { value: 'vegan', label: 'Vegan' },
  { value: 'nonveg', label: 'Non-veg' },
]

export function IndianFoodSuggestions({
  goal,
  foodPreferences,
  onPick,
}: {
  goal: Goal
  foodPreferences: FoodPreference[]
  onPick: (food: MealPrefill) => void
}) {
  const [category, setCategory] = useState<FoodCategory>('meals')
  const [query, setQuery] = useState('')
  const [dietFilter, setDietFilter] = useState<DietFilter>('all')
  const [expanded, setExpanded] = useState(false)

  useEffect(() => setExpanded(false), [category, query, dietFilter])

  const sections = getIndianFoodSections(goal)
  const allFoods = useMemo(() => getAllFoodsForGoal(goal), [goal])
  const isSearching = query.trim().length > 0

  const source = isSearching ? searchFoods(query, allFoods, 20) : sections[category]
  const filtered = useMemo(
    () => filterByDietType(filterByPreferences(source, foodPreferences), dietFilter),
    [source, foodPreferences, dietFilter],
  )
  const items = expanded ? filtered : filtered.slice(0, PREVIEW_COUNT)
  const remaining = filtered.length - items.length

  return (
    <Card>
      <CardHeader title="Suggested foods" subtitle={GOAL_SUBTITLE[goal]} />

      <div className="mb-3 flex items-center gap-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-2)] px-3 py-2.5">
        <Search size={15} className="shrink-0 text-[var(--color-text-muted)]" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search all foods..."
          autoComplete="off"
          className="w-full min-w-0 flex-1 bg-transparent text-sm text-[var(--color-text)] outline-none placeholder:text-[var(--color-text-muted)]"
        />
      </div>

      <div className="mb-3 flex flex-wrap gap-1.5">
        {DIET_FILTERS.map((f) => {
          const active = dietFilter === f.value
          return (
            <button
              key={f.value}
              onClick={() => setDietFilter(f.value)}
              className={`rounded-full border px-3 py-1 text-xs font-semibold transition ${
                active
                  ? 'border-[var(--color-good)] bg-[var(--color-good)]/10 text-[var(--color-good)]'
                  : 'border-[var(--color-border)] bg-[var(--color-surface-2)] text-[var(--color-text-secondary)] hover:text-[var(--color-text)]'
              }`}
            >
              {f.label}
            </button>
          )
        })}
      </div>

      {!isSearching && (
        <div className="mb-3 flex flex-wrap gap-1.5">
          {CATEGORY_ORDER.map((cat) => {
            const Icon = CATEGORY_ICONS[cat]
            const active = category === cat
            return (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition ${
                  active
                    ? 'border-[var(--color-brand)] bg-[var(--color-brand)]/10 text-[var(--color-brand)]'
                    : 'border-[var(--color-border)] bg-[var(--color-surface-2)] text-[var(--color-text-secondary)] hover:text-[var(--color-text)]'
                }`}
              >
                <Icon size={13} /> {CATEGORY_LABELS[cat]}
              </button>
            )
          })}
        </div>
      )}

      <div className="space-y-1.5">
        {filtered.length === 0 && (
          <p className="rounded-xl border border-dashed border-[var(--color-border)] px-3 py-3 text-xs text-[var(--color-text-muted)]">
            {isSearching ? `No matches for "${query}"` : 'No foods here match your dietary preferences.'}
          </p>
        )}
        {items.map((food) => (
          <div
            key={food.name}
            className="flex items-center justify-between rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-2)] px-3.5 py-2.5"
          >
            <div>
              <p className="text-sm font-medium">{food.name}</p>
              <p className="text-[11px] text-[var(--color-text-secondary)]">
                {food.calories} kcal · P {food.protein}g · C {food.carbs}g · F {food.fat}g
              </p>
            </div>
            <button
              onClick={() => onPick(food)}
              aria-label={`Add ${food.name}`}
              className="flex shrink-0 items-center gap-1 rounded-full bg-[var(--color-surface-3)] px-2.5 py-1 text-xs font-semibold text-[var(--color-text-secondary)] hover:text-[var(--color-text)]"
            >
              <Plus size={13} /> Add
            </button>
          </div>
        ))}
      </div>

      {remaining > 0 && (
        <button
          onClick={() => setExpanded(true)}
          className="mt-2 flex w-full items-center justify-center gap-1 rounded-xl py-2 text-xs font-semibold text-[var(--color-text-secondary)] hover:text-[var(--color-text)]"
        >
          <ChevronDown size={14} /> Show {remaining} more
        </button>
      )}
    </Card>
  )
}
