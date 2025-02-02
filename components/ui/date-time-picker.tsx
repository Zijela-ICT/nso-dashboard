import React from 'react';
import { format } from "date-fns";
import { Calendar as CalendarIcon, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
  disabled = false
}: DateTimePickerProps) {
  const dateValue = value instanceof Date ? value : undefined;
  
  const minDate = React.useMemo(() => {
    if (fromDate) return fromDate;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return today;
  }, [fromDate]);

  const handleTimeChange = (newHour: string) => {
    if (!dateValue) return;
    
    const newDate = new Date(dateValue);
    newDate.setHours(parseInt(newHour), 0, 0, 0);
    onChange?.(newDate);
  };

  const hours = Array.from({ length: 24 }, (_, i) => ({
    value: i.toString(),
    label: i.toString().padStart(2, '0') + ':00'
  }));

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full justify-start text-left font-normal",
            !dateValue && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {dateValue ? (
            format(dateValue, "PPP HH:mm")
          ) : (
            <span>{placeholder}</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <Clock className="h-4 w-4" />
            <Select
              value={dateValue?.getHours().toString()}
              onValueChange={handleTimeChange}
            >
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Select time" />
              </SelectTrigger>
              <SelectContent>
                {hours.map((hour) => (
                  <SelectItem key={hour.value} value={hour.value}>
                    {hour.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
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
  );
}