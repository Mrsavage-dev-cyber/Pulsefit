import type { ButtonHTMLAttributes } from 'react'
import clsx from 'clsx'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
}

export function Button({ variant = 'primary', size = 'md', className, ...rest }: ButtonProps) {
  return (
    <button
      className={clsx(
        'inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition active:scale-[0.98] disabled:opacity-40 disabled:active:scale-100',
        variant === 'primary' && 'bg-[var(--color-brand)] text-white hover:brightness-110',
        variant === 'secondary' && 'bg-[var(--color-surface-3)] text-[var(--color-text)] hover:bg-[var(--color-surface-2)]',
        variant === 'ghost' && 'bg-transparent text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-2)]',
        size === 'sm' && 'px-3 py-1.5 text-xs',
        size === 'md' && 'px-4 py-2.5 text-sm',
        size === 'lg' && 'px-5 py-3.5 text-base',
        className,
      )}
      {...rest}
    />
  )
}
