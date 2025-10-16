import React from 'react'
import { Badge } from '@/components/ui/badge'
import { Clock, CheckCircle, XCircle, Calendar, AlertCircle } from 'lucide-react'
import { AttendanceRecord } from '@/types'

type Props = {
  attendance: AttendanceRecord[]
}

export default function AttendanceTable({ attendance }: Props) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'on_time':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'late':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'absent':
        return 'bg-red-100 text-red-800 border-red-200'
      case 'extra_hours':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'on_time':
        return <CheckCircle className="h-4 w-4" />
      case 'late':
        return <AlertCircle className="h-4 w-4" />
      case 'absent':
        return <XCircle className="h-4 w-4" />
      case 'extra_hours':
        return <Clock className="h-4 w-4" />
      default:
        return <Calendar className="h-4 w-4" />
    }
  }

  const formatTime = (timeString: string) => {
    return new Date(timeString).toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      weekday: 'short',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  }

  const formatHours = (hours: number | null) => {
    if (hours === null || hours === undefined) return '-'
    return `${hours.toFixed(1)}h`
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse min-w-[600px]">
        <thead>
          <tr className="bg-gray-50 border-b">
            <th className="p-2 sm:p-4 font-semibold text-gray-700 text-xs sm:text-sm">Fecha</th>
            <th className="p-2 sm:p-4 font-semibold text-gray-700 text-xs sm:text-sm">Entrada</th>
            <th className="p-2 sm:p-4 font-semibold text-gray-700 text-xs sm:text-sm">Salida</th>
            <th className="p-2 sm:p-4 font-semibold text-gray-700 text-xs sm:text-sm">Horas</th>
            <th className="p-2 sm:p-4 font-semibold text-gray-700 text-xs sm:text-sm">Estado</th>
            <th className="p-2 sm:p-4 font-semibold text-gray-700 text-xs sm:text-sm hidden sm:table-cell">Notas</th>
          </tr>
        </thead>
        <tbody>
          {attendance.length > 0 ? (
            attendance.map((record, index) => (
              <tr 
                key={record.id} 
                className={`border-b hover:bg-gray-50 transition-colors ${
                  index % 2 === 0 ? 'bg-white' : 'bg-gray-25'
                }`}
              >
                <td className="p-2 sm:p-4">
                  <div className="flex items-center gap-1 sm:gap-2">
                    <Calendar className="h-3 w-3 sm:h-4 sm:w-4 text-gray-400" />
                    <span className="font-medium text-xs sm:text-sm">{formatDate(record.date)}</span>
                  </div>
                </td>
                <td className="p-2 sm:p-4">
                  {record.checkIn ? (
                    <div className="flex items-center gap-1 sm:gap-2 text-green-700">
                      <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4" />
                      <span className="font-medium text-xs sm:text-sm">{formatTime(record.checkIn)}</span>
                    </div>
                  ) : (
                    <span className="text-gray-400 text-xs sm:text-sm">-</span>
                  )}
                </td>
                <td className="p-2 sm:p-4">
                  {record.checkOut ? (
                    <div className="flex items-center gap-1 sm:gap-2 text-red-700">
                      <XCircle className="h-3 w-3 sm:h-4 sm:w-4" />
                      <span className="font-medium text-xs sm:text-sm">{formatTime(record.checkOut)}</span>
                    </div>
                  ) : (
                    <span className="text-gray-400 text-xs sm:text-sm">-</span>
                  )}
                </td>
                <td className="p-2 sm:p-4">
                  {record.workedHours ? (
                    <div className="flex items-center gap-1 sm:gap-2 text-blue-700">
                      <Clock className="h-3 w-3 sm:h-4 sm:w-4" />
                      <span className="font-medium text-xs sm:text-sm">{formatHours(record.workedHours)}</span>
                    </div>
                  ) : (
                    <span className="text-gray-400 text-xs sm:text-sm">-</span>
                  )}
                </td>
                <td className="p-2 sm:p-4">
                  <Badge className={`px-2 py-1 sm:px-3 sm:py-1 rounded-full text-xs sm:text-sm font-medium border ${getStatusColor(record.status)}`}>
                    <div className="flex items-center gap-1">
                      {getStatusIcon(record.status)}
                      <span className="hidden sm:inline">{getStatusText(record.status)}</span>
                    </div>
                  </Badge>
                </td>
                <td className="p-2 sm:p-4 hidden sm:table-cell">
                  {record.notes ? (
                    <span className="text-xs sm:text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded">
                      {record.notes}
                    </span>
                  ) : (
                    <span className="text-gray-400 text-xs sm:text-sm">-</span>
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={6} className="text-center py-12">
                <div className="flex flex-col items-center gap-4">
                  <Calendar className="h-12 w-12 text-gray-400" />
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No hay registros de asistencia</h3>
                    <p className="text-gray-600">Los registros de asistencia aparecerán aquí cuando comiences a trabajar</p>
                  </div>
                </div>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}
