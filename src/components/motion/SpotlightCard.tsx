'use client'
import { useRef, useState, type ReactNode } from 'react'
import { motion, useReducedMotion } from 'framer-motion'

/**
 * A soft green glow follows the pointer across the card. Also reveals on
 * scroll with the same timing as {@link Reveal}. Renders a `div`.
 */
export default function SpotlightCard({ children, delay = 0, className }: { children: ReactNode; delay?: number; className?: string }) {
  const reduce = useReducedMotion()
  const glow = useRef<HTMLSpanElement>(null)
  const [hover, setHover] = useState(false)

  function onMove(e: React.MouseEvent<HTMLDivElement>) {
    const box = e.currentTarget.getBoundingClientRect()
    glow.current?.style.setProperty('--mx', `${e.clientX - box.left}px`)
    glow.current?.style.setProperty('--my', `${e.clientY - box.top}px`)
  }

  return (
    <motion.div
      className={className}
      style={{ position: 'relative' }}
      initial={reduce ? false : { opacity: 0, y: 24 }}
      whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
      whileHover={reduce ? undefined : { y: -4 }}
      viewport={{ once: true, margin: '-70px' }}
      transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}
      onMouseMove={reduce ? undefined : onMove}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <span
        ref={glow}
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: 'inherit',
          pointerEvents: 'none',
          opacity: hover && !reduce ? 1 : 0,
          transition: 'opacity 0.25s',
          background: 'radial-gradient(220px circle at var(--mx, 50%) var(--my, 50%), rgba(0,129,66,0.12), transparent 70%)',
        }}
      />
      {children}
    </motion.div>
  )
}
