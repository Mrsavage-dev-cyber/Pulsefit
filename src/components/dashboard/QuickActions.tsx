import { useNavigate } from 'react-router-dom'
import { Dumbbell, MessageCircleHeart, Scale, Utensils } from 'lucide-react'

interface QuickActionsProps {
  onLogMeal: () => void
  onLogWeight: () => void
}

export function QuickActions({ onLogMeal, onLogWeight }: QuickActionsProps) {
  const navigate = useNavigate()
  const actions = [
    { label: 'Log meal', icon: Utensils, onClick: onLogMeal },
    { label: 'Log weight', icon: Scale, onClick: onLogWeight },
    { label: 'Start workout', icon: Dumbbell, onClick: () => navigate('/workouts') },
    { label: 'Check in', icon: MessageCircleHeart, onClick: () => navigate('/checkin') },
  ]

  return (
    <div className="grid grid-cols-4 gap-2">
      {actions.map((a) => (
        <button
          key={a.label}
          onClick={a.onClick}
          className="flex flex-col items-center gap-1.5 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] py-3 text-[var(--color-text-secondary)] transition hover:border-[var(--color-border-strong)] hover:text-[var(--color-text)]"
        >
          <a.icon size={18} />
          <span className="text-[10px] font-semibold">{a.label}</span>
        </button>
      ))}
    </div>
  )
}
