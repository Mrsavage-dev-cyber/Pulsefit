import { motion } from 'framer-motion'
import { CheckCircle2 } from 'lucide-react'

export function SignupSuccess() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--color-bg)] px-5">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
        className="flex flex-col items-center text-center"
      >
        <motion.div
          initial={{ scale: 0, rotate: -20 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 260, damping: 16, delay: 0.1 }}
          className="mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-[var(--color-good)]/15"
        >
          <motion.div
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.25, duration: 0.25 }}
          >
            <CheckCircle2 size={44} className="text-[var(--color-good)]" />
          </motion.div>
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.3 }}
          className="text-xl font-extrabold tracking-tight"
        >
          You're in!
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.3 }}
          className="mt-1.5 text-sm text-[var(--color-text-secondary)]"
        >
          Account created — let's set up your plan.
        </motion.p>
      </motion.div>
    </div>
  )
}
