import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-gradient-primary text-white shadow-lg hover:shadow-xl hover:scale-105 active:scale-95",
        primary: "bg-primary-500 text-white shadow-lg hover:bg-primary-600 hover:shadow-xl active:scale-95",
        destructive:
          "bg-accent-500 text-white shadow-lg hover:bg-accent-600 hover:shadow-xl active:scale-95",
        outline:
          "border-2 border-primary-400 bg-background text-foreground hover:bg-primary-50 shadow-sm",
        secondary:
          "bg-secondary-500 text-white shadow-lg hover:bg-secondary-600 hover:shadow-xl active:scale-95",
        ghost: "text-foreground hover:bg-primary-100 hover:text-primary-600",
        link: "text-primary-500 underline-offset-4 hover:underline font-semibold",
        danger: "bg-accent-500 text-white shadow-lg hover:bg-accent-600 hover:shadow-xl active:scale-95",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        md: "h-9 px-4 py-2",
        lg: "h-10 rounded-md px-8",
        icon: "size-9",
        "icon-sm": "size-8",
        "icon-lg": "size-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  loading?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, loading, disabled, children, ...props }, ref) => {
    // Map old variant names to new ones
    const mappedVariant = (variant === "primary" ? "primary" : variant === "danger" ? "danger" : variant) as any;

    return (
      <button
        className={cn(buttonVariants({ variant: mappedVariant, size, className }))}
        ref={ref}
        disabled={disabled || loading}
        {...props}
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            Загрузка...
          </span>
        ) : (
          children
        )}
      </button>
    );
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
