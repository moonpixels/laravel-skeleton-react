import { createContext, PropsWithChildren, useContext, useEffect } from 'react'
import { useLocalStorage } from 'react-use'

type DarkModeProviderState = {
  isDarkMode: boolean
  setDarkMode: (darkMode: boolean) => void
}

const initialState = {
  isDarkMode: false,
  setDarkMode: () => null,
}

const DarkModeProviderContext = createContext<DarkModeProviderState>(initialState)

export function DarkModeProvider({ children, ...props }: PropsWithChildren) {
  const [isDarkMode, setIsDarkMode] = useLocalStorage(
    'dark-mode',
    window.matchMedia('(prefers-color-scheme: dark)').matches
  )

  useEffect(() => {
    const root = window.document.documentElement

    root.classList.remove('dark')

    if (isDarkMode) {
      root.classList.add('dark')
    }
  }, [isDarkMode])

  function setDarkMode(darkMode: boolean) {
    setIsDarkMode(darkMode)
  }

  return (
    <DarkModeProviderContext.Provider {...props} value={{ isDarkMode: !!isDarkMode, setDarkMode }}>
      {children}
    </DarkModeProviderContext.Provider>
  )
}

export function useDarkMode() {
  const context = useContext(DarkModeProviderContext)

  if (context === undefined) {
    throw new Error('useDarkMode must be used within a DarkModeProvider')
  }

  return context
}
