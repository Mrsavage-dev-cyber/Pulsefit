import { useEffect, useState } from 'react'
import { Modal } from '../ui/Modal'
import { Button } from '../ui/Button'
import { FormField, TextInput } from '../ui/FormField'
import { useApp } from '../../context/AppContext'
import { todayISO } from '../../lib/calculations'

export function AddWeightModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { state, dispatch } = useApp()
  const [weight, setWeight] = useState('')
  const [date, setDate] = useState(todayISO())
  const [error, setError] = useState('')

  useEffect(() => {
    if (open) setDate(todayISO())
  }, [open])

  function handleClose() {
    setWeight('')
    setError('')
    onClose()
  }

  function existingEntryFor(d: string) {
    return state.weightEntries.find((w) => w.date === d)
  }

  function submit() {
    const value = Number(weight)
    if (!weight || value <= 0 || value > 400) {
      setError('Enter a valid weight in kilograms.')
      return
    }
    if (!date || date > todayISO()) {
      setError('Pick a date that is today or earlier.')
      return
    }
    dispatch({ type: 'ADD_WEIGHT_ENTRY', entry: { id: `w-${date}`, date, weightKg: Math.round(value * 10) / 10 } })
    handleClose()
  }

  const current = state.profile?.currentWeightKg
  const existing = existingEntryFor(date)

  return (
    <Modal open={open} onClose={handleClose} title="Log weight">
      <div className="space-y-4">
        <FormField label="Date">
          <input
            type="date"
            value={date}
            max={todayISO()}
            onChange={(e) => setDate(e.target.value)}
            className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-2)] px-3.5 py-2.5 text-sm text-[var(--color-text)] outline-none focus:border-[var(--color-brand)]"
          />
        </FormField>
        <FormField
          label="Weight (kg)"
          hint={
            existing
              ? `You already logged ${existing.weightKg} kg for this day — saving will replace it`
              : current
                ? `Last logged: ${current} kg`
                : undefined
          }
        >
          <TextInput
            type="number"
            inputMode="decimal"
            autoFocus
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            placeholder={existing ? String(existing.weightKg) : current ? String(current) : '80'}
          />
        </FormField>
        {error && <p className="text-xs text-[var(--color-critical)]">{error}</p>}
        <Button className="w-full" onClick={submit}>Save entry</Button>
        <p className="text-center text-[11px] text-[var(--color-text-muted)]">
          Tip: log each day this week to see the trend line move on the Weight page.
        </p>
      </div>
    </Modal>
  )
}
