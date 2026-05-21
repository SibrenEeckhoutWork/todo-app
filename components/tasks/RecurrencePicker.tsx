'use client'

import { ChevronRightIcon } from 'lucide-react'
import type { RecurrenceRule } from '@/lib/types'

const OPTIONS: { id: RecurrenceRule['frequency'] | 'none'; label: string }[] = [
  { id: 'none',    label: 'Does not repeat' },
  { id: 'daily',   label: 'Daily' },
  { id: 'weekly',  label: 'Weekly' },
  { id: 'monthly', label: 'Monthly' },
  { id: 'yearly',  label: 'Yearly' },
]

interface RecurrencePickerProps {
  value?: RecurrenceRule
  onChange: (rule: RecurrenceRule | undefined) => void
}

export function RecurrencePicker({ value, onChange }: RecurrencePickerProps) {
  const activeId = value?.frequency ?? 'none'

  return (
    <div className="bg-bg-surface rounded-card overflow-hidden">
      {OPTIONS.map((opt) => (
        <button
          key={opt.id}
          type="button"
          onClick={() => {
            if (opt.id === 'none') { onChange(undefined); return }
            onChange({ frequency: opt.id as RecurrenceRule['frequency'], interval: 1 })
          }}
          className={`w-full flex items-center gap-2.5 px-3 py-2.5 text-[13px] text-left transition-colors ${
            activeId === opt.id
              ? 'bg-accent-light text-accent'
              : 'text-ink-primary hover:bg-bg-hover'
          }`}
        >
          <ChevronRightIcon size={12} className="text-ink-muted flex-shrink-0" />
          {opt.label}
        </button>
      ))}
    </div>
  )
}
