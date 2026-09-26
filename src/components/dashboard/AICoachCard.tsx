import { Sparkles } from 'lucide-react'
import { Card } from '../ui/Card'
import clsx from 'clsx'
import type { CoachInsight } from '../../lib/coach'

export function AICoachCard({ insight }: { insight: CoachInsight }) {
  return (
    <Card
      className={clsx(
        'border',
        insight.tone === 'good' && 'border-[var(--color-good)]/30 bg-[var(--color-good)]/10',
        insight.tone === 'warning' && 'border-[var(--color-warning)]/30 bg-[var(--color-warning)]/10',
        insight.tone === 'info' && 'border-[var(--color-brand)]/30 bg-[var(--color-brand)]/10',
      )}
    >
      <div className="flex gap-3">
        <div
          className={clsx(
            'flex h-8 w-8 shrink-0 items-center justify-center rounded-full',
            insight.tone === 'good' && 'bg-[var(--color-good)]/20 text-[var(--color-good)]',
            insight.tone === 'warning' && 'bg-[var(--color-warning)]/20 text-[var(--color-warning)]',
            insight.tone === 'info' && 'bg-[var(--color-brand)]/20 text-[var(--color-brand)]',
          )}
        >
          <Sparkles size={16} />
        </div>
        <div>
          <p className="text-xs font-bold uppercase tracking-wide text-[var(--color-text-secondary)]">AI Coach Insight</p>
          <p className="mt-1 text-sm leading-relaxed text-[var(--color-text)]">{insight.message}</p>
        </div>
      </div>
    </Card>
  )
}
