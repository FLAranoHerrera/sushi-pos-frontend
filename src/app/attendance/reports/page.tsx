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
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, Download, Calendar, Users, Clock, TrendingUp, FileText, Filter } from 'lucide-react'
import { AttendanceRecord } from '@/types'
import { attendanceService } from '@/services/attendanceService'

export default function AttendanceReportsPage() {
  const { user, isAuthenticated, loading: authLoading } = useAuth()
  const { isAdmin } = useRole()
  const [reports, setReports] = useState<AttendanceRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [selectedFormat, setSelectedFormat] = useState<'csv' | 'pdf'>('csv')
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

    // Establecer fechas por defecto (último mes)
    const today = new Date()
    const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1)
    setStartDate(lastMonth.toISOString().split('T')[0])
    setEndDate(today.toISOString().split('T')[0])

    loadReports()
  }, [isAuthenticated, authLoading, router, isAdmin])

  const loadReports = async () => {
    if (!startDate || !endDate) return

    try {
      setLoading(true)
      const data = await attendanceService.getAttendanceReport(startDate, endDate)
      setReports(data)
    } catch (error) {
      console.error('Error loading reports:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleExport = async () => {
    if (!startDate || !endDate) return

    try {
      const blob = await attendanceService.exportAttendanceReport(startDate, endDate, selectedFormat)
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `reporte-asistencia-${startDate}-${endDate}.${selectedFormat}`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (error) {
      console.error('Error exporting report:', error)
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
                <div className="bg-blue-100 p-2 rounded-lg mr-3">
                  <FileText className="h-6 w-6 text-blue-600" />
                </div>
                <h1 className="text-xl font-bold text-gray-900">Reportes de Asistencia</h1>
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
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900">Reportes de Asistencia</h2>
          <p className="text-gray-600">Genera y exporta reportes de asistencia de todos los empleados</p>
        </div>

        {/* Filtros */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Filter className="h-5 w-5 mr-2" />
              Filtros de Reporte
            </CardTitle>
            <CardDescription>
              Selecciona el rango de fechas y formato de exportación
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <Label htmlFor="startDate">Fecha Inicio</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="endDate">Fecha Fin</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="format">Formato</Label>
                <Select value={selectedFormat} onValueChange={(value: 'csv' | 'pdf') => setSelectedFormat(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="csv">CSV</SelectItem>
                    <SelectItem value="pdf">PDF</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-end gap-2">
                <Button onClick={loadReports} className="flex-1">
                  <Calendar className="h-4 w-4 mr-2" />
                  Generar
                </Button>
                <Button onClick={handleExport} variant="outline">
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Resumen */}
        {reports.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Empleados</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{reports.length}</div>
                <p className="text-xs text-muted-foreground">
                  En el período seleccionado
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Registros</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {reports.length}
                </div>
                <p className="text-xs text-muted-foreground">
                  En el período
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Retrasos</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {reports.filter(r => r.status === 'late').length}
                </div>
                <p className="text-xs text-muted-foreground">
                  En el período
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Ausencias</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {reports.filter(r => r.status === 'absent').length}
                </div>
                <p className="text-xs text-muted-foreground">
                  En el período
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Reportes */}
        <Card>
          <CardHeader>
            <CardTitle>Reporte Detallado</CardTitle>
            <CardDescription>
              Asistencia de todos los empleados en el período seleccionado
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600 mx-auto"></div>
                <p className="mt-2 text-gray-600">Generando reporte...</p>
              </div>
            ) : reports.length === 0 ? (
              <div className="text-center py-8">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No hay datos</h3>
                <p className="text-gray-600">No se encontraron registros para el período seleccionado</p>
              </div>
            ) : (
              <div className="space-y-4">
                {reports.map((record) => (
                  <Card key={record.id} className="border-l-4 border-l-blue-500">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg">Registro #{record.id.slice(-8)}</CardTitle>
                          <CardDescription>
                            {new Date(record.date).toLocaleDateString('es-ES')}
                          </CardDescription>
                        </div>
                        <div className="flex gap-2">
                          <Badge className={`px-3 py-1 rounded-full text-sm font-medium ${
                            record.status === 'on_time' ? 'bg-green-100 text-green-800' :
                            record.status === 'late' ? 'bg-yellow-100 text-yellow-800' :
                            record.status === 'absent' ? 'bg-red-100 text-red-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {record.status === 'on_time' ? 'A tiempo' :
                             record.status === 'late' ? 'Retraso' :
                             record.status === 'absent' ? 'Ausente' :
                             'Sin registro'}
                          </Badge>
                        </div>
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
