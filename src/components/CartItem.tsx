'use client'

import React from 'react'
import { Button } from '@/components/ui/button'
import { OrderItem } from '@/types'
import { Plus, Minus } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'

interface CartItemProps {
  item: OrderItem
  onUpdateQuantity: (productId: string, quantity: number) => void
  onRemove: (productId: string) => void
}

const CartItem = React.memo<CartItemProps>(({ item, onUpdateQuantity, onRemove }) => {
  const handleIncrease = () => {
    onUpdateQuantity(item.product.id, item.quantity + 1)
  }

  const handleDecrease = () => {
    onUpdateQuantity(item.product.id, item.quantity - 1)
  }

  const handleRemove = () => {
    onRemove(item.product.id)
  }

  const handleKeyDown = (e: React.KeyboardEvent, action: () => void) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      action()
    }
  }

  return (
    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
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
          onClick={handleDecrease}
          onKeyDown={(e) => handleKeyDown(e, handleDecrease)}
          aria-label={`Disminuir cantidad de ${item.product.name}`}
          aria-label={`Disminuir cantidad de ${item.product.name}`}
        >
          <Minus className="h-3 w-3" aria-hidden="true" />
        </Button>
        <span className="text-sm font-medium w-8 text-center">
          {item.quantity}
        </span>
        <Button
          size="sm"
          variant="outline"
          onClick={handleIncrease}
          onKeyDown={(e) => handleKeyDown(e, handleIncrease)}
          aria-label={`Aumentar cantidad de ${item.product.name}`}
        >
          <Plus className="h-3 w-3" aria-hidden="true" />
        </Button>
        <Button
          size="sm"
          variant="destructive"
          onClick={handleRemove}
          onKeyDown={(e) => handleKeyDown(e, handleRemove)}
          aria-label={`Eliminar ${item.product.name} del carrito`}
        >
          ×
        </Button>
      </div>
    </div>
  )
})

CartItem.displayName = 'CartItem'

export default CartItem
