import { Type } from '@google/genai'
import { createGeminiClient, describeGeminiError, withGeminiRetries, GEMINI_TEXT_MODEL } from './gemini'
import {
  PlanGenerationError,
  TARGETS_SCHEMA,
  WORKOUT_DAY_SCHEMA,
  profileSummary,
  targetsSummary,
  toWorkoutPlan,
  workoutPlanSummary,
  type RawWorkoutDay,
} from './aiContext'
import type { AppState, ChatMessage, ChatProposal } from '../types'

export { PlanGenerationError }

const RESPONSE_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    reply: { type: Type.STRING, description: 'A warm, direct, conversational reply to the user. 1-4 sentences unless they asked for detail.' },
    proposeChange: {
      type: Type.BOOLEAN,
      description: 'True only if the conversation has surfaced a specific, real problem that warrants a concrete change to targets or the workout plan. False for small talk, a single vague comment, or questions that do not need a plan change.',
    },
    targets: TARGETS_SCHEMA,
    workoutDaysPerWeek: { type: Type.NUMBER },
    workoutPlan: { type: Type.ARRAY, items: WORKOUT_DAY_SCHEMA },
    changes: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: 'Short plain-language bullets describing what would change and why. Empty when proposeChange is false.',
    },
  },
  required: ['reply', 'proposeChange', 'targets', 'workoutDaysPerWeek', 'workoutPlan', 'changes'],
}

interface RawCoachResponse {
  reply: string
  proposeChange: boolean
  targets: ChatProposal['targets']
  workoutDaysPerWeek: number
  workoutPlan: RawWorkoutDay[]
  changes: string[]
}

export interface CoachChatResult {
  reply: string
  proposal: ChatProposal | null
}

export async function sendCoachMessage(state: AppState,
  history: ChatMessage[],
  userMessage: string,
): Promise<CoachChatResult> {
  if (!state.profile || !state.targets) {
    throw new PlanGenerationError('Complete onboarding first.')
  }

  const ai = createGeminiClient()

  const transcript = history.map((m) => `${m.role === 'user' ? 'User' : 'Coach'}: ${m.content}`).join('\n')

  const prompt = `You are an empathetic, knowledgeable fitness and nutrition coach chatting one-on-one with a user inside the PulseFit app's check-in page. Be warm, direct, and specific to their situation — never generic filler. Ask a clarifying question if you need more detail before proposing a change.

User profile:
${profileSummary(state.profile)}

Current daily targets:
${targetsSummary(state.targets)}

Current weekly workout plan:
${workoutPlanSummary(state.workoutPlan)}

Conversation so far:
${transcript || '(nothing yet)'}

User: ${userMessage}

Respond with a conversational reply. Only propose a concrete change to targets or the workout plan (proposeChange: true) if the conversation has surfaced a specific, real problem that warrants one (e.g. persistent hunger, a plateau, an injury, lack of time, low energy, a stated preference change). Do not propose a change for small talk, a single vague comment, or a question that doesn't need one. When you do propose a change, return the FULL updated targets and FULL updated workout plan (not a diff) and short plain-language "changes" bullets describing what and why. When you don't propose a change, echo back the CURRENT targets and workout plan unchanged and leave "changes" empty.`

  let text: string | undefined
  try {
    const response = await withGeminiRetries(() =>
      ai.models.generateContent({
        model: GEMINI_TEXT_MODEL,
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: RESPONSE_SCHEMA,
        },
      }),
    )
    text = response.text
  } catch (err) {
    throw new PlanGenerationError(describeGeminiError(err))
  }

  if (!text) {
    throw new PlanGenerationError('Gemini returned an empty reply. Try again.')
  }

  let parsed: RawCoachResponse
  try {
    parsed = JSON.parse(text)
  } catch {
    throw new PlanGenerationError('Could not read the coach\'s reply. Try again.')
  }

  if (!parsed.proposeChange || parsed.changes.length === 0) {
    return { reply: parsed.reply, proposal: null }
  }

  return {
    reply: parsed.reply,
    proposal: {
      targets: parsed.targets,
      workoutDaysPerWeek: parsed.workoutDaysPerWeek,
      workoutPlan: toWorkoutPlan(parsed.workoutPlan),
      changes: parsed.changes,
      applied: false,
    },
  }
}
