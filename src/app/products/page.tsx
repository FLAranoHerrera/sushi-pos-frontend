'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { useRole } from '@/hooks/useRole'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Utensils, ArrowLeft, Package, Plus, Edit, Trash2, Search, Image as ImageIcon, X } from 'lucide-react'
import { Product, Category } from '@/types'
import { productsService } from '@/services/products.service'
import Image from 'next/image'

export default function ProductsPage() {
  const { user, isAuthenticated, loading: authLoading } = useAuth()
  const { isAdmin, isMesero } = useRole()
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [showEditForm, setShowEditForm] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    available: true,
    categoryId: '',
    image: null as File | null
  })
  const [uploadingImage, setUploadingImage] = useState(false)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
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

    // Cargar productos y categorías
    loadProducts()
    loadCategories()
  }, [isAuthenticated, authLoading, router, isAdmin, isMesero])

  const loadProducts = async () => {
    try {
      const data = await productsService.getProducts()
      setProducts(data)
    } catch (error) {
      console.error('Error loading products:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadCategories = async () => {
    try {
      const response = await productsService.getCategories()
      console.log('Categories response:', response)

      // Verificar si la respuesta es un array o tiene una propiedad data
      const categoriesData = Array.isArray(response) ? response : ((response as { data?: unknown; categories?: unknown }).data || (response as { categories?: unknown }).categories || [])

      // Asegurar que sea un array
      if (Array.isArray(categoriesData)) {
        setCategories(categoriesData)
      } else {
        console.warn('Categories data is not an array:', categoriesData)
        setCategories([])
      }
    } catch (error) {
      console.error('Error loading categories:', error)
      setCategories([])
    }
  }

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validación de campos requeridos
    if (!newProduct.name.trim()) {
      alert('El nombre es requerido')
      return
    }
    
    if (!newProduct.price || isNaN(parseFloat(newProduct.price))) {
      alert('El precio debe ser un número válido')
      return
    }
    
    if (!newProduct.stock || isNaN(parseInt(newProduct.stock))) {
      alert('El stock debe ser un número válido')
      return
    }
    
    try {
      const productData = {
        name: newProduct.name.trim(),
        description: newProduct.description.trim(),
        price: parseFloat(newProduct.price),
        stock: parseInt(newProduct.stock),
        available: newProduct.available,
        categoryId: newProduct.categoryId || undefined
      }
      
      console.log('Creating product with data:', productData)
      console.log('newProduct.image:', newProduct.image)
      console.log('newProduct keys:', Object.keys(newProduct))
      
      // Primero crear el producto (sin imagen)
      const createdProduct = await productsService.createProduct(productData)
      console.log('Product created successfully:', createdProduct)
      
      // Si hay imagen, subirla por separado
      if (newProduct.image) {
        setUploadingImage(true)
        console.log('Uploading image...')
        try {
          await productsService.uploadProductImage(createdProduct.id, newProduct.image)
          console.log('Image uploaded successfully')
        } catch (imageError: unknown) {
          console.error('Error uploading image:', imageError)
          // No fallar la creación completa si solo falla la imagen
          alert(`Producto creado, pero hubo un error al subir la imagen: ${imageError instanceof Error ? imageError.message : 'Unknown error'}`)
        } finally {
          setUploadingImage(false)
        }
      }
      
      await loadProducts()
      setShowCreateForm(false)
      setNewProduct({ name: '', description: '', price: '', stock: '', available: true, categoryId: '', image: null })
      setImagePreview(null)
      
      alert('Producto creado exitosamente')
    } catch (error: unknown) {
      console.error('Error creating product:', error)
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      console.error('Error details:', errorMessage)
      alert(`Error al crear el producto: ${errorMessage}`)
    }
  }

  const handleEditProduct = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingProduct) return
    
    // Validación de campos requeridos
    if (!newProduct.name.trim()) {
      alert('El nombre es requerido')
      return
    }
    
    if (!newProduct.price || isNaN(parseFloat(newProduct.price))) {
      alert('El precio debe ser un número válido')
      return
    }
    
    if (!newProduct.stock || isNaN(parseInt(newProduct.stock))) {
      alert('El stock debe ser un número válido')
      return
    }
    
    try {
      console.log('Updating product:', editingProduct.id)
      console.log('Product data:', newProduct)
      
      const productData = {
        name: newProduct.name.trim(),
        description: newProduct.description.trim(),
        price: parseFloat(newProduct.price),
        stock: parseInt(newProduct.stock),
        available: newProduct.available,
        categoryId: newProduct.categoryId || undefined
      }
      
      console.log('Sending data:', productData)
      console.log('newProduct.image:', newProduct.image)
      console.log('newProduct keys:', Object.keys(newProduct))
      
      // Primero actualizar los datos del producto (sin imagen)
      const updatedProduct = await productsService.updateProduct(editingProduct.id, productData)
      console.log('Product updated successfully:', updatedProduct)
      
      // Si hay nueva imagen, subirla por separado
      if (newProduct.image) {
        setUploadingImage(true)
        console.log('Uploading new image...')
        try {
          await productsService.updateProductImage(editingProduct.id, newProduct.image)
          console.log('Image updated successfully')
        } catch (imageError: unknown) {
          console.error('Error updating image:', imageError)
          // No fallar la actualización completa si solo falla la imagen
          alert(`Producto actualizado, pero hubo un error al subir la imagen: ${imageError instanceof Error ? imageError.message : 'Unknown error'}`)
        } finally {
          setUploadingImage(false)
        }
      }
      
      await loadProducts()
      setShowEditForm(false)
      setEditingProduct(null)
      setNewProduct({ name: '', description: '', price: '', stock: '', available: true, categoryId: '', image: null })
      setImagePreview(null)
      
      alert('Producto actualizado exitosamente')
    } catch (error: unknown) {
      console.error('Error updating product:', error)
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      console.error('Error details:', errorMessage)
      alert(`Error al actualizar el producto: ${errorMessage}`)
    }
  }

  const handleDeleteProduct = async (productId: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este producto?')) return
    
    try {
      await productsService.deleteProduct(productId)
      await loadProducts()
    } catch (error) {
      console.error('Error deleting product:', error)
      alert('Error al eliminar el producto')
    }
  }

  const openEditForm = (product: Product) => {
    setEditingProduct(product)
    setNewProduct({
      name: product.name,
      description: product.description || '',
      price: product.price.toString(),
      stock: product.stock.toString(),
      available: product.available,
      categoryId: product.category?.id || '',
      image: null
    })
    setShowEditForm(true)
  }

  const getImageUrl = (product: Product) => {
    if (product.imageUrl) {
      return product.imageUrl.startsWith('http') 
        ? product.imageUrl 
        : `https://sushi-pos-backend.onrender.com${product.imageUrl}`
    }
    return null
  }

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Validar tipo de archivo
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
      if (!allowedTypes.includes(file.type)) {
        alert('Tipo de archivo no permitido. Solo se permiten: JPEG, PNG, GIF, WebP')
        return
      }
      
      // Validar tamaño (5MB máximo)
      const maxSize = 5 * 1024 * 1024 // 5MB
      if (file.size > maxSize) {
        alert('El archivo es demasiado grande. Tamaño máximo: 5MB')
        return
      }
      
      setNewProduct({ ...newProduct, image: file })
      
      // Crear preview
      const reader = new FileReader()
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const clearImage = () => {
    setNewProduct({ ...newProduct, image: null })
    setImagePreview(null)
  }

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.description?.toLowerCase().includes(searchTerm.toLowerCase())
  )

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
                <h1 className="text-xl font-bold text-gray-900">Gestión de Productos</h1>
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
          <h2 className="text-2xl font-bold text-gray-900">Productos del Menú</h2>
          <p className="text-gray-600">Gestiona los productos y precios del menú</p>
        </div>

        {/* Search and Add Button */}
        <div className="flex justify-between items-center mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Buscar productos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-64"
            />
          </div>
          {isAdmin && (
            <Button 
              onClick={() => setShowCreateForm(true)}
              className="bg-orange-600 hover:bg-orange-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Agregar Producto
            </Button>
          )}
        </div>

        {/* Create Product Form */}
        {showCreateForm && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Crear Nuevo Producto</CardTitle>
              <CardDescription>
                Agrega un nuevo producto al menú
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreateProduct} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Nombre</Label>
                    <Input
                      id="name"
                      value={newProduct.name}
                      onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="price">Precio</Label>
                    <Input
                      id="price"
                      type="number"
                      step="0.01"
                      value={newProduct.price}
                      onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="stock">Stock</Label>
                    <Input
                      id="stock"
                      type="number"
                      value={newProduct.stock}
                      onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="category">Categoría</Label>
                    <Select
                      value={newProduct.categoryId}
                      onValueChange={(value) => setNewProduct({ ...newProduct, categoryId: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar categoría" />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.isArray(categories) && categories.map((category) => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor="description">Descripción</Label>
                    <Input
                      id="description"
                      value={newProduct.description}
                      onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="image">Imagen</Label>
                    <Input
                      id="image"
                      type="file"
                      accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                      onChange={handleImageSelect}
                    />
                    {imagePreview && (
                      <div className="mt-2 relative">
                        <Image 
                          src={imagePreview} 
                          alt="Preview" 
                          width={128}
                          height={128}
                          className="w-32 h-32 object-cover rounded-lg border"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={clearImage}
                          className="absolute -top-2 -right-2 bg-white"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                    <p className="text-xs text-gray-500 mt-1">
                      Tipos permitidos: JPEG, PNG, GIF, WebP. Tamaño máximo: 5MB
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="available"
                      checked={newProduct.available}
                      onChange={(e) => setNewProduct({ ...newProduct, available: e.target.checked })}
                    />
                    <Label htmlFor="available">Disponible</Label>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button 
                    type="submit" 
                    className="bg-orange-600 hover:bg-orange-700"
                    disabled={uploadingImage}
                  >
                    {uploadingImage ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Subiendo imagen...
                      </>
                    ) : (
                      'Crear Producto'
                    )}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setShowCreateForm(false)
                      setImagePreview(null)
                    }}
                    disabled={uploadingImage}
                  >
                    Cancelar
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Edit Product Form */}
        {showEditForm && editingProduct && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Editar Producto</CardTitle>
              <CardDescription>
                Modifica la información del producto
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleEditProduct} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="edit-name">Nombre</Label>
                    <Input
                      id="edit-name"
                      value={newProduct.name}
                      onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit-price">Precio</Label>
                    <Input
                      id="edit-price"
                      type="number"
                      step="0.01"
                      value={newProduct.price}
                      onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit-stock">Stock</Label>
                    <Input
                      id="edit-stock"
                      type="number"
                      value={newProduct.stock}
                      onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit-category">Categoría</Label>
                    <Select
                      value={newProduct.categoryId}
                      onValueChange={(value) => setNewProduct({ ...newProduct, categoryId: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar categoría" />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.isArray(categories) && categories.map((category) => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor="edit-description">Descripción</Label>
                    <Input
                      id="edit-description"
                      value={newProduct.description}
                      onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit-image">Nueva Imagen</Label>
                    <Input
                      id="edit-image"
                      type="file"
                      accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                      onChange={handleImageSelect}
                    />
                    {imagePreview && (
                      <div className="mt-2 relative">
                        <Image 
                          src={imagePreview} 
                          alt="Preview" 
                          width={128}
                          height={128}
                          className="w-32 h-32 object-cover rounded-lg border"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={clearImage}
                          className="absolute -top-2 -right-2 bg-white"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                    <p className="text-xs text-gray-500 mt-1">
                      Tipos permitidos: JPEG, PNG, GIF, WebP. Tamaño máximo: 5MB
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="edit-available"
                      checked={newProduct.available}
                      onChange={(e) => setNewProduct({ ...newProduct, available: e.target.checked })}
                    />
                    <Label htmlFor="edit-available">Disponible</Label>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button 
                    type="submit" 
                    className="bg-orange-600 hover:bg-orange-700"
                    disabled={uploadingImage}
                  >
                    {uploadingImage ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Subiendo imagen...
                      </>
                    ) : (
                      'Actualizar Producto'
                    )}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setShowEditForm(false)
                      setEditingProduct(null)
                      setImagePreview(null)
                    }}
                    disabled={uploadingImage}
                  >
                    Cancelar
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            <div className="col-span-full text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600 mx-auto"></div>
              <p className="mt-2 text-gray-600">Cargando productos...</p>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="col-span-full text-center py-8">
              <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {searchTerm ? 'No se encontraron productos' : 'No hay productos'}
              </h3>
              <p className="text-gray-600">
                {searchTerm ? 'Intenta con otro término de búsqueda' : 'Agrega el primer producto para comenzar'}
              </p>
            </div>
          ) : (
            filteredProducts.map((product) => {
              const imageUrl = getImageUrl(product)
              
              return (
                <Card key={product.id} className="hover:shadow-lg transition-shadow overflow-hidden">
                  {/* Product Image */}
                  <div className="relative h-48 bg-gray-100">
                    {imageUrl ? (
                      <Image
                        src={imageUrl}
                        alt={product.name}
                        fill
                        className="object-cover"
                        onError={(e) => {
                          // Si la imagen falla, mostrar placeholder
                          const target = e.target as HTMLImageElement
                          target.style.display = 'none'
                        }}
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full text-gray-400">
                        <ImageIcon className="h-12 w-12" />
                      </div>
                    )}
                    {isAdmin && (
                      <div className="absolute top-2 right-2 flex space-x-1">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => openEditForm(product)}
                          className="bg-white/90 hover:bg-white"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleDeleteProduct(product.id)}
                          className="bg-white/90 hover:bg-white text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                  
                  <CardHeader>
                    <CardTitle className="text-lg">{product.name}</CardTitle>
                    <CardDescription>
                      {product.description || 'Sin descripción'}
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Precio:</span>
                        <span className="font-semibold text-lg">${Number(product.price).toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Stock:</span>
                        <span className={`font-medium ${
                          product.stock > 10 ? 'text-green-600' : 
                          product.stock > 0 ? 'text-yellow-600' : 'text-red-600'
                        }`}>
                          {product.stock} unidades
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Estado:</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          product.available 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {product.available ? 'Disponible' : 'No disponible'}
                        </span>
                      </div>
                      {product.category && (
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Categoría:</span>
                          <span className="text-sm font-medium">{product.category.name}</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )
            })
          )}
        </div>
      </main>
    </div>
  )
}
