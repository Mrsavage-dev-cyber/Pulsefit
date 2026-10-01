import { Component, type ReactNode } from 'react'
import { clearAllStates } from '../lib/storage'

interface Props {
  children: ReactNode
}

interface State {
  error: Error | null
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null }

  static getDerivedStateFromError(error: Error): State {
    return { error }
  }

  componentDidCatch(error: Error, info: { componentStack: string }) {
    console.error('PulseFit crashed:', error, info.componentStack)
  }

  handleReset = () => {
    clearAllStates()
    window.location.reload()
  }

  render() {
    if (!this.state.error) return this.props.children

    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[var(--color-bg)] px-6 text-center text-[var(--color-text)]">
        <p className="text-xl font-bold">Something went wrong</p>
        <p className="max-w-sm text-sm text-[var(--color-text-secondary)]">
          PulseFit hit an unexpected error. Resetting your local demo data usually fixes it.
        </p>
        <pre className="max-w-sm overflow-auto rounded-lg bg-[var(--color-surface-2)] p-3 text-left text-xs text-[var(--color-text-muted)]">
          {this.state.error.message}
        </pre>
        <button
          onClick={this.handleReset}
          className="rounded-xl bg-[var(--color-brand)] px-4 py-2.5 text-sm font-semibold text-white"
        >
          Reset app data and reload
        </button>
      </div>
    )
  }
}
