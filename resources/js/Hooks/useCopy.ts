import { useClipboard } from '@reactuses/core'
import { useState } from 'react'

export function useCopy() {
  const [copiedText, copy] = useClipboard()

  const [copied, setCopied] = useState(false)

  async function copyText(text: string) {
    await copy(text)

    if (copiedText === text) {
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
