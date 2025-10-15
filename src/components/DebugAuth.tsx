'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRole } from '@/hooks/useRole'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  User, 
  Shield, 
  Clock, 
  Wifi, 
  WifiOff, 
  RefreshCw, 
  CheckCircle, 
  XCircle,
  Activity
} from 'lucide-react'

export default function SystemStatus() {
  const { user, isAuthenticated } = useAuth()
  const { isAdmin } = useRole()
  const [backendStatus, setBackendStatus] = useState<'checking' | 'online' | 'offline'>('checking')
  const [lastChecked, setLastChecked] = useState<Date | null>(null)

  const checkBackendStatus = async () => {
    setBackendStatus('checking')
    try {
      const response = await fetch('https://sushi-pos-backend.onrender.com/api', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      
      if (response.ok) {
        setBackendStatus('online')
      } else {
        setBackendStatus('offline')
      }
    } catch {
      setBackendStatus('offline')
    }
    setLastChecked(new Date())
  }

  useEffect(() => {
    checkBackendStatus()
    // Verificar cada 30 segundos
    const interval = setInterval(checkBackendStatus, 30000)
    return () => clearInterval(interval)
  }, [])

  const getStatusIcon = () => {
    switch (backendStatus) {
      case 'online':
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case 'offline':
        return <XCircle className="h-4 w-4 text-red-600" />
      case 'checking':
        return <RefreshCw className="h-4 w-4 text-yellow-600 animate-spin" />
    }
  }

  const getStatusColor = () => {
    switch (backendStatus) {
      case 'online':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'offline':
        return 'bg-red-100 text-red-800 border-red-200'
      case 'checking':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
    }
  }

  const getStatusText = () => {
    switch (backendStatus) {
      case 'online':
        return 'Backend Conectado'
      case 'offline':
        return 'Backend Desconectado'
      case 'checking':
        return 'Verificando...'
    }
  }

  return (
    <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            <Activity className="h-5 w-5 text-blue-600" />
            Estado del Sistema
          </CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={checkBackendStatus}
            disabled={backendStatus === 'checking'}
            className="flex items-center gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${backendStatus === 'checking' ? 'animate-spin' : ''}`} />
            Verificar
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Estado del Backend */}
        <div className="flex items-center justify-between p-3 bg-white rounded-lg border">
          <div className="flex items-center gap-3">
            {backendStatus === 'online' ? (
              <Wifi className="h-5 w-5 text-green-600" />
            ) : (
              <WifiOff className="h-5 w-5 text-red-600" />
            )}
            <div>
              <p className="font-medium text-gray-900">Backend API</p>
              <p className="text-sm text-gray-600">
                {lastChecked ? `Última verificación: ${lastChecked.toLocaleTimeString()}` : 'No verificado'}
              </p>
            </div>
          </div>
          <Badge className={getStatusColor()}>
            {getStatusIcon()}
            <span className="ml-1">{getStatusText()}</span>
          </Badge>
        </div>

        {/* Información del Usuario */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white rounded-lg p-3 border">
            <div className="flex items-center gap-2 mb-2">
              <User className="h-4 w-4 text-blue-600" />
              <p className="text-sm text-gray-600">Usuario</p>
            </div>
            <p className="font-medium text-gray-900">
              {user ? user.name : 'No autenticado'}
            </p>
          </div>
          
          <div className="bg-white rounded-lg p-3 border">
            <div className="flex items-center gap-2 mb-2">
              <Shield className="h-4 w-4 text-purple-600" />
              <p className="text-sm text-gray-600">Rol</p>
            </div>
            <p className="font-medium text-gray-900">
              {user?.role?.name === 'ADMIN' ? '👑 Administrador' : 
               user?.role?.name === 'MESERO' ? '🍽️ Mesero' : 'Sin rol'}
            </p>
          </div>
        </div>

        {/* Estado de Autenticación */}
        <div className="flex items-center justify-between p-3 bg-white rounded-lg border">
          <div className="flex items-center gap-3">
            <Clock className="h-5 w-5 text-gray-600" />
            <div>
              <p className="font-medium text-gray-900">Sesión</p>
              <p className="text-sm text-gray-600">
                {isAuthenticated ? 'Sesión activa' : 'No autenticado'}
              </p>
            </div>
          </div>
          <Badge className={isAuthenticated ? 'bg-green-100 text-green-800 border-green-200' : 'bg-red-100 text-red-800 border-red-200'}>
            {isAuthenticated ? '✅ Activa' : '❌ Inactiva'}
          </Badge>
        </div>

        {/* Información adicional para administradores */}
        {isAdmin && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <p className="text-sm text-yellow-800 font-medium">
              🔧 Panel de Administración
            </p>
            <p className="text-xs text-yellow-700 mt-1">
              Tienes acceso completo al sistema
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
