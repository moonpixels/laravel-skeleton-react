import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useMemo,
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

  const effectiveTheme = useMemo(() => {
    if (storedTheme === 'system' || !storedTheme) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light'
    }
    return storedTheme
  }, [storedTheme])

  const isDarkMode = effectiveTheme === 'dark'

  useEffect(() => {
    const root = window.document.documentElement
    root.classList.remove('light', 'dark')
    root.classList.add(effectiveTheme)
  }, [effectiveTheme])

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
