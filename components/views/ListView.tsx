'use client'

import { useMemo } from 'react'
import { useTodoStore } from '@/store/todoStore'
import { TaskItem } from '@/components/tasks/TaskItem'
import { AddTaskBar } from '@/components/tasks/AddTaskBar'
import { EmptyState } from '@/components/shared/EmptyState'

interface ListViewProps {
  listId: string
}

export function ListView({ listId }: ListViewProps) {
  const { tasks, lists, showCompleted } = useTodoStore()
  const list = lists.find((l) => l.id === listId)

  const items = useMemo(
    () => tasks.filter((t) => t.listId === listId).sort((a, b) => a.order - b.order),
    [tasks, listId]
  )

  const open = items.filter((t) => !t.completed)
  const done = items.filter((t) => t.completed)
  const pct = items.length ? (done.length / items.length) * 100 : 0

  if (!list) {
    return (
      <div className="px-5 py-4 max-w-lg mx-auto">
        <p className="text-ink-muted text-sm">List not found.</p>
      </div>
    )
  }

  return (
    <div className="px-5 py-4 pb-24 max-w-lg mx-auto md:pb-6 md:max-w-2xl">
      {/* List header */}
      <div className="mb-[22px]">
        <div className="flex items-center gap-2.5 mb-2.5">
          <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: list.color }} />
          <h1 className="font-display font-medium text-[28px] text-ink-primary flex-1 leading-tight tracking-tight">
            {list.name}
          </h1>
          <span className="font-mono text-[12px] text-ink-muted">{items.length} task{items.length === 1 ? '' : 's'}</span>
        </div>
        <div className="flex items-center gap-2.5">
          <div className="flex-1 h-1 bg-ink-faint rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{ width: `${pct}%`, background: list.color }}
            />
          </div>
          <span className="font-mono text-[11px] text-ink-muted">{done.length} done</span>
        </div>
      </div>

      <AddTaskBar defaultListId={listId} />

      {items.length === 0 ? (
        <EmptyState title="No tasks in this list yet." sub="Tap + to add one." />
      ) : (
        <>
          {open.map((t) => <TaskItem key={t.id} task={t} />)}
          {showCompleted && done.length > 0 && (
            <>
              <div className="flex items-baseline gap-2 text-[11px] uppercase tracking-[0.12em] font-medium mt-6 pb-1.5 border-b border-ink-faint text-ink-muted">
                Completed <span className="text-ink-faint">·</span>
                <span className="normal-case tracking-normal font-mono">{done.length}</span>
              </div>
              {done.map((t) => <TaskItem key={t.id} task={t} />)}
            </>
          )}
        </>
      )}
    </div>
  )
}
