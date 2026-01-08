"use client";

interface ButtonProps {
  children: React.ReactNode
  type?: 'button' | 'submit' | 'reset'
  disabled?: boolean
  onClick?: () => void
  className?: string
  variant?: 'primary' | 'link'
}

export default function Button({ 
  children, 
  type = 'button', 
  disabled = false, 
  onClick,
  className = '',
  variant = 'primary'
}: ButtonProps) {
  const baseClasses = "transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
  
  const variantClasses = {
    primary:
      "w-full bg-cyan-950 text-white py-3 px-4 rounded-full hover:bg-cyan-900 font-montserrat text-sm font-semibold",
    link: "text-sm font-bold font-istok-web text-cyan-950 hover:text-cyan-950/80 inline",
  }

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
    >
      {children}
    </button>
  )
}
