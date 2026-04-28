'use client'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface ToggleSwitchProps {
  checked: boolean
  onChange: (checked: boolean) => void
  label?: string
  productColor?: string
  className?: string
}

export default function ToggleSwitch({
  checked,
  onChange,
  label,
  productColor = 'var(--green-700)',
  className,
}: ToggleSwitchProps) {
  return (
    <div className={cn('flex items-center gap-3', className)}>
      <span
        className={cn(
          'font-sans font-medium text-sm transition-colors',
          checked ? 'text-[var(--text-subtle)]' : 'text-[var(--text-primary)]'
        )}
      >
        No
      </span>

      <button
        type="button"
        onClick={() => onChange(!checked)}
        className="relative w-11 h-6 rounded-full transition-colors duration-200 focus-visible:outline-none flex-shrink-0"
        style={{ backgroundColor: checked ? productColor : 'var(--border-medium)' }}
        aria-checked={checked}
        role="switch"
      >
        <motion.div
          className="absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-sm"
          animate={{ x: checked ? 22 : 2 }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        />
      </button>

      <span
        className={cn(
          'font-sans font-medium text-sm transition-colors',
          checked ? 'text-[var(--text-primary)]' : 'text-[var(--text-subtle)]'
        )}
        style={checked ? { color: productColor } : {}}
      >
        Yes
      </span>

      {label && (
        <span className="font-sans text-sm text-[var(--text-muted)] ml-1">{label}</span>
      )}
    </div>
  )
}
