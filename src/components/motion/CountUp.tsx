'use client'
import { useEffect, useRef } from 'react'
import { animate, useInView, useReducedMotion } from 'framer-motion'

/**
 * Counts a figure such as "46+", "$2M" or "97%" up from zero when it scrolls
 * into view. The final text is in the markup, so it reads correctly without
 * JavaScript and with reduced motion.
 */
export default function CountUp({ value, duration = 1.6 }: { value: string; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  const reduce = useReducedMotion()

  useEffect(() => {
    if (!inView || reduce || !ref.current) return
    const match = value.match(/^(\D*)(\d+(?:\.\d+)?)(.*)$/)
    if (!match) return
    const [, prefix, digits, suffix] = match
    const target = Number(digits)
    const decimals = digits.includes('.') ? digits.split('.')[1].length : 0
    const node = ref.current
    const controls = animate(0, target, {
      duration,
      ease: 'easeOut',
      onUpdate: (n) => { node.textContent = `${prefix}${n.toFixed(decimals)}${suffix}` },
      onComplete: () => { node.textContent = value },
    })
    return () => controls.stop()
  }, [inView, reduce, value, duration])

  return <span ref={ref}>{value}</span>
}
