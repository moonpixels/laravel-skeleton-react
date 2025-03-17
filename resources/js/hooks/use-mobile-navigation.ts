import { useSidebar } from '@/components/ui/sidebar'
import { useCallback } from 'react'

export function useMobileNavigation() {
  const { setOpenMobile } = useSidebar()

  return useCallback(() => {
    setOpenMobile(false)
    document.body.style.removeProperty('pointer-events')
  }, [setOpenMobile])
}
