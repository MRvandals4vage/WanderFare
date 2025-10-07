"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { auth, AuthResponse } from "@/lib/api"

export type UserRole = "CUSTOMER" | "VENDOR" | "ADMIN" | null

interface AuthContextType {
  user: AuthResponse | null
  userRole: UserRole
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (userData: any) => Promise<void>
  logout: () => void
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthResponse | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check if user is logged in on mount
    const savedUser = auth.getCurrentUser()
    if (savedUser && auth.isAuthenticated()) {
      setUser(savedUser)
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true)
      const userData = await auth.login({ email, password })
      setUser(userData)
    } catch (error) {
      console.error('Login failed:', error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const register = async (userData: any) => {
    try {
      setIsLoading(true)
      const user = await auth.register(userData)
      setUser(user)
    } catch (error) {
      console.error('Registration failed:', error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    // Clear all auth-related storage
    try {
      auth.logout()
      sessionStorage.clear()
    } catch {}
    // Immediately drop user state
    setUser(null)
    // Hard reload to ensure all components reset
    if (typeof window !== 'undefined') {
      setTimeout(() => {
        window.location.replace('/');
      }, 0)
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        userRole: user?.role as UserRole || null,
        isLoading,
        login,
        register,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
