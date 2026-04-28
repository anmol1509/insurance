'use client'
import { motion } from 'framer-motion'

interface WavyUnderlineProps {
  color?: string
  width?: number
  className?: string
}

export default function WavyUnderline({
  color = 'var(--orange-500)',
  width = 160,
  className,
}: WavyUnderlineProps) {
  const path = `M2 8 C${width * 0.15} 2, ${width * 0.3} 14, ${width * 0.5} 8 S${width * 0.8} 2, ${width - 2} 8`
  const length = width * 1.2

  return (
    <svg
      width={width}
      height="16"
      viewBox={`0 0 ${width} 16`}
      fill="none"
      className={className}
      style={{ overflow: 'visible' }}
    >
      <motion.path
        d={path}
        stroke={color}
        strokeWidth="3.5"
        strokeLinecap="round"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 0.8, ease: 'easeInOut', delay: 0.5 }}
      />
    </svg>
  )
}
