import type { Tag } from '@/lib/types'

interface TagChipProps {
  tag: Tag
  small?: boolean
}

export function TagChip({ tag, small }: TagChipProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full font-body font-medium whitespace-nowrap leading-relaxed ${
        small ? 'text-[10px] px-1.5 py-px' : 'text-[11px] px-2 py-px'
      }`}
      style={{ background: tag.color, color: tag.textColor }}
    >
      {tag.name}
    </span>
  )
}
