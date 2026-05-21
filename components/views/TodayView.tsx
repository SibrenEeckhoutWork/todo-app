'use client'

import { useMemo } from 'react'
import { useTodoStore } from '@/store/todoStore'
import { todayTasks, overdueTasks } from '@/lib/filters'
import { formatDateLong } from '@/lib/dateUtils'
import { TaskItem } from '@/components/tasks/TaskItem'
import { AddTaskBar } from '@/components/tasks/AddTaskBar'
import { EmptyState } from '@/components/shared/EmptyState'
import { format, addDays } from 'date-fns'

function GroupHeading({ label, meta, variant }: { label: string; meta?: string; variant?: 'overdue' }) {
  return (
    <div className={`flex items-baseline gap-2 text-[11px] uppercase tracking-[0.12em] font-medium mt-6 mb-0 pb-1.5 border-b border-ink-faint first:mt-1 ${variant === 'overdue' ? 'text-priority-high' : 'text-ink-muted'}`}>
      {label}
      {meta && (
        <>
          <span className="text-ink-faint">·</span>
          <span className="normal-case tracking-normal font-mono text-ink-muted">{meta}</span>
        </>
      )}
    </div>
  )
}

export function TodayView() {
  const tasks = useTodoStore((s) => s.tasks)
  const showCompleted = useTodoStore((s) => s.showCompleted)

  const today = new Date()
  const todayStr = format(today, 'yyyy-MM-dd')
  const defaultDue = format(addDays(today, 0), 'yyyy-MM-dd')

  const overdue = useMemo(() => overdueTasks(tasks), [tasks])
  const todayItems = useMemo(
    () => todayTasks(tasks).filter((t) => {
      if (overdue.some((o) => o.id === t.id)) return false
      return true
    }),
    [tasks, overdue]
  )

  const visibleOverdue = showCompleted ? overdue : overdue.filter((t) => !t.completed)
  const visibleToday   = showCompleted ? todayItems : todayItems.filter((t) => !t.completed)
  const openCount = [...overdue, ...todayItems].filter((t) => !t.completed).length

  return (
    <div className="px-5 py-4 pb-24 max-w-lg mx-auto md:pb-6 md:max-w-2xl">
      <div className="mb-[18px]">
        <h1 className="font-display font-semibold text-[32px] text-ink-primary leading-tight tracking-tight flex items-center gap-3">
          Today
        </h1>
        <p className="font-mono text-[12px] text-ink-muted mt-1.5">
          {formatDateLong(today)} · {openCount} open
        </p>
      </div>

      <AddTaskBar defaultDueDate={defaultDue} />

      {visibleOverdue.length === 0 && visibleToday.length === 0 ? (
        <EmptyState
          mark={
            <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
              <path d="M8 19L15 26L28 12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          }
          title="Nothing due today"
          sub="Enjoy your day."
        />
      ) : (
        <>
          {visibleOverdue.length > 0 && (
            <>
              <GroupHeading
                label="Overdue"
                meta={`${visibleOverdue.length} task${visibleOverdue.length === 1 ? '' : 's'}`}
                variant="overdue"
              />
              {visibleOverdue.map((t) => <TaskItem key={t.id} task={t} showList />)}
            </>
          )}
          {visibleToday.length > 0 && (
            <>
              <GroupHeading label="Today" meta={formatDateLong(today)} />
              {visibleToday.map((t) => <TaskItem key={t.id} task={t} showList />)}
            </>
          )}
        </>
      )}
    </div>
  )
}
