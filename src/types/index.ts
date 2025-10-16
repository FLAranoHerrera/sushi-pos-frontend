// User Types
export interface User {
  id: string
  email: string
  name: string
  phone?: string
  role: Role
  createdAt: string
  updatedAt: string
}

export interface Role {
  id: string
  name: string
  description: string
}

// Product Types
export interface Product {
  id: string
  name: string
  price: number
  stock: number
  description?: string
  available: boolean
  imageUrl?: string
  subcategory?: Subcategory
  category?: Category
  extras: Extra[]
  createdAt: string
  updatedAt: string
}

export interface Category {
  id: string
  name: string
  subcategories: Subcategory[]
}

export interface Subcategory {
  id: string
  name: string
  category: Category
  products: Product[]
}

export interface Extra {
  id: string
  name: string
  price: number
  description?: string
  products: Product[]
}

// Order Types
export interface Order {
  id: string
  user: User
  items: OrderItem[]
  total: number
  tip: number
  finalTotal: number
  status: OrderStatus
  paymentMethod: PaymentMethod
  paymentStatus: PaymentStatus
  orderNumber: string
  tableNumber?: string
  notes?: string
  createdAt: string
  updatedAt: string
}

export interface OrderItem {
  id: string
  product: Product
  quantity: number
  unitPrice: number
  subtotal: number
  notes?: string
  extras: Extra[]
}

export enum OrderStatus {
  PENDING = 'pending',
  PREPARING = 'preparing',
  READY = 'ready',
  PAID = 'paid',
  CANCELLED = 'cancelled',
}

export enum PaymentMethod {
  CASH = 'cash',
  CARD = 'card',
  DIGITAL = 'digital',
  MIXED = 'mixed',
}

export enum PaymentStatus {
  PENDING = 'pending',
  PAID = 'paid',
  FAILED = 'failed',
  REFUNDED = 'refunded',
}

// Payment Types
export interface PaymentIntent {
  clientSecret: string
  paymentIntentId: string
  amount: number
  currency: string
  status: string
}

export interface CashPayment {
  amount: number
  receivedAmount: number
  change: number
}

export interface CheckoutSession {
  sessionId: string
  url: string
  message: string
}

// Form Types
export interface CreateOrderDto {
  userId: string
  items: CreateOrderItemDto[]
  paymentMethod: PaymentMethod
  tip?: number
  tableNumber?: string
  notes?: string
}

export interface CreateOrderItemDto {
  productId: string
  quantity: number
  extraIds?: string[]
  notes?: string
}

export interface ProcessPaymentDto {
  paymentMethod: PaymentMethod
  amount: number
  receivedAmount?: number
  change?: number
  stripePaymentIntentId?: string
  cardInfo?: string
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean
  data?: T
  message?: string
  error?: string
}

export interface OrderStats {
  totalOrders: number
  paidOrders: number
  pendingOrders: number
  totalRevenue: number
}

// Attendance Types
export interface AttendanceRecord {
  id: string
  employeeId: string
  date: string
  checkIn?: string | null
  checkOut?: string | null
  workedHours?: number | null
  status: 'on_time' | 'late' | 'absent' | 'extra_hours'
  notes?: string | null
  createdAt: string
  updatedAt: string
}

export interface AttendanceStats {
  totalDays: number
  workedDays: number
  lateDays: number
  absentDays: number
  totalHours: number
  averageHoursPerDay: number
}

export interface WorkSchedule {
  id: string
  employeeId: string
  startTime: string
  endTime: string
  daysOfWeek: number[]
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface AttendanceReport {
  employeeId: string
  employeeName: string
  records: AttendanceRecord[]
  stats: AttendanceStats
}
