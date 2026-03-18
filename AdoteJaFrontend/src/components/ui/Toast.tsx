import type { ToastType } from '../../contexts/ToastContext'

interface ToastItemProps {
  message: string
  type: ToastType
}

export function ToastItem({ message, type }: ToastItemProps) {
  return (
    <div
      className={`font-body text-sm px-5 py-3 rounded-2xl shadow-lg text-white pointer-events-auto transition-all
        ${type === 'success' ? 'bg-floresta-500' :
          type === 'error'   ? 'bg-red-500'      :
                               'bg-carbon-800'}`}
    >
      {message}
    </div>
  )
}
