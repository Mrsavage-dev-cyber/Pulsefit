import { useState } from 'react'
import { Camera, CheckCircle2, Trophy } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { Card, CardHeader } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { ProgressBar } from '../components/ui/ProgressBar'
import { MealList } from '../components/nutrition/MealList'
import { MealPlanCard } from '../components/nutrition/MealPlanCard'
import { IndianFoodSuggestions } from '../components/nutrition/IndianFoodSuggestions'
import { AddMealModal, type MealPrefill } from '../components/modals/AddMealModal'
import { PhotoScanModal } from '../components/modals/PhotoScanModal'
import { getTodayMeals, sumMacros } from '../lib/selectors'
import { todayISO } from '../lib/calculations'
import { NUTRITION_GOAL_POINTS } from '../lib/points'
import type { IndianFood } from '../lib/indianFoods'
import type { DetectedFood } from '../lib/foodPhotoAnalysis'
import type { MealType } from '../types'

export function Nutrition() {
  const { state, dispatch } = useApp()
  const [modalOpen, setModalOpen] = useState(false)
  const [defaultType, setDefaultType] = useState<MealType>('breakfast')
  const [prefill, setPrefill] = useState<MealPrefill | null>(null)
  const [initialName, setInitialName] = useState('')
  const [photoModalOpen, setPhotoModalOpen] = useState(false)

  const { targets, profile } = state
  if (!targets || !profile) return null

  const meals = getTodayMeals(state)
  const macros = sumMacros(meals)
  const remaining = targets.calorieTarget - macros.calories
  const nutritionPointsEarned = state.points.awardedNutritionDates.includes(todayISO())

  function openAdd(type: MealType) {
    setDefaultType(type)
    setPrefill(null)
    setInitialName('')
    setModalOpen(true)
  }

  function pickSuggestion(food: MealPrefill) {
    setDefaultType('lunch')
    setPrefill(food)
    setInitialName('')
    setModalOpen(true)
  }

  function quickAdd(type: MealType, food: IndianFood) {
    dispatch({
      type: 'ADD_MEAL',
      meal: {
        id: `meal-${Date.now()}`,
        date: todayISO(),
        mealType: type,
        name: food.name,
        calories: food.calories,
        protein: food.protein,
        carbs: food.carbs,
        fat: food.fat,
      },
    })
  }

  function customAdd(type: MealType, name: string) {
    setDefaultType(type)
    setPrefill(null)
    setInitialName(name)
    setModalOpen(true)
  }

  function addDetectedFood(type: MealType, food: DetectedFood) {
    dispatch({
      type: 'ADD_MEAL',
      meal: {
        id: `meal-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        date: todayISO(),
        mealType: type,
        name: food.name,
        calories: Math.round(food.calories),
        protein: Math.round(food.protein),
        carbs: Math.round(food.carbs),
        fat: Math.round(food.fat),
        note: food.estimatedQuantity,
      },
    })
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-extrabold tracking-tight">Nutrition</h1>
        <Button size="sm" variant="secondary" onClick={() => setPhotoModalOpen(true)}>
          <Camera size={15} /> Scan food
        </Button>
      </div>

      <Card>
        <CardHeader title="Today's totals" subtitle={`${remaining >= 0 ? remaining : 0} kcal remaining`} />
        {nutritionPointsEarned ? (
          <p className="mb-3 flex items-center gap-1.5 text-xs font-semibold text-[var(--color-good)]">
            <CheckCircle2 size={13} /> +{NUTRITION_GOAL_POINTS} pts earned today
          </p>
        ) : (
          <p className="mb-3 flex items-center gap-1.5 text-xs text-[var(--color-text-secondary)]">
            <Trophy size={13} /> Hit your calorie &amp; protein goals to earn +{NUTRITION_GOAL_POINTS} pts
          </p>
        )}
        <p className="tabular mb-3 text-3xl font-extrabold">
          {macros.calories.toLocaleString()} <span className="text-base font-medium text-[var(--color-text-secondary)]">/ {targets.calorieTarget.toLocaleString()} kcal</span>
        </p>
        <div className="space-y-2.5">
          <ProgressBar value={macros.protein} max={targets.proteinG} color="var(--color-brand)" label="Protein" valueLabel={`${macros.protein}/${targets.proteinG}g`} />
          <ProgressBar value={macros.carbs} max={targets.carbG} color="var(--color-orange)" label="Carbs" valueLabel={`${macros.carbs}/${targets.carbG}g`} />
          <ProgressBar value={macros.fat} max={targets.fatG} color="var(--color-violet)" label="Fat" valueLabel={`${macros.fat}/${targets.fatG}g`} />
        </div>
      </Card>

      <MealPlanCard />

      <Card>
        <CardHeader title="Meals" />
        <MealList
          meals={meals}
          goal={profile.goal}
          foodPreferences={profile.foodPreferences}
          onAdd={openAdd}
          onQuickAdd={quickAdd}
          onCustom={customAdd}
          onDelete={(id) => dispatch({ type: 'DELETE_MEAL', id })}
        />
      </Card>

      <IndianFoodSuggestions
        goal={profile.goal}
        foodPreferences={profile.foodPreferences}
        onPick={pickSuggestion}
        onScanPhoto={() => setPhotoModalOpen(true)}
      />

      <AddMealModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        defaultType={defaultType}
        prefill={prefill}
        initialName={initialName}
      />

      <PhotoScanModal open={photoModalOpen} onClose={() => setPhotoModalOpen(false)} onAdd={addDetectedFood} />
    </div>
  )
}
