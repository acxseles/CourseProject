import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center justify-center rounded-full border px-3 py-1 text-xs font-bold w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none transition-all overflow-hidden shadow-sm",
  {
    variants: {
      variant: {
        default: "bg-primary-400 text-white border-primary-500 shadow-md",
        secondary: "bg-secondary-400 text-white border-secondary-500 shadow-md",
        accent: "bg-accent-400 text-white border-accent-500 shadow-md",
        outline: "border-2 border-primary-400 text-primary-600 bg-primary-50 hover:bg-primary-100",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({
  className,
  variant,
  asChild = false,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "span"

  return (
    <Comp
      data-slot="badge"
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  )
}

export { Badge, badgeVariants }
