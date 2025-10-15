import api from '@/lib/api'
import { PaymentIntent, CashPayment, CheckoutSession } from '@/types'

export interface CreatePaymentIntentDto {
  amount: number
  currency?: string
  orderNumber?: string
  metadata?: Record<string, unknown>
}

export interface ProcessCashPaymentDto {
  amount: number
  receivedAmount: number
  change?: number
}

export interface CreateCheckoutSessionDto {
  lineItems: Array<{
    name: string
    quantity: number
    price: number
  }>
  successUrl: string
  cancelUrl: string
  orderNumber?: string
  metadata?: Record<string, unknown>
}

export const paymentsService = {
  async createPaymentIntent(data: CreatePaymentIntentDto): Promise<PaymentIntent> {
    const response = await api.post('/payments/intent', data)
    return response.data
  },

  async processCashPayment(data: ProcessCashPaymentDto): Promise<CashPayment> {
    const response = await api.post('/payments/cash', data)
    return response.data
  },

  async createCheckoutSession(data: CreateCheckoutSessionDto): Promise<CheckoutSession> {
    const response = await api.post('/payments/checkout-session', data)
    return response.data
  },

  async createTerminalPaymentIntent(amount: number, currency: string = 'mxn'): Promise<PaymentIntent> {
    const response = await api.post('/payments/terminal-intent', { amount, currency })
    return response.data
  },

  async getPaymentStatus(paymentIntentId: string): Promise<{ status: string; amount: number; currency: string }> {
    const response = await api.get(`/payments/status/${paymentIntentId}`)
    return response.data
  },

  async confirmPayment(paymentIntentId: string): Promise<{ success: boolean; message: string }> {
    const response = await api.post(`/payments/confirm/${paymentIntentId}`)
    return response.data
  },

  async cancelPayment(paymentIntentId: string): Promise<{ success: boolean; message: string }> {
    const response = await api.post(`/payments/cancel/${paymentIntentId}`)
    return response.data
  },

  async createRefund(paymentIntentId: string, amount?: number): Promise<{ success: boolean; refundId: string }> {
    const response = await api.post(`/payments/refund/${paymentIntentId}`, { amount })
    return response.data
  },

  async createCustomer(email: string, name: string, metadata?: Record<string, unknown>): Promise<{ id: string; email: string; name: string }> {
    const response = await api.post('/payments/customer', { email, name, metadata })
    return response.data
  },

  async getCustomerPaymentMethods(customerId: string): Promise<Array<{ id: string; type: string; last4: string }>> {
    const response = await api.get(`/payments/customer/${customerId}/payment-methods`)
    return response.data
  },

  async createSetupIntent(customerId: string): Promise<{ id: string; clientSecret: string }> {
    const response = await api.post('/payments/setup-intent', { customerId })
    return response.data
  }
}
