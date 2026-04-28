'use client'
import { Check } from 'lucide-react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import Button from './Button'

interface PlanCardProps {
  tier: string
  price: string
  period?: string
  description: string
  features: string[]
  featured?: boolean
  productColor?: string
  productColorBg?: string
  onSelect?: () => void
  className?: string
}

export default function PlanCard({
  tier,
  price,
  period = '/year',
  description,
  features,
  featured = false,
  productColor = 'var(--green-700)',
  productColorBg = 'var(--green-50)',
  onSelect,
  className,
}: PlanCardProps) {
  return (
    <div className={cn('relative', className)}>
      {featured && (
        <div
          className="absolute -top-3.5 left-1/2 -translate-x-1/2 font-sans font-semibold text-xs text-white px-4 py-1 rounded-full z-10 whitespace-nowrap"
          style={{ backgroundColor: productColor }}
        >
          Most popular
        </div>
      )}
      <motion.div
        whileHover={{ y: -4 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        className={cn(
          'bg-white rounded-4xl p-7 h-full flex flex-col',
          featured
            ? 'border-2'
            : 'border border-[var(--border-default)]'
        )}
        style={featured ? { borderColor: productColor } : {}}
      >
        <p className="font-sans font-semibold text-[11px] text-[var(--text-muted)] uppercase tracking-[0.07em]">
          {tier}
        </p>

        <div className="mt-3">
          <p className="font-sans text-xs text-[var(--text-subtle)]">From</p>
          <div className="flex items-end gap-1 mt-0.5">
            <span className="font-display font-bold text-[34px] leading-none text-[var(--text-primary)]">
              {price}
            </span>
            <span className="font-sans text-sm text-[var(--text-muted)] mb-1">{period}</span>
          </div>
        </div>

        <div className="my-4 border-b border-[var(--border-subtle)]" />

        <p className="font-sans text-[13px] text-[var(--text-muted)] pb-4 border-b border-[var(--border-subtle)] leading-relaxed">
          {description}
        </p>

        <ul className="mt-4 flex-1 flex flex-col gap-2.5">
          {features.map((f) => (
            <li key={f} className="flex items-start gap-2">
              <div
                className="shrink-0 w-[18px] h-[18px] rounded-full flex items-center justify-center mt-0.5"
                style={{ backgroundColor: productColorBg }}
              >
                <Check
                  className="w-2.5 h-2.5"
                  style={{ color: productColor }}
                  strokeWidth={2.5}
                />
              </div>
              <span className="font-sans text-sm text-[var(--text-secondary)]">{f}</span>
            </li>
          ))}
        </ul>

        <button
          type="button"
          onClick={onSelect}
          className="mt-5 w-full h-[46px] rounded-[var(--radius-xl)] font-sans font-semibold text-sm transition-all duration-200 border-[1.5px]"
          style={
            featured
              ? {
                  backgroundColor: productColor,
                  color: 'white',
                  borderColor: productColor,
                }
              : {
                  backgroundColor: 'transparent',
                  color: productColor,
                  borderColor: productColor,
                }
          }
        >
          {featured ? 'Get this plan' : 'Select plan'}
        </button>
      </motion.div>
    </div>
  )
}
