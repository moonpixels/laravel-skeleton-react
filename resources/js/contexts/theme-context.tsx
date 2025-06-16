import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from 'react'
import { useLocalStorage } from 'react-use'

export type Theme = 'dark' | 'light' | 'system'

interface ThemeState {
  theme: Theme
  setTheme: (theme: Theme) => void
  isDarkMode: boolean
}

const ThemeContext = createContext<ThemeState | undefined>(undefined)

export function ThemeProvider({ children, ...props }: PropsWithChildren) {
  const [storedTheme, setStoredTheme] = useLocalStorage<Theme>(
    'theme',
    'system'
  )

  const [isDarkMode, setIsDarkMode] = useState<boolean>(false)

  useEffect(() => {
    const root = window.document.documentElement

    root.classList.remove('light', 'dark')

    if (storedTheme === 'system' || !storedTheme) {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)')
        .matches
        ? 'dark'
        : 'light'

      root.classList.add(systemTheme)
      setIsDarkMode(systemTheme === 'dark')
      return
    }

    root.classList.add(storedTheme)
    setIsDarkMode(storedTheme === 'dark')
  }, [storedTheme])

  function setTheme(theme: Theme) {
    setStoredTheme(theme)
  }

  const themeState = storedTheme
    ? {
        theme: storedTheme,
        setTheme,
        isDarkMode,
      }
    : undefined

  return (
    <ThemeContext.Provider {...props} value={themeState}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)

  if (context === undefined)
    throw new Error('useTheme must be used within a ThemeProvider')

  return context
}
