import { useState } from 'react'
import { useCopyToClipboard } from 'react-use'

export function useCopy() {
  const [state, copyToClipboard] = useCopyToClipboard()

  const [copied, setCopied] = useState(false)

  function copyText(text: string) {
    copyToClipboard(text)

    if (state.value === text) {
      setCopied(true)

      setTimeout(() => {
        setCopied(false)
      }, 2000)
    }
  }

  return {
    copyText,
    copied,
  }
}
