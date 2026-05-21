export type Priority = 'high' | 'medium' | 'low' | 'none'

export interface RecurrenceRule {
  frequency: 'daily' | 'weekly' | 'monthly' | 'yearly'
  interval: number
  daysOfWeek?: number[]  // 0=Sun … 6=Sat
  endDate?: string       // ISO date YYYY-MM-DD
}

export interface Tag {
  id: string
  name: string
  color: string  // hex background
  textColor: string  // hex text
}

export interface List {
  id: string
  name: string
  color: string  // hex
  icon: string   // lucide icon name
  order: number
  createdAt: string  // ISO
}

export interface Subtask {
  id: string
  title: string
  completed: boolean
}

export interface Task {
  id: string
  listId: string | null  // null = Inbox
  title: string
  notes: string
  completed: boolean
  completedAt?: string   // ISO datetime
  priority: Priority
  dueDate?: string       // ISO date YYYY-MM-DD
  dueTime?: string       // HH:MM
  tagIds: string[]
  subtasks: Subtask[]
  recurrence?: RecurrenceRule
  order: number
  createdAt: string
  updatedAt: string
}

export interface ExportPayload {
  lists: List[]
  tags: Tag[]
  tasks: Task[]
  subtasks: { taskId: string; id: string; title: string; completed: boolean }[]
}
