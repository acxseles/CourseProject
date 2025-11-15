import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { AlertCircle, CheckCircle, AlertTriangle, Info } from "lucide-react"

const alertVariants = cva(
  "relative w-full rounded-lg border-2 p-4 [&>svg~*]:pl-7 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4",
  {
    variants: {
      variant: {
        default: "bg-primary-50 border-primary-200 text-foreground [&>svg]:text-primary-500",
        destructive: "bg-accent-50 border-accent-200 text-foreground [&>svg]:text-accent-500",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

interface AlertBaseProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof alertVariants> {
  type?: "success" | "error" | "warning" | "info";
  children: React.ReactNode;
}

const Alert = React.forwardRef<HTMLDivElement, AlertBaseProps>(
  ({ className, variant, type, children, ...props }, ref) => {
    const styles = {
      success: "bg-accent-50 text-accent-900 border-2 border-accent-200",
      error: "bg-accent-50 text-accent-900 border-2 border-accent-200",
      warning: "bg-secondary-50 text-secondary-900 border-2 border-secondary-200",
      info: "bg-primary-50 text-primary-900 border-2 border-primary-200",
    };

    const icons = {
      success: <CheckCircle className="w-5 h-5 flex-shrink-0" />,
      error: <AlertCircle className="w-5 h-5 flex-shrink-0" />,
      warning: <AlertTriangle className="w-5 h-5 flex-shrink-0" />,
      info: <Info className="w-5 h-5 flex-shrink-0" />,
    };

    if (type) {
      return (
        <div
          ref={ref}
          role="alert"
          className={cn(
            "w-full flex gap-3 p-3 rounded-lg border",
            styles[type],
            className
          )}
          {...props}
        >
          <div className="flex-shrink-0 mt-0.5">{icons[type]}</div>
          <div className="flex-1 text-sm font-medium">{children}</div>
        </div>
      );
    }

    return (
      <div
        ref={ref}
        role="alert"
        className={cn(alertVariants({ variant }), className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);
Alert.displayName = "Alert"

const AlertTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h5
    ref={ref}
    className={cn("mb-1 font-medium leading-none tracking-tight", className)}
    {...props}
  />
))
AlertTitle.displayName = "AlertTitle"

const AlertDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-sm [&_p]:leading-relaxed", className)}
    {...props}
  />
))
AlertDescription.displayName = "AlertDescription"

export { Alert, AlertTitle, AlertDescription }
