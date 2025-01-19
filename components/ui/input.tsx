import * as React from "react";
import { cn } from "@/lib/utils";
import { Icon } from "./icon";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  name: string;
  errorMessage?: string;
  containerClassName?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, type, containerClassName, errorMessage, ...props }, ref) => {
    const [showPassword, setShowPassword] = React.useState(false);
    const isPassword = type === "password";

    const togglePasswordVisibility = () => {
      setShowPassword(!showPassword);
    };

    return (
      <div className={cn("w-full flex flex-col gap-1 relative", containerClassName &&containerClassName )}>
        {label && <label
          htmlFor={props.name}
          className="text-[#637381] font-semibold text-sm">
          {label}
        </label>}

        <input
          type={isPassword ? (showPassword ? "text" : "password") : type}
          className={cn(
            "border-none ring-0 outline-none bg-[#919EAB14] w-full text-sm text-[#344054] placeholder:text-[#919EAB] placeholder:font-normal placeholder:text-sm px-3 py-4 rounded-lg",
            errorMessage && "border-[#A8353A] border",
            className
          )}
          ref={ref}
          {...props}
        />

        {isPassword && (
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className="absolute right-3 bottom-0 top-7">
            <Icon
              name={showPassword ? "eye-closed" : "eye-closed"}
              className="w-5 h-5"
              stroke="none"
            />
          </button>
        )}
        {errorMessage && <p className="text-[#F97066] text-xs bottom-[-1rem]">{errorMessage}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";

export { Input };
