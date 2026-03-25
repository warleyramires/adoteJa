import { cn } from '../../lib/utils'

type BadgeVariant = 'ambar' | 'azul' | 'pedra' | 'neutral'

interface BadgeProps {
  children: React.ReactNode
  variant?: BadgeVariant
  className?: string
}

const variantClasses: Record<BadgeVariant, string> = {
  ambar:   'bg-primary-fixed text-on-primary-fixed-variant',
  azul:    'bg-secondary-fixed text-on-secondary-fixed',
  pedra:   'bg-surface-container text-on-surface-variant',
  neutral: 'bg-surface-container-high text-on-surface-variant',
}

export function Badge({ children, variant = 'neutral', className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center font-body text-xs font-semibold px-3 py-1 rounded-full',
        variantClasses[variant],
        className
      )}
    >
      {children}
    </span>
  )
}
