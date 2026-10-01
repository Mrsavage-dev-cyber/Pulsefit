import { FunctionsHttpError } from '@supabase/supabase-js'
import { supabase } from './supabaseClient'

export const GEMINI_TEXT_MODEL = 'gemini-3.5-flash'
export const GEMINI_VISION_MODEL = 'gemini-3.5-flash'

interface GenerateContentParams {
  model: string
  contents: unknown
  config?: Record<string, unknown>
}

// Calls go through the `gemini` Supabase Edge Function, which holds the shared API key
// server-side. Mirrors the subset of the @google/genai client the app uses.
export function createGeminiClient() {
  return {
    models: {
      async generateContent(params: GenerateContentParams): Promise<{ text: string | undefined }> {
        const { data, error } = await supabase.functions.invoke<{ text: string }>('gemini', { body: params })
        if (error) {
          if (error instanceof FunctionsHttpError) {
            const body = await error.context.json().catch(() => null)
            throw new Error(body?.error ?? error.message)
          }
          throw error
        }
        return { text: data?.text }
      },
    },
  }
}

function extractMessage(err: unknown): string {
  const raw = err instanceof Error ? err.message : String(err)
  try {
    const parsed = JSON.parse(raw)
    if (typeof parsed?.error?.message === 'string') return parsed.error.message
  } catch {
    // raw wasn't JSON — use it as-is
  }
  return raw
}

function isTransient(err: unknown): boolean {
  return /unavailable|overloaded|high demand|503/i.test(extractMessage(err))
}

export function describeGeminiError(err: unknown): string {
  const message = extractMessage(err)

  if (/sign in to use/i.test(message)) {
    return 'Your session expired. Sign out and back in, then try again.'
  }
  if (/api key not valid|api_key_invalid|permission_denied|not configured/i.test(message)) {
    return 'PulseFit AI is temporarily unavailable. Try again later.'
  }
  if (/resource_exhausted|quota|429/i.test(message)) {
    return 'Rate limited by the Gemini API. Try again in a moment.'
  }
  if (isTransient(err)) {
    return 'Gemini is overloaded right now. Try again in a few seconds.'
  }
  if (/fetch failed|network|enotfound/i.test(message)) {
    return 'Could not reach PulseFit AI. Check your connection.'
  }
  return `Gemini error: ${message}`
}

// gemini-3.5-flash intermittently returns 503 "high demand" under load — retry
// a few times with backoff before surfacing it as a real failure.
export async function withGeminiRetries<T>(fn: () => Promise<T>, attempts = 3, baseDelayMs = 1200): Promise<T> {
  let lastErr: unknown
  for (let i = 0; i < attempts; i++) {
    try {
      return await fn()
    } catch (err) {
      lastErr = err
      if (!isTransient(err) || i === attempts - 1) throw err
      await new Promise((resolve) => setTimeout(resolve, baseDelayMs * (i + 1)))
    }
  }
  throw lastErr
}
