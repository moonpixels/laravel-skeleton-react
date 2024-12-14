import { useDarkMode as useDarkModeCore, usePreferredDark } from '@reactuses/core'
import { createContext, PropsWithChildren, useContext } from 'react'

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
  const [isDarkMode, toggleDarkMode] = useDarkModeCore({
    classNameDark: 'dark',
    classNameLight: '',
    defaultValue: usePreferredDark(false),
  })

  function setDarkMode(darkMode: boolean) {
    if (darkMode !== isDarkMode) {
      toggleDarkMode()
    }
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
