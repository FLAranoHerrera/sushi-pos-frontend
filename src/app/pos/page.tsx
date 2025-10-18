'use client'

import React, { useState, useEffect, useCallback, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { useAuth } from '@/contexts/AuthContext'
import { useRole } from '@/hooks/useRole'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Product, OrderItem, CreateOrderDto, PaymentMethod } from '@/types'
import { productsService } from '@/services/products.service'
import { ordersService } from '@/services/orders.service'
import { getImageUrl } from '@/lib/api'
import { Utensils, Plus, Minus, ShoppingCart } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'
import ProductCard from '@/components/ProductCard'
import CartItem from '@/components/CartItem'
import ErrorBoundary from '@/components/ErrorBoundary'
import { useErrorHandler } from '@/hooks/useErrorHandler'
import { useProducts } from '@/hooks/useProducts'

export default function POSPage() {
  const { user, isAuthenticated, loading: authLoading } = useAuth()
  const { canAccessPOS } = useRole()
  const router = useRouter()
  const { handleError, error, clearError } = useErrorHandler()
  const { products, loading, error: productsError, refetch } = useProducts()
  
  const [cart, setCart] = useState<OrderItem[]>([])
  const [tableNumber, setTableNumber] = useState('')
  const [notes, setNotes] = useState('')
  const [processing, setProcessing] = useState(false)

  // Memoizar productos disponibles
  const availableProducts = useMemo(() => {
    return products.filter(p => p.available)
  }, [products])

  useEffect(() => {
    if (authLoading) {
      return // Esperar a que termine la autenticación
    }

    if (!isAuthenticated) {
      router.push('/login')
      return
    }

    if (!canAccessPOS) {
      router.push('/dashboard')
      return
    }
  }, [isAuthenticated, authLoading, canAccessPOS, router])

  // Manejar errores de productos
  useEffect(() => {
    if (productsError) {
      handleError(productsError, 'cargar productos')
    }
  }, [productsError, handleError])

  const addToCart = useCallback((product: Product) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.product.id === product.id)
      
      if (existingItem) {
        return prevCart.map(item => 
          item.product.id === product.id 
            ? { ...item, quantity: item.quantity + 1, subtotal: (item.quantity + 1) * item.unitPrice }
            : item
        )
      } else {
        const newItem: OrderItem = {
          id: Math.random().toString(),
          product,
          quantity: 1,
          unitPrice: Number(product.price),
          subtotal: Number(product.price),
          extras: [],
          notes: ''
        }
        return [...prevCart, newItem]
      }
    })
  }, [])

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    setCart(prevCart => {
      if (quantity <= 0) {
        return prevCart.filter(item => item.product.id !== productId)
      } else {
        return prevCart.map(item => 
          item.product.id === productId 
            ? { ...item, quantity, subtotal: quantity * item.unitPrice }
            : item
        )
      }
    })
  }, [])

  const removeFromCart = useCallback((productId: string) => {
    setCart(prevCart => prevCart.filter(item => item.product.id !== productId))
  }, [])

  const getTotal = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.subtotal, 0)
  }, [cart])

  const processOrder = useCallback(async () => {
    if (!user || cart.length === 0) return

    setProcessing(true)
    clearError()
    
    try {
      const orderData: CreateOrderDto = {
        userId: user.id,
        items: cart.map(item => ({
          productId: item.product.id,
          quantity: item.quantity,
          notes: item.notes
        })),
        paymentMethod: PaymentMethod.CASH, // Por defecto efectivo, se cambiará después
        tableNumber: tableNumber || undefined,
        notes: notes || undefined
      }

      await ordersService.createOrder(orderData)
      
      // Limpiar carrito
      setCart([])
      setTableNumber('')
      setNotes('')
      
      // Redirigir a la página de órdenes para ver la orden creada
      router.push('/orders')
      
    } catch (error: unknown) {
      handleError(error, 'crear orden')
    } finally {
      setProcessing(false)
    }
  }, [user, cart, tableNumber, notes, router, handleError, clearError])

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center">
                <div className="bg-orange-100 p-2 rounded-lg mr-3">
                  <Utensils className="h-6 w-6 text-orange-600" />
                </div>
                <h1 className="text-xl font-bold text-gray-900">Punto de Venta</h1>
              </div>
              
              <Button
                variant="outline"
                onClick={() => router.push('/dashboard')}
              >
                Volver al Dashboard
              </Button>
            </div>
          </div>
        </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Productos */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Menú</CardTitle>
                <CardDescription>Selecciona los productos para la orden</CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600 mx-auto"></div>
                    <p className="mt-2 text-gray-600">Cargando productos...</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {availableProducts.map((product) => (
                      <ProductCard
                        key={product.id}
                        product={product}
                        onAddToCart={addToCart}
                      />
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Carrito y Checkout */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  Orden Actual
                </CardTitle>
                <CardDescription>
                  {cart.length} {cart.length === 1 ? 'producto' : 'productos'} en el carrito
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Items del carrito */}
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {cart.map((item) => (
                    <CartItem
                      key={item.id}
                      item={item}
                      onUpdateQuantity={updateQuantity}
                      onRemove={removeFromCart}
                    />
                  ))}
                </div>

                {/* Total */}
                <div className="border-t pt-4">
                  <div className="flex justify-between items-center text-lg font-bold">
                    <span>Total:</span>
                    <span className="text-orange-600">
                      {formatCurrency(getTotal)}
                    </span>
                  </div>
                </div>

                {/* Información adicional */}
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Mesa (Opcional)</label>
                    <Input
                      placeholder="Mesa 5"
                      value={tableNumber}
                      onChange={(e) => setTableNumber(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Notas (Opcional)</label>
                    <Input
                      placeholder="Sin cebolla, extra picante..."
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                    />
                  </div>
                </div>

                {/* Manejo de errores */}
                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                    <p className="text-sm text-red-800">{error}</p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={clearError}
                      className="mt-2 text-red-600 hover:text-red-700"
                    >
                      Cerrar
                    </Button>
                  </div>
                )}

                {/* Botón de crear orden */}
                <div className="space-y-2">
                  <Button
                    className="w-full bg-orange-600 hover:bg-orange-700"
                    onClick={processOrder}
                    disabled={cart.length === 0 || processing}
                    aria-label="Crear nueva orden"
                  >
                    <ShoppingCart className="h-4 w-4 mr-2" aria-hidden="true" />
                    Crear Orden
                  </Button>
                </div>

                {processing && (
                  <div className="text-center py-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-orange-600 mx-auto"></div>
                    <p className="text-sm text-gray-600 mt-1">Procesando orden...</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
    </ErrorBoundary>
  )
}
