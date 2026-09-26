import clsx from 'clsx'

interface ProgressBarProps {
  value: number
  max: number
  color?: string
  label?: string
  valueLabel?: string
  className?: string
}

export function ProgressBar({ value, max, color = 'var(--color-brand)', label, valueLabel, className }: ProgressBarProps) {
  const pct = max > 0 ? Math.min(100, Math.max(0, (value / max) * 100)) : 0
  return (
    <div className={clsx('w-full', className)}>
      {(label || valueLabel) && (
        <div className="mb-1.5 flex items-center justify-between text-xs">
          {label && <span className="text-[var(--color-text-secondary)]">{label}</span>}
          {valueLabel && <span className="tabular text-[var(--color-text-secondary)]">{valueLabel}</span>}
        </div>
      )}
      <div className="h-2 w-full overflow-hidden rounded-full bg-[var(--color-surface-3)]">
        <div
          className="h-full rounded-full transition-[width] duration-500 ease-out"
          style={{ width: `${pct}%`, backgroundColor: color }}
        />
      </div>
    </div>
  )
}
