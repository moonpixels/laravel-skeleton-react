import { User } from '@/types'
import { usePage } from '@inertiajs/react'
import { createContext, PropsWithChildren, useContext } from 'react'

interface UserState {
  user: User
  twoFactorEnabled: boolean
}

const UserContext = createContext<UserState | undefined>(undefined)

export function UserProvider({ children, ...props }: PropsWithChildren) {
  let userState = undefined

  const page = usePage()

  const user = page.props.user

  if (user) {
    userState = {
      user,
      twoFactorEnabled: !!user.twoFactorConfirmedAt,
    }
  }

  return (
    <UserContext.Provider {...props} value={userState}>
      {children}
    </UserContext.Provider>
  )
}

export function useUser() {
  const context = useContext(UserContext)

  if (context === undefined) {
    throw new Error(
      'useUser must be used within a UserProvider with an authenticated user'
    )
  }

  return context
}
