'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { User } from '@/types'
import { authService } from '@/services/auth.service'

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  signup: (email: string, password: string, name: string, phone?: string) => Promise<void>
  logout: () => void
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const initAuth = async () => {
      if (authService.isAuthenticated()) {
        try {
          const userData = await authService.getProfile()
          setUser(userData)
        } catch (error) {
          console.error('Error getting user profile:', error)
          // Solo hacer logout si es un error 401 (no autorizado)
          if (error instanceof Error && 'response' in error && error.response && typeof error.response === 'object' && 'status' in error.response && error.response.status === 401) {
            console.log('Token inválido, haciendo logout')
            authService.logout()
            setUser(null)
          }
        }
      }
      setLoading(false)
    }

    initAuth()
  }, [])

  const login = async (email: string, password: string) => {
    try {
      const response = await authService.login({ email, password })
      authService.setToken(response.token)
      setUser(response.user)
    } catch (error) {
      throw error
    }
  }

  const signup = async (email: string, password: string, name: string, phone?: string) => {
    try {
      const response = await authService.signup({ email, password, name, phone })
      authService.setToken(response.token)
      setUser(response.user)
    } catch (error) {
      throw error
    }
  }

  const logout = () => {
    authService.logout()
    setUser(null)
  }

  const value = {
    user,
    loading,
    login,
    signup,
    logout,
    isAuthenticated: !!user,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
