import { motion } from 'framer-motion'
import { Zap } from 'lucide-react'

export function SigninSuccess() {
  return (
    <div className="flex min-h-screen items-center justify-center overflow-hidden bg-[var(--color-bg)] px-5">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.25 }}
        className="flex flex-col items-center text-center"
      >
        <div className="relative mb-5 flex h-20 w-20 items-center justify-center">
          {[0, 0.25, 0.5].map((delay) => (
            <motion.span
              key={delay}
              className="absolute h-20 w-20 rounded-full border-2 border-[var(--color-brand)]"
              initial={{ scale: 0.5, opacity: 0.7 }}
              animate={{ scale: 1.8, opacity: 0 }}
              transition={{ duration: 1.1, repeat: Infinity, delay, ease: 'easeOut' }}
            />
          ))}
          <motion.div
            initial={{ scale: 0, rotate: 30 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 14 }}
            className="relative flex h-20 w-20 items-center justify-center rounded-full bg-[var(--color-brand)]/15"
          >
            <Zap size={38} className="text-[var(--color-brand)]" fill="var(--color-brand)" />
          </motion.div>
        </div>
        <motion.h1
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.3 }}
          className="text-xl font-extrabold tracking-tight"
        >
          Welcome back!
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.3 }}
          className="mt-1.5 text-sm text-[var(--color-text-secondary)]"
        >
          Picking up right where you left off.
        </motion.p>
      </motion.div>
    </div>
  )
}
