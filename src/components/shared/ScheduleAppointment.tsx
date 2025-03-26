import React, { useState } from 'react';
import { Calendar, Clock, CheckCircle, X } from 'lucide-react';

interface TimeSlot {
  id: string;
  startTime: string;
  endTime: string;
  available: boolean;
}

interface ScheduleAppointmentProps {
  professionalId: string;
  professionalName: string;
  jobId?: string;
  onScheduled?: (date: Date, timeSlot: TimeSlot) => void;
  onCancel?: () => void;
}

const ScheduleAppointment: React.FC<ScheduleAppointmentProps> = ({
  professionalId,
  professionalName,
  jobId,
  onScheduled,
  onCancel,
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<TimeSlot | null>(null);
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  
  // Generate days for the current month
  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };
  
  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay();
  };
  
  const generateCalendarDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    const daysInMonth = getDaysInMonth(year, month);
    const firstDayOfMonth = getFirstDayOfMonth(year, month);
    
    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(null);
    }
    
    // Add days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }
    
    return days;
  };
  
  const handleDateSelect = async (date: Date) => {
    setSelectedDate(date);
    setSelectedTimeSlot(null);
    setLoading(true);
    
    try {
      // This would be replaced with an actual API call
      // Simulate API call to get available time slots
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Generate mock time slots
      const mockTimeSlots: TimeSlot[] = [
        { id: '1', startTime: '09:00', endTime: '10:00', available: true },
        { id: '2', startTime: '10:00', endTime: '11:00', available: true },
        { id: '3', startTime: '11:00', endTime: '12:00', available: false },
        { id: '4', startTime: '13:00', endTime: '14:00', available: true },
        { id: '5', startTime: '14:00', endTime: '15:00', available: true },
        { id: '6', startTime: '15:00', endTime: '16:00', available: false },
        { id: '7', startTime: '16:00', endTime: '17:00', available: true },
      ];
      
      setTimeSlots(mockTimeSlots);
    } catch (error) {
      console.error('Error fetching time slots:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleSchedule = async () => {
    if (!selectedDate || !selectedTimeSlot) return;
    
    setLoading(true);
    
    try {
      // This would be replaced with an actual API call
      // Simulate API call to schedule appointment
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setSuccess(true);
      
      if (onScheduled) {
        onScheduled(selectedDate, selectedTimeSlot);
      }
    } catch (error) {
      console.error('Error scheduling appointment:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };
  
  const isToday = (date: Date) => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };
  
  const isPastDate = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    date.setHours(0, 0, 0, 0);
    return date < today;
  };
  
  const isSelectedDate = (date: Date) => {
    if (!selectedDate) return false;
    
    return (
      date.getDate() === selectedDate.getDate() &&
      date.getMonth() === selectedDate.getMonth() &&
      date.getFullYear() === selectedDate.getFullYear()
    );
  };
  
  const changeMonth = (increment: number) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + increment);
    setCurrentDate(newDate);
  };
  
  if (success) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 max-w-md mx-auto">
        <div className="text-center mb-6">
          <CheckCircle className="mx-auto h-16 w-16 text-green-500" />
          <h2 className="mt-4 text-2xl font-bold text-gray-900">Appointment Scheduled!</h2>
          <p className="mt-2 text-gray-600">
            Your appointment with {professionalName} has been scheduled for:
          </p>
          <p className="mt-1 font-semibold">
            {formatDate(selectedDate!)} at {selectedTimeSlot!.startTime} - {selectedTimeSlot!.endTime}
          </p>
        </div>
        
        <div className="space-y-4">
          <button
            onClick={() => window.location.href = jobId ? `/jobs/details/${jobId}` : '/appointments'}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition duration-200"
          >
            {jobId ? 'Return to Job Details' : 'View My Appointments'}
          </button>
          
          <button
            onClick={onCancel}
            className="w-full border border-gray-300 text-gray-700 font-medium py-2 px-4 rounded-lg hover:bg-gray-50 transition duration-200"
          >
            Close
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6 max-w-md mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-900">Schedule Appointment</h2>
        {onCancel && (
          <button
            onClick={onCancel}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={20} />
          </button>
        )}
      </div>
      
      <div className="mb-6">
        <p className="text-gray-600">
          Scheduling appointment with <span className="font-semibold">{professionalName}</span>
        </p>
        {jobId && (
          <p className="text-sm text-gray-500">
            Job ID: {jobId}
          </p>
        )}
      </div>
      
      {/* Calendar */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <button
            onClick={() => changeMonth(-1)}
            className="p-1 rounded-full hover:bg-gray-100"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          
          <h3 className="text-lg font-medium text-gray-900">
            {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </h3>
          
          <button
            onClick={() => changeMonth(1)}
            className="p-1 rounded-full hover:bg-gray-100"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
        
        <div className="grid grid-cols-7 gap-1 text-center mb-2">
          {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((day) => (
            <div key={day} className="text-gray-500 text-sm font-medium py-1">
              {day}
            </div>
          ))}
        </div>
        
        <div className="grid grid-cols-7 gap-1">
          {generateCalendarDays().map((day, index) => (
            <div key={index} className="aspect-square">
              {day ? (
                <button
                  onClick={() => !isPastDate(day) && handleDateSelect(day)}
                  disabled={isPastDate(day)}
                  className={`w-full h-full flex items-center justify-center rounded-full text-sm ${
                    isPastDate(day)
                      ? 'text-gray-300 cursor-not-allowed'
                      : isSelectedDate(day)
                      ? 'bg-blue-500 text-white'
                      : isToday(day)
                      ? 'bg-blue-100 text-blue-700 font-medium'
                      : 'hover:bg-gray-100'
                  }`}
                >
                  {day.getDate()}
                </button>
              ) : (
                <div className="w-full h-full"></div>
              )}
            </div>
          ))}
        </div>
      </div>
      
      {/* Time Slots */}
      {selectedDate && (
        <div className="mb-6">
          <h3 className="text-lg font-medium text-gray-900 mb-3">
            Available Times for {selectedDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}
          </h3>
          
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            </div>
          ) : timeSlots.length === 0 ? (
            <p className="text-center py-4 text-gray-500">No available time slots for this date.</p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {timeSlots.map((slot) => (
                <button
                  key={slot.id}
                  onClick={() => slot.available && setSelectedTimeSlot(slot)}
                  disabled={!slot.available}
                  className={`py-2 px-3 rounded-lg text-sm flex items-center justify-center ${
                    !slot.available
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : selectedTimeSlot?.id === slot.id
                      ? 'bg-blue-500 text-white'
                      : 'border border-gray-200 hover:border-blue-300'
                  }`}
                >
                  <Clock size={16} className="mr-1" />
                  {slot.startTime} - {slot.endTime}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
      
      {/* Action Buttons */}
      <div className="flex space-x-4">
        <button
          onClick={onCancel}
          className="flex-1 border border-gray-300 text-gray-700 font-medium py-2 px-4 rounded-lg hover:bg-gray-50 transition duration-200"
        >
          Cancel
        </button>
        <button
          onClick={handleSchedule}
          disabled={loading || !selectedDate || !selectedTimeSlot}
          className={`flex-1 bg-blue-500 text-white font-medium py-2 px-4 rounded-lg transition duration-200 ${
            loading || !selectedDate || !selectedTimeSlot
              ? 'opacity-70 cursor-not-allowed'
              : 'hover:bg-blue-600'
          }`}
        >
          {loading ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing...
            </span>
          ) : (
            'Schedule Appointment'
          )}
        </button>
      </div>
    </div>
  );
};

export default ScheduleAppointment;