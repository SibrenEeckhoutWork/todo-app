import type { List, Tag, Task, Subtask } from './types'

export const SEED_LISTS: List[] = [
  { id: 'work',     name: 'Work',     color: '#2563a8', icon: 'briefcase',    order: 0, createdAt: '2026-01-01T00:00:00.000Z' },
  { id: 'personal', name: 'Personal', color: '#4a7c59', icon: 'user',         order: 1, createdAt: '2026-01-01T00:00:00.000Z' },
  { id: 'shopping', name: 'Shopping', color: '#d97706', icon: 'shopping-bag', order: 2, createdAt: '2026-01-01T00:00:00.000Z' },
]

export const SEED_TAGS: Tag[] = [
  { id: 'urgent',    name: 'urgent',    color: '#fecaca', textColor: '#9b2c2c' },
  { id: 'waiting',   name: 'waiting',   color: '#ddd6fe', textColor: '#5b21b6' },
  { id: 'groceries', name: 'groceries', color: '#bbf7d0', textColor: '#166534' },
  { id: 'idea',      name: 'idea',      color: '#fde68a', textColor: '#854d0e' },
  { id: 'family',    name: 'family',    color: '#bfdbfe', textColor: '#1e3a8a' },
]

const REF = new Date(2026, 4, 20) // May 20 2026

function dOff(days: number, hour = 9, minute = 0): string {
  const d = new Date(REF)
  d.setDate(d.getDate() + days)
  d.setHours(hour, minute, 0, 0)
  return d.toISOString()
}

function isoDate(days: number): string {
  const d = new Date(REF)
  d.setDate(d.getDate() + days)
  return d.toISOString().split('T')[0]
}

function isoTime(hour: number, minute = 0): string {
  return `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`
}

function task(t: Omit<Task, 'createdAt' | 'updatedAt'> & { createdDays?: number }): Task {
  return {
    notes: '',
    recurrence: undefined,
    subtasks: [],
    ...t,
    createdAt: dOff(t.createdDays ?? -3),
    updatedAt: dOff(t.createdDays ?? -3),
  }
}

export const SEED_TASKS: Task[] = [
  task({ id: 'task-1',  title: 'Reply to Maya about the design crit',   completed: false, priority: 'high',   listId: 'work',     tagIds: ['urgent'],     dueDate: isoDate(0),  dueTime: isoTime(11), order: 0 }),
  task({ id: 'task-2',  title: 'Review Q2 design system PR',            completed: false, priority: 'medium', listId: 'work',     tagIds: [],             dueDate: isoDate(0),  dueTime: isoTime(15), order: 1,
    notes: 'Especially the typography tokens — check the Lora weights.',
    subtasks: [
      { id: 'st-21', title: 'Pull latest from main', completed: true  },
      { id: 'st-22', title: 'Run visual regression',  completed: false },
      { id: 'st-23', title: 'Leave inline comments',  completed: false },
    ] as Subtask[],
  }),
  task({ id: 'task-12', title: 'Pay credit card bill',                  completed: false, priority: 'high',   listId: 'personal', tagIds: ['urgent'],     dueDate: isoDate(0),  dueTime: isoTime(23), order: 2, recurrence: { frequency: 'monthly', interval: 1 } }),
  task({ id: 'task-4',  title: 'Call dentist about appointment',        completed: false, priority: 'low',    listId: 'personal', tagIds: ['waiting'],    dueDate: isoDate(-2), dueTime: isoTime(10), order: 3 }),
  task({ id: 'task-3',  title: 'Buy weekly groceries',                  completed: false, priority: 'none',   listId: 'shopping', tagIds: ['groceries'],  dueDate: isoDate(1),  dueTime: isoTime(18), order: 4, recurrence: { frequency: 'weekly', interval: 1 },
    subtasks: [
      { id: 'st-31', title: 'Milk',         completed: false },
      { id: 'st-32', title: 'Bread',        completed: false },
      { id: 'st-33', title: 'Eggs',         completed: true  },
      { id: 'st-34', title: 'Coffee beans', completed: false },
    ] as Subtask[],
  }),
  task({ id: 'task-11', title: 'Stand-up notes for Thursday',           completed: false, priority: 'medium', listId: 'work',     tagIds: [],             dueDate: isoDate(1),  dueTime: isoTime(9),  order: 5, createdDays: -1 }),
  task({ id: 'task-5',  title: 'Weekly journal review',                 completed: false, priority: 'none',   listId: 'personal', tagIds: [],             dueDate: isoDate(2),  dueTime: isoTime(20), order: 6, recurrence: { frequency: 'weekly', interval: 1 }, createdDays: -1 }),
  task({ id: 'task-7',  title: 'Draft proposal for new project',        completed: false, priority: 'high',   listId: 'work',     tagIds: [],             dueDate: isoDate(3),  dueTime: isoTime(17), order: 7, createdDays: -1 }),
  task({ id: 'task-10', title: 'Order new desk lamp',                   completed: false, priority: 'none',   listId: 'shopping', tagIds: [],             dueDate: isoDate(4),  dueTime: isoTime(12), order: 8, createdDays: -1 }),
  task({ id: 'task-8',  title: 'Book flights for July trip',            completed: false, priority: 'medium', listId: 'personal', tagIds: ['family'],     dueDate: isoDate(5),  dueTime: isoTime(10), order: 9, createdDays: -1 }),
  task({ id: 'task-14', title: 'Renew library card',                    completed: false, priority: 'low',    listId: 'personal', tagIds: [],             dueDate: isoDate(7),  dueTime: isoTime(12), order: 10, createdDays: -1 }),
  task({ id: 'task-9',  title: 'Read "The Design of Everyday Things"',  completed: false, priority: 'none',   listId: 'personal', tagIds: ['idea'],       order: 11, createdDays: -1 }),
  task({ id: 'task-13', title: 'Sketch ideas for app icon',             completed: false, priority: 'none',   listId: 'work',     tagIds: ['idea'],       order: 12, createdDays: -1 }),
  { ...task({ id: 'task-6', title: 'Pick up dry cleaning', completed: true, priority: 'none', listId: 'personal', tagIds: [], dueDate: isoDate(-1), dueTime: isoTime(17), order: 13 }),
    completedAt: dOff(-1, 17, 30), updatedAt: dOff(-1, 17, 30) },
]
