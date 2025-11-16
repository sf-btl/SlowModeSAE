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
  const baseClasses = "w-full pl-3 py-2 text-black font-montserrat bg-input-bg border-0 rounded-md focus:outline-none focus:ring-2 transition-colors"
  const errorClasses = error 
    ? "focus:ring-rose-800/80 ring-1 ring-rose-800" 
    : "focus:ring-zinc-500"
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
        name={name}
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