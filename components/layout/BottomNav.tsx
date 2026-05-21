'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { SunIcon, InboxIcon, CalendarIcon, MenuIcon, PlusIcon } from 'lucide-react'
import { useTodoStore } from '@/store/todoStore'
import { useMemo } from 'react'
import { todayTasks, inboxTasks } from '@/lib/filters'

interface BottomNavProps {
  onFabClick?: () => void
}

export function BottomNav({ onFabClick }: BottomNavProps) {
  const pathname = usePathname()
  const tasks = useTodoStore((s) => s.tasks)

  const counts = useMemo(() => ({
    today: todayTasks(tasks).length,
    inbox: inboxTasks(tasks).length,
  }), [tasks])

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/'
    return pathname.startsWith(href)
  }

  const navItem = (
    href: string,
    label: string,
    icon: React.ReactNode,
    badge?: number
  ) => (
    <Link
      href={href}
      className={`flex flex-col items-center gap-0.5 min-w-[52px] pt-1.5 pb-0 text-[10px] rounded-lg transition-colors ${
        isActive(href) ? 'text-accent' : 'text-ink-muted'
      }`}
    >
      <span className="relative">
        {icon}
        {badge != null && badge > 0 && (
          <span className="absolute -top-1 -right-1.5 bg-priority-high text-white text-[9px] font-bold leading-none rounded-full min-w-[14px] h-[14px] flex items-center justify-center px-0.5">
            {badge > 99 ? '99+' : badge}
          </span>
        )}
      </span>
      <span>{label}</span>
    </Link>
  )

  return (
    <nav className="h-[70px] bg-bg-elevated border-t border-ink-faint flex items-center justify-around px-2 pb-3 flex-shrink-0">
      {navItem('/', 'Today', <SunIcon size={22} />, counts.today)}
      {navItem('/inbox', 'Inbox', <InboxIcon size={22} />, counts.inbox)}

      <button
        type="button"
        aria-label="Add task"
        onClick={onFabClick}
        className="w-14 h-14 rounded-full bg-ink-primary text-white flex items-center justify-center shadow-[0_6px_14px_rgba(28,25,23,0.22)] -mt-9 flex-shrink-0 active:scale-95 transition-transform"
      >
        <PlusIcon size={22} />
      </button>

      {navItem('/upcoming', 'Upcoming', <CalendarIcon size={22} />)}
      {navItem('/browse', 'Browse', <MenuIcon size={22} />)}
    </nav>
  )
}
