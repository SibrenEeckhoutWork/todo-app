'use client'

interface CheckboxProps {
  checked: boolean
  onChange: (checked: boolean) => void
  size?: number
  className?: string
}

export function Checkbox({ checked, onChange, size = 22, className = '' }: CheckboxProps) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={checked}
      onClick={(e) => { e.stopPropagation(); onChange(!checked) }}
      className={`relative flex-shrink-0 rounded-full border-2 border-solid flex items-center justify-center transition-colors ${
        checked
          ? 'border-done-check bg-done-check'
          : 'border-ink-secondary bg-transparent hover:border-ink-primary'
      } ${className}`}
      style={{ width: size, height: size, minWidth: size }}
    >
      {checked && (
        <svg
          width={size * 0.5}
          height={size * 0.5}
          viewBox="0 0 12 12"
          fill="none"
          className="animate-[check-scale-in_220ms_cubic-bezier(.34,1.56,.64,1)]"
        >
          <path
            d="M2.5 6L5 8.5L9.5 3.5"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )}
    </button>
  )
}
