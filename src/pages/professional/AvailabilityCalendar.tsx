import React, { useState } from 'react';
import { Calendar, Clock, ChevronLeft, ChevronRight, Plus, X, Check, AlertCircle } from 'lucide-react';
import { Helmet } from 'react-helmet-async';

interface TimeSlot {
  id: string;
  date: Date;
  startTime: string;
  endTime: string;
  isBooked: boolean;
  jobId?: string;
  jobTitle?: string;
  homeownerName?: string;
}

interface AvailabilitySettings {
  workDays: {
    monday: boolean;
    tuesday: boolean;
    wednesday: boolean;
    thursday: boolean;
    friday: boolean;
    saturday: boolean;
    sunday: boolean;
  };
  workHours: {
    start: string;
    end: string;
  };
  breakTime: {
    start: string;
    end: string;
  };
  bufferTime: number; // in minutes
}

const AvailabilityCalendar: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [showAddSlotModal, setShowAddSlotModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [newSlotStart, setNewSlotStart] = useState('09:00');
  const [newSlotEnd, setNewSlotEnd] = useState('17:00');
  const [loading, setLoading] = useState(false);

  const [availabilitySettings, setAvailabilitySettings] = useState<AvailabilitySettings>({
    workDays: {
      monday: true,
      tuesday: true,
      wednesday: true,
      thursday: true,
      friday: true,
      saturday: false,
      sunday: false,
    },
    workHours: {
      start: '09:00',
      end: '17:00',
    },
    breakTime: {
      start: '12:00',
      end: '13:00',
    },
    bufferTime: 30,
  });

  // Generate days for the current month
  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay();
  };

  const generateCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentYear, currentMonth);
    const firstDayOfMonth = getFirstDayOfMonth(currentYear, currentMonth);

    const days = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(null);
    }

    // Add days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(currentYear, currentMonth, i));
    }

    return days;
  };

  const changeMonth = (increment: number) => {
    const newDate = new Date(currentYear, currentMonth + increment, 1);
    setCurrentMonth(newDate.getMonth());
    setCurrentYear(newDate.getFullYear());
  };

  const handleDateSelect = async (date: Date) => {
    setSelectedDate(date);
    setLoading(true);

    try {
      // This would be replaced with an actual API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Generate mock time slots for the selected date
      const mockTimeSlots: TimeSlot[] = [
        {
          id: 'slot1',
          date: new Date(date),
          startTime: '09:00',
          endTime: '11:00',
          isBooked: false,
        },
        {
          id: 'slot2',
          date: new Date(date),
          startTime: '11:30',
          endTime: '13:30',
          isBooked: true,
          jobId: 'job123',
          jobTitle: 'Bathroom Renovation',
          homeownerName: 'John Smith',
        },
        {
          id: 'slot3',
          date: new Date(date),
          startTime: '14:00',
          endTime: '16:00',
          isBooked: false,
        },
        {
          id: 'slot4',
          date: new Date(date),
          startTime: '16:30',
          endTime: '18:00',
          isBooked: true,
          jobId: 'job456',
          jobTitle: 'Kitchen Sink Installation',
          homeownerName: 'Sarah Johnson',
        },
      ];

      setTimeSlots(mockTimeSlots);
    } catch (error) {
      console.error('Error fetching time slots:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddTimeSlot = async () => {
    if (!selectedDate) return;

    setLoading(true);

    try {
      // This would be replaced with an actual API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Create new time slot
      const newSlot: TimeSlot = {
        id: `slot_${Date.now()}`,
        date: new Date(selectedDate),
        startTime: newSlotStart,
        endTime: newSlotEnd,
        isBooked: false,
      };

      // Add to existing time slots
      setTimeSlots([...timeSlots, newSlot]);

      // Close modal
      setShowAddSlotModal(false);

      // Reset form
      setNewSlotStart('09:00');
      setNewSlotEnd('17:00');
    } catch (error) {
      console.error('Error adding time slot:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTimeSlot = async (slotId: string) => {
    if (!confirm('Are you sure you want to delete this time slot?')) {
      return;
    }

    setLoading(true);

    try {
      // This would be replaced with an actual API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Remove from time slots
      setTimeSlots(timeSlots.filter(slot => slot.id !== slotId));
    } catch (error) {
      console.error('Error deleting time slot:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSettings = async () => {
    setLoading(true);

    try {
      // This would be replaced with an actual API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Close modal
      setShowSettingsModal(false);

      // Show success message
      alert('Availability settings saved successfully!');
    } catch (error) {
      console.error('Error saving settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApplyDefaultSchedule = async () => {
    if (!selectedDate) return;

    if (!confirm('This will apply your default work hours to this date. Continue?')) {
      return;
    }

    setLoading(true);

    try {
      // This would be replaced with an actual API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Create new time slot based on default work hours
      const newSlot: TimeSlot = {
        id: `slot_${Date.now()}`,
        date: new Date(selectedDate),
        startTime: availabilitySettings.workHours.start,
        endTime: availabilitySettings.workHours.end,
        isBooked: false,
      };

      // Add to existing time slots
      setTimeSlots([...timeSlots, newSlot]);
    } catch (error) {
      console.error('Error applying default schedule:', error);
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

  const hasBookings = (date: Date) => {
    // This would be replaced with actual logic to check if the date has bookings
    // For now, just return a random boolean
    return Math.random() > 0.7;
  };

  const hasAvailability = (date: Date) => {
    // This would be replaced with actual logic to check if the date has availability set
    // For now, just return a random boolean
    return Math.random() > 0.3;
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <Helmet>
        <title>Availability Calendar - TradeHub24</title>
        <meta name="description" content="Manage your availability and schedule on TradeHub24" />
      </Helmet>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-4 md:mb-0">Availability Calendar</h1>

        <div className="flex space-x-3">
          <button
            onClick={() => setShowSettingsModal(true)}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 flex items-center"
          >
            <Calendar className="h-4 w-4 mr-2" />
            Availability Settings
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Calendar Column */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-4">
              <button
                onClick={() => changeMonth(-1)}
                className="p-1 rounded-full hover:bg-gray-100"
              >
                <ChevronLeft className="h-5 w-5 text-gray-600" />
              </button>

              <h3 className="text-lg font-medium text-gray-900">
                {new Date(currentYear, currentMonth, 1).toLocaleDateString('en-US', {
                  month: 'long',
                  year: 'numeric',
                })}
              </h3>

              <button
                onClick={() => changeMonth(1)}
                className="p-1 rounded-full hover:bg-gray-100"
              >
                <ChevronRight className="h-5 w-5 text-gray-600" />
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
                      className={`w-full h-full flex flex-col items-center justify-center rounded-lg text-sm relative ${
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

                      {/* Indicators */}
                      {!isPastDate(day) && (
                        <div className="flex mt-1 space-x-0.5">
                          {hasBookings(day) && <div className="w-1.5 h-1.5 rounded-full bg-red-500"></div>}
                          {hasAvailability(day) && <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>}
                        </div>
                      )}
                    </button>
                  ) : (
                    <div className="w-full h-full"></div>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex items-center justify-center space-x-4 text-sm">
                <div className="flex items-center">
                  <div className="w-2 h-2 rounded-full bg-green-500 mr-1"></div>
                  <span className="text-gray-600">Available</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 rounded-full bg-red-500 mr-1"></div>
                  <span className="text-gray-600">Booked</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Time Slots Column */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md p-6">
            {selectedDate ? (
              <>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-medium text-gray-900">{formatDate(selectedDate)}</h3>

                  <div className="flex space-x-2">
                    <button
                      onClick={handleApplyDefaultSchedule}
                      className="px-3 py-1.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 text-sm flex items-center"
                    >
                      <Clock className="h-4 w-4 mr-1" />
                      Apply Default Hours
                    </button>

                    <button
                      onClick={() => setShowAddSlotModal(true)}
                      className="px-3 py-1.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-sm flex items-center"
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Add Time Slot
                    </button>
                  </div>
                </div>

                {loading ? (
                  <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                  </div>
                ) : timeSlots.length === 0 ? (
                  <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-lg">
                    <Clock className="mx-auto h-12 w-12 text-gray-300 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No time slots set</h3>
                    <p className="text-gray-500 mb-4">You haven't set any availability for this date yet.</p>
                    <button
                      onClick={() => setShowAddSlotModal(true)}
                      className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-sm inline-flex items-center"
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Add Time Slot
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {timeSlots
                      .sort((a, b) => {
                        const aTime = a.startTime.split(':').map(Number);
                        const bTime = b.startTime.split(':').map(Number);
                        return aTime[0] * 60 + aTime[1] - (bTime[0] * 60 + bTime[1]);
                      })
                      .map((slot) => (
                        <div
                          key={slot.id}
                          className={`border rounded-lg p-4 ${
                            slot.isBooked ? 'border-red-200 bg-red-50' : 'border-green-200 bg-green-50'
                          }`}
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <div className="flex items-center">
                                <Clock
                                  className={`h-5 w-5 ${
                                    slot.isBooked ? 'text-red-500' : 'text-green-500'
                                  } mr-2`}
                                />
                                <span className="font-medium">
                                  {slot.startTime} - {slot.endTime}
                                </span>
                                <span
                                  className={`ml-2 text-xs font-medium px-2 py-0.5 rounded-full ${
                                    slot.isBooked ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                                  }`}
                                >
                                  {slot.isBooked ? 'Booked' : 'Available'}
                                </span>
                              </div>

                              {slot.isBooked && (
                                <div className="mt-2 ml-7">
                                  <p className="text-sm text-gray-700">
                                    <span className="font-medium">Job:</span> {slot.jobTitle}
                                  </p>
                                  <p className="text-sm text-gray-700">
                                    <span className="font-medium">Client:</span> {slot.homeownerName}
                                  </p>
                                  <p className="text-sm text-gray-700">
                                    <span className="font-medium">Job ID:</span> {slot.jobId}
                                  </p>
                                </div>
                              )}
                            </div>

                            {!slot.isBooked && (
                              <button
                                onClick={() => handleDeleteTimeSlot(slot.id)}
                                className="text-gray-400 hover:text-gray-600"
                              >
                                <X className="h-5 w-5" />
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-16">
                <Calendar className="mx-auto h-16 w-16 text-gray-300 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No date selected</h3>
                <p className="text-gray-500">
                  Please select a date from the calendar to view or set availability.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add Time Slot Modal */}
      {showAddSlotModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">Add Time Slot</h3>
              <button
                onClick={() => setShowAddSlotModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
              <div className="border rounded-lg p-3 bg-gray-50 text-gray-700">
                {selectedDate && formatDate(selectedDate)}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <label htmlFor="startTime" className="block text-sm font-medium text-gray-700 mb-1">
                  Start Time
                </label>
                <input
                  type="time"
                  id="startTime"
                  value={newSlotStart}
                  onChange={(e) => setNewSlotStart(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg p-2"
                />
              </div>
              <div>
                <label htmlFor="endTime" className="block text-sm font-medium text-gray-700 mb-1">
                  End Time
                </label>
                <input
                  type="time"
                  id="endTime"
                  value={newSlotEnd}
                  onChange={(e) => setNewSlotEnd(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg p-2"
                />
              </div>
            </div>

            <div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2">
              <button
                type="button"
                onClick={() => setShowAddSlotModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 mb-2 sm:mb-0"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleAddTimeSlot}
                disabled={loading}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center justify-center"
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                ) : (
                  <>
                    <Plus className="h-4 w-4 mr-1" />
                    Add Time Slot
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Settings Modal */}
      {showSettingsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-lg w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">Availability Settings</h3>
              <button
                onClick={() => setShowSettingsModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Working Days
              </label>
              <div className="grid grid-cols-7 gap-2">
                {[
                  { key: 'monday', label: 'M' },
                  { key: 'tuesday', label: 'T' },
                  { key: 'wednesday', label: 'W' },
                  { key: 'thursday', label: 'T' },
                  { key: 'friday', label: 'F' },
                  { key: 'saturday', label: 'S' },
                  { key: 'sunday', label: 'S' },
                ].map((day) => (
                  <button
                    key={day.key}
                    type="button"
                    onClick={() => {
                      setAvailabilitySettings((prev) => ({
                        ...prev,
                        workDays: {
                          ...prev.workDays,
                          [day.key]: !prev.workDays[day.key as keyof typeof prev.workDays],
                        },
                      }));
                    }}
                    className={`aspect-square flex items-center justify-center rounded-lg text-sm font-medium ${
                      availabilitySettings.workDays[day.key as keyof typeof availabilitySettings.workDays]
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {day.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Work Hours - Start
                </label>
                <input
                  type="time"
                  value={availabilitySettings.workHours.start}
                  onChange={(e) => {
                    setAvailabilitySettings((prev) => ({
                      ...prev,
                      workHours: {
                        ...prev.workHours,
                        start: e.target.value,
                      },
                    }));
                  }}
                  className="w-full border border-gray-300 rounded-lg p-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Work Hours - End
                </label>
                <input
                  type="time"
                  value={availabilitySettings.workHours.end}
                  onChange={(e) => {
                    setAvailabilitySettings((prev) => ({
                      ...prev,
                      workHours: {
                        ...prev.workHours,
                        end: e.target.value,
                      },
                    }));
                  }}
                  className="w-full border border-gray-300 rounded-lg p-2"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Break Time - Start
                </label>
                <input
                  type="time"
                  value={availabilitySettings.breakTime.start}
                  onChange={(e) => {
                    setAvailabilitySettings((prev) => ({
                      ...prev,
                      breakTime: {
                        ...prev.breakTime,
                        start: e.target.value,
                      },
                    }));
                  }}
                  className="w-full border border-gray-300 rounded-lg p-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Break Time - End
                </label>
                <input
                  type="time"
                  value={availabilitySettings.breakTime.end}
                  onChange={(e) => {
                    setAvailabilitySettings((prev) => ({
                      ...prev,
                      breakTime: {
                        ...prev.breakTime,
                        end: e.target.value,
                      },
                    }));
                  }}
                  className="w-full border border-gray-300 rounded-lg p-2"
                />
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Buffer Time Between Appointments (minutes)
              </label>
              <select
                value={availabilitySettings.bufferTime}
                onChange={(e) => {
                  setAvailabilitySettings((prev) => ({
                    ...prev,
                    bufferTime: parseInt(e.target.value),
                  }));
                }}
                className="w-full border border-gray-300 rounded-lg p-2"
              >
                <option value="0">No buffer</option>
                <option value="15">15 minutes</option>
                <option value="30">30 minutes</option>
                <option value="45">45 minutes</option>
                <option value="60">1 hour</option>
              </select>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <div className="flex items-start">
                <AlertCircle className="h-5 w-5 text-blue-500 mr-2 mt-0.5" />
                <div>
                  <h4 className="text-sm font-medium text-blue-800 mb-1">Important Note</h4>
                  <p className="text-sm text-blue-700">
                    These settings will be used as defaults when you add new availability.
                    They won't affect any existing bookings.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2">
              <button
                type="button"
                onClick={() => setShowSettingsModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 mb-2 sm:mb-0"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveSettings}
                disabled={loading}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center justify-center"
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                ) : (
                  <>
                    <Check className="h-4 w-4 mr-1" />
                    Save Settings
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AvailabilityCalendar;
