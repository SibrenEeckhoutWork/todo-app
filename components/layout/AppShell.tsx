'use client'

import { useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Sidebar } from './Sidebar'
import { BottomNav } from './BottomNav'
import { TaskDetail } from '@/components/tasks/TaskDetail'

export function AppShell({ children }: { children: React.ReactNode }) {
  const router = useRouter()

  const handleFab = useCallback(() => {
    router.push('/')
    setTimeout(() => {
      const input = document.querySelector<HTMLInputElement>('[data-quick-add]')
      if (input) input.focus()
    }, 60)
  }, [router])

  return (
    <div className="flex h-dvh overflow-hidden bg-bg-base">
      <Sidebar />
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <main className="flex-1 overflow-y-auto no-scrollbar">
          {children}
        </main>
        <div className="md:hidden">
          <BottomNav onFabClick={handleFab} />
        </div>
      </div>
      <TaskDetail />
    </div>
  )
}
