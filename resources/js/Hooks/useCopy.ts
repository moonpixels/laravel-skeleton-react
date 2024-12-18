import { useRef, useState } from 'react'
import { useCopyToClipboard } from 'react-use'

export function useCopy() {
  const [state, copyToClipboard] = useCopyToClipboard()

  const [copied, setCopied] = useState(false)

  const timeoutRef = useRef<number | null>(null)

  function copyText(text: string) {
    setCopied(false)

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    copyToClipboard(text)

    if (state.value === text) {
      setCopied(true)

      timeoutRef.current = window.setTimeout(() => {
        setCopied(false)
      }, 2000)
    }
  }

  return {
    copyText,
    copied,
  }
}
