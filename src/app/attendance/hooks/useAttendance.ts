import { useState, useEffect } from 'react';
import { AttendanceRecord } from '@/types/attendance';
import { attendanceService } from '@/services/attendanceService';

export function useAttendance(employeeId: string) {
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchAttendance = async () => {
    if (!employeeId) return;
    setLoading(true);
    const data = await attendanceService.getAttendance(employeeId);
    setRecords(data);
    setLoading(false);
  };

  const checkIn = async () => {
    await attendanceService.registerCheckIn(employeeId);
    await fetchAttendance();
  };

  const checkOut = async () => {
    await attendanceService.registerCheckOut(employeeId);
    await fetchAttendance();
  };

  useEffect(() => {
    fetchAttendance();
  }, [employeeId]);

  return { records, loading, checkIn, checkOut };
}
