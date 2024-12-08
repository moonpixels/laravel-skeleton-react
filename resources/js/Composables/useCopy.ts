import { useClipboard } from '@vueuse/core'

export function useCopy() {
  const { copy, copied } = useClipboard()

  async function copyText(text: string) {
    await copy(text)
  }

  return {
    copyText,
    copied,
  }
}
