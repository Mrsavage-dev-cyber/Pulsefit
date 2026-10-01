export function bmi(weightKg: number, heightCm: number): number {
  const m = heightCm / 100
  return weightKg / (m * m)
}

export function rollingAverage(values: number[], windowSize: number): (number | null)[] {
  const result: (number | null)[] = []
  for (let i = 0; i < values.length; i++) {
    if (i < windowSize - 1) {
      result.push(null)
      continue
    }
    const window = values.slice(i - windowSize + 1, i + 1)
    const avg = window.reduce((a, b) => a + b, 0) / window.length
    result.push(Math.round(avg * 10) / 10)
  }
  return result
}

export function formatDate(d: Date): string {
  return d.toISOString().slice(0, 10)
}

export function todayISO(): string {
  return formatDate(new Date())
}

export function daysAgoISO(days: number): string {
  const d = new Date()
  d.setDate(d.getDate() - days)
  return formatDate(d)
}

export function dayLabel(iso: string): string {
  const d = new Date(iso + 'T00:00:00')
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
}

export function weekdayShort(dayOfWeek: number): string {
  return ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][dayOfWeek]
}

export function isoWeekdayIndex(iso: string): number {
  const d = new Date(iso + 'T00:00:00')
  const jsDay = d.getDay() // 0 = Sunday
  return (jsDay + 6) % 7 // 0 = Monday
}

export function formatPlanTime(time: string): string {
  const [hStr, mStr] = time.split(':')
  const h = Number(hStr)
  const m = Number(mStr)
  if (Number.isNaN(h) || Number.isNaN(m)) return time
  const period = h >= 12 ? 'PM' : 'AM'
  const h12 = h % 12 === 0 ? 12 : h % 12
  return `${h12}:${String(m).padStart(2, '0')} ${period}`
}
