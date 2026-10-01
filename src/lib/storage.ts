// State is stored per signed-in user so accounts sharing a browser never see each other's data.
const PREFIX = 'pulsefit_state_v2:'
const LEGACY_KEY = 'pulsefit_state_v1'

function keyFor(userId: string): string {
  return PREFIX + userId
}

export function loadState<T>(userId: string): T | null {
  try {
    // The old shared slot can't be attributed to any one account, so drop it.
    localStorage.removeItem(LEGACY_KEY)
    const raw = localStorage.getItem(keyFor(userId))
    if (!raw) return null
    return JSON.parse(raw) as T
  } catch {
    return null
  }
}

export function saveState<T>(userId: string, state: T): void {
  try {
    localStorage.setItem(keyFor(userId), JSON.stringify(state))
  } catch {
    // ignore quota / privacy-mode errors
  }
}

export function clearAllStates(): void {
  try {
    Object.keys(localStorage)
      .filter((k) => k.startsWith(PREFIX) || k === LEGACY_KEY)
      .forEach((k) => localStorage.removeItem(k))
  } catch {
    // ignore
  }
}
