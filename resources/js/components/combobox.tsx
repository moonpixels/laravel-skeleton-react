import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { cn } from '@/utils/utils'
import { CheckIcon, ChevronDownIcon } from 'lucide-react'
import * as React from 'react'

interface ComboboxContextValue {
  value: string | string[]
  onValueChange: (value: string | string[]) => void
  multiple: boolean
  open: boolean
  setOpen: (open: boolean) => void
}

const ComboboxContext = React.createContext<ComboboxContextValue | null>(null)

function useCombobox() {
  const context = React.useContext(ComboboxContext)
  if (!context) {
    throw new Error('Combobox components must be used within a Combobox')
  }
  return context
}

interface ComboboxProps<Multiple extends boolean = false> {
  value?: Multiple extends true ? string[] : string
  defaultValue?: Multiple extends true ? string[] : string
  onValueChange?: (value: Multiple extends true ? string[] : string) => void
  multiple?: Multiple
  open?: boolean
  onOpenChange?: (open: boolean) => void
  children: React.ReactNode
}

function Combobox<Multiple extends boolean = false>({
  value,
  defaultValue,
  onValueChange,
  multiple = false as Multiple,
  open: controlledOpen,
  onOpenChange,
  children,
}: ComboboxProps<Multiple>) {
  const [internalValue, setInternalValue] = React.useState<string | string[]>(
    value ?? defaultValue ?? (multiple ? [] : '')
  )
  const [internalOpen, setInternalOpen] = React.useState(false)

  const currentValue = value ?? internalValue
  const currentOpen = controlledOpen ?? internalOpen

  const handleValueChange = React.useCallback(
    (newValue: string | string[]) => {
      if (value === undefined) {
        setInternalValue(newValue)
      }
      onValueChange?.(newValue as Multiple extends true ? string[] : string)
    },
    [value, onValueChange]
  )

  const handleOpenChange = React.useCallback(
    (newOpen: boolean) => {
      if (controlledOpen === undefined) {
        setInternalOpen(newOpen)
      }
      onOpenChange?.(newOpen)
    },
    [controlledOpen, onOpenChange]
  )

  const contextValue = React.useMemo(
    () => ({
      value: currentValue,
      onValueChange: handleValueChange,
      multiple: multiple as boolean,
      open: currentOpen,
      setOpen: handleOpenChange,
    }),
    [currentValue, handleValueChange, multiple, currentOpen, handleOpenChange]
  )

  return (
    <ComboboxContext.Provider value={contextValue}>
      <Popover open={currentOpen} onOpenChange={handleOpenChange}>
        {children}
      </Popover>
    </ComboboxContext.Provider>
  )
}

interface ComboboxTriggerProps extends React.ComponentPropsWithoutRef<
  typeof Button
> {
  children?: React.ReactNode
}

function ComboboxTrigger({
  className,
  children,
  ...props
}: ComboboxTriggerProps) {
  const { open } = useCombobox()

  return (
    <PopoverTrigger asChild>
      <button
        role="combobox"
        aria-expanded={open}
        className={cn(
          "border-input data-placeholder:text-muted-foreground [&_svg:not([class*='text-'])]:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive flex h-9 w-full items-center justify-between rounded-md border bg-white px-3 py-2 text-sm shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 dark:bg-white/5 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 [&>span]:line-clamp-1",
          className
        )}
        {...props}
      >
        {children}
        <ChevronDownIcon className="size-4 opacity-50" />
      </button>
    </PopoverTrigger>
  )
}

interface ComboboxValueProps {
  placeholder?: string
  className?: string
  children?: (value: string | string[]) => React.ReactNode
}

function ComboboxValue({
  placeholder,
  className,
  children,
}: ComboboxValueProps) {
  const { value } = useCombobox()

  const isEmpty = !value || (Array.isArray(value) && value.length === 0)

  return (
    <span className={className} data-placeholder={isEmpty ? true : undefined}>
      {isEmpty ? placeholder : (children?.(value) ?? value)}
    </span>
  )
}

interface ComboboxContentProps extends React.ComponentPropsWithoutRef<
  typeof PopoverContent
> {
  children: React.ReactNode
  className?: string
}

function ComboboxContent({ children, className }: ComboboxContentProps) {
  return (
    <PopoverContent
      className={cn(
        'w-full max-w-(--radix-popover-trigger-width) p-0',
        className
      )}
    >
      <Command>{children}</Command>
    </PopoverContent>
  )
}

function ComboboxInput(
  props: React.ComponentPropsWithoutRef<typeof CommandInput>
) {
  return <CommandInput {...props} />
}

interface ComboboxItemProps extends Omit<
  React.ComponentPropsWithoutRef<typeof CommandItem>,
  'value'
> {
  value: string
  children: React.ReactNode
}

function ComboboxItem({
  value: itemValue,
  onSelect,
  children,
  ...props
}: ComboboxItemProps) {
  const { value, onValueChange, multiple, setOpen } = useCombobox()

  const isSelected = multiple
    ? (value as string[]).includes(itemValue)
    : value === itemValue

  const handleSelect = () => {
    if (multiple) {
      const currentValues = value as string[]
      const newValues = isSelected
        ? currentValues.filter((v) => v !== itemValue)
        : [...currentValues, itemValue]
      onValueChange(newValues)
    } else {
      const newValue = isSelected ? '' : itemValue
      onValueChange(newValue)
      setOpen(false)
    }
    onSelect?.(itemValue)
  }

  return (
    <CommandItem onSelect={handleSelect} {...props}>
      {children}
      <CheckIcon
        className={cn(
          'ml-auto size-4',
          isSelected ? 'opacity-100' : 'opacity-0'
        )}
      />
    </CommandItem>
  )
}

function ComboboxEmpty(
  props: React.ComponentPropsWithoutRef<typeof CommandEmpty>
) {
  return <CommandEmpty {...props} />
}

function ComboboxGroup(
  props: React.ComponentPropsWithoutRef<typeof CommandGroup>
) {
  return <CommandGroup {...props} />
}

function ComboboxList(
  props: React.ComponentPropsWithoutRef<typeof CommandList>
) {
  return <CommandList {...props} />
}

function ComboboxSeparator({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('bg-border pointer-events-none -mx-1 my-1 h-px', className)}
      {...props}
    />
  )
}

function ComboboxLabel({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('px-2 py-1.5 text-sm font-medium', className)}
      {...props}
    />
  )
}

export {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxGroup,
  ComboboxInput,
  ComboboxItem,
  ComboboxLabel,
  ComboboxList,
  ComboboxSeparator,
  ComboboxTrigger,
  ComboboxValue,
}
