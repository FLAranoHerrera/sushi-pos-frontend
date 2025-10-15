import api from '@/lib/api'
import { Product, Category, Subcategory, Extra } from '@/types'

// DTOs
interface CreateProductDto {
  name: string
  description?: string
  price: number
  stock: number
  categoryId?: string
  subcategoryId?: string
  isActive?: boolean
  image?: File
}

interface UpdateProductDto {
  name?: string
  description?: string
  price?: number
  stock?: number
  categoryId?: string
  subcategoryId?: string
  isActive?: boolean
  image?: File
}

export const productsService = {
  async getProducts(): Promise<Product[]> {
    const { data } = await api.get('/products?limit=100')
    return data.data || data
  },

  async getProduct(id: string): Promise<Product> {
    const { data } = await api.get(`/products/${id}`)
    return data
  },

  async getCategories(): Promise<Category[]> {
    const { data } = await api.get('/categories')
    return data
  },

  async getSubcategories(): Promise<Subcategory[]> {
    const { data } = await api.get('/subcategories')
    return data
  },

  async getExtras(): Promise<Extra[]> {
    const { data } = await api.get('/extras')
    return data
  },

  async createProduct(productData: CreateProductDto): Promise<Product> {
    const { image: _, ...allowedFields } = productData
    const { data } = await api.post('/products', allowedFields)
    return data
  },

  async updateProduct(id: string, productData: UpdateProductDto): Promise<Product> {
    const { image: _, ...allowedFields } = productData
    try {
      const { data } = await api.patch(`/products/${id}`, allowedFields)
      return data
    } catch {
      const { data } = await api.put(`/products/${id}`, allowedFields)
      return data
    }
  },

  async deleteProduct(id: string): Promise<void> {
    await api.delete(`/products/${id}`)
  },

  async uploadProductImage(id: string, file: File): Promise<Product> {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      throw new Error('Tipo de archivo no permitido. Solo se permiten: JPEG, PNG, GIF, WebP')
    }

    const maxSize = 5 * 1024 * 1024 // 5MB
    if (file.size > maxSize) {
      throw new Error('El archivo es demasiado grande. Tamaño máximo: 5MB')
    }

    const formData = new FormData()
    formData.append('image', file)

    const { data } = await api.post(`/products/${id}/image`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return data
  },

  async updateProductImage(id: string, file: File): Promise<Product> {
    return this.uploadProductImage(id, file)
  },
}
