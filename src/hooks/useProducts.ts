'use client'

import { useState, useEffect, useCallback } from 'react'
import { Product } from '@/types'
import { productsService } from '@/services/products.service'

interface UseProductsReturn {
  products: Product[]
  loading: boolean
  error: string | null
  refetch: () => Promise<void>
  clearCache: () => void
}

const CACHE_KEY = 'products_cache'
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutos

interface CacheData {
  products: Product[]
  timestamp: number
}

export const useProducts = (): UseProductsReturn => {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const getCachedProducts = useCallback((): Product[] | null => {
    try {
      const cached = localStorage.getItem(CACHE_KEY)
      if (!cached) return null

      const cacheData: CacheData = JSON.parse(cached)
      const now = Date.now()
      
      // Verificar si el cache es válido
      if (now - cacheData.timestamp < CACHE_DURATION) {
        return cacheData.products
      }
      
      // Cache expirado, limpiar
      localStorage.removeItem(CACHE_KEY)
      return null
    } catch {
      return null
    }
  }, [])

  const setCachedProducts = useCallback((products: Product[]) => {
    try {
      const cacheData: CacheData = {
        products,
        timestamp: Date.now()
      }
      localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData))
    } catch (error) {
      console.warn('Error saving products to cache:', error)
    }
  }, [])

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      
      const data = await productsService.getProducts()
      setProducts(data)
      setCachedProducts(data)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al cargar productos'
      setError(errorMessage)
      console.error('Error fetching products:', err)
    } finally {
      setLoading(false)
    }
  }, [setCachedProducts])

  const refetch = useCallback(async () => {
    // Limpiar cache y forzar nueva carga
    localStorage.removeItem(CACHE_KEY)
    await fetchProducts()
  }, [fetchProducts])

  const clearCache = useCallback(() => {
    localStorage.removeItem(CACHE_KEY)
  }, [])

  useEffect(() => {
    // Intentar cargar desde cache primero
    const cachedProducts = getCachedProducts()
    if (cachedProducts) {
      setProducts(cachedProducts)
      setLoading(false)
      
      // Cargar datos frescos en background
      fetchProducts()
    } else {
      // No hay cache válido, cargar desde API
      fetchProducts()
    }
  }, [getCachedProducts, fetchProducts])

  return {
    products,
    loading,
    error,
    refetch,
    clearCache
  }
}

export default useProducts
