import api from '@/lib/api'
import { AttendanceRecord, AttendanceReport } from '@/types'
import { attendanceServiceMock } from './attendanceServiceMock'

// Usar mock temporalmente hasta que el backend implemente las rutas de asistencia
const USE_MOCK = true

export const attendanceService = {
  async getAttendance(employeeId: string): Promise<AttendanceRecord[]> {
    if (USE_MOCK) {
      return attendanceServiceMock.getAttendance(employeeId)
    }
    const response = await api.get(`/attendance/employee/${employeeId}`)
    return response.data
  },

  async getAttendanceReport(startDate: string, endDate: string): Promise<AttendanceRecord[]> {
    if (USE_MOCK) {
      return attendanceServiceMock.getAttendanceReport(startDate, endDate)
    }
    const response = await api.get(`/attendance/report?startDate=${startDate}&endDate=${endDate}`)
    return response.data
  },

  async registerCheckIn(employeeId: string): Promise<AttendanceRecord> {
    if (USE_MOCK) {
      return attendanceServiceMock.registerCheckIn(employeeId)
    }
    const response = await api.post(`/attendance/check-in/${employeeId}`)
    return response.data
  },

  async registerCheckOut(employeeId: string): Promise<AttendanceRecord> {
    if (USE_MOCK) {
      return attendanceServiceMock.registerCheckOut(employeeId)
    }
    const response = await api.post(`/attendance/check-out/${employeeId}`)
    return response.data
  },

  async getTodayAttendance(employeeId: string): Promise<AttendanceRecord | null> {
    if (USE_MOCK) {
      return attendanceServiceMock.getTodayAttendance(employeeId)
    }
    const response = await api.get(`/attendance/today/${employeeId}`)
    return response.data
  },

  async getAttendanceStats(employeeId: string, month: number, year: number): Promise<{
    totalDays: number
    workedDays: number
    lateDays: number
    absentDays: number
    totalHours: number
    averageHoursPerDay: number
  }> {
    if (USE_MOCK) {
      return attendanceServiceMock.getAttendanceStats(employeeId, month, year)
    }
    const response = await api.get(`/attendance/stats/${employeeId}?month=${month}&year=${year}`)
    return response.data
  },

  async exportAttendanceReport(startDate: string, endDate: string, format: 'csv' | 'pdf'): Promise<Blob> {
    if (USE_MOCK) {
      return attendanceServiceMock.exportAttendanceReport(startDate, endDate, format)
    }
    const response = await api.get(`/attendance/export?startDate=${startDate}&endDate=${endDate}&format=${format}`, {
      responseType: 'blob'
    })
    return response.data
  },

  async markAbsent(employeeId: string, date: string, reason?: string): Promise<void> {
    if (USE_MOCK) {
      // Mock implementation
      return Promise.resolve()
    }
    await api.post(`/attendance/mark-absent/${employeeId}`, { date, reason })
  },

  async updateWorkSchedule(employeeId: string, schedule: {
    startTime: string
    endTime: string
    daysOfWeek: number[]
  }): Promise<void> {
    if (USE_MOCK) {
      // Mock implementation
      return Promise.resolve()
    }
    await api.put(`/attendance/schedule/${employeeId}`, schedule)
  },

  async generateQRCode(employeeId: string): Promise<string> {
    if (USE_MOCK) {
      // Mock implementation
      return Promise.resolve('mock-qr-code')
    }
    const response = await api.get(`/attendance/qr/${employeeId}`)
    return response.data.qrCode
  }
}
