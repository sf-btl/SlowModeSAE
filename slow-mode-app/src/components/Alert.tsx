"use client";

interface AlertProps {
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
  onClose?: () => void;
}

export default function Alert({ type, message, onClose }: AlertProps) {
  const baseClasses = "p-4 rounded-md mb-4 font-montserrat text-sm flex items-start justify-between";
  
  const typeClasses = {
    success: "bg-emerald-50 text-emerald-800 border border-emerald-200",
    error: "bg-rose-50 text-rose-800 border border-rose-200",
    info: "bg-blue-50 text-blue-800 border border-blue-200",
    warning: "bg-amber-50 text-amber-800 border border-amber-200"
  };

  return (
    <div className={`${baseClasses} ${typeClasses[type]}`}>
      <div className="flex-1">
        {message}
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className="ml-3 text-current opacity-50 hover:opacity-100 transition-opacity"
          aria-label="Fermer"
        >
          ✕
        </button>
      )}
    </div>
  );
}
