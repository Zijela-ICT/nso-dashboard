import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
<<<<<<< HEAD
  "inline-flex items-center rounded-full text-xs px-2 py-0.5 font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        success:
          "bg-[#E7F6EC] text-[#036B26] ",
        pending:
        "bg-[#FFAB0014] text-[#B76E00] ",
        failed: "text-[#B42318] bg-[#FEF3F2] border-[#FECDCA]",
        overdue: "text-[#B54708] border-[#FEDF89] bg-[#FFFAEB]"
      },
    },
    defaultVariants: {
      variant: "success",
=======
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "text-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
>>>>>>> c19478d79349764ae1e3db0c71a9bf05832c4460
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
