"use client"

import * as React from "react"
import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface DatePickerProps {
  value?: Date | undefined
  onChange?: (date: Date | undefined) => void
  fromDate?: Date;
  placeholder?: string
  disabled?: boolean
}

export function DatePicker({ 
  value, 
  onChange, 
  placeholder = "Pick a date" ,
  fromDate,
  disabled = false
}: DatePickerProps) {
  // Ensure value is a valid Date object or undefined
  const dateValue = value instanceof Date ? value : undefined

  const minDate = React.useMemo(() => {
    if (fromDate) return fromDate;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return today;
  }, [fromDate]);
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-full justify-start text-left font-normal",
            !dateValue && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {dateValue ? format(dateValue, "PPP") : <span>{placeholder}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={dateValue}
          onSelect={onChange}
          initialFocus
          fromDate={minDate}
          disabled={(date) => date < minDate || disabled}
        />
      </PopoverContent>
    </Popover>
  )
}