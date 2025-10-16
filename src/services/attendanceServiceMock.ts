import { AttendanceRecord, AttendanceStats } from '@/types'

// Mock data para pruebas
const mockAttendanceRecords: AttendanceRecord[] = [
  {
    id: '1',
    employeeId: 'b6db1bb0-7136-4ec6-b0ea-ab8460c2cacc',
    date: '2025-10-15',
    checkIn: '2025-10-15T08:00:00Z',
    checkOut: '2025-10-15T17:00:00Z',
    workedHours: 9,
    status: 'on_time',
    notes: 'Jornada completa',
    createdAt: '2025-10-15T08:00:00Z',
    updatedAt: '2025-10-15T17:00:00Z'
  },
  {
    id: '2',
    employeeId: 'b6db1bb0-7136-4ec6-b0ea-ab8460c2cacc',
    date: '2025-10-14',
    checkIn: '2025-10-14T08:15:00Z',
    checkOut: '2025-10-14T17:30:00Z',
    workedHours: 9.25,
    status: 'late',
    notes: 'Llegó tarde por tráfico',
    createdAt: '2025-10-14T08:15:00Z',
    updatedAt: '2025-10-14T17:30:00Z'
  },
  {
    id: '3',
    employeeId: 'b6db1bb0-7136-4ec6-b0ea-ab8460c2cacc',
    date: '2025-10-13',
    checkIn: '2025-10-13T08:00:00Z',
    checkOut: '2025-10-13T19:00:00Z',
    workedHours: 11,
    status: 'extra_hours',
    notes: 'Horas extra por inventario',
    createdAt: '2025-10-13T08:00:00Z',
    updatedAt: '2025-10-13T19:00:00Z'
  }
]

export const attendanceServiceMock = {
  async getAttendance(employeeId: string): Promise<AttendanceRecord[]> {
    // Simular delay de red
    await new Promise(resolve => setTimeout(resolve, 500))
    return mockAttendanceRecords.filter(record => record.employeeId === employeeId)
  },

  async getTodayAttendance(employeeId: string): Promise<AttendanceRecord | null> {
    await new Promise(resolve => setTimeout(resolve, 300))
    const today = new Date().toISOString().split('T')[0]
    const todayRecord = mockAttendanceRecords.find(record => 
      record.employeeId === employeeId && record.date === today
    )
    return todayRecord || null
  },

  async getAttendanceStats(employeeId: string, month: number, year: number): Promise<AttendanceStats> {
    await new Promise(resolve => setTimeout(resolve, 400))
    
    const records = mockAttendanceRecords.filter(record => 
      record.employeeId === employeeId
    )
    
    const workedDays = records.filter(r => r.checkIn).length
    const lateDays = records.filter(r => r.status === 'late').length
    const absentDays = records.filter(r => r.status === 'absent').length
    const totalHours = records.reduce((sum, r) => sum + (r.workedHours || 0), 0)
    
    return {
      totalDays: 30, // Días del mes
      workedDays,
      lateDays,
      absentDays,
      totalHours,
      averageHoursPerDay: workedDays > 0 ? totalHours / workedDays : 0
    }
  },

  async registerCheckIn(employeeId: string): Promise<AttendanceRecord> {
    await new Promise(resolve => setTimeout(resolve, 800))
    
    const now = new Date()
    const today = now.toISOString().split('T')[0]
    const checkInTime = now.toISOString()
    
    const newRecord: AttendanceRecord = {
      id: Date.now().toString(),
      employeeId,
      date: today,
      checkIn: checkInTime,
      checkOut: null,
      workedHours: null,
      status: 'on_time',
      notes: null,
      createdAt: checkInTime,
      updatedAt: checkInTime
    }
    
    // Agregar a mock data
    mockAttendanceRecords.push(newRecord)
    
    return newRecord
  },

  async registerCheckOut(employeeId: string): Promise<AttendanceRecord> {
    await new Promise(resolve => setTimeout(resolve, 800))
    
    const now = new Date()
    const today = now.toISOString().split('T')[0]
    const checkOutTime = now.toISOString()
    
    // Buscar registro de hoy
    const todayRecord = mockAttendanceRecords.find(record => 
      record.employeeId === employeeId && record.date === today && record.checkIn && !record.checkOut
    )
    
    if (!todayRecord) {
      throw new Error('No hay registro de entrada para hoy')
    }
    
    // Calcular horas trabajadas
    const checkInTime = new Date(todayRecord.checkIn!)
    const workedHours = (now.getTime() - checkInTime.getTime()) / (1000 * 60 * 60)
    
    // Actualizar registro
    todayRecord.checkOut = checkOutTime
    todayRecord.workedHours = Math.round(workedHours * 10) / 10
    todayRecord.updatedAt = checkOutTime
    
    return todayRecord
  },

  async getAttendanceReport(startDate: string, endDate: string): Promise<AttendanceRecord[]> {
    await new Promise(resolve => setTimeout(resolve, 600))
    
    return mockAttendanceRecords.filter(record => {
      const recordDate = new Date(record.date)
      const start = new Date(startDate)
      const end = new Date(endDate)
      return recordDate >= start && recordDate <= end
    })
  },

  async exportAttendanceReport(startDate: string, endDate: string, format: 'csv' | 'pdf'): Promise<Blob> {
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    const data = await this.getAttendanceReport(startDate, endDate)
    const csvContent = [
      'ID,Employee ID,Date,Check In,Check Out,Worked Hours,Status,Notes',
      ...data.map(record => 
        `${record.id},${record.employeeId},${record.date},${record.checkIn || ''},${record.checkOut || ''},${record.workedHours || ''},${record.status},${record.notes || ''}`
      )
    ].join('\n')
    
    return new Blob([csvContent], { type: 'text/csv' })
  }
}
