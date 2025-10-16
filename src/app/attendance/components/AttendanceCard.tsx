import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Clock, CheckCircle, XCircle, Calendar } from 'lucide-react'
import { AttendanceRecord } from '@/types'

type Props = {
  onCheckIn: () => Promise<void>
  onCheckOut: () => Promise<void>
  todayRecord?: AttendanceRecord | null
  loading?: boolean
}

export default function AttendanceCard({ onCheckIn, onCheckOut, todayRecord, loading }: Props) {
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

  const formatTime = (timeString: string) => {
    return new Date(timeString).toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const canCheckIn = !todayRecord?.checkIn
  const canCheckOut = todayRecord?.checkIn && !todayRecord?.checkOut

  return (
    <Card className="bg-gradient-to-r from-orange-50 to-red-50 border-orange-200">
      <CardHeader className="text-center">
        <CardTitle className="text-xl font-bold text-gray-800 flex items-center justify-center gap-2">
          <Clock className="h-6 w-6 text-orange-600" />
          Registro de Asistencia
        </CardTitle>
        <CardDescription>
          {new Date().toLocaleDateString('es-ES', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Estado actual */}
        <div className="text-center">
          {todayRecord ? (
            <div className="space-y-3">
              <Badge className={`px-4 py-2 text-sm font-medium ${getStatusColor(todayRecord.status)}`}>
                {getStatusText(todayRecord.status)}
              </Badge>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center justify-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="font-medium">Entrada:</span>
                  <span>{todayRecord.checkIn ? formatTime(todayRecord.checkIn) : 'No registrada'}</span>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <XCircle className="h-4 w-4 text-red-600" />
                  <span className="font-medium">Salida:</span>
                  <span>{todayRecord.checkOut ? formatTime(todayRecord.checkOut) : 'No registrada'}</span>
                </div>
              </div>

              {todayRecord.workedHours && (
                <div className="flex items-center justify-center gap-2 text-sm">
                  <Clock className="h-4 w-4 text-blue-600" />
                  <span className="font-medium">Horas trabajadas:</span>
                  <span className="font-bold text-blue-600">{todayRecord.workedHours.toFixed(1)}h</span>
                </div>
              )}
            </div>
          ) : (
            <div className="text-gray-600">
              <Calendar className="h-8 w-8 mx-auto mb-2 text-gray-400" />
              <p>No hay registro para hoy</p>
            </div>
          )}
        </div>

        {/* Botones de acción */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
          <Button
            onClick={onCheckIn}
            disabled={!canCheckIn || loading}
            className="bg-green-600 hover:bg-green-700 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-medium transition-all duration-200 shadow-lg hover:shadow-xl text-sm sm:text-base"
          >
            <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
            {loading ? 'Registrando...' : 'Registrar Entrada'}
          </Button>
          
          <Button
            onClick={onCheckOut}
            disabled={!canCheckOut || loading}
            className="bg-red-600 hover:bg-red-700 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-medium transition-all duration-200 shadow-lg hover:shadow-xl text-sm sm:text-base"
          >
            <XCircle className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
            {loading ? 'Registrando...' : 'Registrar Salida'}
          </Button>
        </div>

        {/* Información adicional */}
        <div className="text-center text-xs text-gray-500 bg-white/50 rounded-lg p-3">
          <p className="font-medium mb-1">💡 Información</p>
          <p>
            {canCheckIn && "Puedes registrar tu entrada ahora"}
            {canCheckOut && "Puedes registrar tu salida cuando termines tu jornada"}
            {!canCheckIn && !canCheckOut && "Ya registraste entrada y salida para hoy"}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
