import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'

type StepState = 'completed' | 'active' | 'upcoming'

interface StepCircleProps {
  state: StepState
  number: number
  productColor?: string
  className?: string
}

export default function StepCircle({
  state,
  number,
  productColor = 'var(--green-700)',
  className,
}: StepCircleProps) {
  return (
    <div
      className={cn(
        'shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300',
        className
      )}
      style={
        state === 'completed'
          ? { backgroundColor: 'var(--green-700)', border: 'none' }
          : state === 'active'
          ? { backgroundColor: 'white', border: `2px solid ${productColor}` }
          : {
              backgroundColor: 'var(--surface-raised)',
              border: '1.5px solid var(--border-default)',
            }
      }
    >
      {state === 'completed' ? (
        <Check className="w-3.5 h-3.5 text-white" strokeWidth={2.5} />
      ) : (
        <span
          className="font-display font-bold text-sm"
          style={
            state === 'active'
              ? { color: productColor }
              : { color: 'var(--text-muted)' }
          }
        >
          {number}
        </span>
      )}
    </div>
  )
}
