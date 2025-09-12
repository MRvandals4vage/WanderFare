"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

export type UserRole = "customer" | "vendor" | "admin" | null

interface AuthContextType {
  userRole: UserRole
  setUserRole: (role: UserRole) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [userRole, setUserRole] = useState<UserRole>(null)

  const logout = () => {
    setUserRole(null)
  }

  return <AuthContext.Provider value={{ userRole, setUserRole, logout }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
