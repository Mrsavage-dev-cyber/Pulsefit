import { useRef, useState } from 'react'
import { Camera, Check, Plus, RotateCcw } from 'lucide-react'
import clsx from 'clsx'
import { Modal } from '../ui/Modal'
import { Button } from '../ui/Button'
import { getApiKey } from '../../lib/aiConfig'
import { analyzeFoodPhoto, FoodPhotoAnalysisError, type DetectedFood } from '../../lib/foodPhotoAnalysis'
import type { MealType } from '../../types'

const MEAL_TYPES: { value: MealType; label: string }[] = [
  { value: 'breakfast', label: 'Breakfast' },
  { value: 'lunch', label: 'Lunch' },
  { value: 'dinner', label: 'Dinner' },
  { value: 'snack', label: 'Snack' },
]

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      const result = reader.result as string
      resolve(result.split(',')[1] ?? '')
    }
    reader.onerror = () => reject(reader.error)
    reader.readAsDataURL(file)
  })
}

export function PhotoScanModal({
  open,
  onClose,
  onAdd,
}: {
  open: boolean
  onClose: () => void
  onAdd: (type: MealType, food: DetectedFood) => void
}) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [file, setFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [mealType, setMealType] = useState<MealType>('lunch')
  const [analyzing, setAnalyzing] = useState(false)
  const [error, setError] = useState('')
  const [results, setResults] = useState<DetectedFood[] | null>(null)
  const [added, setAdded] = useState<Set<number>>(new Set())

  function reset() {
    setFile(null)
    setPreviewUrl(null)
    setAnalyzing(false)
    setError('')
    setResults(null)
    setAdded(new Set())
  }

  function handleClose() {
    reset()
    onClose()
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const picked = e.target.files?.[0]
    if (!picked) return
    setFile(picked)
    setPreviewUrl(URL.createObjectURL(picked))
    setResults(null)
    setError('')
  }

  async function analyze() {
    if (!file) return
    const apiKey = getApiKey()
    if (!apiKey) {
      setError('Add your Anthropic API key in Settings first to use AI food scanning.')
      return
    }
    setAnalyzing(true)
    setError('')
    try {
      const base64 = await fileToBase64(file)
      const items = await analyzeFoodPhoto(apiKey, base64, file.type)
      setResults(items)
    } catch (err) {
      setError(err instanceof FoodPhotoAnalysisError ? err.message : 'Something went wrong analyzing that photo.')
    } finally {
      setAnalyzing(false)
    }
  }

  function addItem(index: number, food: DetectedFood) {
    onAdd(mealType, food)
    setAdded((prev) => new Set(prev).add(index))
  }

  return (
    <Modal open={open} onClose={handleClose} title="Scan food with AI">
      <div className="space-y-4">
        {!previewUrl && (
          <button
            onClick={() => inputRef.current?.click()}
            className="flex w-full flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-[var(--color-border)] bg-[var(--color-surface-2)] py-10 text-[var(--color-text-secondary)]"
          >
            <Camera size={28} />
            <span className="text-sm font-semibold">Take or choose a photo</span>
          </button>
        )}
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handleFileChange}
          className="hidden"
        />

        {previewUrl && (
          <div className="space-y-3">
            <div className="overflow-hidden rounded-2xl border border-[var(--color-border)]">
              <img src={previewUrl} alt="Selected food" className="max-h-64 w-full object-cover" />
            </div>

            {!results && (
              <div className="flex gap-2">
                <Button variant="secondary" className="flex-1" onClick={() => inputRef.current?.click()}>
                  <RotateCcw size={15} /> Retake
                </Button>
                <Button className="flex-1" onClick={analyze} disabled={analyzing}>
                  {analyzing ? 'Analyzing...' : 'Analyze'}
                </Button>
              </div>
            )}
          </div>
        )}

        {error && <p className="text-xs text-[var(--color-critical)]">{error}</p>}

        {results && (
          <div className="space-y-3">
            <div>
              <span className="mb-1.5 block text-xs font-semibold text-[var(--color-text-secondary)]">Add to</span>
              <div className="grid grid-cols-4 gap-2">
                {MEAL_TYPES.map((t) => (
                  <button
                    key={t.value}
                    onClick={() => setMealType(t.value)}
                    className={clsx(
                      'rounded-lg border px-2 py-2 text-xs font-semibold',
                      mealType === t.value
                        ? 'border-[var(--color-brand)] bg-[var(--color-brand)]/10'
                        : 'border-[var(--color-border)] bg-[var(--color-surface-2)] text-[var(--color-text-secondary)]',
                    )}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1.5">
              {results.map((food, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-2)] px-3.5 py-2.5"
                >
                  <div>
                    <p className="text-sm font-medium">{food.name}</p>
                    <p className="text-[11px] text-[var(--color-text-secondary)]">
                      {food.estimatedQuantity} · {food.calories} kcal · P {food.protein}g · C {food.carbs}g · F {food.fat}g
                    </p>
                  </div>
                  <button
                    onClick={() => addItem(i, food)}
                    disabled={added.has(i)}
                    aria-label={`Add ${food.name}`}
                    className={clsx(
                      'flex shrink-0 items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold',
                      added.has(i)
                        ? 'bg-[var(--color-good)]/10 text-[var(--color-good)]'
                        : 'bg-[var(--color-surface-3)] text-[var(--color-text-secondary)] hover:text-[var(--color-text)]',
                    )}
                  >
                    {added.has(i) ? <Check size={13} /> : <Plus size={13} />}
                    {added.has(i) ? 'Added' : 'Add'}
                  </button>
                </div>
              ))}
            </div>

            <p className="text-center text-[11px] text-[var(--color-text-muted)]">
              AI estimates can be off — adjust logged meals from the Nutrition page if needed.
            </p>
          </div>
        )}
      </div>
    </Modal>
  )
}
