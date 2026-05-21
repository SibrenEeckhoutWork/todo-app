'use client'

import { useMemo } from 'react'
import { useTodoStore } from '@/store/todoStore'
import { upcomingTasks, overdueTasks } from '@/lib/filters'
import { formatDateGroupHeader } from '@/lib/dateUtils'
import { TaskItem } from '@/components/tasks/TaskItem'
import { AddTaskBar } from '@/components/tasks/AddTaskBar'
import { EmptyState } from '@/components/shared/EmptyState'

export function UpcomingView() {
  const tasks = useTodoStore((s) => s.tasks)
  const showCompleted = useTodoStore((s) => s.showCompleted)

  const overdue = useMemo(() => overdueTasks(tasks), [tasks])
  const grouped = useMemo(() => upcomingTasks(tasks), [tasks])
  const sortedDates = Object.keys(grouped).sort()

  const visibleOverdue = showCompleted ? overdue : overdue.filter((t) => !t.completed)
  const hasVisibleGroups = sortedDates.some((k) => {
    const items = showCompleted ? grouped[k] : grouped[k].filter((t) => !t.completed)
    return items.length > 0
  })

  return (
    <div className="px-5 py-4 pb-24 max-w-lg mx-auto md:pb-6 md:max-w-2xl">
      <div className="mb-[18px]">
        <h1 className="font-display font-semibold text-[32px] text-ink-primary leading-tight tracking-tight">
          Upcoming
        </h1>
        <p className="font-mono text-[12px] text-ink-muted mt-1.5">Next 14 days</p>
      </div>

      <AddTaskBar />

      {visibleOverdue.length === 0 && !hasVisibleGroups ? (
        <EmptyState title="Nothing scheduled." sub="A quiet stretch ahead." />
      ) : (
        <>
          {visibleOverdue.length > 0 && (
            <>
              <div className="flex items-baseline gap-2 text-[11px] uppercase tracking-[0.12em] font-medium mt-1 pb-1.5 border-b border-ink-faint text-priority-high">
                Overdue
                <span className="text-ink-faint">·</span>
                <span className="normal-case tracking-normal font-mono text-ink-muted">{visibleOverdue.length} task{visibleOverdue.length === 1 ? '' : 's'}</span>
              </div>
              {visibleOverdue.map((t) => <TaskItem key={t.id} task={t} showList />)}
            </>
          )}
          {sortedDates.map((dateKey) => {
            const items = showCompleted
              ? grouped[dateKey]
              : grouped[dateKey].filter((t) => !t.completed)
            if (!items.length) return null
            const { label, meta } = formatDateGroupHeader(dateKey)
            return (
              <div key={dateKey}>
                <div className="flex items-baseline gap-2 text-[11px] uppercase tracking-[0.12em] font-medium mt-6 pb-1.5 border-b border-ink-faint text-ink-muted">
                  {label}
                  <span className="text-ink-faint">·</span>
                  <span className="normal-case tracking-normal font-mono">{meta}</span>
                </div>
                {items.map((t) => <TaskItem key={t.id} task={t} showList />)}
              </div>
            )
          })}
        </>
      )}
    </div>
  )
}
