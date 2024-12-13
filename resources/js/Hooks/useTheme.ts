import { useDarkMode, usePreferredDark } from '@reactuses/core'

export function useTheme() {
  const [theme, toggleDark] = useDarkMode({
    classNameDark: 'dark',
    classNameLight: 'light',
    defaultValue: usePreferredDark(false),
  })

  const isDarkTheme = !!theme

  function toggleTheme() {
    toggleDark()
  }

  return {
    isDarkTheme,
    toggleTheme,
  }
}
