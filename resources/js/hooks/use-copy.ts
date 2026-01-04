import { useCallback, useEffect, useRef, useState } from 'react'
import { useCopyToClipboard } from 'react-use'

export function useCopy() {
  const [, copyToClipboard] = useCopyToClipboard()

  const [copied, setCopied] = useState(false)

  const timeoutRef = useRef<number | null>(null)

  const copyText = useCallback(
    (text: string) => {
      copyToClipboard(text)
      setCopied(true)

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }

      timeoutRef.current = window.setTimeout(() => {
        setCopied(false)
        timeoutRef.current = null
      }, 2000)
    },
    [copyToClipboard]
  )

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
        timeoutRef.current = null
      }
    }
  }, [])

  return {
    copyText,
    copied,
  }
}
