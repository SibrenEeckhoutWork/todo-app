import { CalendarIcon } from 'lucide-react'
import { getDueInfo } from '@/lib/dateUtils'

interface DueChipProps {
  dueDate: string
}

const variantClass = {
  overdue: 'text-priority-high font-medium',
  today:   'text-priority-medium font-medium',
  soon:    'text-ink-secondary',
  future:  'text-ink-secondary',
}

export function DueChip({ dueDate }: DueChipProps) {
  const info = getDueInfo(dueDate)
  return (
    <span className={`inline-flex items-center gap-1 font-mono text-[11px] whitespace-nowrap ${variantClass[info.variant]}`}>
      <CalendarIcon size={11} />
      {info.label}
    </span>
  )
}
