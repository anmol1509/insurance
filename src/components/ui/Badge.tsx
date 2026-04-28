import { cn } from '@/lib/utils'

type BadgeVariant =
  | 'motor'
  | 'medical'
  | 'travel'
  | 'business'
  | 'status-active'
  | 'status-expiring'
  | 'status-expired'
  | 'status-pending'
  | 'promo'
  | 'default'

interface BadgeProps {
  variant?: BadgeVariant
  children: React.ReactNode
  className?: string
}

const variantStyles: Record<BadgeVariant, string> = {
  motor:           'bg-motor-50 text-motor-700 border border-motor-100',
  medical:         'bg-medical-50 text-medical-700 border border-medical-100',
  travel:          'bg-travel-50 text-travel-700 border border-travel-100',
  business:        'bg-business-50 text-business-700 border border-business-100',
  'status-active': 'bg-[#DCFCE7] text-[#166534]',
  'status-expiring':'bg-[#FEF9C3] text-[#854D0E]',
  'status-expired': 'bg-[#FEE2E2] text-[#991B1B]',
  'status-pending': 'bg-[#EFF6FF] text-[#1E40AF]',
  promo:           'bg-orange-50 text-orange-600',
  default:         'bg-[var(--surface-raised)] text-[var(--text-secondary)] border border-[var(--border-default)]',
}

export default function Badge({ variant = 'default', children, className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 font-sans font-semibold text-[11px] uppercase tracking-[0.05em] px-2.5 py-1 rounded-full',
        variantStyles[variant],
        className
      )}
    >
      {children}
    </span>
  )
}
