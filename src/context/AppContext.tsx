import { createContext, useContext, useEffect, useMemo, useReducer, type ReactNode } from 'react'
import { formatDate } from '../lib/calculations'
import { awardNutritionPoints, awardWorkoutPoints, emptyPoints, nutritionGoalMet, revokeWorkoutPoints } from '../lib/points'
import { sumMacros } from '../lib/selectors'
import { loadState, saveState } from '../lib/storage'
import { useAuth } from './AuthContext'
import type { AppState, ChatMessage, Meal, MealPlan, Targets, UserProfile, WeightEntry, WorkoutDay } from '../types'

type Action =
  | { type: 'ONBOARD'; profile: UserProfile; targets: Targets; workoutPlan: WorkoutDay[]; mealPlan: MealPlan | null }
  | { type: 'ADD_WEIGHT_ENTRY'; entry: WeightEntry }
  | { type: 'ADD_MEAL'; meal: Meal }
  | { type: 'DELETE_MEAL'; id: string }
  | { type: 'LOG_WATER'; ml: number }
  | { type: 'ADD_STEPS'; steps: number }
  | { type: 'TOGGLE_WORKOUT'; id: string }
  | { type: 'ADD_COACH_MESSAGE'; message: ChatMessage }
  | { type: 'APPLY_COACH_PROPOSAL'; messageId: string }
  | { type: 'RECALC_TARGETS'; targets: Targets }
  | { type: 'SET_MEAL_PLAN'; mealPlan: MealPlan }
  | { type: 'RESET' }

const emptyState: AppState = {
  profile: null,
  targets: null,
  weightEntries: [],
  meals: [],
  workoutPlan: [],
  dailyStats: [],
  coachMessages: [],
  currentWeekStart: '',
  points: emptyPoints(),
  mealPlan: null,
}

function todayISO(): string {
  return new Date().toISOString().slice(0, 10)
}

function mondayOf(dateISO: string): string {
  const d = new Date(dateISO + 'T00:00:00')
  const dayIdx = (d.getDay() + 6) % 7 // 0 = Monday
  d.setDate(d.getDate() - dayIdx)
  return formatDate(d)
}

function ensureToday(state: AppState): AppState {
  const today = todayISO()
  const last = state.dailyStats[state.dailyStats.length - 1]
  if (last?.date === today) return state
  return {
    ...state,
    dailyStats: [...state.dailyStats, { date: today, steps: 0, waterMl: 0, sleepHours: 0 }],
  }
}

function ensureWeek(state: AppState): AppState {
  if (!state.profile) return state
  const thisMonday = mondayOf(todayISO())
  if (state.currentWeekStart === thisMonday) return state
  return {
    ...state,
    currentWeekStart: thisMonday,
    workoutPlan: state.workoutPlan.map((w) => ({ ...w, completed: false })),
  }
}

function normalize(state: AppState): AppState {
  return ensureWeek(ensureToday(state))
}

function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'ONBOARD': {
      const { targets } = action
      const startDate = formatDate(new Date(action.profile.createdAt))
      return {
        profile: action.profile,
        targets,
        weightEntries: [{ id: `w-${startDate}`, date: startDate, weightKg: action.profile.currentWeightKg }],
        meals: [],
        workoutPlan: action.workoutPlan,
        dailyStats: [{ date: todayISO(), steps: 0, waterMl: 0, sleepHours: 0 }],
        coachMessages: [],
        currentWeekStart: mondayOf(todayISO()),
        points: emptyPoints(),
        mealPlan: action.mealPlan,
      }
    }
    case 'ADD_WEIGHT_ENTRY': {
      const withoutSameDay = state.weightEntries.filter((w) => w.date !== action.entry.date)
      const weightEntries = [...withoutSameDay, action.entry].sort((a, b) => a.date.localeCompare(b.date))
      const latest = weightEntries[weightEntries.length - 1]
      const profile = state.profile ? { ...state.profile, currentWeightKg: latest.weightKg } : state.profile
      return { ...state, weightEntries, profile }
    }
    case 'ADD_MEAL': {
      return { ...state, meals: [...state.meals, action.meal] }
    }
    case 'DELETE_MEAL': {
      return { ...state, meals: state.meals.filter((m) => m.id !== action.id) }
    }
    case 'LOG_WATER': {
      const s = ensureToday(state)
      const stats = [...s.dailyStats]
      const idx = stats.length - 1
      stats[idx] = { ...stats[idx], waterMl: stats[idx].waterMl + action.ml }
      return { ...s, dailyStats: stats }
    }
    case 'ADD_STEPS': {
      const s = ensureToday(state)
      const stats = [...s.dailyStats]
      const idx = stats.length - 1
      stats[idx] = { ...stats[idx], steps: stats[idx].steps + action.steps }
      return { ...s, dailyStats: stats }
    }
    case 'TOGGLE_WORKOUT': {
      const workout = state.workoutPlan.find((w) => w.id === action.id)
      if (!workout) return state
      const completed = !workout.completed
      return {
        ...state,
        workoutPlan: state.workoutPlan.map((w) => (w.id === action.id ? { ...w, completed } : w)),
        points: completed ? awardWorkoutPoints(state.points, action.id) : revokeWorkoutPoints(state.points, action.id),
      }
    }
    case 'ADD_COACH_MESSAGE': {
      return { ...state, coachMessages: [...state.coachMessages, action.message] }
    }
    case 'APPLY_COACH_PROPOSAL': {
      const message = state.coachMessages.find((m) => m.id === action.messageId)
      if (!message?.proposal || message.proposal.applied || !state.profile) return state
      const { proposal } = message
      return {
        ...state,
        targets: proposal.targets,
        workoutPlan: proposal.workoutPlan,
        profile: { ...state.profile, workoutDaysPerWeek: proposal.workoutDaysPerWeek },
        coachMessages: state.coachMessages.map((m) =>
          m.id === action.messageId ? { ...m, proposal: { ...proposal, applied: true } } : m,
        ),
      }
    }
    case 'RECALC_TARGETS': {
      if (!state.profile) return state
      return { ...state, targets: action.targets }
    }
    case 'SET_MEAL_PLAN': {
      return { ...state, mealPlan: action.mealPlan }
    }
    case 'RESET':
      return emptyState
    default:
      return state
  }
}

function applyNutritionPoints(state: AppState): AppState {
  if (!state.targets) return state
  const today = todayISO()
  const todaysMeals = state.meals.filter((m) => m.date === today)
  if (todaysMeals.length === 0) return state
  const macros = sumMacros(todaysMeals)
  if (!nutritionGoalMet(macros, state.targets)) return state
  const points = awardNutritionPoints(state.points, today)
  if (points === state.points) return state
  return { ...state, points }
}

function reducerWithNormalize(state: AppState, action: Action): AppState {
  return applyNutritionPoints(reducer(normalize(state), action))
}

interface AppContextValue {
  state: AppState
  dispatch: React.Dispatch<Action>
}

const AppContext = createContext<AppContextValue | null>(null)

function isValidState(loaded: unknown): loaded is AppState {
  if (!loaded || typeof loaded !== 'object') return false
  const s = loaded as Partial<AppState>
  if (!Array.isArray(s.weightEntries) || !Array.isArray(s.meals) || !Array.isArray(s.workoutPlan)) return false
  if (!Array.isArray(s.dailyStats)) return false
  if (s.profile && !s.targets) return false
  return true
}

export function AppProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth()
  // Remount per account so switching users loads that user's own state, never the previous one's.
  return (
    <UserAppProvider key={user?.id ?? 'signed-out'} userId={user?.id ?? null}>
      {children}
    </UserAppProvider>
  )
}

function UserAppProvider({ userId, children }: { userId: string | null; children: ReactNode }) {
  const [state, dispatch] = useReducer(reducerWithNormalize, emptyState, () => {
    if (!userId) return emptyState
    const loaded = loadState<AppState>(userId)
    if (!isValidState(loaded)) return emptyState
    return normalize({
      ...loaded,
      currentWeekStart: loaded.currentWeekStart ?? '',
      coachMessages: Array.isArray(loaded.coachMessages) ? loaded.coachMessages : [],
      points: loaded.points && typeof loaded.points.total === 'number' ? loaded.points : emptyPoints(),
      mealPlan: loaded.mealPlan ?? null,
    })
  })

  useEffect(() => {
    if (userId) saveState(userId, state)
  }, [userId, state])

  const value = useMemo(() => ({ state, dispatch }), [state])

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp(): AppContextValue {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}
