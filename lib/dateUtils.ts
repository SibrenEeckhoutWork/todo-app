import {
  isToday,
  isTomorrow,
  isBefore,
  startOfDay,
  parseISO,
  differenceInCalendarDays,
  format,
} from 'date-fns'

export interface DueInfo {
  label: string
  variant: 'overdue' | 'today' | 'soon' | 'future'
}

export function getDueInfo(dueDate: string): DueInfo {
  const d = parseISO(dueDate)
  const now = startOfDay(new Date())

  if (isBefore(d, now)) return { label: 'Overdue', variant: 'overdue' }
  if (isToday(d))       return { label: 'Today',    variant: 'today' }
  if (isTomorrow(d))    return { label: 'Tomorrow', variant: 'soon' }

  const diff = differenceInCalendarDays(d, now)
  if (diff < 7) return { label: format(d, 'EEEE'), variant: 'future' }
  return { label: format(d, 'd MMM'), variant: 'future' }
}

export function formatDateLong(date: Date): string {
  return format(date, 'EEEE, d MMMM')
}

export function formatDateGroupHeader(isoDate: string): { label: string; meta: string } {
  const d = parseISO(isoDate)
  const now = startOfDay(new Date())
  const diff = differenceInCalendarDays(d, now)

  if (diff === 0) return { label: 'Today',    meta: formatDateLong(d) }
  if (diff === 1) return { label: 'Tomorrow', meta: format(d, 'd MMMM') }
  return { label: format(d, 'EEEE'), meta: format(d, 'd MMMM') }
}

export function formatTime(time: string): string {
  const [h, m] = time.split(':').map(Number)
  const period = h >= 12 ? 'PM' : 'AM'
  const hour = h % 12 || 12
  return `${hour}:${String(m).padStart(2, '0')} ${period}`
}
