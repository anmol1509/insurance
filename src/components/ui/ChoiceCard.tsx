'use client'
import { motion } from 'framer-motion'
import { Check } from 'lucide-react'

interface ChoiceCardProps {
  icon: React.ElementType
  label: string
  sub?: string
  selected?: boolean
  onClick?: () => void
  productColor?: string
  productColorBg?: string
}

/** Icon-led option card used by the opening step of each quote flow. */
export default function ChoiceCard({
  icon: Icon,
  label,
  sub,
  selected = false,
  onClick,
  productColor = 'var(--green-700)',
  productColorBg = 'var(--green-50)',
}: ChoiceCardProps) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.98 }}
      className="relative w-full text-left rounded-2xl border-[1.5px] p-4 flex items-center gap-3.5 transition-colors"
      style={
        selected
          ? { borderColor: productColor, backgroundColor: productColorBg }
          : { borderColor: 'var(--border-default)', backgroundColor: 'white' }
      }
    >
      <span
        className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0 transition-colors"
        style={{ backgroundColor: selected ? productColor : 'var(--surface-raised)' }}
      >
        <Icon className="w-5 h-5" style={{ color: selected ? 'white' : 'var(--text-muted)' }} />
      </span>

      <span className="flex-1 min-w-0">
        <span className="block font-sans font-semibold text-[14px]" style={{ color: 'var(--text-primary)' }}>
          {label}
        </span>
        {sub && (
          <span className="block font-sans text-[12px] mt-0.5" style={{ color: 'var(--text-muted)' }}>
            {sub}
          </span>
        )}
      </span>

      <span
        className="w-5 h-5 rounded-full border-[1.5px] flex items-center justify-center shrink-0 transition-all"
        style={selected
          ? { borderColor: productColor, backgroundColor: productColor }
          : { borderColor: 'var(--border-medium)' }}
      >
        {selected && <Check className="w-3 h-3 text-white" />}
      </span>
    </motion.button>
  )
}
