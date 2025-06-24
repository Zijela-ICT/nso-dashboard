import { UndoIcon } from "lucide-react";
import React, { useRef } from "react";

type NewlineTextFieldProps = {
  value: string;
  onChange: (val: string) => void;
  as?: "input" | "textarea";
  [key: string]: any; // for other props like placeholder, className, etc.
};

const NewlineTextField: React.FC<NewlineTextFieldProps> = ({
  value,
  onChange,
  as = "textarea",
  ...props
}) => {
  const ref = useRef<HTMLInputElement & HTMLTextAreaElement>(null);

  const insertNewline = () => {
    if (!ref.current) return;
    const el = ref.current;
    const start = el.selectionStart || 0;
    const end = el.selectionEnd || 0;
    const newValue = value.slice(0, start) + "\n" + value.slice(end);
    onChange(newValue);

    // Set cursor after the newline
    setTimeout(() => {
      el.selectionStart = el.selectionEnd = start + 1;
      el.focus();
    }, 0);
  };

  const Field = as;

  return (
    <div className="flex flex-1">
      <Field
        ref={ref}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`${props.className} flex-1 !min-h-[70px]`}
        {...props}
      />
      <button
        type="button"
        onClick={insertNewline}
        className="bg-[#e8e8e8] h-[40px] w-[40px] flex items-center justify-center"
      >
        <img src="/assets/new-line.svg" alt="" className="w-4" />
      </button>
    </div>
  );
};

export default NewlineTextField;
