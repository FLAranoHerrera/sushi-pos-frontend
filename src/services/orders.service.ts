import api from '@/lib/api'
import { Order, CreateOrderDto, ProcessPaymentDto, OrderStats, OrderStatus } from '@/types'

export const ordersService = {
  async getOrders(status?: OrderStatus, userId?: string): Promise<Order[]> {
    const params = new URLSearchParams()
    if (status) params.append('status', status)
    if (userId) params.append('userId', userId)
    
    const response = await api.get(`/orders?${params.toString()}`)
    return response.data
  },

  async getOrder(id: string): Promise<Order> {
    const response = await api.get(`/orders/${id}`)
    return response.data
  },

  async createOrder(orderData: CreateOrderDto): Promise<Order> {
    const response = await api.post('/orders', orderData)
    return response.data
  },

  async updateOrder(id: string, orderData: Partial<Order>): Promise<Order> {
    const response = await api.patch(`/orders/${id}`, orderData)
    return response.data
  },

  async updateOrderStatus(id: string, status: OrderStatus): Promise<Order> {
    const response = await api.patch(`/orders/${id}/status`, { status })
    return response.data
  },

  async processPayment(id: string, paymentData: ProcessPaymentDto): Promise<Order> {
    const response = await api.post(`/orders/${id}/payment`, paymentData)
    return response.data
  },

  async cancelOrder(id: string): Promise<Order> {
    const response = await api.patch(`/orders/${id}/cancel`)
    return response.data
  },

  async getOrderStats(): Promise<OrderStats> {
    const response = await api.get('/orders/stats')
    return response.data
  }
}
