export type AttendanceRecord = {
  id: string
  employeeId: string
  date: string
  checkIn?: string | null
  checkOut?: string | null
  workedHours?: number | null
  status: 'on_time' | 'late' | 'absent' | 'extra_hours'
  notes?: string | null
  createdAt: string
  updatedAt: string
}
