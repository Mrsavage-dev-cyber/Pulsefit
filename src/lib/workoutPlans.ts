import type { Challenge, Exercise, Experience, Goal, WorkoutDay } from '../types'

interface Template {
  title: string
  focus: string
  exercises: Exercise[]
}

const STRENGTH_TEMPLATES: Template[] = [
  {
    title: 'Upper Body Push',
    focus: 'Chest, shoulders, triceps',
    exercises: [
      { name: 'Barbell bench press', sets: 4, reps: '6-8', restSec: 90 },
      { name: 'Overhead press', sets: 3, reps: '8-10', restSec: 90 },
      { name: 'Incline dumbbell press', sets: 3, reps: '10-12', restSec: 75 },
      { name: 'Lateral raise', sets: 3, reps: '12-15', restSec: 60 },
      { name: 'Triceps pushdown', sets: 3, reps: '12-15', restSec: 60 },
    ],
  },
  {
    title: 'Lower Body Strength',
    focus: 'Quads, hamstrings, glutes',
    exercises: [
      { name: 'Back squat', sets: 4, reps: '5-8', restSec: 120 },
      { name: 'Romanian deadlift', sets: 3, reps: '8-10', restSec: 90 },
      { name: 'Walking lunges', sets: 3, reps: '10-12/leg', restSec: 75 },
      { name: 'Leg press', sets: 3, reps: '10-12', restSec: 75 },
      { name: 'Standing calf raise', sets: 3, reps: '15-20', restSec: 45 },
    ],
  },
  {
    title: 'Upper Body Pull',
    focus: 'Back, biceps, rear delts',
    exercises: [
      { name: 'Deadlift', sets: 3, reps: '5-6', restSec: 120 },
      { name: 'Pull-ups', sets: 4, reps: '6-10', restSec: 90 },
      { name: 'Barbell row', sets: 3, reps: '8-10', restSec: 90 },
      { name: 'Face pull', sets: 3, reps: '12-15', restSec: 60 },
      { name: 'Barbell curl', sets: 3, reps: '10-12', restSec: 60 },
    ],
  },
  {
    title: 'Full Body Strength',
    focus: 'Total body compound movements',
    exercises: [
      { name: 'Goblet squat', sets: 3, reps: '10-12', restSec: 75 },
      { name: 'Push-ups', sets: 3, reps: '10-15', restSec: 60 },
      { name: 'Dumbbell row', sets: 3, reps: '10-12', restSec: 75 },
      { name: 'Hip thrust', sets: 3, reps: '10-12', restSec: 75 },
      { name: 'Plank', sets: 3, reps: '45s', restSec: 45 },
    ],
  },
  {
    title: 'Core & Conditioning',
    focus: 'Core stability and light cardio',
    exercises: [
      { name: 'Hanging knee raise', sets: 3, reps: '12-15', restSec: 45 },
      { name: 'Cable woodchopper', sets: 3, reps: '12/side', restSec: 45 },
      { name: 'Russian twist', sets: 3, reps: '20', restSec: 45 },
      { name: 'Incline treadmill walk', sets: 1, reps: '15 min', restSec: 0 },
    ],
  },
]

const CARDIO_LIGHT_TEMPLATE: Template = {
  title: 'Active Recovery',
  focus: 'Mobility and light cardio',
  exercises: [
    { name: 'Brisk walk or cycle', sets: 1, reps: '20 min', restSec: 0 },
    { name: 'Hip flexor stretch', sets: 2, reps: '30s/side', restSec: 20 },
    { name: 'Foam rolling', sets: 1, reps: '10 min', restSec: 0 },
  ],
}

const LOW_IMPACT_TEMPLATE: Template = {
  title: 'Low-Impact Full Body',
  focus: 'Joint-friendly strength work',
  exercises: [
    { name: 'Seated leg press', sets: 3, reps: '10-12', restSec: 75 },
    { name: 'Chest press machine', sets: 3, reps: '10-12', restSec: 75 },
    { name: 'Seated cable row', sets: 3, reps: '10-12', restSec: 75 },
    { name: 'Glute bridge', sets: 3, reps: '12-15', restSec: 60 },
    { name: 'Stationary bike', sets: 1, reps: '10 min', restSec: 0 },
  ],
}

const CUT_REP_SHIFT: Record<string, string> = {
  '5-8': '10-12',
  '5-6': '8-10',
  '6-8': '10-12',
  '6-10': '10-15',
  '8-10': '12-15',
  '10-12': '15-20',
  '10-12/leg': '15-20/leg',
  '10-15': '15-20',
  '12-15': '20-25',
  '12/side': '15-20/side',
  '12-15/side': '18-22/side',
}

export interface PlanStyle {
  label: string
  description: string
}

export function getPlanStyle(goal: Goal): PlanStyle {
  if (goal === 'gain_muscle') {
    return { label: 'Hypertrophy — bulking phase', description: 'Heavier loads, longer rest, extra sets on the main lift for size and strength.' }
  }
  if (goal === 'lose_fat') {
    return { label: 'Fat-loss circuit', description: 'Higher reps, shorter rest, and a cardio finisher on every session to maximize burn.' }
  }
  return { label: 'Balanced maintenance', description: 'Standard volume and rest to hold onto strength and conditioning.' }
}

function shiftRepsForCut(reps: string): string {
  if (reps.includes('min') || reps.endsWith('s')) return reps
  return CUT_REP_SHIFT[reps] ?? reps
}

function shiftRestForGoal(restSec: number, goal: Goal): number {
  if (restSec <= 0) return restSec
  if (goal === 'gain_muscle') return Math.round((restSec + 15) / 5) * 5
  if (goal === 'lose_fat') return Math.max(20, Math.round((restSec * 0.6) / 5) * 5)
  return restSec
}

function applyGoalStyle(exercises: Exercise[], goal: Goal, isMainLift: boolean): Exercise[] {
  return exercises.map((ex, i) => {
    const isCardioEntry = ex.reps.includes('min')
    let { sets, reps, restSec } = ex

    if (goal === 'lose_fat' && !isCardioEntry) {
      reps = shiftRepsForCut(reps)
    }
    if (goal === 'gain_muscle' && isMainLift && i === 0 && !isCardioEntry) {
      sets += 1
    }
    if (restSec != null) {
      restSec = shiftRestForGoal(restSec, goal)
    }

    return { ...ex, sets, reps, restSec }
  })
}

const CUT_FINISHERS = [
  { name: 'Finisher: incline treadmill walk', sets: 1, reps: '10 min', restSec: 0 },
  { name: 'Finisher: kettlebell swings', sets: 1, reps: '3 min AMRAP', restSec: 0 },
  { name: 'Finisher: rowing machine sprint', sets: 1, reps: '8 min', restSec: 0 },
]

function scaleDuration(exerciseCount: number, experience: Experience): number {
  const perExercise = experience === 'beginner' ? 7 : experience === 'intermediate' ? 8 : 9
  return Math.round(exerciseCount * perExercise + 10)
}

export function generateWorkoutPlan(
  goal: Goal,
  experience: Experience,
  daysPerWeek: number,
  challenges: Challenge[],
): WorkoutDay[] {
  const shortOnTime = challenges.includes('lack_of_time')
  const hasInjury = challenges.includes('injury_pain')
  const days = Math.min(Math.max(daysPerWeek, 2), 6)

  const pool: Template[] = hasInjury
    ? [LOW_IMPACT_TEMPLATE, CARDIO_LIGHT_TEMPLATE, LOW_IMPACT_TEMPLATE, CARDIO_LIGHT_TEMPLATE]
    : STRENGTH_TEMPLATES
  const usesCompoundLifts = !hasInjury

  const plan: WorkoutDay[] = []
  const dayOfWeekSlots = spreadAcrossWeek(days)

  for (let i = 0; i < days; i++) {
    const template = pool[i % pool.length]
    let exercises = applyGoalStyle(template.exercises, goal, usesCompoundLifts)

    if (shortOnTime) {
      exercises = exercises.slice(0, Math.max(3, Math.ceil(exercises.length * 0.6)))
    }

    if (goal === 'lose_fat' && !hasInjury && template.title !== 'Core & Conditioning') {
      const finisher = CUT_FINISHERS[i % CUT_FINISHERS.length]
      exercises = [...exercises, shortOnTime ? { ...finisher, reps: '6 min' } : finisher]
    }

    const duration = shortOnTime ? Math.min(30, scaleDuration(exercises.length, experience)) : scaleDuration(exercises.length, experience)

    plan.push({
      id: `w-${i}`,
      dayOfWeek: dayOfWeekSlots[i],
      title: template.title,
      focus: template.focus,
      durationMin: duration,
      exercises,
      completed: false,
    })
  }

  return plan.sort((a, b) => a.dayOfWeek - b.dayOfWeek)
}

function spreadAcrossWeek(days: number): number[] {
  // Monday = 0 .. Sunday = 6, spread training days evenly with rest days between
  const patterns: Record<number, number[]> = {
    2: [0, 3],
    3: [0, 2, 4],
    4: [0, 1, 3, 4],
    5: [0, 1, 2, 4, 5],
    6: [0, 1, 2, 3, 4, 5],
  }
  return patterns[days] ?? [0, 2, 4]
}
