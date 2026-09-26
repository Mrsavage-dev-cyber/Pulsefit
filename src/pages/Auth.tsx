import { useState } from 'react'
import { Activity, Mail } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { Button } from '../components/ui/Button'
import { FormField, TextInput } from '../components/ui/FormField'
import { SegmentedControl } from '../components/ui/SegmentedControl'

const MODE_OPTIONS = [
  { label: 'Sign in', value: 'signin' },
  { label: 'Sign up', value: 'signup' },
] as const

type Mode = (typeof MODE_OPTIONS)[number]['value']

export function Auth() {
  const { signIn, signUp } = useAuth()
  const [mode, setMode] = useState<Mode>('signin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [confirmationSent, setConfirmationSent] = useState(false)

  function switchMode(next: Mode) {
    setMode(next)
    setError('')
    setConfirmationSent(false)
  }

  async function submit() {
    if (!email.trim() || !password) {
      setError('Enter your email and password.')
      return
    }
    if (mode === 'signup' && password.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }

    setSubmitting(true)
    setError('')

    if (mode === 'signin') {
      const { error: signInError } = await signIn(email.trim(), password)
      if (signInError) setError(signInError)
    } else {
      const { error: signUpError, needsEmailConfirmation } = await signUp(email.trim(), password)
      if (signUpError) setError(signUpError)
      else if (needsEmailConfirmation) setConfirmationSent(true)
    }

    setSubmitting(false)
  }

  if (confirmationSent) {
    return (
      <div className="animate-in mx-auto flex min-h-screen w-full max-w-md flex-col items-center justify-center px-5 py-8 text-center">
        <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--color-brand)]/15">
          <Mail size={26} className="text-[var(--color-brand)]" />
        </div>
        <h1 className="text-xl font-extrabold tracking-tight">Check your inbox</h1>
        <p className="mt-2 text-sm text-[var(--color-text-secondary)]">
          We sent a confirmation link to <span className="font-semibold text-[var(--color-text)]">{email}</span>. Confirm your
          email, then sign in below.
        </p>
        <Button className="mt-6 w-full" onClick={() => switchMode('signin')}>
          Back to sign in
        </Button>
      </div>
    )
  }

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-md flex-col justify-center px-5 py-8">
      <div className="mb-8 flex items-center gap-2">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--color-brand)]">
          <Activity size={20} className="text-white" />
        </div>
        <span className="text-xl font-extrabold tracking-tight">PulseFit</span>
      </div>

      <h1 className="text-2xl font-extrabold tracking-tight">{mode === 'signin' ? 'Welcome back' : 'Create your account'}</h1>
      <p className="mt-1 mb-6 text-sm text-[var(--color-text-secondary)]">
        {mode === 'signin' ? 'Sign in to pick up where you left off.' : 'Sign up to start tracking your goals.'}
      </p>

      <SegmentedControl options={[...MODE_OPTIONS]} value={mode} onChange={switchMode} className="mb-6 w-full" />

      <div className="space-y-4">
        <FormField label="Email">
          <TextInput
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
          />
        </FormField>
        <FormField label="Password" hint={mode === 'signup' ? 'At least 6 characters.' : undefined}>
          <TextInput
            type="password"
            autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            onKeyDown={(e) => e.key === 'Enter' && submit()}
          />
        </FormField>

        {error && <p className="text-xs text-[var(--color-critical)]">{error}</p>}

        <Button className="w-full" onClick={submit} disabled={submitting}>
          {submitting ? 'Please wait...' : mode === 'signin' ? 'Sign in' : 'Create account'}
        </Button>
      </div>
    </div>
  )
}
