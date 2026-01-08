"use client";

interface InputProps {
  id: string
  type?: 'text' | 'email' | 'password' | 'tel'
  placeholder?: string
  value?: string
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  onFocus?: () => void
  onBlur?: () => void
  required?: boolean
  disabled?: boolean
  className?: string
  error?: boolean
  icon?: React.ReactNode
  minLength?: number
  name?: string
}

export default function Input({ 
  id,
  type = 'text', 
  placeholder,
  value,
  onChange,
  onFocus,
  onBlur,
  required = false,
  disabled = false,
  className = '',
  error = false,
  icon,
  minLength,
  name
}: InputProps) {
  const baseClasses =
    "w-full rounded-2xl border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 font-montserrat focus:outline-none focus:ring-2 transition-colors"
  const errorClasses = error
    ? "focus:ring-rose-500/60 ring-1 ring-rose-500"
    : "focus:ring-cyan-900/20"
  const iconPadding = icon ? "pr-10" : "pr-3"

  return (
    <div className="relative">
      {icon && (
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
          {icon}
        </div>
      )}
      <input
        id={id}
        name={name ?? id}
        type={type}
        required={required}
        disabled={disabled}
        value={value}
        onChange={onChange}
        onFocus={onFocus}
        onBlur={onBlur}
        minLength={minLength}
        className={`${baseClasses} ${errorClasses} ${iconPadding} ${className}`}
        placeholder={placeholder}
      />
    </div>
  )
}
