import { GoogleGenAI } from '@google/genai'

export const GEMINI_TEXT_MODEL = 'gemini-3.5-flash'
export const GEMINI_VISION_MODEL = 'gemini-3.5-flash'

export function createGeminiClient(apiKey: string): GoogleGenAI {
  return new GoogleGenAI({ apiKey })
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

  if (/api key not valid|api_key_invalid|401|permission_denied/i.test(message)) {
    return 'That Gemini API key was rejected. Check it in Settings.'
  }
  if (/resource_exhausted|quota|429/i.test(message)) {
    return 'Rate limited by the Gemini API. Try again in a moment.'
  }
  if (isTransient(err)) {
    return 'Gemini is overloaded right now. Try again in a few seconds.'
  }
  if (/fetch failed|network|enotfound/i.test(message)) {
    return 'Could not reach the Gemini API. Check your connection.'
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
