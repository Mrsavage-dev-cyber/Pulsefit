import type { InputHTMLAttributes, ReactNode } from 'react'

interface FormFieldProps {
  label: string
  children: ReactNode
  hint?: string
}

export function FormField({ label, children, hint }: FormFieldProps) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-semibold text-[var(--color-text-secondary)]">{label}</span>
      {children}
      {hint && <span className="mt-1 block text-[11px] text-[var(--color-text-muted)]">{hint}</span>}
    </label>
  )
}

export function TextInput(props: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-2)] px-3.5 py-2.5 text-sm text-[var(--color-text)] outline-none placeholder:text-[var(--color-text-muted)] focus:border-[var(--color-brand)]"
    />
  )
}
