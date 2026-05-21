'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { SunIcon, InboxIcon, CalendarIcon, SettingsIcon } from 'lucide-react'
import { useTodoStore } from '@/store/todoStore'
import { useMemo } from 'react'
import { todayTasks, inboxTasks, upcomingTasks } from '@/lib/filters'

export function Sidebar() {
  const pathname = usePathname()
  const { tasks, lists, tags } = useTodoStore()

  const counts = useMemo(() => {
    const c: Record<string, number> = {}
    c.today    = todayTasks(tasks).length
    c.inbox    = inboxTasks(tasks).length
    c.upcoming = Object.values(upcomingTasks(tasks)).flat().length
    lists.forEach((l) => { c['list:' + l.id] = tasks.filter((t) => t.listId === l.id && !t.completed).length })
    tags.forEach((t)  => { c['tag:' + t.id]  = tasks.filter((x) => x.tagIds.includes(t.id) && !x.completed).length })
    return c
  }, [tasks, lists, tags])

  const isActive = (href: string) => href === '/' ? pathname === '/' : pathname.startsWith(href)

  const smartItem = (href: string, label: string, icon: React.ReactNode, count?: number) => (
    <Link
      key={href}
      href={href}
      className={`flex items-center gap-3 px-3 py-2 rounded-lg text-[14px] transition-colors ${
        isActive(href)
          ? 'bg-accent-light text-accent font-medium'
          : 'text-ink-secondary hover:bg-bg-hover'
      }`}
    >
      <span className="flex-shrink-0">{icon}</span>
      <span className="flex-1">{label}</span>
      {count != null && count > 0 && (
        <span className="font-mono text-[11px] text-ink-muted">{count}</span>
      )}
    </Link>
  )

  return (
    <aside className="hidden md:flex flex-col w-56 bg-bg-surface border-r border-ink-faint flex-shrink-0 h-full overflow-y-auto no-scrollbar">
      <div className="px-4 pt-6 pb-2">
        <div className="flex items-center gap-2 mb-6">
          <span className="w-5 h-5 border-2 border-ink-primary rounded-full flex items-center justify-center flex-shrink-0">
            <svg width="9" height="9" viewBox="0 0 10 10" fill="none">
              <path d="M2 5L4 7L8 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </span>
          <span className="font-display font-semibold text-[17px] text-ink-primary">Todo</span>
        </div>

        <nav className="flex flex-col gap-0.5">
          {smartItem('/', 'Today', <SunIcon size={16} />, counts.today)}
          {smartItem('/inbox', 'Inbox', <InboxIcon size={16} />, counts.inbox)}
          {smartItem('/upcoming', 'Upcoming', <CalendarIcon size={16} />, counts.upcoming)}
        </nav>

        <div className="mt-5 mb-1.5 px-1 text-[10px] text-ink-muted uppercase tracking-widest font-medium">
          My Lists
        </div>
        <nav className="flex flex-col gap-0.5">
          {lists
            .slice()
            .sort((a, b) => a.order - b.order)
            .map((l) => (
              <Link
                key={l.id}
                href={`/list/${l.id}`}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-[14px] transition-colors ${
                  isActive(`/list/${l.id}`)
                    ? 'bg-accent-light text-accent font-medium'
                    : 'text-ink-secondary hover:bg-bg-hover'
                }`}
              >
                <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: l.color }} />
                <span className="flex-1">{l.name}</span>
                {counts['list:' + l.id] > 0 && (
                  <span className="font-mono text-[11px] text-ink-muted">{counts['list:' + l.id]}</span>
                )}
              </Link>
            ))}
        </nav>

        {tags.length > 0 && (
          <>
            <div className="mt-5 mb-1.5 px-1 text-[10px] text-ink-muted uppercase tracking-widest font-medium">
              Tags
            </div>
            <nav className="flex flex-col gap-0.5">
              {tags.map((t) => (
                <Link
                  key={t.id}
                  href={`/tag/${t.id}`}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg text-[14px] transition-colors ${
                    isActive(`/tag/${t.id}`)
                      ? 'bg-accent-light text-accent font-medium'
                      : 'text-ink-secondary hover:bg-bg-hover'
                  }`}
                >
                  <span
                    className="w-2.5 h-2.5 rotate-45 flex-shrink-0"
                    style={{ background: t.color }}
                  />
                  <span className="flex-1">{t.name}</span>
                  {counts['tag:' + t.id] > 0 && (
                    <span className="font-mono text-[11px] text-ink-muted">{counts['tag:' + t.id]}</span>
                  )}
                </Link>
              ))}
            </nav>
          </>
        )}
      </div>

      <div className="mt-auto px-4 py-4 border-t border-ink-faint">
        <Link
          href="/settings"
          className={`flex items-center gap-3 px-3 py-2 rounded-lg text-[14px] transition-colors ${
            isActive('/settings')
              ? 'bg-accent-light text-accent font-medium'
              : 'text-ink-secondary hover:bg-bg-hover'
          }`}
        >
          <SettingsIcon size={16} />
          Settings
        </Link>
      </div>
    </aside>
  )
}
