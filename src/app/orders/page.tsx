'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { useRole } from '@/hooks/useRole'
import { ordersService } from '@/services/orders.service'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Utensils, ArrowLeft, ShoppingCart, Clock, CheckCircle, XCircle, DollarSign } from 'lucide-react'
import { Order, OrderStatus, PaymentStatus, PaymentMethod } from '@/types'

export default function OrdersPage() {
  const { user, isAuthenticated, loading: authLoading } = useAuth()
  const { isAdmin, isMesero } = useRole()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'pending' | 'preparing' | 'ready' | 'paid'>('all')
  const [showOrderDetails, setShowOrderDetails] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const router = useRouter()

  useEffect(() => {
    if (authLoading) {
      return
    }

    if (!isAuthenticated) {
      router.push('/login')
      return
    }

    if (!isAdmin && !isMesero) {
      router.push('/dashboard')
      return
    }

    // Cargar órdenes
    loadOrders()
  }, [isAuthenticated, authLoading, router, isAdmin, isMesero])

  const loadOrders = async () => {
    try {
      setLoading(true)
      const data = await ordersService.getOrders()
      setOrders(data)
    } catch (error) {
      console.error('Error loading orders:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateOrderStatus = async (orderId: string, newStatus: OrderStatus) => {
    try {
      await ordersService.updateOrderStatus(orderId, newStatus)
      // Recargar órdenes para mostrar el cambio
      await loadOrders()
    } catch (error) {
      console.error('Error updating order status:', error)
      alert('Error al actualizar el estado de la orden')
    }
  }

  const processCashPayment = async (orderId: string) => {
    try {
      // Buscar la orden para obtener el total
      const order = orders.find(o => o.id === orderId)
      if (!order) {
        alert('Orden no encontrada')
        return
      }

      const total = Number(order.finalTotal)
      
      // Solicitar monto recibido
      const receivedAmountStr = prompt(`Total a pagar: $${total.toFixed(2)}\n\nIngrese el monto recibido:`, total.toFixed(2))
      
      if (!receivedAmountStr) {
        return // Usuario canceló
      }

      const receivedAmount = parseFloat(receivedAmountStr)
      
      if (isNaN(receivedAmount) || receivedAmount < total) {
        alert('El monto recibido debe ser mayor o igual al total')
        return
      }

      const change = receivedAmount - total

      // Para efectivo, confirmar inmediatamente
      await ordersService.processPayment(orderId, {
        paymentMethod: PaymentMethod.CASH,
        amount: total,
        receivedAmount: receivedAmount,
        change: change
      })
      await loadOrders()
      alert(`Pago en efectivo procesado exitosamente\nCambio: $${change.toFixed(2)}`)
    } catch (error) {
      console.error('Error processing cash payment:', error)
      alert('Error al procesar el pago en efectivo')
    }
  }

  const processCardPayment = async (orderId: string) => {
    try {
      // Para tarjeta, iniciar proceso de Stripe
      alert('Iniciando proceso de pago con tarjeta...')
      // TODO: Implementar integración con Stripe
    } catch (error) {
      console.error('Error processing card payment:', error)
      alert('Error al procesar el pago con tarjeta')
    }
  }

  const processDigitalPayment = async (orderId: string) => {
    try {
      // Para pago digital, iniciar proceso de Stripe
      alert('Iniciando proceso de pago digital...')
      // TODO: Implementar integración con Stripe
    } catch (error) {
      console.error('Error processing digital payment:', error)
      alert('Error al procesar el pago digital')
    }
  }

  const showOrderDetailsModal = (order: Order) => {
    setSelectedOrder(order)
    setShowOrderDetails(true)
  }

  const closeOrderDetails = () => {
    setShowOrderDetails(false)
    setSelectedOrder(null)
  }

  const cancelOrder = async (orderId: string) => {
    if (!confirm('¿Estás seguro de que quieres cancelar esta orden?')) return
    
    try {
      await ordersService.updateOrderStatus(orderId, OrderStatus.CANCELLED)
      await loadOrders()
      alert('Orden cancelada exitosamente')
    } catch (error) {
      console.error('Error cancelling order:', error)
      alert('Error al cancelar la orden')
    }
  }

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'preparing':
        return 'bg-orange-100 text-orange-800'
      case 'ready':
        return 'bg-green-100 text-green-800'
      case 'paid':
        return 'bg-blue-100 text-blue-800'
      case 'cancelled':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: OrderStatus) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4" />
      case 'preparing':
        return <Utensils className="h-4 w-4" />
      case 'ready':
        return <CheckCircle className="h-4 w-4" />
      case 'paid':
        return <DollarSign className="h-4 w-4" />
      case 'cancelled':
        return <XCircle className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  const getPaymentStatusColor = (status: PaymentStatus) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'paid':
        return 'bg-green-100 text-green-800'
      case 'failed':
        return 'bg-red-100 text-red-800'
      case 'refunded':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const filteredOrders = orders.filter(order => {
    if (filter === 'all') return true
    return order.status === filter
  })

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

  if (!isAuthenticated || (!isAdmin && !isMesero)) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push('/dashboard')}
                className="mr-4"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Volver
              </Button>
              <div className="flex items-center">
                <div className="bg-orange-100 p-2 rounded-lg mr-3">
                  <Utensils className="h-6 w-6 text-orange-600" />
                </div>
                <h1 className="text-xl font-bold text-gray-900">Gestión de Órdenes</h1>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                {user?.name} ({isAdmin ? '👑 Administrador' : '🍽️ Mesero'})
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Gestión de Órdenes</h2>
          <p className="text-gray-600 text-lg">Controla el flujo completo: desde la cocina hasta el cobro</p>
          
          {/* Mensaje informativo sobre pagos */}
          <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.726-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-yellow-800">
                  Información de Pagos
                </h3>
                <div className="mt-1 text-sm text-yellow-700">
                  <p>
                    Los pagos con tarjeta y digital están temporalmente deshabilitados mientras implementamos la pasarela de pagos con Stripe. 
                    <strong> Solo está disponible el pago en efectivo.</strong>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap gap-3 mb-8">
          <Button
            variant={filter === 'all' ? 'default' : 'outline'}
            onClick={() => setFilter('all')}
            className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
              filter === 'all' 
                ? 'bg-orange-600 hover:bg-orange-700 text-white shadow-lg' 
                : 'bg-white hover:bg-gray-50 text-gray-700 border-gray-300'
            }`}
          >
            📋 Todas
          </Button>
          <Button
            variant={filter === 'pending' ? 'default' : 'outline'}
            onClick={() => setFilter('pending')}
            className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
              filter === 'pending' 
                ? 'bg-yellow-600 hover:bg-yellow-700 text-white shadow-lg' 
                : 'bg-white hover:bg-gray-50 text-gray-700 border-gray-300'
            }`}
          >
            🆕 Nuevas
          </Button>
          <Button
            variant={filter === 'preparing' ? 'default' : 'outline'}
            onClick={() => setFilter('preparing')}
            className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
              filter === 'preparing' 
                ? 'bg-orange-600 hover:bg-orange-700 text-white shadow-lg' 
                : 'bg-white hover:bg-gray-50 text-gray-700 border-gray-300'
            }`}
          >
            🍳 En Cocina
          </Button>
          <Button
            variant={filter === 'ready' ? 'default' : 'outline'}
            onClick={() => setFilter('ready')}
            className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
              filter === 'ready' 
                ? 'bg-green-600 hover:bg-green-700 text-white shadow-lg' 
                : 'bg-white hover:bg-gray-50 text-gray-700 border-gray-300'
            }`}
          >
            ✅ Listas
          </Button>
          <Button
            variant={filter === 'paid' ? 'default' : 'outline'}
            onClick={() => setFilter('paid')}
            className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
              filter === 'paid' 
                ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg' 
                : 'bg-white hover:bg-gray-50 text-gray-700 border-gray-300'
            }`}
          >
            💰 Completadas
          </Button>
        </div>

        {/* Orders List */}
        <div className="space-y-4">
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600 mx-auto"></div>
              <p className="mt-2 text-gray-600">Cargando órdenes...</p>
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="text-center py-8">
              <ShoppingCart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No hay órdenes</h3>
              <p className="text-gray-600">Las órdenes aparecerán aquí cuando se creen</p>
            </div>
          ) : (
            filteredOrders.map((order) => (
              <Card key={order.id} className="hover:shadow-xl transition-all duration-300 border-l-4 border-l-orange-500 bg-gradient-to-r from-white to-orange-50">
                <CardHeader className="pb-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <CardTitle className="flex items-center text-xl mb-2">
                        <span className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm font-bold mr-3">
                          #{order.orderNumber}
                        </span>
                        <Badge className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                          {getStatusIcon(order.status)}
                          <span className="ml-1 capitalize">{order.status}</span>
                        </Badge>
                      </CardTitle>
                      <CardDescription className="text-base">
                        <span className="inline-flex items-center px-2 py-1 bg-gray-100 text-gray-700 rounded-md text-sm mr-3">
                          🪑 Mesa: {order.tableNumber || 'Sin mesa'}
                        </span>
                        <span className="text-gray-500">
                          {new Date(order.createdAt).toLocaleString()}
                        </span>
                      </CardDescription>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-bold text-green-600 mb-2">
                        ${Number(order.finalTotal).toFixed(2)}
                      </div>
                      <Badge className={`px-3 py-1 rounded-full text-sm font-medium ${getPaymentStatusColor(order.paymentStatus)}`}>
                        {order.paymentStatus === 'paid' ? '✅ Pagado' : '⏳ Pendiente'}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Items:</h4>
                      <div className="space-y-1">
                        {order.items.map((item, index) => (
                          <div key={index} className="flex justify-between text-sm">
                            <span>{item.product.name} x {item.quantity}</span>
                            <span>${Number(item.subtotal).toFixed(2)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    {order.notes && (
                      <div>
                        <h4 className="font-medium text-gray-900 mb-1">Notas:</h4>
                        <p className="text-sm text-gray-600">{order.notes}</p>
                      </div>
                    )}
                    <div className="flex justify-between pt-2 border-t">
                      <span className="font-medium">Total:</span>
                      <span className="font-bold">${Number(order.finalTotal).toFixed(2)}</span>
                    </div>
                    <div className="flex space-x-2 pt-2">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => showOrderDetailsModal(order)}
                      >
                        👁️ Ver Detalles
                      </Button>
                      {(order.status === 'pending' || order.status === 'preparing') && (
                        <Button 
                          size="sm" 
                          variant="destructive"
                          onClick={() => cancelOrder(order.id)}
                        >
                          ❌ Cancelar
                        </Button>
                      )}
                      {order.status === 'pending' && (
                        <Button 
                          size="sm" 
                          className="bg-orange-600 hover:bg-orange-700"
                          onClick={() => updateOrderStatus(order.id, OrderStatus.PREPARING)}
                        >
                          Enviar a Cocina
                        </Button>
                      )}
                      {order.status === 'preparing' && (
                        <Button 
                          size="sm" 
                          className="bg-green-600 hover:bg-green-700"
                          onClick={() => updateOrderStatus(order.id, OrderStatus.READY)}
                        >
                          Marcar Lista
                        </Button>
                      )}
                      {order.status === 'ready' && (
                        <div className="flex space-x-2">
                          <Button 
                            size="sm" 
                            className="bg-green-600 hover:bg-green-700"
                            onClick={() => processCashPayment(order.id)}
                          >
                            💰 Efectivo
                          </Button>
                          <Button 
                            size="sm" 
                            className="bg-gray-400 cursor-not-allowed"
                            disabled
                            title="Pago con tarjeta temporalmente deshabilitado"
                          >
                            💳 Tarjeta
                          </Button>
                          <Button 
                            size="sm" 
                            className="bg-gray-400 cursor-not-allowed"
                            disabled
                            title="Pago digital temporalmente deshabilitado"
                          >
                            📱 Digital
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </main>

      {/* Modal de Detalles de Orden */}
      {showOrderDetails && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-900">
                Detalles de Orden #{selectedOrder.orderNumber}
              </h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={closeOrderDetails}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </Button>
            </div>
            
            <div className="space-y-4">
              {/* Información básica */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-medium text-gray-900">Estado</h3>
                  <Badge className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedOrder.status)}`}>
                    {getStatusIcon(selectedOrder.status)}
                    <span className="ml-1 capitalize">{selectedOrder.status}</span>
                  </Badge>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Pago</h3>
                  <Badge className={`px-3 py-1 rounded-full text-sm font-medium ${getPaymentStatusColor(selectedOrder.paymentStatus)}`}>
                    {selectedOrder.paymentStatus === 'paid' ? '✅ Pagado' : '⏳ Pendiente'}
                  </Badge>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Mesa</h3>
                  <p className="text-sm text-gray-600">{selectedOrder.tableNumber || 'Sin mesa'}</p>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Fecha</h3>
                  <p className="text-sm text-gray-600">{new Date(selectedOrder.createdAt).toLocaleString()}</p>
                </div>
              </div>

              {/* Items de la orden */}
              <div>
                <h3 className="font-medium text-gray-900 mb-2">Items de la Orden</h3>
                <div className="space-y-2">
                  {selectedOrder.items.map((item, index) => (
                    <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{item.product.name}</h4>
                        <p className="text-sm text-gray-600">Cantidad: {item.quantity}</p>
                        <p className="text-sm text-gray-600">Precio unitario: ${Number(item.product.price).toFixed(2)}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-gray-900">${Number(item.subtotal).toFixed(2)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Notas */}
              {selectedOrder.notes && (
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Notas Especiales</h3>
                  <p className="text-sm text-gray-600 bg-yellow-50 p-3 rounded-lg">{selectedOrder.notes}</p>
                </div>
              )}

              {/* Totales */}
              <div className="border-t pt-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal:</span>
                    <span>${Number(selectedOrder.total - selectedOrder.tip).toFixed(2)}</span>
                  </div>
                  {selectedOrder.tip > 0 && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Propina:</span>
                      <span>${Number(selectedOrder.tip).toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total:</span>
                    <span>${Number(selectedOrder.finalTotal).toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Botones de acción */}
              <div className="flex space-x-2 pt-4">
                <Button
                  variant="outline"
                  onClick={closeOrderDetails}
                  className="flex-1"
                >
                  Cerrar
                </Button>
                {(selectedOrder.status === 'pending' || selectedOrder.status === 'preparing') && (
                  <Button
                    variant="destructive"
                    onClick={() => {
                      cancelOrder(selectedOrder.id)
                      closeOrderDetails()
                    }}
                    className="flex-1"
                  >
                    ❌ Cancelar Orden
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
