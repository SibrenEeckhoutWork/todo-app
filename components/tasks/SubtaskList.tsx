'use client'

import { useState } from 'react'
import { PlusIcon } from 'lucide-react'
import { Checkbox } from '@/components/shared/Checkbox'
import { useTodoStore } from '@/store/todoStore'
import type { Task } from '@/lib/types'

export function SubtaskList({ task }: { task: Task }) {
  const { toggleSubtask, addSubtask } = useTodoStore()
  const [newTitle, setNewTitle] = useState('')

  const doneCount = task.subtasks.filter((s) => s.completed).length

  return (
    <div>
      <div className="flex items-center justify-between text-[13px] text-ink-secondary py-2.5">
        <span>Subtasks</span>
        {task.subtasks.length > 0 && (
          <span className="font-mono text-[11px] text-ink-muted">
            {doneCount}/{task.subtasks.length}
          </span>
        )}
      </div>

      <div className="flex flex-col">
        {task.subtasks.map((s) => (
          <div
            key={s.id}
            className={`flex items-center gap-2.5 py-2 text-[13px] ${s.completed ? 'opacity-60' : ''}`}
          >
            <Checkbox
              checked={s.completed}
              onChange={() => toggleSubtask(task.id, s.id)}
              size={18}
            />
            <span className={s.completed ? 'text-done-text line-through decoration-1' : 'text-ink-primary'}>
              {s.title}
            </span>
          </div>
        ))}

        <div className="flex items-center gap-2.5 py-2">
          <span className="w-[18px] flex justify-center text-ink-muted flex-shrink-0">
            <PlusIcon size={14} />
          </span>
          <input
            placeholder="Add subtask…"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && newTitle.trim()) {
                addSubtask(task.id, newTitle.trim())
                setNewTitle('')
              }
            }}
            className="flex-1 bg-transparent text-[13px] placeholder:text-ink-muted min-w-0"
          />
        </div>
      </div>
    </div>
  )
}
