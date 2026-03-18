import { cn } from '../../lib/utils'

type BadgeVariant = 'terracota' | 'floresta' | 'areia' | 'neutral'

interface BadgeProps {
  children: React.ReactNode
  variant?: BadgeVariant
  className?: string
}

const variantClasses: Record<BadgeVariant, string> = {
  terracota: 'bg-terracota-100 text-terracota-700',
  floresta:  'bg-floresta-100 text-floresta-600',
  areia:     'bg-areia-200 text-carbon-800',
  neutral:   'bg-creme-300 text-carbon-800',
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
