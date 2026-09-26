import clsx from 'clsx'

interface Option<T extends string> {
  label: string
  value: T
}

interface SegmentedControlProps<T extends string> {
  options: Option<T>[]
  value: T
  onChange: (value: T) => void
  className?: string
}

export function SegmentedControl<T extends string>({ options, value, onChange, className }: SegmentedControlProps<T>) {
  return (
    <div className={clsx('inline-flex rounded-xl bg-[var(--color-surface-3)] p-1', className)}>
      {options.map((opt) => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          className={clsx(
            'rounded-lg px-3 py-1.5 text-xs font-semibold transition',
            value === opt.value ? 'bg-[var(--color-brand)] text-white' : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text)]',
          )}
        >
          {opt.label}
        </button>
      ))}
    </div>
  )
}
