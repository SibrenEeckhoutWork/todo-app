'use client'

import { useState, useRef, useEffect } from 'react'
import { CalendarIcon } from 'lucide-react'
import { useTodoStore } from '@/store/todoStore'
import type { Priority } from '@/lib/types'
import { format, addDays } from 'date-fns'

const PRIORITIES: { id: Priority; label: string }[] = [
  { id: 'none',   label: 'Priority' },
  { id: 'low',    label: 'Low' },
  { id: 'medium', label: 'Medium' },
  { id: 'high',   label: 'High' },
]

interface AddTaskBarProps {
  defaultListId?: string | null
  defaultDueDate?: string
  autoFocus?: boolean
}

export function AddTaskBar({ defaultListId, defaultDueDate, autoFocus }: AddTaskBarProps) {
  const { addTask, lists } = useTodoStore()
  const [text, setText] = useState('')
  const [focused, setFocused] = useState(false)
  const [priority, setPriority] = useState<Priority>('none')
  const [dueDate, setDueDate] = useState<string | undefined>(defaultDueDate)
  const [listId, setListId] = useState<string | null>(defaultListId ?? null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (autoFocus) inputRef.current?.focus()
  }, [autoFocus])

  useEffect(() => {
    setListId(defaultListId ?? null)
  }, [defaultListId])

  function cycleDue() {
    const today = format(new Date(), 'yyyy-MM-dd')
    const tomorrow = format(addDays(new Date(), 1), 'yyyy-MM-dd')
    const nextWeek = format(addDays(new Date(), 7), 'yyyy-MM-dd')
    setDueDate((d) => {
      if (!d) return today
      if (d === today) return tomorrow
      if (d === tomorrow) return nextWeek
      return undefined
    })
  }

  function cyclePriority() {
    const order: Priority[] = ['none', 'low', 'medium', 'high']
    setPriority((p) => order[(order.indexOf(p) + 1) % order.length])
  }

  function cycleList() {
    if (!lists.length) return
    setListId((id) => {
      if (!id) return lists[0].id
      const idx = lists.findIndex((l) => l.id === id)
      return idx === lists.length - 1 ? null : lists[idx + 1].id
    })
  }

  function submit() {
    const title = text.trim()
    if (!title) return
    addTask({
      title,
      notes: '',
      completed: false,
      priority,
      dueDate,
      dueTime: undefined,
      listId,
      tagIds: [],
      subtasks: [],
      recurrence: undefined,
    })
    setText('')
    setPriority('none')
    setDueDate(defaultDueDate)
    inputRef.current?.focus()
  }

  const showToolbar = focused || !!text
  const currentList = listId ? lists.find((l) => l.id === listId) : null
  const dueLabel = dueDate
    ? dueDate === format(new Date(), 'yyyy-MM-dd') ? 'Today'
    : dueDate === format(addDays(new Date(), 1), 'yyyy-MM-dd') ? 'Tomorrow'
    : 'Next week'
    : 'Date'

  return (
    <div
      className={`bg-bg-elevated border rounded-card mb-[18px] px-3.5 py-3 shadow-sm transition-all ${
        showToolbar ? 'border-accent ring-2 ring-accent-light' : 'border-ink-faint'
      }`}
    >
      <div className="flex items-center gap-3">
        <span
          className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 text-sm leading-none transition-colors ${
            showToolbar
              ? 'border border-accent text-accent'
              : 'border border-dashed border-ink-muted text-ink-muted'
          }`}
        >
          +
        </span>
        <input
          ref={inputRef}
          data-quick-add
          placeholder="Add a task…"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') submit()
            if (e.key === 'Escape') { setText(''); e.currentTarget.blur() }
          }}
          className="flex-1 bg-transparent text-[15px] placeholder:text-ink-muted min-w-0"
        />
      </div>

      {showToolbar && (
        <div
          className="flex gap-1.5 mt-2.5 pt-2.5 border-t border-ink-faint flex-wrap animate-[slide-down-fade_150ms_ease]"
          onMouseDown={(e) => e.preventDefault()}
        >
          <button
            onClick={cycleDue}
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[12px] border ${
              dueDate
                ? 'bg-accent-light text-accent border-transparent'
                : 'bg-bg-surface text-ink-secondary border-transparent'
            }`}
          >
            <CalendarIcon size={11} />
            {dueLabel}
          </button>

          <button
            onClick={cyclePriority}
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[12px] border ${
              priority !== 'none'
                ? 'bg-accent-light text-accent border-transparent'
                : 'bg-bg-surface text-ink-secondary border-transparent'
            }`}
          >
            ! {priority === 'none' ? 'Priority' : PRIORITIES.find((p) => p.id === priority)!.label}
          </button>

          <button
            onClick={cycleList}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[12px] bg-bg-surface text-ink-secondary"
          >
            {currentList && (
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: currentList.color }} />
            )}
            {currentList ? currentList.name : 'Inbox'}
          </button>

          <span className="flex-1" />

          <button
            onClick={submit}
            className="bg-ink-primary text-bg-elevated rounded-lg px-3 py-1 text-[12px] font-medium"
          >
            ↵ Add
          </button>
        </div>
      )}
    </div>
  )
}
