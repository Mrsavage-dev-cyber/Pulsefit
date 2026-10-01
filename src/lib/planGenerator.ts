import { Type } from '@google/genai'
import { createGeminiClient, describeGeminiError, withGeminiRetries, GEMINI_TEXT_MODEL } from './gemini'
import {
  MEAL_PLAN_SCHEMA,
  PlanGenerationError,
  TARGETS_SCHEMA,
  WORKOUT_DAY_SCHEMA,
  profileSummary,
  targetsSummary,
  toMealPlan,
  toWorkoutPlan,
  type RawPlannedMeal,
  type RawWorkoutDay,
} from './aiContext'
import type { MealPlan, Targets, UserProfile, WorkoutDay } from '../types'

export { PlanGenerationError, toWorkoutPlan }

const PLAN_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    targets: TARGETS_SCHEMA,
    workoutPlan: { type: Type.ARRAY, items: WORKOUT_DAY_SCHEMA },
    mealPlan: MEAL_PLAN_SCHEMA,
  },
  required: ['targets', 'workoutPlan', 'mealPlan'],
}

export async function generatePlan(
  apiKey: string,
  profile: UserProfile,
): Promise<{ targets: Targets; workoutPlan: WorkoutDay[]; mealPlan: MealPlan }> {
  const ai = createGeminiClient(apiKey)

  const prompt = `You are a fitness and nutrition coach generating a personalized plan for a user of the PulseFit app.

User profile:
${profileSummary(profile)}

Produce:
1. Daily nutrition targets (BMR via a standard formula, TDEE from activity level, a calorie target adjusted sensibly for the goal, protein/carb/fat macros in grams, a daily step goal, and a realistic weekly weight change target in kg).
2. A full weekly workout plan with exactly ${profile.workoutDaysPerWeek} training days, spread across the week (Monday=0 .. Sunday=6) with rest days between sessions where possible. Tailor exercise selection, volume, and rest periods to the goal and experience level. If the user reported "injury_pain", use only low-impact, joint-friendly movements. If they reported "lack_of_time", keep sessions to about 30 minutes using supersets/compound lifts. If the goal is "lose_fat", favor higher reps, shorter rest, and include a cardio finisher on most days. If the goal is "gain_muscle", favor heavier loads, longer rest, and more volume on main lifts.
3. A full day's meal plan (4-6 meals/snacks) that adds up close to the calorie and macro targets from point 1. Recommend specific dishes with realistic portions and a time of day to eat each one. Strictly respect the user's food preferences (${profile.foodPreferences.join(', ') || 'none specified'}) — never suggest a dish that violates them (e.g. no meat for vegetarian/vegan, no fish/meat for pescatarian besides fish, no dairy for dairy_free, no gluten for gluten_free). Favor familiar Indian home-cooking and everyday dishes where they fit the goal and macros. Space meals sensibly across the day (e.g. breakfast ~7-9am, lunch ~12-2pm, an afternoon snack ~4-5pm, dinner ~7-9pm).

Give your best numeric estimates even when not 100% certain — never leave a field out.`

  let text: string | undefined
  try {
    const response = await withGeminiRetries(() =>
      ai.models.generateContent({
        model: GEMINI_TEXT_MODEL,
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: PLAN_SCHEMA,
        },
      }),
    )
    text = response.text
  } catch (err) {
    throw new PlanGenerationError(describeGeminiError(err))
  }

  if (!text) {
    throw new PlanGenerationError('Gemini returned an empty plan. Try again.')
  }

  let parsed: { targets: Targets; workoutPlan: RawWorkoutDay[]; mealPlan: RawPlannedMeal[] }
  try {
    parsed = JSON.parse(text)
  } catch {
    throw new PlanGenerationError('Could not read the generated plan. Try again.')
  }

  return { targets: parsed.targets, workoutPlan: toWorkoutPlan(parsed.workoutPlan), mealPlan: toMealPlan(parsed.mealPlan) }
}

const MEAL_PLAN_ONLY_SCHEMA = {
  type: Type.OBJECT,
  properties: { mealPlan: MEAL_PLAN_SCHEMA },
  required: ['mealPlan'],
}

export async function generateMealPlan(apiKey: string, profile: UserProfile, targets: Targets): Promise<MealPlan> {
  const ai = createGeminiClient(apiKey)

  const prompt = `You are a nutrition coach building a one-day meal plan for a user of the PulseFit app.

User profile:
${profileSummary(profile)}

Daily targets to hit: ${targetsSummary(targets)}

Produce a full day's meal plan (4-6 meals/snacks) that adds up close to these targets. Recommend specific dishes with realistic portions and a time of day (24-hour "HH:MM") to eat each one. Strictly respect the user's food preferences — never suggest a dish that violates them. Favor familiar Indian home-cooking and everyday dishes where they fit the goal and macros. Space meals sensibly across the day (e.g. breakfast ~7-9am, lunch ~12-2pm, an afternoon snack ~4-5pm, dinner ~7-9pm).`

  let text: string | undefined
  try {
    const response = await withGeminiRetries(() =>
      ai.models.generateContent({
        model: GEMINI_TEXT_MODEL,
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: MEAL_PLAN_ONLY_SCHEMA,
        },
      }),
    )
    text = response.text
  } catch (err) {
    throw new PlanGenerationError(describeGeminiError(err))
  }

  if (!text) {
    throw new PlanGenerationError('Gemini returned an empty meal plan. Try again.')
  }

  try {
    const parsed = JSON.parse(text) as { mealPlan: RawPlannedMeal[] }
    return toMealPlan(parsed.mealPlan)
  } catch {
    throw new PlanGenerationError('Could not read the generated meal plan. Try again.')
  }
}

const TARGETS_ONLY_SCHEMA = {
  type: Type.OBJECT,
  properties: { targets: TARGETS_SCHEMA },
  required: ['targets'],
}

export async function generateTargets(apiKey: string, profile: UserProfile): Promise<Targets> {
  const ai = createGeminiClient(apiKey)

  const prompt = `You are a nutrition coach recalculating daily targets for a user of the PulseFit app after a profile or weight update.

User profile:
${profileSummary(profile)}

Produce updated daily nutrition targets: BMR, TDEE, a calorie target adjusted sensibly for the goal, protein/carb/fat macros in grams, a daily step goal, and a realistic weekly weight change target in kg. Give your best numeric estimates even when not 100% certain — never leave a field out.`

  let text: string | undefined
  try {
    const response = await withGeminiRetries(() =>
      ai.models.generateContent({
        model: GEMINI_TEXT_MODEL,
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: TARGETS_ONLY_SCHEMA,
        },
      }),
    )
    text = response.text
  } catch (err) {
    throw new PlanGenerationError(describeGeminiError(err))
  }

  if (!text) {
    throw new PlanGenerationError('Gemini returned empty targets. Try again.')
  }

  try {
    const parsed = JSON.parse(text) as { targets: Targets }
    return parsed.targets
  } catch {
    throw new PlanGenerationError('Could not read the generated targets. Try again.')
  }
}
