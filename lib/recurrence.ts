import {
  addDays,
  addWeeks,
  addMonths,
  addYears,
  parseISO,
  isBefore,
  format,
} from 'date-fns'
import type { Task, RecurrenceRule } from './types'

function nextDate(rule: RecurrenceRule, from: Date): Date {
  switch (rule.frequency) {
    case 'daily':   return addDays(from,   rule.interval)
    case 'weekly':  return addWeeks(from,  rule.interval)
    case 'monthly': return addMonths(from, rule.interval)
    case 'yearly':  return addYears(from,  rule.interval)
  }
}

export function spawnNextOccurrence(task: Task): Task | null {
  if (!task.recurrence || !task.dueDate) return null

  const from = parseISO(task.dueDate)
  const next = nextDate(task.recurrence, from)

  if (task.recurrence.endDate) {
    const end = parseISO(task.recurrence.endDate)
    if (isBefore(end, next)) return null
  }

  return {
    ...task,
    id: crypto.randomUUID(),
    completed: false,
    completedAt: undefined,
    dueDate: format(next, 'yyyy-MM-dd'),
    subtasks: task.subtasks.map((s) => ({ ...s, completed: false })),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
}

export function recurrenceLabel(rule: RecurrenceRule): string {
  const n = rule.interval
  switch (rule.frequency) {
    case 'daily':
      return n === 1 ? 'Daily' : `Every ${n} days`
    case 'weekly':
      if (rule.daysOfWeek?.length) {
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
        return `Every ${rule.daysOfWeek.map((d) => days[d]).join(', ')}`
      }
      return n === 1 ? 'Weekly' : `Every ${n} weeks`
    case 'monthly':
      return n === 1 ? 'Monthly' : `Every ${n} months`
    case 'yearly':
      return n === 1 ? 'Yearly' : `Every ${n} years`
  }
}
