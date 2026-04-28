'use client'
import { useState, useRef, useEffect } from 'react'
import { ChevronDown, Check } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'

interface SelectOption {
  value: string
  label: string
}

interface SelectProps {
  label?: string
  options: SelectOption[]
  value?: string
  onChange?: (value: string) => void
  placeholder?: string
  required?: boolean
  error?: string
  className?: string
  productColor?: string
}

export default function Select({
  label,
  options,
  value,
  onChange,
  placeholder = 'Select an option',
  required,
  error,
  className,
  productColor = 'var(--green-700)',
}: SelectProps) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  const selected = options.find((o) => o.value === value)

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  return (
    <div className={cn('relative flex flex-col gap-1.5', className)} ref={ref}>
      {label && (
        <label className="font-sans font-semibold text-xs text-[var(--text-secondary)]">
          {label}
          {required && <span className="text-[var(--error)] ml-0.5">*</span>}
        </label>
      )}

      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={cn(
          'h-12 w-full bg-[var(--surface)] border-[1.5px] border-[var(--border-medium)] rounded-[var(--radius-md)] px-4 font-sans text-[15px] text-left flex items-center justify-between transition-all duration-[var(--transition-base)] outline-none',
          'hover:border-[var(--border-strong)]',
          open && 'border-[var(--green-700)] shadow-[0_0_0_3px_rgba(10,92,54,0.1)]',
          error && 'border-[var(--error)]',
          !selected && 'text-[var(--text-subtle)]'
        )}
      >
        <span className={selected ? 'text-[var(--text-primary)]' : 'text-[var(--text-subtle)]'}>
          {selected?.label ?? placeholder}
        </span>
        <ChevronDown
          className={cn(
            'w-4 h-4 text-[var(--text-muted)] transition-transform duration-200',
            open && 'rotate-180'
          )}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full mt-1 left-0 right-0 z-50 bg-white rounded-xl shadow-lg border border-[var(--border-default)] max-h-72 overflow-y-auto"
          >
            {options.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => {
                  onChange?.(opt.value)
                  setOpen(false)
                }}
                className={cn(
                  'w-full px-4 py-2.5 text-left font-sans text-sm flex items-center justify-between hover:bg-[var(--surface-raised)] transition-colors',
                  opt.value === value && 'bg-[var(--green-50)] text-[var(--green-700)]'
                )}
              >
                {opt.label}
                {opt.value === value && <Check className="w-4 h-4" />}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {error && (
        <p className="font-sans text-xs text-[var(--error)]">{error}</p>
      )}
    </div>
  )
}
