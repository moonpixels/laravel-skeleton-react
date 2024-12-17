import { createContext, PropsWithChildren, useContext, useEffect } from 'react'
import { useLocalStorage } from 'react-use'

type DarkModeState = {
  isDarkMode: boolean
  setDarkMode: (darkMode: boolean) => void
}

const initialState = {
  isDarkMode: false,
  setDarkMode: () => null,
}

const DarkModeContext = createContext<DarkModeState>(initialState)

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
    <DarkModeContext.Provider {...props} value={{ isDarkMode: !!isDarkMode, setDarkMode }}>
      {children}
    </DarkModeContext.Provider>
  )
}

export function useDarkMode() {
  const context = useContext(DarkModeContext)

  if (context === undefined) {
    throw new Error('useDarkMode must be used within a DarkModeProvider')
  }

  return context
}
