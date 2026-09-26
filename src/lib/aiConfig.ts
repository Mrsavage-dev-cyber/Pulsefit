const KEY = 'pulsefit_anthropic_api_key'

export function getApiKey(): string | null {
  try {
    return localStorage.getItem(KEY)
  } catch {
    return null
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
