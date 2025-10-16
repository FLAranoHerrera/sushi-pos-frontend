'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { useRole } from '@/hooks/useRole'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Utensils, ArrowLeft, Clock, CheckCircle, XCircle, Download, Calendar, Users } from 'lucide-react'
import { AttendanceRecord, AttendanceStats } from '@/types'
import { attendanceService } from '@/services/attendanceService'
import AttendanceCard from './components/AttendanceCard'
import AttendanceTable from './components/AttendanceTable'

export default function AttendancePage() {
  const { user, isAuthenticated, loading: authLoading } = useAuth()
  const { isAdmin, isMesero } = useRole()
  const [records, setRecords] = useState<AttendanceRecord[]>([])
  const [todayRecord, setTodayRecord] = useState<AttendanceRecord | null>(null)
  const [stats, setStats] = useState<AttendanceStats | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    if (authLoading) {
      return
    }

    if (!isAuthenticated) {
      router.push('/login')
      return
    }

    if (!user?.id) {
      return
    }

    loadAttendanceData()
  }, [isAuthenticated, authLoading, router, user?.id])

  const loadAttendanceData = async () => {
    if (!user?.id) return

    try {
      setLoading(true)
      
      // Cargar registros de asistencia
      const attendanceData = await attendanceService.getAttendance(user.id)
      setRecords(attendanceData)

      // Cargar registro de hoy
      const todayData = await attendanceService.getTodayAttendance(user.id)
      setTodayRecord(todayData)

      // Cargar estadísticas del mes actual
      const currentDate = new Date()
      const statsData = await attendanceService.getAttendanceStats(
        user.id,
        currentDate.getMonth() + 1,
        currentDate.getFullYear()
      )
      setStats(statsData)
    } catch (error) {
      console.error('Error loading attendance data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCheckIn = async () => {
    if (!user?.id) return

    try {
      await attendanceService.registerCheckIn(user.id)
      await loadAttendanceData()
    } catch (error) {
      console.error('Error checking in:', error)
    }
  }

  const handleCheckOut = async () => {
    if (!user?.id) return

    try {
      await attendanceService.registerCheckOut(user.id)
      await loadAttendanceData()
    } catch (error) {
      console.error('Error checking out:', error)
    }
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
                  <Clock className="h-6 w-6 text-orange-600" />
                </div>
                <h1 className="text-xl font-bold text-gray-900">Control de Asistencia</h1>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                {user?.name} ({isAdmin ? '👑 Administrador' : isMesero ? '🍽️ Mesero' : 'Empleado'})
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        <div className="mb-6 sm:mb-8">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Mi Asistencia</h2>
          <p className="text-sm sm:text-base text-gray-600">Registra tu entrada y salida, y revisa tu historial</p>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-6 sm:mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Días Trabajados</CardTitle>
                <CheckCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.workedDays}</div>
                <p className="text-xs text-muted-foreground">
                  de {stats.totalDays} días
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Horas Totales</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalHours.toFixed(1)}h</div>
                <p className="text-xs text-muted-foreground">
                  Promedio: {stats.averageHoursPerDay.toFixed(1)}h/día
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Retrasos</CardTitle>
                <XCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.lateDays}</div>
                <p className="text-xs text-muted-foreground">
                  Este mes
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Ausencias</CardTitle>
                <XCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.absentDays}</div>
                <p className="text-xs text-muted-foreground">
                  Este mes
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Attendance Card */}
        <div className="mb-6 sm:mb-8">
          <AttendanceCard 
            onCheckIn={handleCheckIn} 
            onCheckOut={handleCheckOut}
            todayRecord={todayRecord}
            loading={loading}
          />
        </div>

        {/* Attendance Table */}
        <Card>
          <CardHeader>
            <CardTitle>Historial de Asistencia</CardTitle>
            <CardDescription>
              Registro de tus entradas y salidas
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600 mx-auto"></div>
                <p className="mt-2 text-gray-600">Cargando registros...</p>
              </div>
            ) : (
              <AttendanceTable attendance={records} />
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
