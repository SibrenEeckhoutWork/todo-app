'use client'

import { useMemo } from 'react'
import { useTodoStore } from '@/store/todoStore'
import { TaskItem } from '@/components/tasks/TaskItem'
import { AddTaskBar } from '@/components/tasks/AddTaskBar'
import { EmptyState } from '@/components/shared/EmptyState'

export function TagView({ tagId }: { tagId: string }) {
  const { tasks, tags, showCompleted } = useTodoStore()
  const tag = tags.find((t) => t.id === tagId)
  const items = useMemo(
    () => tasks.filter((t) => t.tagIds.includes(tagId)),
    [tasks, tagId]
  )
  const visible = showCompleted ? items : items.filter((t) => !t.completed)

  if (!tag) return (
    <div className="px-5 py-4"><p className="text-ink-muted text-sm">Tag not found.</p></div>
  )

  return (
    <div className="px-5 py-4 pb-24 max-w-lg mx-auto md:pb-6 md:max-w-2xl">
      <div className="mb-[18px]">
        <h1 className="font-display font-semibold text-[32px] text-ink-primary leading-tight tracking-tight flex items-center gap-3">
          <span className="w-4 h-4 rotate-45 flex-shrink-0" style={{ background: tag.color }} />
          {tag.name}
        </h1>
        <p className="font-mono text-[12px] text-ink-muted mt-1.5">
          {items.filter((t) => !t.completed).length} open
        </p>
      </div>
      <AddTaskBar />
      {visible.length === 0 ? (
        <EmptyState title={`Nothing tagged ${tag.name}.`} />
      ) : (
        visible.map((t) => <TaskItem key={t.id} task={t} showList />)
      )}
    </div>
  )
}
