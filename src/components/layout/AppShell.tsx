import { NavLink, Outlet } from 'react-router-dom'
import { Activity, Dumbbell, LayoutDashboard, MessageCircleHeart, Settings as SettingsIcon, Utensils } from 'lucide-react'
import clsx from 'clsx'
import { PointsBadge } from '../ui/PointsBadge'

const NAV_ITEMS = [
  { to: '/', label: 'Home', icon: LayoutDashboard, end: true },
  { to: '/weight', label: 'Weight', icon: Activity, end: false },
  { to: '/nutrition', label: 'Nutrition', icon: Utensils, end: false },
  { to: '/workouts', label: 'Workouts', icon: Dumbbell, end: false },
  { to: '/checkin', label: 'Check-in', icon: MessageCircleHeart, end: false },
]

export function AppShell() {
  return (
    <div className="min-h-screen bg-[var(--color-bg)] md:flex">
      <aside className="hidden w-60 shrink-0 border-r border-[var(--color-border)] px-4 py-6 md:block">
        <div className="mb-8 flex items-center gap-2 px-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--color-brand)]">
            <Activity size={18} className="text-white" />
          </div>
          <span className="text-lg font-extrabold tracking-tight">PulseFit</span>
        </div>
        <PointsBadge className="mb-6" />
        <nav className="space-y-1">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                clsx(
                  'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition',
                  isActive
                    ? 'bg-[var(--color-surface-2)] text-[var(--color-text)]'
                    : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-2)] hover:text-[var(--color-text)]',
                )
              }
            >
              <item.icon size={18} />
              {item.label}
            </NavLink>
          ))}
          <div className="my-2 border-t border-[var(--color-border)]" />
          <NavLink
            to="/settings"
            className={({ isActive }) =>
              clsx(
                'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition',
                isActive
                  ? 'bg-[var(--color-surface-2)] text-[var(--color-text)]'
                  : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-2)] hover:text-[var(--color-text)]',
              )
            }
          >
            <SettingsIcon size={18} />
            Settings
          </NavLink>
        </nav>
      </aside>

      <div className="flex min-h-screen flex-1 flex-col">
        <main className="mx-auto w-full max-w-2xl flex-1 px-4 pb-28 pt-6 md:px-8 md:pb-10">
          <Outlet />
        </main>

        <nav className="safe-bottom fixed inset-x-0 bottom-0 z-40 border-t border-[var(--color-border)] bg-[var(--color-surface)]/95 backdrop-blur md:hidden">
          <div className="mx-auto flex max-w-2xl items-stretch justify-around">
            {NAV_ITEMS.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  clsx(
                    'flex flex-1 flex-col items-center gap-1 py-2.5 text-[10px] font-semibold transition',
                    isActive ? 'text-[var(--color-brand)]' : 'text-[var(--color-text-muted)]',
                  )
                }
              >
                <item.icon size={20} />
                {item.label}
              </NavLink>
            ))}
          </div>
        </nav>
      </div>
    </div>
  )
}
