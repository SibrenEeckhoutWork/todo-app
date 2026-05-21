import {
  isToday,
  isBefore,
  startOfDay,
  parseISO,
  isAfter,
  format,
} from 'date-fns'
import type { Task } from './types'

function dueDate(task: Task): Date | null {
  if (!task.dueDate) return null
  return parseISO(task.dueDate)
}

export function todayTasks(tasks: Task[]): Task[] {
  const now = startOfDay(new Date())
  return tasks.filter((t) => {
    const d = dueDate(t)
    if (!d) return false
    return isToday(d) || isBefore(d, now)
  })
}

export function overdueTasks(tasks: Task[]): Task[] {
  const now = startOfDay(new Date())
  return tasks.filter((t) => {
    const d = dueDate(t)
    if (!d) return false
    return isBefore(d, now) && !isToday(d)
  })
}

export function inboxTasks(tasks: Task[]): Task[] {
  return tasks.filter((t) => !t.listId && !t.dueDate)
}

export function upcomingTasks(tasks: Task[]): Record<string, Task[]> {
  const now = startOfDay(new Date())
  const groups: Record<string, Task[]> = {}

  tasks.forEach((t) => {
    const d = dueDate(t)
    if (!d) return
    if (!isAfter(d, now) && !isToday(d)) return
    const key = format(d, 'yyyy-MM-dd')
    groups[key] = groups[key] ?? []
    groups[key].push(t)
  })

  return groups
}
