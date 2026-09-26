import { useEffect, useState } from 'react'
import { Navigate, Route, HashRouter, Routes } from 'react-router-dom'
import { AppProvider, useApp } from './context/AppContext'
import { AuthProvider, useAuth } from './context/AuthContext'
import { AppShell } from './components/layout/AppShell'
import { Auth } from './pages/Auth'
import { SignupSuccess } from './components/SignupSuccess'
import { SigninSuccess } from './components/SigninSuccess'
import { SignoutFarewell } from './components/SignoutFarewell'
import { Onboarding } from './pages/Onboarding'
import { Dashboard } from './pages/Dashboard'
import { WeightProgress } from './pages/WeightProgress'
import { Nutrition } from './pages/Nutrition'
import { Workouts } from './pages/Workouts'
import { CheckIn } from './pages/CheckIn'
import { Settings } from './pages/Settings'

function Gate({ children }: { children: React.ReactNode }) {
  const { state } = useApp()
  if (!state.profile) return <Navigate to="/onboarding" replace />
  return <>{children}</>
}

function useAuthTransition(active: boolean, clear: () => void, durationMs: number): boolean {
  const [showing, setShowing] = useState(false)

  useEffect(() => {
    if (!active) return
    setShowing(true)
    const timer = setTimeout(() => {
      setShowing(false)
      clear()
    }, durationMs)
    return () => clearTimeout(timer)
  }, [active, clear, durationMs])

  return showing
}

function AppRoutes() {
  const { state } = useApp()
  const { session, loading, justSignedUp, clearJustSignedUp, justSignedIn, clearJustSignedIn, justSignedOut, clearJustSignedOut } =
    useAuth()

  const showWelcome = useAuthTransition(justSignedUp, clearJustSignedUp, 1600)
  const showWelcomeBack = useAuthTransition(justSignedIn, clearJustSignedIn, 1500)
  const showFarewell = useAuthTransition(justSignedOut, clearJustSignedOut, 1300)

  if (loading) {
    return <div className="flex min-h-screen items-center justify-center bg-[var(--color-bg)]" />
  }

  if (showFarewell) {
    return <SignoutFarewell />
  }

  if (!session) {
    return <Auth />
  }

  if (showWelcome) {
    return <SignupSuccess />
  }

  if (showWelcomeBack) {
    return <SigninSuccess />
  }

  return (
    <Routes>
      <Route
        path="/onboarding"
        element={state.profile ? <Navigate to="/" replace /> : <Onboarding />}
      />
      <Route
        element={
          <Gate>
            <AppShell />
          </Gate>
        }
      >
        <Route path="/" element={<Dashboard />} />
        <Route path="/weight" element={<WeightProgress />} />
        <Route path="/nutrition" element={<Nutrition />} />
        <Route path="/workouts" element={<Workouts />} />
        <Route path="/checkin" element={<CheckIn />} />
        <Route path="/settings" element={<Settings />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <HashRouter>
          <AppRoutes />
        </HashRouter>
      </AppProvider>
    </AuthProvider>
  )
}

export default App
