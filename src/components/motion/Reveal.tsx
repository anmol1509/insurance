'use client'
import Link from 'next/link'
import type { ReactNode } from 'react'
import { motion, useReducedMotion } from 'framer-motion'

type Tag = 'div' | 'li' | 'section' | 'h2' | 'p' | 'span'

interface RevealProps {
  as?: Tag
  delay?: number
  /** Distance, in px, the element travels up while it fades in. */
  y?: number
  className?: string
  id?: string
  children: ReactNode
}

const VIEWPORT = { once: true, margin: '-70px' } as const

/**
 * Fades and lifts its content in the first time it scrolls into view. The
 * element keeps its own tag and class, so existing CSS selectors still match.
 */
export function Reveal({ as = 'div', delay = 0, y = 24, className, id, children }: RevealProps) {
  const reduce = useReducedMotion()
  const Comp = motion[as] as typeof motion.div
  return (
    <Comp
      id={id}
      className={className}
      initial={reduce ? false : { opacity: 0, y }}
      whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
      viewport={VIEWPORT}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </Comp>
  )
}

const MotionLink = motion.create(Link)

/** A next/link that reveals like {@link Reveal}. */
export function RevealLink({
  href,
  className,
  delay = 0,
  y = 28,
  children,
}: {
  href: string
  className?: string
  delay?: number
  y?: number
  children: ReactNode
}) {
  const reduce = useReducedMotion()
  return (
    <MotionLink
      href={href}
      className={className}
      initial={reduce ? false : { opacity: 0, y }}
      whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
      viewport={VIEWPORT}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </MotionLink>
  )
}
