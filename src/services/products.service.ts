import api from '@/lib/api'
import { Product, Category, Subcategory, Extra } from '@/types'

// Interfaces para los DTOs
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
    const response = await api.get('/products?limit=100')
    return response.data.data || response.data
  },

  async getProduct(id: string): Promise<Product> {
    const response = await api.get(`/products/${id}`)
    return response.data
  },

  async getCategories(): Promise<Category[]> {
    const response = await api.get('/categories')
    return response.data
  },

  async getSubcategories(): Promise<Subcategory[]> {
    const response = await api.get('/subcategories')
    return response.data
  },

  async getExtras(): Promise<Extra[]> {
    const response = await api.get('/extras')
    return response.data
  },

  async createProduct(productData: CreateProductDto): Promise<Product> {
    console.log('Creating product with data:', productData)
    
    // Filtrar campos que el backend no acepta para creación
    const { id, createdAt, updatedAt, category, file, image, ...allowedFields } = productData
    console.log('Filtered data for creation (removed id, timestamps, category, file, image):', allowedFields)
    
    const response = await api.post('/products', allowedFields)
    console.log('Create response:', response.data)
    return response.data
  },

  async updateProduct(id: string, productData: UpdateProductDto): Promise<Product> {
    console.log(`Updating product ${id} with data:`, productData)
    console.log('Full URL:', `${api.defaults.baseURL}/products/${id}`)
    console.log('Token available:', !!localStorage.getItem('token'))
    
    // Filtrar campos que el backend no acepta para actualización
    const { categoryId, id: productId, createdAt, updatedAt, category, file, image, ...allowedFields } = productData
    console.log('Filtered data (removed categoryId, id, timestamps, category, file, image):', allowedFields)
    
    try {
      // Intentar primero con PATCH
      const response = await api.patch(`/products/${id}`, allowedFields)
      console.log('Update response (PATCH):', response.data)
      return response.data
    } catch (patchError: unknown) {
      console.log('PATCH failed, trying PUT...')
      try {
        // Si PATCH falla, intentar con PUT
        const response = await api.put(`/products/${id}`, allowedFields)
        console.log('Update response (PUT):', response.data)
        return response.data
      } catch (putError: unknown) {
        console.error('Both PATCH and PUT failed:', {
          patchError: {
            status: patchError.response?.status,
            statusText: patchError.response?.statusText,
            data: patchError.response?.data,
            url: patchError.config?.url,
            method: patchError.config?.method,
            headers: patchError.config?.headers
          },
          putError: {
            status: putError.response?.status,
            statusText: putError.response?.statusText,
            data: putError.response?.data,
            url: putError.config?.url,
            method: putError.config?.method,
            headers: putError.config?.headers
          }
        })
        throw putError
      }
    }
  },

  async deleteProduct(id: string): Promise<void> {
    await api.delete(`/products/${id}`)
  },

  async uploadProductImage(id: string, file: File): Promise<Product> {
    console.log(`Uploading image for product ${id}:`, file.name, file.type, file.size)
    
    // Validar tipo de archivo
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      throw new Error('Tipo de archivo no permitido. Solo se permiten: JPEG, PNG, GIF, WebP')
    }
    
    // Validar tamaño (5MB máximo)
    const maxSize = 5 * 1024 * 1024 // 5MB
    if (file.size > maxSize) {
      throw new Error('El archivo es demasiado grande. Tamaño máximo: 5MB')
    }
    
    const formData = new FormData()
    formData.append('image', file) // Usar 'image' como nombre del campo según la documentación
    
    try {
      const response = await api.post(`/products/${id}/image`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      console.log('Image upload response:', response.data)
      return response.data
    } catch (error: unknown) {
      console.error('Image upload error:', error instanceof Error ? error.message : 'Unknown error')
      throw error
    }
  },

  async updateProductImage(id: string, file: File): Promise<Product> {
    console.log(`Updating image for product ${id}:`, file.name, file.type, file.size)
    
    // Validar tipo de archivo
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      throw new Error('Tipo de archivo no permitido. Solo se permiten: JPEG, PNG, GIF, WebP')
    }
    
    // Validar tamaño (5MB máximo)
    const maxSize = 5 * 1024 * 1024 // 5MB
    if (file.size > maxSize) {
      throw new Error('El archivo es demasiado grande. Tamaño máximo: 5MB')
    }
    
    const formData = new FormData()
    formData.append('image', file) // Usar 'image' como nombre del campo según la documentación
    
    try {
      // Usar POST según la documentación del backend
      const response = await api.post(`/products/${id}/image`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      console.log('Image update response:', response.data)
      return response.data
    } catch (error: unknown) {
      console.error('Image update error:', error instanceof Error ? error.message : 'Unknown error')
      throw error
    }
  }
}
