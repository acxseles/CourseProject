"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = "text", label, error, ...props }, ref) => (
    <div className="w-full flex flex-col gap-1.5">
      {label && (
        <label className="text-sm font-semibold text-foreground">
          {label}
        </label>
      )}
      <input
        type={type}
        ref={ref}
        className={cn(
          "w-full rounded-lg border-2 px-3 py-2 text-base shadow-sm transition-all placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:cursor-not-allowed disabled:opacity-50",
          error && "border-accent-500 focus:ring-accent-500",
          className
        )}
        style={{
          backgroundColor: "var(--bg-primary)",
          color: "var(--text-primary)",
          borderColor: error ? "var(--color-accent-500)" : "var(--color-primary-200)",
        }}
        {...props}
      />
      {error && (
        <p className="text-xs text-accent-600 flex items-center gap-1 mt-1">
          <span>⚠</span> {error}
        </p>
      )}
    </div>
  )
)

Input.displayName = "Input"

export { Input }
