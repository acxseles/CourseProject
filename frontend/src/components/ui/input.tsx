import * as React from "react"
import { cn } from "@/lib/utils"

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, label, error, ...props }, ref) => (
    <div className="w-full flex flex-col gap-2">
      {label && (
        <label className="text-sm font-bold text-foreground">
          {label}
        </label>
      )}
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-lg border-2 border-primary-200 px-4 py-2 text-base shadow-sm transition-all file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:border-primary-400 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          error && "border-accent-400 focus-visible:ring-accent-400",
          className
        )}
        style={{
          backgroundColor: 'var(--bg-primary)',
          color: 'var(--text-primary)',
          borderColor: error ? 'var(--color-accent-400)' : 'var(--color-primary-200)'
        }}
        ref={ref}
        {...props}
      />
      {error && (
        <span className="text-sm font-medium text-accent-600 flex items-center gap-1">
          <span className="inline-block">⚠</span> {error}
        </span>
      )}
    </div>
  )
)
Input.displayName = "Input"

export { Input }
