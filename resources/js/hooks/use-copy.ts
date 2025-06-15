import { useEffect, useRef, useState } from 'react'
import { useCopyToClipboard } from 'react-use'

export function useCopy() {
  const [state, copyText] = useCopyToClipboard()

  const [copied, setCopied] = useState(false)

  const timeoutRef = useRef<number | null>(null)

  useEffect(() => {
    if (!state.value) return

    setCopied(true)

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    timeoutRef.current = window.setTimeout(() => {
      setCopied(false)
      timeoutRef.current = null
    }, 2000)

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
        timeoutRef.current = null
      }
    }
  }, [state])

  return {
    copyText,
    copied,
  }
}
