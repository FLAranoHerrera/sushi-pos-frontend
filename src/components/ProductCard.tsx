'use client'

import React from 'react'
import Image from 'next/image'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Product } from '@/types'
import { getImageUrl } from '@/lib/api'
import { Utensils, Plus } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'

interface ProductCardProps {
  product: Product
  onAddToCart: (product: Product) => void
}

const ProductCard = React.memo<ProductCardProps>(({ product, onAddToCart }) => {
  const getProductImageUrl = (product: Product) => {
    return getImageUrl(product.imageUrl || '')
  }

  const handleAddToCart = () => {
    onAddToCart(product)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      handleAddToCart()
    }
  }

  return (
    <Card className="hover:shadow-md transition-shadow">
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
                onClick={handleAddToCart}
                onKeyDown={handleKeyDown}
                className="bg-orange-600 hover:bg-orange-700"
                aria-label={`Agregar ${product.name} al carrito`}
                role="button"
                tabIndex={0}
              >
                <Plus className="h-4 w-4 mr-1" aria-hidden="true" />
                Agregar
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
})

ProductCard.displayName = 'ProductCard'

export default ProductCard
