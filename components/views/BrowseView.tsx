'use client'

import Link from 'next/link'
import { PlusIcon, ChevronRightIcon, SettingsIcon } from 'lucide-react'
import { useTodoStore } from '@/store/todoStore'
import { useMemo } from 'react'

export function BrowseView() {
  const { lists, tags, tasks } = useTodoStore()

  const counts = useMemo(() => {
    const c: Record<string, number> = {}
    lists.forEach((l) => { c['list:' + l.id] = tasks.filter((t) => t.listId === l.id && !t.completed).length })
    tags.forEach((t)  => { c['tag:' + t.id]  = tasks.filter((x) => x.tagIds.includes(t.id) && !x.completed).length })
    return c
  }, [lists, tags, tasks])

  const sectionHeading = (label: string) => (
    <div className="text-[11px] text-ink-muted uppercase tracking-[0.14em] px-1 pb-2 font-medium">
      {label}
    </div>
  )

  const card = (children: React.ReactNode) => (
    <div className="bg-bg-elevated border border-ink-faint rounded-card overflow-hidden mb-5">
      {children}
    </div>
  )

  const row = (content: React.ReactNode) => (
    <div className="border-b border-ink-faint last:border-none">{content}</div>
  )

  return (
    <div className="px-5 py-4 pb-24 max-w-lg mx-auto md:pb-6 md:max-w-2xl">
      <div className="mb-[22px]">
        <h1 className="font-display font-semibold text-[32px] text-ink-primary leading-tight tracking-tight">
          Browse
        </h1>
        <p className="font-mono text-[12px] text-ink-muted mt-1.5">Lists, tags &amp; settings</p>
      </div>

      {sectionHeading('My Lists')}
      {card(
        <>
          {lists
            .slice()
            .sort((a, b) => a.order - b.order)
            .map((l) =>
              row(
                <Link
                  key={l.id}
                  href={`/list/${l.id}`}
                  className="flex items-center gap-3.5 px-4 py-3.5 active:bg-bg-hover transition-colors"
                >
                  <span className="w-[22px] flex justify-center">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ background: l.color }} />
                  </span>
                  <span className="flex-1 text-[15px] text-ink-primary">{l.name}</span>
                  <span className="font-mono text-[12px] text-ink-muted">{counts['list:' + l.id] ?? 0}</span>
                  <ChevronRightIcon size={14} className="text-ink-muted" />
                </Link>
              )
            )}
          {row(
            <button className="w-full flex items-center gap-3.5 px-4 py-3.5 text-ink-muted active:bg-bg-hover transition-colors">
              <span className="w-[22px] flex justify-center"><PlusIcon size={16} /></span>
              <span className="text-[15px]">New list</span>
            </button>
          )}
        </>
      )}

      {tags.length > 0 && (
        <>
          {sectionHeading('Tags')}
          {card(
            tags.map((t) =>
              row(
                <Link
                  key={t.id}
                  href={`/tag/${t.id}`}
                  className="flex items-center gap-3.5 px-4 py-3.5 active:bg-bg-hover transition-colors"
                >
                  <span className="w-[22px] flex justify-center">
                    <span className="w-2.5 h-2.5 rotate-45" style={{ background: t.color }} />
                  </span>
                  <span className="flex-1 text-[15px] text-ink-primary">{t.name}</span>
                  <span className="font-mono text-[12px] text-ink-muted">{counts['tag:' + t.id] ?? 0}</span>
                  <ChevronRightIcon size={14} className="text-ink-muted" />
                </Link>
              )
            )
          )}
        </>
      )}

      {sectionHeading('General')}
      {card(
        row(
          <Link
            href="/settings"
            className="flex items-center gap-3.5 px-4 py-3.5 active:bg-bg-hover transition-colors"
          >
            <span className="w-[22px] flex justify-center text-ink-secondary">
              <SettingsIcon size={18} />
            </span>
            <span className="flex-1 text-[15px] text-ink-primary">Settings</span>
            <ChevronRightIcon size={14} className="text-ink-muted" />
          </Link>
        )
      )}
    </div>
  )
}
