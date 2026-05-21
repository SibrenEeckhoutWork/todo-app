import Papa from 'papaparse'
import type { List, Tag, Task, ExportPayload } from './types'

type Row = Record<string, string>

export function exportToCSV(data: Pick<ExportPayload, 'tasks' | 'lists' | 'tags'>): string {
  const lines: string[] = []

  lines.push('SECTION,lists')
  lines.push(Papa.unparse(data.lists.map((l) => ({
    id: l.id, name: l.name, color: l.color,
    icon: l.icon, order: l.order, createdAt: l.createdAt,
  }))))

  lines.push('')
  lines.push('SECTION,tags')
  lines.push(Papa.unparse(data.tags.map((t) => ({
    id: t.id, name: t.name, color: t.color, textColor: t.textColor,
  }))))

  lines.push('')
  lines.push('SECTION,tasks')
  lines.push(Papa.unparse(data.tasks.map((t) => ({
    id: t.id, listId: t.listId ?? '', title: t.title, notes: t.notes,
    completed: t.completed, completedAt: t.completedAt ?? '',
    priority: t.priority, dueDate: t.dueDate ?? '', dueTime: t.dueTime ?? '',
    tagIds: t.tagIds.join(';'),
    recurrence: t.recurrence ? JSON.stringify(t.recurrence) : '',
    order: t.order, createdAt: t.createdAt, updatedAt: t.updatedAt,
  }))))

  lines.push('')
  lines.push('SECTION,subtasks')
  const allSubtasks = data.tasks.flatMap((t) =>
    t.subtasks.map((s) => ({ taskId: t.id, id: s.id, title: s.title, completed: s.completed }))
  )
  lines.push(Papa.unparse(allSubtasks))

  return lines.join('\n')
}

export function parseCSV(raw: string): ExportPayload {
  const sections = raw.split(/^SECTION,/m).filter(Boolean)
  const result: ExportPayload = { lists: [], tags: [], tasks: [], subtasks: [] }

  for (const section of sections) {
    const lines = section.trim().split('\n')
    const name = lines[0].trim()
    const body = lines.slice(1).join('\n')
    if (!body.trim()) continue

    const { data } = Papa.parse<Row>(body, { header: true, skipEmptyLines: true })

    if (name === 'lists') {
      result.lists = data.map((r) => ({
        id: r.id, name: r.name, color: r.color,
        icon: r.icon ?? 'list', order: Number(r.order),
        createdAt: r.createdAt,
      })) as List[]
    } else if (name === 'tags') {
      result.tags = data.map((r) => ({
        id: r.id, name: r.name, color: r.color, textColor: r.textColor ?? '#000000',
      })) as Tag[]
    } else if (name === 'tasks') {
      result.tasks = data.map((r) => ({
        id: r.id, listId: r.listId || null, title: r.title, notes: r.notes ?? '',
        completed: r.completed === 'true', completedAt: r.completedAt || undefined,
        priority: r.priority as Task['priority'],
        dueDate: r.dueDate || undefined, dueTime: r.dueTime || undefined,
        tagIds: r.tagIds ? r.tagIds.split(';').filter(Boolean) : [],
        recurrence: r.recurrence ? JSON.parse(r.recurrence) : undefined,
        subtasks: [],
        order: Number(r.order), createdAt: r.createdAt, updatedAt: r.updatedAt,
      })) as Task[]
    } else if (name === 'subtasks') {
      result.subtasks = data.map((r) => ({
        taskId: r.taskId, id: r.id, title: r.title, completed: r.completed === 'true',
      }))
    }
  }

  // Re-attach subtasks to tasks
  for (const sub of result.subtasks) {
    const task = result.tasks.find((t) => t.id === sub.taskId)
    if (task) {
      task.subtasks.push({ id: sub.id, title: sub.title, completed: sub.completed })
    }
  }

  return result
}
