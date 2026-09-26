import { motion } from 'framer-motion'
import { Waves } from 'lucide-react'

export function SignoutFarewell() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--color-bg)] px-5">
      <motion.div
        initial={{ opacity: 0, scale: 1.05 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className="flex flex-col items-center text-center"
      >
        <motion.div
          initial={{ scale: 0.7, opacity: 0 }}
          animate={{ scale: 1, opacity: 1, rotate: [0, -8, 8, -4, 0] }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-[var(--color-violet)]/15"
        >
          <Waves size={36} className="text-[var(--color-violet)]" />
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.3 }}
          className="text-xl font-extrabold tracking-tight"
        >
          See you soon
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.3 }}
          className="mt-1.5 text-sm text-[var(--color-text-secondary)]"
        >
          You've been signed out.
        </motion.p>
      </motion.div>
    </div>
  )
}
