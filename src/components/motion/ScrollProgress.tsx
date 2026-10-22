'use client'
import { motion, useReducedMotion, useScroll, useSpring } from 'framer-motion'

/** A thin green bar across the top that fills as the page is scrolled. */
export default function ScrollProgress() {
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 24, restDelta: 0.001 })
  if (reduce) return null
  return (
    <motion.div
      aria-hidden="true"
      style={{
        scaleX,
        transformOrigin: '0% 50%',
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: 3,
        zIndex: 9999,
        background: 'linear-gradient(90deg, #008142, #4ade80)',
        pointerEvents: 'none',
      }}
    />
  )
}
