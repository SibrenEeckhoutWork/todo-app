'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Task, List, Tag, Subtask, ExportPayload, Priority, RecurrenceRule } from '@/lib/types'
import { SEED_LISTS, SEED_TAGS, SEED_TASKS } from '@/lib/seed'
import { spawnNextOccurrence } from '@/lib/recurrence'

interface TodoState {
  lists: List[]
  tasks: Task[]
  tags: Tag[]
  showCompleted: boolean
  selectedTaskId: string | null
  openTask(id: string): void
  closeTask(): void

  // List actions
  addList(list: Omit<List, 'id' | 'createdAt' | 'order'>): void
  updateList(id: string, patch: Partial<List>): void
  deleteList(id: string): void
  reorderLists(ids: string[]): void

  // Task actions
  addTask(task: Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'order'>): void
  updateTask(id: string, patch: Partial<Task>): void
  deleteTask(id: string): void
  completeTask(id: string): void
  reorderTasks(listId: string | null, ids: string[]): void

  // Subtask actions
  addSubtask(taskId: string, title: string): void
  toggleSubtask(taskId: string, subtaskId: string): void
  deleteSubtask(taskId: string, subtaskId: string): void

  // Tag actions
  addTag(tag: Omit<Tag, 'id'>): void
  updateTag(id: string, patch: Partial<Tag>): void
  deleteTag(id: string): void

  // Global
  toggleShowCompleted(): void
  importData(data: ExportPayload): void
  resetAll(): void
}

const now = () => new Date().toISOString()

export const useTodoStore = create<TodoState>()(
  persist(
    (set, get) => ({
      lists: SEED_LISTS,
      tasks: SEED_TASKS,
      tags: SEED_TAGS,
      showCompleted: true,
      selectedTaskId: null,
      openTask: (id) => set({ selectedTaskId: id }),
      closeTask: () => set({ selectedTaskId: null }),

      // ── Lists ─────────────────────────────────────────────────
      addList(list) {
        const maxOrder = get().lists.reduce((m, l) => Math.max(m, l.order), -1)
        set((s) => ({
          lists: [...s.lists, {
            ...list,
            id: crypto.randomUUID(),
            order: maxOrder + 1,
            createdAt: now(),
          }],
        }))
      },
      updateList(id, patch) {
        set((s) => ({ lists: s.lists.map((l) => l.id === id ? { ...l, ...patch } : l) }))
      },
      deleteList(id) {
        set((s) => ({
          lists: s.lists.filter((l) => l.id !== id),
          tasks: s.tasks.map((t) => t.listId === id ? { ...t, listId: null } : t),
        }))
      },
      reorderLists(ids) {
        set((s) => ({
          lists: ids
            .map((id, i) => {
              const l = s.lists.find((x) => x.id === id)
              return l ? { ...l, order: i } : null
            })
            .filter(Boolean) as List[],
        }))
      },

      // ── Tasks ─────────────────────────────────────────────────
      addTask(task) {
        const maxOrder = get().tasks.reduce((m, t) => Math.max(m, t.order), -1)
        set((s) => ({
          tasks: [{
            ...task,
            id: crypto.randomUUID(),
            order: maxOrder + 1,
            createdAt: now(),
            updatedAt: now(),
          }, ...s.tasks],
        }))
      },
      updateTask(id, patch) {
        set((s) => ({
          tasks: s.tasks.map((t) =>
            t.id === id ? { ...t, ...patch, updatedAt: now() } : t
          ),
        }))
      },
      deleteTask(id) {
        set((s) => ({ tasks: s.tasks.filter((t) => t.id !== id) }))
      },
      completeTask(id) {
        const task = get().tasks.find((t) => t.id === id)
        if (!task) return

        const completed = !task.completed
        const patch: Partial<Task> = {
          completed,
          completedAt: completed ? now() : undefined,
          updatedAt: now(),
        }

        set((s) => {
          const tasks = s.tasks.map((t) => t.id === id ? { ...t, ...patch } : t)
          if (completed && task.recurrence) {
            const next = spawnNextOccurrence({ ...task, ...patch })
            if (next) tasks.push(next)
          }
          return { tasks }
        })
      },
      reorderTasks(listId, ids) {
        set((s) => {
          const tasksById: Record<string, Task> = {}
          s.tasks.forEach((t) => { tasksById[t.id] = t })
          const reordered = ids.map((id, i) =>
            tasksById[id] ? { ...tasksById[id], order: i } : null
          ).filter(Boolean) as Task[]
          const untouched = s.tasks.filter((t) => !ids.includes(t.id))
          return { tasks: [...reordered, ...untouched] }
        })
      },

      // ── Subtasks ──────────────────────────────────────────────
      addSubtask(taskId, title) {
        set((s) => ({
          tasks: s.tasks.map((t) =>
            t.id === taskId
              ? {
                  ...t,
                  subtasks: [...t.subtasks, { id: crypto.randomUUID(), title, completed: false }],
                  updatedAt: now(),
                }
              : t
          ),
        }))
      },
      toggleSubtask(taskId, subtaskId) {
        set((s) => ({
          tasks: s.tasks.map((t) =>
            t.id === taskId
              ? {
                  ...t,
                  subtasks: t.subtasks.map((s) =>
                    s.id === subtaskId ? { ...s, completed: !s.completed } : s
                  ),
                  updatedAt: now(),
                }
              : t
          ),
        }))
      },
      deleteSubtask(taskId, subtaskId) {
        set((s) => ({
          tasks: s.tasks.map((t) =>
            t.id === taskId
              ? { ...t, subtasks: t.subtasks.filter((s) => s.id !== subtaskId), updatedAt: now() }
              : t
          ),
        }))
      },

      // ── Tags ──────────────────────────────────────────────────
      addTag(tag) {
        set((s) => ({ tags: [...s.tags, { ...tag, id: crypto.randomUUID() }] }))
      },
      updateTag(id, patch) {
        set((s) => ({ tags: s.tags.map((t) => t.id === id ? { ...t, ...patch } : t) }))
      },
      deleteTag(id) {
        set((s) => ({
          tags: s.tags.filter((t) => t.id !== id),
          tasks: s.tasks.map((t) => ({ ...t, tagIds: t.tagIds.filter((x) => x !== id) })),
        }))
      },

      // ── Global ────────────────────────────────────────────────
      toggleShowCompleted() {
        set((s) => ({ showCompleted: !s.showCompleted }))
      },
      importData(data) {
        const subtasksMap: Record<string, Subtask[]> = {}
        data.subtasks.forEach((s) => {
          subtasksMap[s.taskId] = subtasksMap[s.taskId] ?? []
          subtasksMap[s.taskId].push({ id: s.id, title: s.title, completed: s.completed })
        })
        const tasks = data.tasks.map((t) => ({
          ...t,
          subtasks: subtasksMap[t.id] ?? t.subtasks ?? [],
        }))
        set({ lists: data.lists, tags: data.tags, tasks })
      },
      resetAll() {
        set({ lists: SEED_LISTS, tasks: SEED_TASKS, tags: SEED_TAGS, showCompleted: true })
      },
    }),
    { name: 'todo-store' }
  )
)
