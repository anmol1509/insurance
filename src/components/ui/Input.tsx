'use client'
import { motion, AnimatePresence } from 'framer-motion'
import { XCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { InputHTMLAttributes, forwardRef } from 'react'
import React from 'react'

interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'prefix'> {
  label?: string
  error?: string
  required?: boolean
  prefix?: 'naira' | 'phone' | string
  suffix?: string
  productColor?: string
  hint?: string
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      required,
      prefix,
      suffix,
      productColor = 'var(--green-700)',
      hint,
      className,
      id,
      ...props
    },
    ref
  ) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-')

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="font-sans font-semibold text-xs text-[var(--text-secondary)]"
          >
            {label}
            {required && (
              <span className="text-[var(--error)] ml-0.5">*</span>
            )}
          </label>
        )}

        <div className="relative flex items-center">
          {prefix === 'naira' && (
            <span className="absolute left-3 text-[var(--text-muted)] font-sans text-sm pointer-events-none z-10">
              ₦
            </span>
          )}
          {prefix === 'phone' && (
            <div className="absolute left-0 h-full flex items-center px-3 bg-[var(--surface-raised)] border-r border-[var(--border-medium)] rounded-l-[var(--radius-md)] text-[var(--text-secondary)] font-sans font-medium text-sm z-10 whitespace-nowrap">
              +234
            </div>
          )}
          {prefix && prefix !== 'naira' && prefix !== 'phone' && (
            <span className="absolute left-3 text-[var(--text-muted)] font-sans text-sm pointer-events-none z-10">
              {prefix}
            </span>
          )}

          <input
            ref={ref}
            id={inputId}
            className={cn(
              'h-12 w-full bg-[var(--surface)] border-[1.5px] border-[var(--border-medium)] rounded-[var(--radius-md)] px-4 font-sans text-[15px] text-[var(--text-primary)] placeholder:text-[var(--text-subtle)] transition-all duration-[var(--transition-base)] outline-none',
              'focus:border-[var(--green-700)] focus:shadow-[0_0_0_3px_rgba(10,92,54,0.1)]',
              error && 'border-[var(--error)] focus:border-[var(--error)] focus:shadow-[0_0_0_3px_rgba(239,68,68,0.1)]',
              prefix === 'naira' && 'pl-8',
              prefix === 'phone' && 'pl-16',
              (prefix && prefix !== 'naira' && prefix !== 'phone') && 'pl-8',
              suffix && 'pr-12',
              props.disabled && 'bg-[var(--surface-sunken)] opacity-60 cursor-not-allowed',
              className
            )}
            {...props}
            /* Format Nigerian numbers as XXX XXX XXXX while typing */
            value={prefix === 'phone' && typeof props.value === 'string'
              ? props.value.replace(/\D/g, '').replace(/(\d{3})(\d{3})(\d{0,4})/, '$1 $2 $3').trim()
              : props.value
            }
            onChange={prefix === 'phone' && props.onChange
              ? (e) => {
                  const stripped = e.target.value.replace(/\D/g, '').slice(0, 10)
                  const fakeEvent = { ...e, target: { ...e.target, value: stripped } }
                  props.onChange!(fakeEvent as React.ChangeEvent<HTMLInputElement>)
                }
              : props.onChange
            }
          />

          {suffix && (
            <span className="absolute right-3 text-[var(--text-muted)] font-sans text-sm pointer-events-none">
              {suffix}
            </span>
          )}
        </div>

        {hint && !error && (
          <p className="font-sans text-xs text-[var(--text-subtle)]">{hint}</p>
        )}

        <AnimatePresence>
          {error && (
            <motion.p
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="flex items-center gap-1 font-sans text-xs text-[var(--error)] overflow-hidden"
            >
              <XCircle className="w-3.5 h-3.5 shrink-0" />
              {error}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    )
  }
)

Input.displayName = 'Input'
export default Input
