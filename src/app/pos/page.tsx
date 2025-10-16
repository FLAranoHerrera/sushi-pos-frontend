'use client'

import { useState, useEffect } from 'react'
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

export default function POSPage() {
  const { user, isAuthenticated, loading: authLoading } = useAuth()
  const { canAccessPOS } = useRole()
  const router = useRouter()
  
  const [products, setProducts] = useState<Product[]>([])
  const [cart, setCart] = useState<OrderItem[]>([])
  const [tableNumber, setTableNumber] = useState('')
  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState(false)

  const getProductImageUrl = (product: Product) => {
    return getImageUrl(product.imageUrl || '')
  }

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

    const loadProducts = async () => {
      try {
        const data = await productsService.getProducts()
        setProducts(data.filter(p => p.available))
      } catch (error) {
        console.error('Error loading products:', error)
      } finally {
        setLoading(false)
      }
    }

    loadProducts()
  }, [isAuthenticated, authLoading, canAccessPOS, router])

  const addToCart = (product: Product) => {
    const existingItem = cart.find(item => item.product.id === product.id)
    
    if (existingItem) {
      setCart(cart.map(item => 
        item.product.id === product.id 
          ? { ...item, quantity: item.quantity + 1, subtotal: (item.quantity + 1) * item.unitPrice }
          : item
      ))
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
      setCart([...cart, newItem])
    }
  }

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      setCart(cart.filter(item => item.product.id !== productId))
    } else {
      setCart(cart.map(item => 
        item.product.id === productId 
          ? { ...item, quantity, subtotal: quantity * item.unitPrice }
          : item
      ))
    }
  }

  const removeFromCart = (productId: string) => {
    setCart(cart.filter(item => item.product.id !== productId))
  }

  const getTotal = () => {
    return cart.reduce((sum, item) => sum + item.subtotal, 0)
  }

  const processOrder = async () => {
    if (!user || cart.length === 0) return

    setProcessing(true)
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
      let errorMessage = 'Error desconocido'
      
      if (error instanceof Error) {
        if ('response' in error && error.response && typeof error.response === 'object' && 'data' in error.response) {
          const responseData = error.response.data as { message?: string }
          errorMessage = responseData.message || error.message
        } else {
          errorMessage = error.message
        }
      }
      
      alert(`Error al crear la orden: ${errorMessage}`)
    } finally {
      setProcessing(false)
    }
  }

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
                    {products.map((product) => (
                      <Card key={product.id} className="hover:shadow-md transition-shadow">
                        <CardContent className="p-4">
                          <div className="flex gap-4">
                            {/* Imagen del producto */}
                            <div className="flex-shrink-0">
                              {getProductImageUrl(product) ? (
                                <div className="relative w-16 h-16 rounded-lg overflow-hidden">
                                  <Image
                                    src={getProductImageUrl(product)!}
                                    alt={product.name}
                                    fill
                                    className="object-cover"
                                    sizes="64px"
                                  />
                                </div>
                              ) : (
                                <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                                  <Utensils className="h-6 w-6 text-gray-400" />
                                </div>
                              )}
                            </div>
                            
                            {/* Información del producto */}
                            <div className="flex-1 min-w-0">
                              <div className="flex justify-between items-start mb-2">
                                <h3 className="font-semibold text-gray-900 truncate">{product.name}</h3>
                                <span className="text-lg font-bold text-orange-600 ml-2">
                                  {formatCurrency(Number(product.price))}
                                </span>
                              </div>
                              {product.description && (
                                <p className="text-sm text-gray-600 mb-3 line-clamp-2">{product.description}</p>
                              )}
                              <div className="flex justify-between items-center">
                                <span className="text-xs text-gray-500">
                                  Stock: {product.stock}
                                </span>
                                <Button
                                  size="sm"
                                  onClick={() => addToCart(product)}
                                  className="bg-orange-600 hover:bg-orange-700"
                                >
                                  <Plus className="h-4 w-4 mr-1" />
                                  Agregar
                                </Button>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
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
                    <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <h4 className="font-medium text-sm">{item.product.name}</h4>
                        <p className="text-xs text-gray-600">
                          {formatCurrency(item.unitPrice)} × {item.quantity}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="text-sm font-medium w-8 text-center">
                          {item.quantity}
                        </span>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => removeFromCart(item.product.id)}
                        >
                          ×
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Total */}
                <div className="border-t pt-4">
                  <div className="flex justify-between items-center text-lg font-bold">
                    <span>Total:</span>
                    <span className="text-orange-600">
                      {formatCurrency(getTotal())}
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

                {/* Botón de crear orden */}
                <div className="space-y-2">
                  <Button
                    className="w-full bg-orange-600 hover:bg-orange-700"
                    onClick={() => processOrder()}
                    disabled={cart.length === 0 || processing}
                  >
                    <ShoppingCart className="h-4 w-4 mr-2" />
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
  )
}
