'use client'

import { useRef, useState } from 'react'
import { useTodoStore } from '@/store/todoStore'
import { Toggle } from '@/components/shared/Toggle'
import { exportToCSV, parseCSV } from '@/lib/csv'

export function SettingsView() {
  const { lists, tags, tasks, showCompleted, toggleShowCompleted, importData, resetAll, updateList, updateTag } = useTodoStore()
  const fileRef = useRef<HTMLInputElement>(null)
  const [confirmReset, setConfirmReset] = useState(false)

  function handleExport() {
    const csv = exportToCSV({ lists, tags, tasks })
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `todo-export-${new Date().toISOString().slice(0, 10)}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  function handleImport(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      try {
        const payload = parseCSV(ev.target?.result as string)
        if (confirm(`Import ${payload.tasks.length} tasks, ${payload.lists.length} lists, ${payload.tags.length} tags? This will replace all current data.`)) {
          importData(payload)
        }
      } catch {
        alert('Could not parse CSV file.')
      }
    }
    reader.readAsText(file)
    e.target.value = ''
  }

  const card = (children: React.ReactNode) => (
    <div className="bg-bg-elevated border border-ink-faint rounded-card overflow-hidden mb-4">
      {children}
    </div>
  )

  const heading = (label: string, danger?: boolean) => (
    <h3 className={`font-display font-semibold text-[15px] px-4 pt-3.5 pb-2 ${danger ? 'text-priority-high' : 'text-ink-primary'}`}>
      {label}
    </h3>
  )

  const divider = 'border-t border-ink-faint'

  return (
    <div className="px-5 py-4 pb-24 max-w-lg mx-auto md:pb-6 md:max-w-2xl">
      <div className="mb-[22px]">
        <h1 className="font-display font-semibold text-[32px] text-ink-primary leading-tight tracking-tight">
          Settings
        </h1>
      </div>

      {card(
        <>
          {heading('Display')}
          <div className={`flex items-center justify-between px-4 py-3 text-[14px] ${divider}`}>
            <span className="text-ink-primary">Show completed tasks</span>
            <Toggle on={showCompleted} onChange={toggleShowCompleted} />
          </div>
          <div className={`flex items-center justify-between px-4 py-3 text-[14px] ${divider}`}>
            <span className="text-ink-primary">Week starts on</span>
            <span className="font-mono text-[11px] text-ink-muted">Monday</span>
          </div>
        </>
      )}

      {card(
        <>
          {heading('Data')}
          <div className={`flex items-center justify-between px-4 py-3 text-[14px] ${divider}`}>
            <span className="text-ink-primary">Export tasks</span>
            <button
              onClick={handleExport}
              className="bg-bg-surface border border-ink-faint rounded-lg px-2.5 py-1 text-[12px] text-ink-primary"
            >
              Export CSV
            </button>
          </div>
          <div className={`flex items-center justify-between px-4 py-3 text-[14px] ${divider}`}>
            <span className="text-ink-primary">Import tasks</span>
            <button
              onClick={() => fileRef.current?.click()}
              className="bg-bg-surface border border-ink-faint rounded-lg px-2.5 py-1 text-[12px] text-ink-primary"
            >
              Import CSV
            </button>
            <input ref={fileRef} type="file" accept=".csv" className="hidden" onChange={handleImport} />
          </div>
        </>
      )}

      {card(
        <>
          {heading('Lists')}
          {lists.map((l) => (
            <div key={l.id} className={`flex items-center gap-3 px-4 py-3 text-[14px] ${divider}`}>
              <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: l.color }} />
              <span className="flex-1 text-ink-primary">{l.name}</span>
              <button className="bg-bg-surface border border-ink-faint rounded-lg px-2.5 py-1 text-[12px]">
                Edit
              </button>
            </div>
          ))}
        </>
      )}

      {tags.length > 0 && card(
        <>
          {heading('Tags')}
          {tags.map((t) => (
            <div key={t.id} className={`flex items-center gap-3 px-4 py-3 text-[14px] ${divider}`}>
              <span className="w-2.5 h-2.5 rotate-45 flex-shrink-0" style={{ background: t.color }} />
              <span className="flex-1 text-ink-primary">{t.name}</span>
              <button className="bg-bg-surface border border-ink-faint rounded-lg px-2.5 py-1 text-[12px]">
                Edit
              </button>
            </div>
          ))}
        </>
      )}

      <div className="bg-bg-elevated border border-priority-high/30 rounded-card overflow-hidden mb-4">
        {heading('Reset', true)}
        <div className={`px-4 py-3 text-[13px] text-ink-secondary ${divider}`}>
          Delete all tasks, lists and tags. This cannot be undone.
        </div>
        <div className={`flex justify-end px-4 py-3 ${divider}`}>
          {confirmReset ? (
            <div className="flex gap-2">
              <button
                onClick={() => setConfirmReset(false)}
                className="px-3 py-1.5 rounded-lg text-[12px] border border-ink-faint text-ink-secondary"
              >
                Cancel
              </button>
              <button
                onClick={() => { resetAll(); setConfirmReset(false) }}
                className="px-3 py-1.5 rounded-lg text-[12px] bg-priority-high text-white"
              >
                Yes, reset everything
              </button>
            </div>
          ) : (
            <button
              onClick={() => setConfirmReset(true)}
              className="px-3 py-1.5 rounded-lg text-[12px] bg-priority-high text-white"
            >
              Reset everything
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
