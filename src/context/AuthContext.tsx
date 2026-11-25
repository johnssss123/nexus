import { createContext, useContext, useState, type ReactNode } from 'react'

interface User {
  id: number
  email: string
  name: string
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const stored = localStorage.getItem('nexus_user')
    return stored ? JSON.parse(stored) : null
  })

  async function login(email: string, password: string) {
    const res = await fetch(
      `http://localhost:3001/users?email=${email}&password=${password}`
    )
    const results = await res.json()
    if (results.length === 0) throw new Error('Invalid credentials')
    setUser(results[0])
    localStorage.setItem('nexus_user', JSON.stringify(results[0]))
  }

  function logout() {
    setUser(null)
    localStorage.removeItem('nexus_user')
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}