'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Utensils, ShoppingCart, Users, DollarSign, TrendingUp, LogOut, Settings, Package, Clock } from 'lucide-react'
import { OrderStats } from '@/types'
import { ordersService } from '@/services/orders.service'
import SystemStatus from '@/components/SystemStatus'
import { useRole } from '@/hooks/useRole'

export default function DashboardPage() {
  const { user, logout, isAuthenticated, loading: authLoading } = useAuth()
  const { isAdmin, isMesero, canAccessPOS, canManageProducts, canManageOrders, canManageUsers } = useRole()
  const [stats, setStats] = useState<OrderStats | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    if (authLoading) {
      return // Esperar a que termine la autenticación
    }

    if (!isAuthenticated) {
      router.push('/login')
      return
    }

    const loadStats = async () => {
      try {
        const data = await ordersService.getOrderStats()
        setStats(data)
      } catch (error) {
        console.error('Error loading stats:', error)
      } finally {
        setLoading(false)
      }
    }

    loadStats()
  }, [isAuthenticated, authLoading, router])

  const handleLogout = () => {
    logout()
    router.push('/login')
  }

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

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="bg-orange-100 p-2 rounded-lg mr-3">
                <Utensils className="h-6 w-6 text-orange-600" />
              </div>
              <h1 className="text-xl font-bold text-gray-900">SushiPOS</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <span className="text-sm text-gray-600">
                  Hola, {user?.name}
                </span>
                <div className="text-xs text-gray-500">
                  {isAdmin ? '👑 Administrador' : isMesero ? '🍽️ Mesero' : 'Usuario'}
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="flex items-center"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Cerrar Sesión
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* System Status Component */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <SystemStatus />
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900">Dashboard</h2>
          <p className="text-gray-600">Resumen de tu restaurante</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Órdenes</CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {loading ? '...' : stats?.totalOrders || 0}
              </div>
              <p className="text-xs text-muted-foreground">
                Todas las órdenes
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Órdenes Pagadas</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {loading ? '...' : stats?.paidOrders || 0}
              </div>
              <p className="text-xs text-muted-foreground">
                Completadas exitosamente
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Órdenes Pendientes</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {loading ? '...' : stats?.pendingOrders || 0}
              </div>
              <p className="text-xs text-muted-foreground">
                En proceso
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Ingresos Totales</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {loading ? '...' : `$${stats?.totalRevenue?.toFixed(2) || '0.00'}`}
              </div>
              <p className="text-xs text-muted-foreground">
                Ingresos del día
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* POS - Disponible para ADMIN y MESERO */}
          {canAccessPOS && (
            <Card className="hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => router.push('/pos')}>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <ShoppingCart className="h-5 w-5 mr-2 text-orange-600" />
                  Punto de Venta
                </CardTitle>
                <CardDescription>
                  Crear órdenes rápidamente y enviar a cocina
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full bg-orange-600 hover:bg-orange-700">
                  Abrir POS
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Órdenes - Disponible para ADMIN y MESERO */}
          {canManageOrders && (
            <Card className="hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => router.push('/orders')}>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="h-5 w-5 mr-2 text-blue-600" />
                  Órdenes
                </CardTitle>
                <CardDescription>
                  Gestionar flujo de órdenes: cocina → lista → cobrar
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full">
                  Ver Órdenes
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Productos - Para ADMIN y MESERO */}
          {(canManageProducts || canAccessPOS) && (
            <Card className="hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => router.push('/products')}>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Package className="h-5 w-5 mr-2 text-green-600" />
                  Productos
                </CardTitle>
                <CardDescription>
                  {isAdmin ? 'Gestionar menú y productos' : 'Ver menú y productos'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full">
                  {isAdmin ? 'Gestionar Menú' : 'Ver Menú'}
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Asistencia - Disponible para todos los empleados */}
          <Card className="hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => router.push('/attendance')}>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Clock className="h-5 w-5 mr-2 text-blue-600" />
                Mi Asistencia
              </CardTitle>
              <CardDescription>
                Registrar entrada y salida, ver historial
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full">
                Ver Mi Asistencia
              </Button>
            </CardContent>
          </Card>

          {/* Asistencia Admin - Solo para administradores */}
          {canManageUsers && (
            <Card className="hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => router.push('/attendance/admin')}>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="h-5 w-5 mr-2 text-purple-600" />
                  Asistencia de Empleados
                </CardTitle>
                <CardDescription>
                  Supervisar asistencia de todos los empleados
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full">
                  Ver Todos los Empleados
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Usuarios - Solo para ADMIN */}
          {canManageUsers && (
            <Card className="hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => router.push('/users')}>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Settings className="h-5 w-5 mr-2 text-purple-600" />
                  Usuarios
                </CardTitle>
                <CardDescription>
                  Gestionar usuarios y permisos
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full">
                  Gestionar Usuarios
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  )
}
