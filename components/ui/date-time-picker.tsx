import React from "react";
import { format, isValid, setHours, setMinutes, parseISO } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface DateTimePickerProps {
  value?: Date;
  onChange?: (date: Date | undefined) => void;
  fromDate?: Date;
  placeholder?: string;
  disabled?: boolean;
}

export function DateTimePicker({
  value,
  onChange,
  placeholder = "Pick date and time",
  fromDate,
  disabled = false,
}: DateTimePickerProps) {
  // Safe date validation
  const dateValue = React.useMemo(() => {
    if (!value) return undefined;
    if (value instanceof Date && isValid(value)) return value;
    if (typeof value === "string") {
      const parsed = parseISO(value);
      return isValid(parsed) ? parsed : undefined;
    }
    const converted = new Date(value);
    return isValid(converted) ? converted : undefined;
  }, [value]);

  const minDate = React.useMemo(() => {
    if (fromDate && isValid(fromDate)) return fromDate;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return today;
  }, [fromDate]);

  // Fixed time change handler
  const handleTimeChange = (timeString: string) => {
    if (!timeString) return;

    try {
      const [hoursStr, minutesStr] = timeString.split(":");
      const hours = parseInt(hoursStr, 10);
      const minutes = parseInt(minutesStr, 10);

      if (
        isNaN(hours) ||
        isNaN(minutes) ||
        hours < 0 ||
        hours > 23 ||
        minutes < 0 ||
        minutes > 59
      ) {
        console.warn("Invalid time format:", timeString);
        return;
      }

      // Use existing date or create new one for today
      const baseDate = dateValue || new Date();
      const newDate = setMinutes(setHours(baseDate, hours), minutes);

      onChange?.(newDate);
    } catch (error) {
      console.error("Error parsing time:", error);
    }
  };

  // Safe date selection handler
  const handleDateSelect = (selectedDate: Date | undefined) => {
    if (!selectedDate || !isValid(selectedDate)) {
      onChange?.(undefined);
      return;
    }

    // Preserve time if it exists, otherwise use current time
    if (dateValue && isValid(dateValue)) {
      const newDate = setMinutes(
        setHours(selectedDate, dateValue.getHours()),
        dateValue.getMinutes()
      );
      onChange?.(newDate);
    } else {
      // Set to current time if no previous time was set
      const now = new Date();
      const newDate = setMinutes(
        setHours(selectedDate, now.getHours()),
        now.getMinutes()
      );
      onChange?.(newDate);
    }
  };

  // Safe time format helper
  const getTimeValue = () => {
    try {
      if (dateValue && isValid(dateValue)) {
        return format(dateValue, "HH:mm");
      }
      // Default to current time if no date selected
      return format(new Date(), "HH:mm");
    } catch (error) {
      console.error("Error formatting time:", error);
      return "00:00";
    }
  };

  // Safe display format helper
  const getDisplayValue = () => {
    try {
      if (dateValue && isValid(dateValue)) {
        return format(dateValue, "PPP HH:mm");
      }
      return placeholder;
    } catch (error) {
      console.error("Error formatting display date:", error);
      return placeholder;
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          disabled={disabled}
          className={cn(
            "w-full justify-start text-left font-normal",
            !dateValue && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          <span>{getDisplayValue()}</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <label htmlFor="time-input" className="text-sm font-medium">
              Time:
            </label>
            <input
              id="time-input"
              type="time"
              value={getTimeValue()}
              onChange={(e) => handleTimeChange(e.target.value)}
              className="px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={disabled}
            />
          </div>
        </div>
        <Calendar
          mode="single"
          selected={dateValue}
          onSelect={handleDateSelect}
          initialFocus
          fromDate={minDate}
          disabled={(date) => {
            if (disabled) return true;
            if (!date || !isValid(date)) return true;
            return date < minDate;
          }}
        />
      </PopoverContent>
    </Popover>
  );
}
