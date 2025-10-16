'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { useRole } from '@/hooks/useRole'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, Users, Clock, CheckCircle, XCircle, Calendar, Download, Filter } from 'lucide-react'
import { AttendanceRecord } from '@/types'
import { attendanceService } from '@/services/attendanceService'

export default function AttendanceAdminPage() {
  const { user, isAuthenticated, loading: authLoading } = useAuth()
  const { isAdmin } = useRole()
  const [allRecords, setAllRecords] = useState<AttendanceRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
  const router = useRouter()

  useEffect(() => {
    if (authLoading) {
      return
    }

    if (!isAuthenticated) {
      router.push('/login')
      return
    }

    if (!isAdmin) {
      router.push('/dashboard')
      return
    }

    loadAllAttendance()
  }, [isAuthenticated, authLoading, router, isAdmin])

  const loadAllAttendance = async () => {
    try {
      setLoading(true)
      // Simular datos de todos los empleados
      const mockData: AttendanceRecord[] = [
        {
          id: '1',
          employeeId: 'emp-001',
          date: selectedDate,
          checkIn: '2025-10-16T08:00:00Z',
          checkOut: '2025-10-16T17:00:00Z',
          workedHours: 9,
          status: 'on_time',
          notes: 'Jornada completa',
          createdAt: '2025-10-16T08:00:00Z',
          updatedAt: '2025-10-16T17:00:00Z'
        },
        {
          id: '2',
          employeeId: 'emp-002',
          date: selectedDate,
          checkIn: '2025-10-16T08:15:00Z',
          checkOut: null,
          workedHours: null,
          status: 'late',
          notes: 'Llegó tarde',
          createdAt: '2025-10-16T08:15:00Z',
          updatedAt: '2025-10-16T08:15:00Z'
        },
        {
          id: '3',
          employeeId: 'emp-003',
          date: selectedDate,
          checkIn: null,
          checkOut: null,
          workedHours: null,
          status: 'absent',
          notes: 'Ausente sin aviso',
          createdAt: '2025-10-16T00:00:00Z',
          updatedAt: '2025-10-16T00:00:00Z'
        }
      ]
      setAllRecords(mockData)
    } catch (error) {
      console.error('Error loading attendance data:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'on_time':
        return 'bg-green-100 text-green-800'
      case 'late':
        return 'bg-yellow-100 text-yellow-800'
      case 'absent':
        return 'bg-red-100 text-red-800'
      case 'extra_hours':
        return 'bg-blue-100 text-blue-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'on_time':
        return 'A tiempo'
      case 'late':
        return 'Retraso'
      case 'absent':
        return 'Ausente'
      case 'extra_hours':
        return 'Horas extra'
      default:
        return 'Sin registro'
    }
  }

  const getEmployeeName = (employeeId: string) => {
    const names: { [key: string]: string } = {
      'emp-001': 'Juan Pérez',
      'emp-002': 'María García',
      'emp-003': 'Carlos López'
    }
    return names[employeeId] || `Empleado ${employeeId}`
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

  if (!isAuthenticated || !isAdmin) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push('/attendance')}
                className="mr-4"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Volver
              </Button>
              <div className="flex items-center">
                <div className="bg-purple-100 p-2 rounded-lg mr-3">
                  <Users className="h-6 w-6 text-purple-600" />
                </div>
                <h1 className="text-xl font-bold text-gray-900">Asistencia de Empleados</h1>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                {user?.name} (👑 Administrador)
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        <div className="mb-6 sm:mb-8">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Control de Asistencia</h2>
          <p className="text-sm sm:text-base text-gray-600">Supervisa la asistencia de todos los empleados</p>
        </div>

        {/* Filtros */}
        <Card className="mb-6 sm:mb-8">
          <CardHeader>
            <CardTitle className="flex items-center text-sm sm:text-base">
              <Filter className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
              Filtros
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-end">
              <div className="flex-1">
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                  Fecha
                </label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
                />
              </div>
              <Button onClick={loadAllAttendance} className="w-full sm:w-auto">
                <Calendar className="h-4 w-4 mr-2" />
                Actualizar
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Resumen */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-6 sm:mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Empleados</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{allRecords.length}</div>
              <p className="text-xs text-muted-foreground">
                Registrados hoy
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Presentes</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {allRecords.filter(r => r.checkIn).length}
              </div>
              <p className="text-xs text-muted-foreground">
                Con entrada registrada
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Retrasos</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {allRecords.filter(r => r.status === 'late').length}
              </div>
              <p className="text-xs text-muted-foreground">
                Llegaron tarde
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Ausentes</CardTitle>
              <XCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {allRecords.filter(r => r.status === 'absent').length}
              </div>
              <p className="text-xs text-muted-foreground">
                Sin registro
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Lista de Empleados */}
        <Card>
          <CardHeader>
            <CardTitle>Asistencia del Día</CardTitle>
            <CardDescription>
              Estado de asistencia de todos los empleados
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600 mx-auto"></div>
                <p className="mt-2 text-gray-600">Cargando datos...</p>
              </div>
            ) : (
              <div className="space-y-4">
                {allRecords.map((record) => (
                  <Card key={record.id} className="border-l-4 border-l-blue-500">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg">{getEmployeeName(record.employeeId)}</CardTitle>
                          <CardDescription>ID: {record.employeeId}</CardDescription>
                        </div>
                        <Badge className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(record.status)}`}>
                          {getStatusText(record.status)}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600">Entrada:</span>
                          <span className="font-medium ml-2">
                            {record.checkIn ? new Date(record.checkIn).toLocaleTimeString() : 'No registrada'}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-600">Salida:</span>
                          <span className="font-medium ml-2">
                            {record.checkOut ? new Date(record.checkOut).toLocaleTimeString() : 'No registrada'}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-600">Horas:</span>
                          <span className="font-medium ml-2">
                            {record.workedHours ? `${record.workedHours.toFixed(1)}h` : '-'}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-600">Notas:</span>
                          <span className="font-medium ml-2">
                            {record.notes || '-'}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
