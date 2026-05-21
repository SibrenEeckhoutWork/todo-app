'use client'

import { useState, useEffect, useRef } from 'react'
import { XIcon, TrashIcon, CalendarIcon, RefreshCwIcon } from 'lucide-react'
import { Checkbox } from '@/components/shared/Checkbox'
import { TagChip } from '@/components/shared/TagChip'
import { SubtaskList } from './SubtaskList'
import { RecurrencePicker } from './RecurrencePicker'
import { useTodoStore } from '@/store/todoStore'
import { recurrenceLabel } from '@/lib/recurrence'
import { format, addDays } from 'date-fns'
import type { Priority, RecurrenceRule } from '@/lib/types'

const PRIORITIES: { id: Priority; label: string; sym: string }[] = [
  { id: 'none',   label: 'None',   sym: '·' },
  { id: 'low',    label: 'Low',    sym: '↓' },
  { id: 'medium', label: 'Medium', sym: '→' },
  { id: 'high',   label: 'High',   sym: '↑' },
]

const PRIORITY_BG: Record<Priority, string> = {
  high:   'bg-priority-high text-white',
  medium: 'bg-priority-medium text-white',
  low:    'bg-priority-low text-white',
  none:   'bg-ink-secondary text-white',
}

export function TaskDetail() {
  const { tasks, lists, tags, updateTask, completeTask, deleteTask, selectedTaskId, closeTask } = useTodoStore()
  const taskId = selectedTaskId
  const onClose = closeTask
  const [editor, setEditor] = useState<string | null>(null)
  const task = tasks.find((t) => t.id === taskId)

  useEffect(() => { setEditor(null) }, [taskId])

  if (!task) return null

  const list = lists.find((l) => l.id === task.listId)
  const now = format(new Date(), 'yyyy-MM-dd')
  const tomorrow = format(addDays(new Date(), 1), 'yyyy-MM-dd')
  const nextWeek = format(addDays(new Date(), 7), 'yyyy-MM-dd')

  const field = (
    icon: React.ReactNode,
    label: string,
    value: React.ReactNode,
    editorKey: string,
    muted?: boolean
  ) => (
    <div>
      <button
        type="button"
        onClick={() => setEditor(editor === editorKey ? null : editorKey)}
        className="w-full flex items-center gap-3 py-3 text-left active:bg-bg-surface rounded-lg transition-colors"
      >
        <span className="w-5 text-ink-muted flex justify-center text-[14px] flex-shrink-0">{icon}</span>
        <span className="text-[13px] text-ink-secondary w-[76px] flex-shrink-0">{label}</span>
        <span className={`flex-1 text-[13px] flex items-center gap-1.5 flex-wrap justify-end text-right ${muted ? 'text-ink-muted' : 'text-ink-primary'}`}>
          {value}
        </span>
      </button>
    </div>
  )

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-ink-primary/30 z-40 transition-opacity duration-200"
        onClick={onClose}
      />

      {/* Sheet */}
      <div className="fixed left-0 right-0 bottom-0 bg-bg-elevated z-50 rounded-t-[18px] max-h-[88dvh] flex flex-col shadow-2xl animate-[sheet-in_300ms_cubic-bezier(0.16,1,0.3,1)]">
        {/* Handle */}
        <div className="w-9 h-1 bg-ink-faint rounded-full mx-auto mt-2 mb-1 flex-shrink-0" />

        {/* Scrollable body */}
        <div className="overflow-y-auto no-scrollbar flex-1 px-[22px] pb-8">
          {/* Header row */}
          <div className="flex items-center justify-between mb-1 pt-2">
            <button
              type="button"
              aria-label="Close"
              onClick={onClose}
              className="w-9 h-9 flex items-center justify-center rounded-lg text-ink-secondary hover:bg-bg-hover"
            >
              <XIcon size={20} />
            </button>
            <span className="font-mono text-[11px] text-ink-muted">#{task.id.slice(-6)}</span>
          </div>

          {/* Title */}
          <div className="flex gap-3 items-start mb-3">
            <div className="pt-[3px]">
              <Checkbox checked={task.completed} onChange={() => completeTask(task.id)} />
            </div>
            <textarea
              className={`flex-1 font-display font-medium text-[20px] leading-snug bg-transparent resize-none py-0.5 ${
                task.completed ? 'text-done-text line-through' : 'text-ink-primary'
              }`}
              value={task.title}
              rows={Math.max(1, Math.ceil(task.title.length / 26))}
              placeholder="Task title"
              onChange={(e) => updateTask(task.id, { title: e.target.value })}
            />
          </div>

          {/* Notes */}
          <textarea
            className="w-full bg-transparent text-[14px] text-ink-secondary resize-none py-1 leading-relaxed placeholder:text-ink-muted mb-1 min-h-[44px]"
            value={task.notes}
            placeholder="Notes…"
            rows={2}
            onChange={(e) => updateTask(task.id, { notes: e.target.value })}
          />

          {/* Fields */}
          <div className="border-t border-ink-faint mt-2">
            {field(
              <CalendarIcon size={14} />,
              'Due date',
              task.dueDate ? task.dueDate : 'No date',
              'date',
              !task.dueDate
            )}
            {editor === 'date' && (
              <div className="bg-bg-surface rounded-card p-3 mb-1 flex gap-2 flex-wrap">
                {[['Today', now], ['Tomorrow', tomorrow], ['Next week', nextWeek], ['Clear', '']].map(([label, val]) => (
                  <button
                    key={label}
                    type="button"
                    onClick={() => { updateTask(task.id, { dueDate: val || undefined }); setEditor(null) }}
                    className="px-3 py-1.5 rounded-full text-[12px] bg-bg-elevated border border-ink-faint text-ink-secondary"
                  >
                    {label}
                  </button>
                ))}
              </div>
            )}

            {field(
              '!',
              'Priority',
              <>
                {task.priority !== 'none' && (
                  <span className={`w-2 h-2 rounded-full inline-block ${
                    task.priority === 'high' ? 'bg-priority-high'
                    : task.priority === 'medium' ? 'bg-priority-medium'
                    : 'bg-priority-low'
                  }`} />
                )}
                {PRIORITIES.find((p) => p.id === task.priority)!.label}
              </>,
              'priority',
              task.priority === 'none'
            )}
            {editor === 'priority' && (
              <div className="bg-bg-surface rounded-card p-3 mb-1 flex gap-2 flex-wrap">
                {PRIORITIES.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => { updateTask(task.id, { priority: p.id }); setEditor(null) }}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12px] border ${
                      task.priority === p.id
                        ? PRIORITY_BG[p.id]
                        : 'bg-bg-elevated border-ink-faint text-ink-secondary'
                    }`}
                  >
                    <span className={`w-2 h-2 rounded-full ${p.id !== 'none' ? `bg-priority-${p.id}` : 'bg-ink-faint'}`} />
                    {p.sym} {p.label}
                  </button>
                ))}
              </div>
            )}

            {field(
              '▤',
              'List',
              <>
                {list && <span className="w-2 h-2 rounded-full" style={{ background: list.color }} />}
                {list?.name ?? 'Inbox'}
              </>,
              'list'
            )}
            {editor === 'list' && (
              <div className="bg-bg-surface rounded-card p-3 mb-1 flex gap-2 flex-wrap">
                {lists.map((l) => (
                  <button
                    key={l.id}
                    type="button"
                    onClick={() => { updateTask(task.id, { listId: l.id }); setEditor(null) }}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12px] border ${
                      task.listId === l.id ? 'text-white border-transparent' : 'bg-bg-elevated border-ink-faint text-ink-secondary'
                    }`}
                    style={task.listId === l.id ? { background: l.color } : undefined}
                  >
                    <span className="w-1.5 h-1.5 rounded-full" style={{ background: l.color }} />
                    {l.name}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => { updateTask(task.id, { listId: null }); setEditor(null) }}
                  className={`px-3 py-1.5 rounded-full text-[12px] border ${
                    !task.listId ? 'bg-ink-secondary text-white border-transparent' : 'bg-bg-elevated border-ink-faint text-ink-secondary'
                  }`}
                >
                  Inbox
                </button>
              </div>
            )}

            {field(
              '#',
              'Tags',
              task.tagIds.length === 0
                ? 'None'
                : task.tagIds.map((id) => {
                    const t = tags.find((x) => x.id === id)
                    return t ? <TagChip key={id} tag={t} small /> : null
                  }),
              'tags',
              task.tagIds.length === 0
            )}
            {editor === 'tags' && (
              <div className="bg-bg-surface rounded-card p-3 mb-1 flex gap-2 flex-wrap">
                {tags.map((t) => {
                  const on = task.tagIds.includes(t.id)
                  return (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => {
                        const next = on ? task.tagIds.filter((x) => x !== t.id) : [...task.tagIds, t.id]
                        updateTask(task.id, { tagIds: next })
                      }}
                      className="px-3 py-1.5 rounded-full text-[12px] border border-transparent"
                      style={on ? { background: t.color, color: t.textColor } : { background: 'white', color: '#78716c', borderColor: '#e7e5e0' }}
                    >
                      {t.name}
                    </button>
                  )
                })}
              </div>
            )}
          </div>

          {/* Subtasks */}
          <div className="border-t border-ink-faint mt-1 pt-1">
            <SubtaskList task={task} />
          </div>

          {/* Recurrence */}
          <div className="border-t border-ink-faint mt-1">
            {field(
              <RefreshCwIcon size={14} />,
              'Repeat',
              task.recurrence ? recurrenceLabel(task.recurrence) : 'Does not repeat',
              'recur',
              !task.recurrence
            )}
            {editor === 'recur' && (
              <div className="mb-2">
                <RecurrencePicker
                  value={task.recurrence}
                  onChange={(rule) => { updateTask(task.id, { recurrence: rule }); setEditor(null) }}
                />
              </div>
            )}
          </div>

          {/* Delete */}
          <div className="mt-5 flex justify-center">
            <button
              type="button"
              onClick={() => { deleteTask(task.id); onClose() }}
              className="inline-flex items-center gap-1.5 text-priority-high text-[13px] px-3.5 py-2 rounded-lg hover:bg-[#c0392b]/10 transition-colors"
            >
              <TrashIcon size={14} />
              Delete task
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
