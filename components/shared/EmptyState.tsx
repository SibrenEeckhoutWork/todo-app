interface EmptyStateProps {
  mark?: React.ReactNode
  title: string
  sub?: string
}

export function EmptyState({ mark, title, sub }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center text-center py-16 px-5">
      {mark && <div className="text-ink-faint mb-4 text-4xl">{mark}</div>}
      <p className="text-ink-secondary text-[15px] mb-1">{title}</p>
      {sub && <p className="font-display italic text-ink-muted text-sm">{sub}</p>}
    </div>
  )
}
