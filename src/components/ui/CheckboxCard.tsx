'use client'
import { motion, AnimatePresence } from 'framer-motion'
import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'

interface CheckboxCardProps {
  label: string
  subLabel?: string
  priceTag?: string
  checked?: boolean
  onChange?: (checked: boolean) => void
  productColor?: string
  productColorBg?: string
  className?: string
  icon?: React.ReactNode
}

export default function CheckboxCard({
  label,
  subLabel,
  priceTag,
  checked = false,
  onChange,
  productColor = 'var(--green-700)',
  productColorBg = 'var(--green-50)',
  className,
  icon,
}: CheckboxCardProps) {
  return (
    <motion.button
      type="button"
      onClick={() => onChange?.(!checked)}
      whileTap={{ scale: 0.99 }}
      className={cn(
        'relative border-[1.5px] rounded-[var(--radius-lg)] p-4 cursor-pointer flex items-center gap-3.5 text-left transition-all duration-[var(--transition-base)] w-full',
        checked
          ? 'border-current'
          : 'border-[var(--border-default)] bg-white hover:border-[var(--border-strong)] hover:bg-[var(--surface-raised)]',
        className
      )}
      style={
        checked
          ? {
              borderColor: productColor,
              backgroundColor: productColorBg,
            }
          : {}
      }
    >
      {/* Checkbox square */}
      <div
        className="shrink-0 w-5 h-5 rounded-[5px] border-[1.5px] flex items-center justify-center transition-all duration-150"
        style={
          checked
            ? { borderColor: productColor, backgroundColor: productColor }
            : { borderColor: 'var(--border-medium)' }
        }
      >
        {checked && <Check className="w-3 h-3 text-white" strokeWidth={3} />}
      </div>

      {/* Optional icon */}
      {icon && <div className="shrink-0">{icon}</div>}

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p className="font-sans font-medium text-sm text-[var(--text-primary)]">{label}</p>
        {subLabel && (
          <p className="font-sans text-xs text-[var(--text-muted)] mt-0.5">{subLabel}</p>
        )}
      </div>

      {/* Price tag */}
      {priceTag && (
        <span className="shrink-0 font-sans font-medium text-[13px]" style={{ color: productColor }}>
          {priceTag}
        </span>
      )}
    </motion.button>
  )
}
