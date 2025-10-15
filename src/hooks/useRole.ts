import { useAuth } from '@/contexts/AuthContext'

export const useRole = () => {
  const { user } = useAuth()

  const isAdmin = user?.role?.name === 'ADMIN'
  const isMesero = user?.role?.name === 'MESERO'
  
  const canAccessAdmin = isAdmin
  const canAccessPOS = isAdmin || isMesero
  const canManageProducts = isAdmin
  const canManageOrders = isAdmin || isMesero
  const canManageUsers = isAdmin

  return {
    isAdmin,
    isMesero,
    canAccessAdmin,
    canAccessPOS,
    canManageProducts,
    canManageOrders,
    canManageUsers,
    role: user?.role?.name,
  }
}
