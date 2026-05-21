'use client'

import { useMemo } from 'react'
import { useTodoStore } from '@/store/todoStore'
import { inboxTasks } from '@/lib/filters'
import { TaskItem } from '@/components/tasks/TaskItem'
import { AddTaskBar } from '@/components/tasks/AddTaskBar'
import { EmptyState } from '@/components/shared/EmptyState'

export function InboxView() {
  const tasks = useTodoStore((s) => s.tasks)
  const showCompleted = useTodoStore((s) => s.showCompleted)

  const inbox = useMemo(() => inboxTasks(tasks), [tasks])
  const visible = showCompleted ? inbox : inbox.filter((t) => !t.completed)
  const openCount = inbox.filter((t) => !t.completed).length

  return (
    <div className="px-5 py-4 pb-24 max-w-lg mx-auto md:pb-6 md:max-w-2xl">
      <div className="mb-[18px]">
        <h1 className="font-display font-semibold text-[32px] text-ink-primary leading-tight tracking-tight">
          Inbox
        </h1>
        <p className="font-mono text-[12px] text-ink-muted mt-1.5">
          {openCount} unscheduled
        </p>
      </div>

      <AddTaskBar />

      {visible.length === 0 ? (
        <EmptyState title="Your inbox is clear." sub="Capture anything on your mind." />
      ) : (
        visible.map((t) => <TaskItem key={t.id} task={t} showList />)
      )}
    </div>
  )
}
