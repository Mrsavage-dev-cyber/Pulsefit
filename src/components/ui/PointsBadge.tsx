import clsx from 'clsx'
import { Trophy } from 'lucide-react'
import { useApp } from '../../context/AppContext'

export function PointsBadge({ className }: { className?: string }) {
  const { state } = useApp()

  return (
    <span
      className={clsx(
        'inline-flex items-center gap-1.5 rounded-full bg-[var(--color-brand)]/12 px-3 py-1.5 text-xs font-bold text-[var(--color-brand)]',
        className,
      )}
    >
      <Trophy size={13} />
      {state.points.total.toLocaleString()} pts
    </span>
  )
}
