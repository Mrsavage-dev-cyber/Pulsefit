import { createContext, useContext, useEffect, useMemo, useReducer, type ReactNode } from 'react'
import { computeTargets, formatDate } from '../lib/calculations'
import { seedDailyStats, seedTodayMeals } from '../lib/seedData'
import { loadState, saveState } from '../lib/storage'
import { generateWorkoutPlan } from '../lib/workoutPlans'
import type { AppState, Challenge, CheckIn, Meal, Targets, UserProfile, WeightEntry, WorkoutDay } from '../types'

type Action =
  | { type: 'ONBOARD'; profile: UserProfile }
  | { type: 'ADD_WEIGHT_ENTRY'; entry: WeightEntry }
  | { type: 'ADD_MEAL'; meal: Meal }
  | { type: 'DELETE_MEAL'; id: string }
  | { type: 'LOG_WATER'; ml: number }
  | { type: 'ADD_STEPS'; steps: number }
  | { type: 'TOGGLE_WORKOUT'; id: string }
  | { type: 'ADD_CHECKIN'; checkIn: CheckIn }
  | {
      type: 'APPLY_ADAPTATION'
      targets: Targets
      workoutPlan: WorkoutDay[]
      challenges: Challenge[]
      workoutDaysPerWeek: number
    }
  | { type: 'RECALC_TARGETS' }
  | { type: 'RESET' }

const emptyState: AppState = {
  profile: null,
  targets: null,
  weightEntries: [],
  meals: [],
  workoutPlan: [],
  dailyStats: [],
  checkIns: [],
  currentWeekStart: '',
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
      const targets = computeTargets(action.profile)
      const startDate = formatDate(new Date(action.profile.createdAt))
      return {
        profile: action.profile,
        targets,
        weightEntries: [{ id: `w-${startDate}`, date: startDate, weightKg: action.profile.currentWeightKg }],
        meals: seedTodayMeals(targets),
        workoutPlan: generateWorkoutPlan(
          action.profile.goal,
          action.profile.experience,
          action.profile.workoutDaysPerWeek,
          action.profile.challenges,
        ),
        dailyStats: seedDailyStats(targets),
        checkIns: [],
        currentWeekStart: mondayOf(todayISO()),
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
      return {
        ...state,
        workoutPlan: state.workoutPlan.map((w) => (w.id === action.id ? { ...w, completed: !w.completed } : w)),
      }
    }
    case 'ADD_CHECKIN': {
      return { ...state, checkIns: [...state.checkIns, action.checkIn] }
    }
    case 'APPLY_ADAPTATION': {
      if (!state.profile) return state
      return {
        ...state,
        targets: action.targets,
        workoutPlan: action.workoutPlan,
        profile: {
          ...state.profile,
          challenges: action.challenges,
          workoutDaysPerWeek: action.workoutDaysPerWeek,
        },
      }
    }
    case 'RECALC_TARGETS': {
      if (!state.profile) return state
      return { ...state, targets: computeTargets(state.profile) }
    }
    case 'RESET':
      return emptyState
    default:
      return state
  }
}

function reducerWithNormalize(state: AppState, action: Action): AppState {
  return reducer(normalize(state), action)
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
  if (!Array.isArray(s.dailyStats) || !Array.isArray(s.checkIns)) return false
  if (s.profile && !s.targets) return false
  return true
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducerWithNormalize, emptyState, () => {
    const loaded = loadState<AppState>()
    if (!isValidState(loaded)) return emptyState
    return normalize({ ...loaded, currentWeekStart: loaded.currentWeekStart ?? '' })
  })

  useEffect(() => {
    saveState(state)
  }, [state])

  const value = useMemo(() => ({ state, dispatch }), [state])

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp(): AppContextValue {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}
