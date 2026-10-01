import { useState } from 'react'
import { motion } from 'framer-motion'
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

function AmbientBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <motion.div
        className="absolute -top-32 -left-24 h-80 w-80 rounded-full bg-[var(--color-brand)]/30 blur-[90px]"
        animate={{ x: [0, 30, 0], y: [0, 20, 0] }}
        transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute top-1/3 -right-28 h-96 w-96 rounded-full bg-[var(--color-violet)]/25 blur-[100px]"
        animate={{ x: [0, -25, 0], y: [0, -30, 0] }}
        transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute -bottom-24 left-1/4 h-72 w-72 rounded-full bg-[var(--color-aqua)]/20 blur-[90px]"
        animate={{ x: [0, 20, 0], y: [0, -15, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
      />
    </div>
  )
}

function Logo() {
  return (
    <div className="relative mb-6 flex h-14 w-14 items-center justify-center">
      {[0, 0.4].map((delay) => (
        <motion.span
          key={delay}
          className="absolute h-14 w-14 rounded-2xl border border-[var(--color-brand)]"
          initial={{ scale: 0.8, opacity: 0.5 }}
          animate={{ scale: 1.6, opacity: 0 }}
          transition={{ duration: 2.2, repeat: Infinity, delay, ease: 'easeOut' }}
        />
      ))}
      <motion.div
        initial={{ scale: 0, rotate: -15 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: 'spring', stiffness: 260, damping: 16 }}
        className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[var(--color-brand)] to-[var(--color-violet)] shadow-[0_8px_30px_-8px_rgba(57,135,229,0.7)]"
      >
        <Activity size={26} className="text-white" />
      </motion.div>
    </div>
  )
}

export function Auth() {
  const { signIn, signUp, signInWithGoogle } = useAuth()
  const [mode, setMode] = useState<Mode>('signin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [googleSubmitting, setGoogleSubmitting] = useState(false)
  const [confirmationSent, setConfirmationSent] = useState(false)

  function switchMode(next: Mode) {
    setMode(next)
    setError('')
    setConfirmationSent(false)
  }

  async function submitGoogle() {
    setGoogleSubmitting(true)
    setError('')
    const { error: googleError } = await signInWithGoogle()
    if (googleError) {
      setError(googleError)
      setGoogleSubmitting(false)
    }
    // On success the browser redirects to Google, so no need to clear submitting state.
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
      <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[var(--color-bg)] px-5 py-8">
        <AmbientBackground />
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="relative w-full max-w-md rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface)]/80 p-8 text-center shadow-2xl backdrop-blur-xl"
        >
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--color-brand)]/15">
            <Mail size={26} className="text-[var(--color-brand)]" />
          </div>
          <h1 className="text-xl font-extrabold tracking-tight">Check your inbox</h1>
          <p className="mt-2 text-sm text-[var(--color-text-secondary)]">
            We sent a confirmation link to <span className="font-semibold text-[var(--color-text)]">{email}</span>. Confirm
            your email, then sign in below.
          </p>
          <Button className="mt-6 w-full" onClick={() => switchMode('signin')}>
            Back to sign in
          </Button>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[var(--color-bg)] px-5 py-8">
      <AmbientBackground />

      <motion.div
        initial={{ opacity: 0, y: 16, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="relative w-full max-w-md rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface)]/80 p-7 shadow-2xl backdrop-blur-xl sm:p-8"
      >
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05, duration: 0.3 }}
          className="flex flex-col items-center text-center sm:items-start sm:text-left"
        >
          <Logo />
          <h1 className="bg-gradient-to-r from-[var(--color-text)] to-[var(--color-text-secondary)] bg-clip-text text-3xl font-extrabold tracking-tight text-transparent">
            {mode === 'signin' ? 'Welcome back' : 'Create your account'}
          </h1>
          <p className="mt-1.5 mb-7 text-sm text-[var(--color-text-secondary)]">
            {mode === 'signin' ? 'Sign in to pick up where you left off.' : 'Sign up to start tracking your goals.'}
          </p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.3 }}>
          <SegmentedControl options={[...MODE_OPTIONS]} value={mode} onChange={switchMode} className="mb-6 w-full" />
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15, duration: 0.3 }}>
          <motion.button
            type="button"
            whileHover={{ scale: 1.015, y: -1 }}
            whileTap={{ scale: 0.98 }}
            onClick={submitGoogle}
            disabled={googleSubmitting || submitting}
            className="flex w-full items-center justify-center gap-2.5 rounded-xl border border-[var(--color-border-strong)] bg-[var(--color-surface-2)] px-4 py-3 text-sm font-semibold text-[var(--color-text)] shadow-sm transition hover:border-[var(--color-brand)]/50 hover:bg-[var(--color-surface-3)] disabled:opacity-40"
          >
            <GoogleIcon />
            {googleSubmitting ? 'Redirecting...' : 'Continue with Google'}
          </motion.button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.3 }}
          className="my-6 flex items-center gap-3"
        >
          <div className="h-px flex-1 bg-[var(--color-border)]" />
          <span className="text-[11px] font-bold tracking-wider text-[var(--color-text-muted)]">OR</span>
          <div className="h-px flex-1 bg-[var(--color-border)]" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.3 }}
          className="space-y-4"
        >
          <FormField label="Email">
            <TextInput
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
            />
          </FormField>
          <FormField label="Password" hint={mode === 'signup' && !password ? 'At least 6 characters.' : undefined}>
            <TextInput
              type="password"
              autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              onKeyDown={(e) => e.key === 'Enter' && submit()}
            />
            {mode === 'signup' && password && <PasswordStrength password={password} />}
          </FormField>

          {error && (
            <motion.p
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-xs font-medium text-[var(--color-critical)]"
            >
              {error}
            </motion.p>
          )}

          <motion.button
            type="button"
            whileHover={{ scale: 1.015 }}
            whileTap={{ scale: 0.98 }}
            onClick={submit}
            disabled={submitting}
            className="w-full rounded-xl bg-gradient-to-r from-[var(--color-brand)] to-[var(--color-violet)] px-4 py-3 text-sm font-bold text-white shadow-[0_10px_35px_-10px_rgba(57,135,229,0.7)] transition disabled:opacity-40"
          >
            {submitting ? 'Please wait...' : mode === 'signin' ? 'Sign in' : 'Create account'}
          </motion.button>
        </motion.div>
      </motion.div>
    </div>
  )
}

const STRENGTH_LEVELS = [
  { label: 'Weak', color: 'var(--color-critical)' },
  { label: 'Fair', color: 'var(--color-orange)' },
  { label: 'Good', color: 'var(--color-yellow)' },
  { label: 'Strong', color: 'var(--color-good)' },
] as const

function getPasswordScore(password: string): number {
  let score = 0
  if (password.length >= 6) score++
  if (password.length >= 10) score++
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++
  if (/\d/.test(password)) score++
  if (/[^A-Za-z0-9]/.test(password)) score++
  return Math.min(score, 4)
}

function PasswordStrength({ password }: { password: string }) {
  const score = getPasswordScore(password)
  const level = STRENGTH_LEVELS[Math.max(score - 1, 0)]

  return (
    <div className="mt-2">
      <div className="flex gap-1.5">
        {STRENGTH_LEVELS.map((_, i) => (
          <div key={i} className="h-1 flex-1 overflow-hidden rounded-full bg-[var(--color-surface-3)]">
            <motion.div
              className="h-full rounded-full"
              initial={false}
              animate={{
                width: i < score ? '100%' : '0%',
                backgroundColor: level.color,
              }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
            />
          </div>
        ))}
      </div>
      <span className="mt-1.5 block text-[11px] font-semibold" style={{ color: level.color }}>
        {level.label}
      </span>
    </div>
  )
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.8 2.72v2.26h2.9c1.7-1.56 2.7-3.86 2.7-6.62Z"
      />
      <path
        fill="#34A853"
        d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.9-2.26c-.8.54-1.84.86-3.06.86-2.35 0-4.34-1.59-5.05-3.72H.95v2.33A9 9 0 0 0 9 18Z"
      />
      <path
        fill="#FBBC05"
        d="M3.95 10.7A5.4 5.4 0 0 1 3.67 9c0-.59.1-1.16.28-1.7V4.97H.95A9 9 0 0 0 0 9c0 1.45.35 2.83.95 4.03l3-2.33Z"
      />
      <path
        fill="#EA4335"
        d="M9 3.58c1.32 0 2.5.46 3.44 1.35l2.58-2.58C13.46.89 11.43 0 9 0A9 9 0 0 0 .95 4.97l3 2.33C4.66 5.17 6.65 3.58 9 3.58Z"
      />
    </svg>
  )
}
