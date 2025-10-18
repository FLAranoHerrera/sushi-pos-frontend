'use client'

import { useState, useCallback } from 'react'

interface ErrorState {
  error: string | null
  hasError: boolean
}

export const useErrorHandler = () => {
  const [errorState, setErrorState] = useState<ErrorState>({
    error: null,
    hasError: false
  })

  const handleError = useCallback((error: unknown, context?: string) => {
    let errorMessage = 'Error desconocido'
    
    if (error instanceof Error) {
      errorMessage = error.message
    } else if (typeof error === 'string') {
      errorMessage = error
    } else if (error && typeof error === 'object' && 'message' in error) {
      errorMessage = String(error.message)
    }
    
    // Log para debugging
    console.error(`Error${context ? ` en ${context}` : ''}:`, error)
    
    setErrorState({
      error: errorMessage,
      hasError: true
    })
    
    // Auto-clear error after 5 seconds
    setTimeout(() => {
      setErrorState(prev => ({ ...prev, hasError: false }))
    }, 5000)
  }, [])

  const clearError = useCallback(() => {
    setErrorState({
      error: null,
      hasError: false
    })
  }, [])

  const resetError = useCallback(() => {
    setErrorState({
      error: null,
      hasError: false
    })
  }, [])

  return {
    error: errorState.error,
    hasError: errorState.hasError,
    handleError,
    clearError,
    resetError
  }
}

export default useErrorHandler
