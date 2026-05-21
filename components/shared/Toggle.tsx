'use client'

interface ToggleProps {
  on: boolean
  onChange: (on: boolean) => void
  label?: string
}

export function Toggle({ on, onChange, label }: ToggleProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      aria-label={label}
      onClick={() => onChange(!on)}
      className={`relative flex-shrink-0 w-[38px] h-[22px] rounded-full transition-colors duration-150 ${
        on ? 'bg-accent' : 'bg-ink-faint'
      }`}
    >
      <span
        className={`absolute top-[2px] left-[2px] w-[18px] h-[18px] rounded-full bg-white shadow-sm transition-transform duration-150 ${
          on ? 'translate-x-4' : 'translate-x-0'
        }`}
      />
    </button>
  )
}
