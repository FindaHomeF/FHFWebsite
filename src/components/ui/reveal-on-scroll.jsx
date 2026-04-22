'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { motionTransition, REVEAL } from '@/lib/motion'

const RevealOnScroll = ({
  children,
  className = '',
  delay = 0,
  y = REVEAL.y,
  once = true,
}) => {
  const shouldReduceMotion = useReducedMotion()

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>
  }

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, amount: REVEAL.viewportAmount }}
      transition={motionTransition.reveal(delay)}
    >
      {children}
    </motion.div>
  )
}

export default RevealOnScroll
