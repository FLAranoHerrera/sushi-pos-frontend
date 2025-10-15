import api from '@/lib/api'
import { User } from '@/types'

export interface LoginDto {
  email: string
  password: string
}

export interface SignupDto {
  email: string
  password: string
  name: string
  phone?: string
}

export interface AuthResponse {
  message: string
  token: string
  user: User
}

export interface CreateUserDto {
  name: string
  email: string
  password: string
  phone?: string
  role: string
}

export const authService = {
  async login(credentials: LoginDto): Promise<AuthResponse> {
    const response = await api.post('/auth/login', credentials)
    return response.data
  },

  async signup(userData: SignupDto): Promise<AuthResponse> {
    const response = await api.post('/auth/signup', userData)
    return response.data
  },

  async getProfile(): Promise<User> {
    const response = await api.get('/auth/profile')
    return response.data
  },

  async getUsers(): Promise<User[]> {
    const response = await api.get('/users')
    return response.data
  },

  async createUser(userData: CreateUserDto): Promise<User> {
    const response = await api.post('/users', userData)
    return response.data
  },

  async updateUser(id: string, userData: Partial<CreateUserDto>): Promise<User> {
    const response = await api.patch(`/users/${id}`, userData)
    return response.data
  },

  async deleteUser(id: string): Promise<void> {
    await api.delete(`/users/${id}`)
  },

  async logout(): Promise<void> {
    localStorage.removeItem('token')
  },

  isAuthenticated(): boolean {
    return !!localStorage.getItem('token')
  },

  getToken(): string | null {
    return localStorage.getItem('token')
  },

  setToken(token: string): void {
    localStorage.setItem('token', token)
  }
}
