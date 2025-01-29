import { createContext, PropsWithChildren, useContext } from 'react'
import { useLocalStorage } from 'react-use'

type DarkModeState = {
  isDarkMode: boolean
  setDarkMode: (darkMode: boolean) => void
}

const DarkModeContext = createContext<DarkModeState | undefined>(undefined)

function updateRootClass(isDarkMode: boolean) {
  window.document.documentElement.classList.toggle('dark', isDarkMode)
}

export function DarkModeProvider({ children, ...props }: PropsWithChildren) {
  const [isDarkMode, setIsDarkMode] = useLocalStorage(
    'dark-mode',
    window.matchMedia('(prefers-color-scheme: dark)').matches
  )

  updateRootClass(!!isDarkMode)

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
