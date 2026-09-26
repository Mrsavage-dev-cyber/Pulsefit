import type { HTMLAttributes, ReactNode } from 'react'
import clsx from 'clsx'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
  padded?: boolean
}

export function Card({ children, className, padded = true, ...rest }: CardProps) {
  return (
    <div
      className={clsx(
        'rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)]',
        padded && 'p-4',
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  )
}

export function CardHeader({ title, subtitle, action }: { title: string; subtitle?: string; action?: ReactNode }) {
  return (
    <div className="mb-3 flex items-start justify-between gap-3">
      <div>
        <h3 className="text-[15px] font-semibold text-[var(--color-text)]">{title}</h3>
        {subtitle && <p className="mt-0.5 text-xs text-[var(--color-text-secondary)]">{subtitle}</p>}
      </div>
      {action}
    </div>
  )
}
