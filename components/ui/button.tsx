import * as React from "react";
import {Slot} from "@radix-ui/react-slot";
import {cva, type VariantProps} from "class-variance-authority";

import {cn} from "@/lib/utils";

type SpinnerProps = {
  className?: string;
};
const Spinner = ({className}: SpinnerProps) => (
  <svg
    className={cn("animate-spin h-5 w-5", className && className)}
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
  >
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
    />
  </svg>
);

const buttonVariants = cva(
  "inline-flex h-[48px] items-center justify-center whitespace-nowrap w-full rounded-[8px] text-base font-medium  transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:bg-[#919EAB33] disabled:text-[#919EABCC] ",
  {
    variants: {
      variant: {
        default: "bg-[#0CA554] text-[#FCFCFD] hover:bg-[#0CA554]/90",
        destructive:
          "bg-red-500 text-neutral-50 hover:bg-red-500/90 dark:bg-red-900 dark:text-neutral-50 dark:hover:bg-red-900/90",
        outline:
            "border border-[#0CA554] bg-white text-[#0CA554]  dark:hover:text-neutral-50",
        secondary:
          "bg-neutral-100 text-neutral-900 hover:bg-neutral-100/80 dark:bg-neutral-800 dark:text-neutral-50 dark:hover:bg-neutral-800/80",
        ghost:
          "hover:bg-neutral-100 hover:text-neutral-900 dark:hover:bg-neutral-800 dark:hover:text-neutral-50",
        link: "text-neutral-900 underline-offset-4 hover:underline dark:text-neutral-50",
      },
      size: {
        default: "px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  isLoading?: boolean;
  loadingText?: string;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      isLoading = false,
      loadingText,
      disabled,
      children,
      asChild = false,
      ...props
    },
    ref,
  ) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(
          buttonVariants({variant, size, className}),
          isLoading && "cursor-not-allowed opacity-70",
        )}
        ref={ref}
        disabled={disabled || isLoading}
        {...props}
      >
        <span className="flex items-center justify-center gap-2">
          {isLoading && <Spinner />}
          {isLoading && loadingText ? loadingText : children}
        </span>
      </Comp>
    );
  },
);
Button.displayName = "Button";

export {Button, buttonVariants, Spinner};
