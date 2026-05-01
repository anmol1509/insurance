'use client'
import { motion } from 'framer-motion'

interface PhoneFrameProps {
  children: React.ReactNode
  animate?: boolean
  className?: string
}

export default function PhoneFrame({ children, animate = true, className }: PhoneFrameProps) {
  return (
    <motion.div
      animate={animate ? { y: [0, -10, 0] } : {}}
      transition={animate ? { duration: 3, repeat: Infinity, ease: 'easeInOut' } : {}}
      className={className}
      style={{
        width: '260px',
        backgroundColor: '#1C1C1E',
        borderRadius: '44px',
        padding: '14px',
        boxShadow:
          '0 40px 80px rgba(0,0,0,0.4), inset 0 0 0 1px rgba(255,255,255,0.1)',
      }}
    >
      {/* Notch */}
      <div
        style={{
          width: '100px',
          height: '28px',
          backgroundColor: '#000',
          borderRadius: '16px',
          margin: '0 auto 8px',
        }}
      />
      {/* Screen */}
      <div
        style={{
          backgroundColor: 'white',
          borderRadius: '32px',
          overflow: 'hidden',
          height: '440px',
        }}
      >
        {children}
      </div>
    </motion.div>
  )
}
