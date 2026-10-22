'use client'
import { motion, useReducedMotion } from 'framer-motion'

/**
 * Words resolve out of a blur one after another. Changing `text` replays it,
 * which suits a heading that changes with a tab.
 */
export default function BlurText({ text, delay = 0, step = 0.07 }: { text: string; delay?: number; step?: number }) {
  const reduce = useReducedMotion()
  if (reduce) return <>{text}</>
  const words = text.split(' ')
  return (
    <span aria-label={text}>
      {words.map((word, i) => (
        <motion.span
          key={`${text}-${i}`}
          aria-hidden="true"
          style={{ display: 'inline-block', whiteSpace: 'pre' }}
          initial={{ opacity: 0, filter: 'blur(10px)', y: -10 }}
          animate={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
          transition={{ duration: 0.55, delay: delay + i * step, ease: 'easeOut' }}
        >
          {word}
          {i < words.length - 1 ? ' ' : ''}
        </motion.span>
      ))}
    </span>
  )
}
