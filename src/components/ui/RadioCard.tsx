'use client'
import { motion, AnimatePresence } from 'framer-motion'
import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'

interface RadioCardProps {
  label: string
  subLabel?: string
  priceHint?: string
  selected?: boolean
  onClick?: () => void
  productColor?: string
  productColorBg?: string
  className?: string
}

export default function RadioCard({
  label,
  subLabel,
  priceHint,
  selected = false,
  onClick,
  productColor = 'var(--green-700)',
  productColorBg = 'var(--green-50)',
  className,
}: RadioCardProps) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileTap={{ scale: 0.98 }}
      className={cn(
        'relative border-[1.5px] rounded-[var(--radius-lg)] p-4 cursor-pointer flex items-center gap-3.5 text-left transition-all duration-[var(--transition-base)] w-full',
        selected
          ? 'border-current bg-[var(--bg-selected)]'
          : 'border-[var(--border-default)] bg-white hover:border-[var(--border-strong)] hover:bg-[var(--surface-raised)]',
        className
      )}
      style={
        selected
          ? {
              borderColor: productColor,
              backgroundColor: productColorBg,
              '--bg-selected': productColorBg,
            } as React.CSSProperties
          : {}
      }
    >
      {/* Radio circle */}
      <div
        className="shrink-0 w-5 h-5 rounded-full border-[1.5px] flex items-center justify-center transition-all duration-150"
        style={
          selected
            ? { borderColor: productColor, backgroundColor: productColor }
            : { borderColor: 'var(--border-medium)' }
        }
      >
        {selected && <div className="w-2 h-2 rounded-full bg-white" />}
      </div>

      {/* Content */}
      <div className="flex-1">
        <p className="font-sans font-medium text-sm text-[var(--text-primary)]">{label}</p>
        {subLabel && (
          <p className="font-sans text-xs text-[var(--text-muted)] mt-0.5">{subLabel}</p>
        )}
        {priceHint && (
          <p className="font-sans font-medium text-[13px] mt-1" style={{ color: productColor }}>
            {priceHint}
          </p>
        )}
      </div>

      {/* Selected checkmark badge */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            transition={{ type: 'spring', stiffness: 400, damping: 20 }}
            className="absolute top-2 right-2 w-[18px] h-[18px] rounded-full flex items-center justify-center"
            style={{ backgroundColor: productColor }}
          >
            <Check className="w-2.5 h-2.5 text-white" strokeWidth={3} />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.button>
  )
}
