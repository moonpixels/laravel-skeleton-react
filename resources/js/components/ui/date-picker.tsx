import { Calendar } from '@/components/ui/calendar'
import { Input } from '@/components/ui/input'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { format } from 'date-fns'
import { CalendarIcon } from 'lucide-react'
import * as React from 'react'
import { useCallback } from 'react'

type DatePickerProps = Omit<
  React.ComponentProps<typeof Calendar>,
  'locale' | 'mode' | 'selected' | 'onSelect'
> & {
  selected: Date | undefined
  onSelect: (date: Date | undefined) => void
  showTime?: boolean
  locale?: string
}

function DatePicker({
  selected,
  onSelect,
  showTime = false,
  locale = 'en-GB',
  ...props
}: DatePickerProps) {
  const [openFrom, setOpenFrom] = React.useState(false)
  const date = selected

  const handleDateChange = useCallback(
    (selectedDate: Date | undefined) => {
      if (date && selectedDate) {
        selectedDate.setHours(
          date.getHours(),
          date.getMinutes(),
          date.getSeconds()
        )
      }

      onSelect(selectedDate)

      setOpenFrom(false)
    },
    [date, onSelect]
  )

  const handleTimeChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const timeValue = event.target.value

      if (date && timeValue) {
        const [hours, minutes, seconds] = timeValue.split(':').map(Number)

        const updatedDate = new Date(date)
        updatedDate.setHours(hours, minutes, seconds)

        onSelect(updatedDate)
      }
    },
    [date, onSelect]
  )

  return (
    <div className="flex w-full gap-2">
      <div className="flex-1">
        <Popover open={openFrom} onOpenChange={setOpenFrom}>
          <PopoverTrigger asChild>
            <button
              aria-label="Select date"
              data-placeholder={date ? undefined : ''}
              className="border-input data-placeholder:text-muted-foreground [&_svg:not([class*='text-'])]:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive flex h-9 w-full min-w-[136px] items-center justify-between gap-3 rounded-md border bg-white px-3 py-2 text-sm shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 *:data-[slot=select-value]:flex *:data-[slot=select-value]:items-center *:data-[slot=select-value]:gap-2 dark:bg-white/5 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 [&>span]:line-clamp-1"
            >
              {date
                ? date.toLocaleDateString(locale, {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric',
                  })
                : 'Select date'}
              <CalendarIcon className="size-4 opacity-50" />
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-auto overflow-hidden p-0" align="start">
            <Calendar
              startMonth={new Date(new Date().getFullYear() - 10, 0)}
              endMonth={new Date(new Date().getFullYear() + 10, 11)}
              {...props}
              mode="single"
              captionLayout="dropdown"
              selected={date}
              onSelect={(date) => handleDateChange(date)}
            />
          </PopoverContent>
        </Popover>
      </div>
      {showTime && (
        <div>
          <Input
            aria-label="Select time"
            type="time"
            step="1"
            disabled={!date}
            value={date ? format(date, 'HH:mm:ss') : ''}
            onChange={handleTimeChange}
            className="appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
          />
        </div>
      )}
    </div>
  )
}

export { DatePicker }
