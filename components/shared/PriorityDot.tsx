import type { Priority } from '@/lib/types'

const colorClass: Record<Priority, string> = {
  high:   'bg-priority-high',
  medium: 'bg-priority-medium',
  low:    'bg-priority-low',
  none:   'hidden',
}

export function PriorityDot({ priority }: { priority: Priority }) {
  return (
    <span
      className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${colorClass[priority]}`}
      aria-label={`${priority} priority`}
    />
  )
}
