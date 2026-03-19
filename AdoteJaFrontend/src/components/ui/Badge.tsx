import { cn } from '../../lib/utils'

type BadgeVariant = 'ambar' | 'azul' | 'pedra' | 'neutral'

interface BadgeProps {
  children: React.ReactNode
  variant?: BadgeVariant
  className?: string
}

const variantClasses: Record<BadgeVariant, string> = {
  ambar:   'bg-ambar-100 text-ambar-700',
  azul:    'bg-azul-100 text-azul-600',
  pedra:   'bg-pedra-200 text-carbon-800',
  neutral: 'bg-creme-300 text-carbon-800',
}

export function Badge({ children, variant = 'neutral', className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center font-body text-xs font-medium px-2.5 py-1 rounded-full',
        variantClasses[variant],
        className
      )}
    >
      {children}
    </span>
  )
}
