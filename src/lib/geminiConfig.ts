const KEY = 'pulsefit_gemini_api_key'

// Dev convenience: falls back to VITE_GEMINI_API_KEY from .env.local if nothing is saved yet.
// Dev-only so the key is never baked into a public production bundle.
const ENV_FALLBACK: string | undefined = import.meta.env.DEV ? import.meta.env.VITE_GEMINI_API_KEY : undefined

export function getApiKey(): string | null {
  try {
    return localStorage.getItem(KEY) || ENV_FALLBACK || null
  } catch {
    return ENV_FALLBACK || null
  }
}

export function setApiKey(key: string): void {
  try {
    localStorage.setItem(KEY, key)
  } catch {
    // ignore quota / privacy-mode errors
  }
}

export function clearApiKey(): void {
  try {
    localStorage.removeItem(KEY)
  } catch {
    // ignore
  }
}
