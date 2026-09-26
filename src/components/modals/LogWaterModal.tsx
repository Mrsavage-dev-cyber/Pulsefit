import { useState } from 'react'
import { Modal } from '../ui/Modal'
import { Button } from '../ui/Button'
import { FormField, TextInput } from '../ui/FormField'
import { useApp } from '../../context/AppContext'

const QUICK_AMOUNTS = [250, 500, 750]

export function LogWaterModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { dispatch } = useApp()
  const [custom, setCustom] = useState('')

  function log(ml: number) {
    dispatch({ type: 'LOG_WATER', ml })
    onClose()
  }

  function submitCustom() {
    const value = Number(custom)
    if (value > 0) log(Math.round(value))
  }

  return (
    <Modal open={open} onClose={onClose} title="Log water">
      <div className="space-y-4">
        <div className="grid grid-cols-3 gap-2">
          {QUICK_AMOUNTS.map((ml) => (
            <button
              key={ml}
              onClick={() => log(ml)}
              className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-2)] py-3 text-sm font-semibold transition hover:border-[var(--color-brand)]"
            >
              +{ml} ml
            </button>
          ))}
        </div>
        <FormField label="Custom amount (ml)">
          <div className="flex gap-2">
            <TextInput
              type="number"
              inputMode="numeric"
              value={custom}
              onChange={(e) => setCustom(e.target.value)}
              placeholder="300"
            />
            <Button onClick={submitCustom}>Add</Button>
          </div>
        </FormField>
      </div>
    </Modal>
  )
}
