'use client'

import { RefreshCwIcon } from 'lucide-react'
import { Checkbox } from '@/components/shared/Checkbox'
import { PriorityDot } from '@/components/shared/PriorityDot'
import { DueChip } from '@/components/shared/DueChip'
import { TagChip } from '@/components/shared/TagChip'
import { useTodoStore } from '@/store/todoStore'
import type { Task } from '@/lib/types'

interface TaskItemProps {
  task: Task
  showList?: boolean
}

export function TaskItem({ task, showList }: TaskItemProps) {
  const { completeTask, openTask, tags, lists } = useTodoStore()

  const visibleTags = task.tagIds.slice(0, 2).map((id) => tags.find((t) => t.id === id)).filter(Boolean)
  const overflow = task.tagIds.length - visibleTags.length
  const sub = task.subtasks
  const subDone = sub.filter((s) => s.completed).length
  const list = showList ? lists.find((l) => l.id === task.listId) : null

  return (
    <div
      className={`flex items-center gap-3 min-h-[52px] py-3 px-0.5 border-b border-ink-faint cursor-pointer transition-colors active:bg-bg-hover select-none ${
        task.completed ? 'opacity-60' : ''
      }`}
      onClick={() => openTask(task.id)}
    >
      <Checkbox
        checked={task.completed}
        onChange={() => completeTask(task.id)}
        size={22}
      />

      <PriorityDot priority={task.priority} />

      <div className="flex-1 min-w-0 flex flex-col gap-1">
        <span
          className={`text-[15px] leading-snug truncate ${
            task.completed
              ? 'text-done-text line-through decoration-1'
              : 'text-ink-primary'
          }`}
        >
          {task.title}
        </span>

        {(task.dueDate || task.recurrence || sub.length > 0 || visibleTags.length > 0 || list) && (
          <span className="flex items-center gap-2 flex-wrap">
            {task.dueDate && <DueChip dueDate={task.dueDate} />}
            {task.recurrence && (
              <RefreshCwIcon size={11} className="text-ink-muted flex-shrink-0" />
            )}
            {sub.length > 0 && (
              <span className="font-mono text-[11px] text-ink-muted">
                {subDone}/{sub.length}
              </span>
            )}
            {list && (
              <span className="inline-flex items-center gap-1 font-mono text-[11px] text-ink-secondary">
                <span className="w-1.5 h-1.5 rounded-full" style={{ background: list.color }} />
                {list.name}
              </span>
            )}
            {visibleTags.map((tag) => tag && <TagChip key={tag.id} tag={tag} small />)}
            {overflow > 0 && (
              <span className="text-[11px] text-ink-muted">+{overflow}</span>
            )}
          </span>
        )}
      </div>
    </div>
  )
}
