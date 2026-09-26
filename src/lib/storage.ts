const KEY = 'pulsefit_state_v1'

export function loadState<T>(): T | null {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return null
    return JSON.parse(raw) as T
  } catch {
    return null
  }
}

export function saveState<T>(state: T): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(state))
  } catch {
    // ignore quota / privacy-mode errors
  }
}

export function clearState(): void {
  try {
    localStorage.removeItem(KEY)
  } catch {
    // ignore
  }
}
