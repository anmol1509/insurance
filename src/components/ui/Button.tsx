'use client'
import { motion } from 'framer-motion'
import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { ReactNode } from 'react'

type Variant = 'primary' | 'primary-green' | 'secondary' | 'ghost' | 'danger'
type Size = 'sm' | 'md' | 'lg'

interface ButtonProps {
  variant?: Variant
  size?: Size
  loading?: boolean
  disabled?: boolean
  iconLeft?: ReactNode
  iconRight?: ReactNode
  children: ReactNode
  onClick?: () => void
  type?: 'button' | 'submit' | 'reset'
  className?: string
  productColor?: string
  fullWidth?: boolean
}

const sizeClasses: Record<Size, string> = {
  sm: 'h-10 px-4 text-sm',
  md: 'h-12 px-6 text-[15px]',
  lg: 'h-14 px-8 text-base',
}

const variantClasses: Record<Variant, string> = {
  primary:
    'bg-orange-500 text-white border-none hover:bg-orange-600 shadow-sm',
  'primary-green':
    'bg-[var(--green-700)] text-white border-none hover:bg-[var(--green-800)]',
  secondary:
    'bg-white border border-[var(--border-medium)] text-[var(--text-secondary)] hover:bg-[var(--surface-raised)] hover:border-[var(--border-strong)]',
  ghost:
    'bg-transparent border border-[var(--border-medium)] text-[var(--text-secondary)] hover:bg-[var(--surface-raised)]',
  danger:
    'bg-[var(--error)] text-white border-none hover:bg-red-600',
}

export default function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  iconLeft,
  iconRight,
  children,
  onClick,
  type = 'button',
  className,
  fullWidth,
}: ButtonProps) {
  const isDisabled = disabled || loading

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={isDisabled}
      whileTap={isDisabled ? {} : { scale: 0.97 }}
      whileHover={
        isDisabled
          ? {}
          : variant === 'primary'
          ? { y: -1 }
          : {}
      }
      transition={{ type: 'spring', stiffness: 400, damping: 17 }}
      className={cn(
        'inline-flex items-center justify-center gap-2 font-sans font-semibold rounded-[var(--radius-xl)] transition-all duration-[var(--transition-base)] cursor-pointer select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
        sizeClasses[size],
        variantClasses[variant],
        isDisabled && 'opacity-60 cursor-not-allowed',
        fullWidth && 'w-full',
        className
      )}
    >
      {loading ? (
        <Loader2 className="w-5 h-5 animate-spin" />
      ) : (
        <>
          {iconLeft && <span className="shrink-0">{iconLeft}</span>}
          {children}
          {iconRight && <span className="shrink-0">{iconRight}</span>}
        </>
      )}
    </motion.button>
  )
}
