import { PrimaryNavigation } from '@/Components/PrimaryNavigation'
import { Button } from '@/Components/UI/Button'
import { Sheet, SheetContent, SheetTrigger } from '@/Components/UI/Sheet'
import { EqualIcon } from 'lucide-react'

export function MobileNavigation() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button className="lg:hidden" size="icon" variant="ghost">
          <EqualIcon className="size-5" />
        </Button>
      </SheetTrigger>

      <SheetContent hideCloseButton side="left">
        <PrimaryNavigation />
      </SheetContent>
    </Sheet>
  )
}
