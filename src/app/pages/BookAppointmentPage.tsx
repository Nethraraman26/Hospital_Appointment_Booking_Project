import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import {
  getDoctors,
  getCurrentUser,
  addAppointment,
  getAvailableSlots,
  Doctor,
  Patient,
} from '../utils/storage';

export function BookAppointmentPage() {
  const navigate = useNavigate();
  const [patient, setPatient] = useState<Patient | null>(null);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [selectedDoctorId, setSelectedDoctorId] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [selectedSlot, setSelectedSlot] = useState('');
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState<'success' | 'danger'>('success');

  useEffect(() => {
    // Check if user is logged in as patient
    const currentUser = getCurrentUser();
    if (!currentUser || currentUser.type !== 'patient' || !currentUser.data) {
      navigate('/');
      return;
    }

    setPatient(currentUser.data);
    loadDoctors();
  }, [navigate]);

  const loadDoctors = () => {
    const allDoctors = getDoctors();
    // Only show available doctors
    const availableDoctors = allDoctors.filter(doc => doc.available);
    setDoctors(availableDoctors);
  };

  // Get today's date in YYYY-MM-DD format for min date
  const getTodayDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Update available slots when doctor or date changes
  useEffect(() => {
    if (selectedDoctorId && selectedDate) {
      const slots = getAvailableSlots(selectedDoctorId, selectedDate);
      setAvailableSlots(slots);
      setSelectedSlot('');
      
      // Show alert if no slots available
      if (slots.length === 0) {
        setAlertMessage('No available slots for this doctor on the selected date. Please choose another date.');
        setAlertType('danger');
        setShowAlert(true);
      } else {
        setShowAlert(false);
      }
    }
  }, [selectedDoctorId, selectedDate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedDoctorId || !selectedDate || !selectedSlot) {
      setAlertMessage('Please fill in all fields');
      setAlertType('danger');
      setShowAlert(true);
      return;
    }

    const selectedDoctor = doctors.find(doc => doc.id === selectedDoctorId);
    
    if (!selectedDoctor || !patient) {
      return;
    }

    // Double-check if slot is still available
    const slots = getAvailableSlots(selectedDoctorId, selectedDate);
    if (!slots.includes(selectedSlot)) {
      setAlertMessage('This time slot is no longer available. Please select another slot.');
      setAlertType('danger');
      setShowAlert(true);
      setAvailableSlots(slots);
      setSelectedSlot('');
      return;
    }

    // Book the appointment
    addAppointment({
      patientId: patient.id,
      patientName: patient.name,
      doctorId: selectedDoctor.id,
      doctorName: selectedDoctor.name,
      date: selectedDate,
      timeSlot: selectedSlot,
    });

    setAlertMessage('Appointment booked successfully!');
    setAlertType('success');
    setShowAlert(true);

    // Reset form
    setSelectedDoctorId('');
    setSelectedDate('');
    setSelectedSlot('');
    setAvailableSlots([]);

    // Redirect to patient dashboard after 2 seconds
    setTimeout(() => {
      navigate('/patient');
    }, 2000);
  };

  const handleBack = () => {
    navigate('/patient');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <nav className="bg-blue-600 text-white shadow-lg">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl">🏥 Book Appointment</h1>
          <button
            onClick={handleBack}
            className="px-4 py-2 bg-white text-blue-600 rounded-lg hover:bg-gray-100 transition-colors"
          >
            Back to Dashboard
          </button>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-6">
        <div className="max-w-3xl mx-auto">
          {/* Alert */}
          {showAlert && (
            <div
              className={`mb-6 p-4 rounded-lg ${
                alertType === 'success'
                  ? 'bg-green-100 border border-green-400 text-green-700'
                  : 'bg-red-100 border border-red-400 text-red-700'
              }`}
            >
              <div className="flex justify-between items-center">
                <span>{alertMessage}</span>
                <button
                  onClick={() => setShowAlert(false)}
                  className="text-xl leading-none hover:opacity-70"
                >
                  ×
                </button>
              </div>
            </div>
          )}

          {/* Booking Form */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-2xl mb-6">Book Your Appointment</h3>
            
            {doctors.length === 0 ? (
              <div className="p-4 bg-yellow-100 border border-yellow-400 text-yellow-700 rounded-lg">
                No doctors are currently available. Please check back later.
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                {/* Patient Info */}
                <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                  <h6 className="text-lg mb-3">Patient Information</h6>
                  <p className="mb-2"><strong>Name:</strong> {patient?.name}</p>
                  <p className="mb-0"><strong>Phone:</strong> {patient?.phone}</p>
                </div>

                {/* Select Doctor */}
                <div className="mb-4">
                  <label className="block text-gray-700 mb-2">
                    Select Doctor <span className="text-red-600">*</span>
                  </label>
                  <select
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={selectedDoctorId}
                    onChange={(e) => setSelectedDoctorId(e.target.value)}
                    required
                  >
                    <option value="">-- Choose a doctor --</option>
                    {doctors.map((doctor) => (
                      <option key={doctor.id} value={doctor.id}>
                        Dr. {doctor.name} - {doctor.specialization}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Select Date */}
                <div className="mb-4">
                  <label className="block text-gray-700 mb-2">
                    Select Date <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="date"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    min={getTodayDate()}
                    required
                  />
                </div>

                {/* Select Time Slot */}
                {selectedDoctorId && selectedDate && (
                  <div className="mb-6">
                    <label className="block text-gray-700 mb-2">
                      Select Time Slot <span className="text-red-600">*</span>
                    </label>
                    
                    {availableSlots.length === 0 ? (
                      <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                        All slots are booked for this date. Please select another date.
                      </div>
                    ) : (
                      <div className="grid md:grid-cols-2 gap-3">
                        {availableSlots.map((slot) => (
                          <label
                            key={slot}
                            className={`block cursor-pointer border-2 rounded-lg p-3 transition-colors ${
                              selectedSlot === slot
                                ? 'border-blue-600 bg-blue-50'
                                : 'border-gray-300 hover:border-blue-400'
                            }`}
                          >
                            <input
                              type="radio"
                              name="timeSlot"
                              value={slot}
                              checked={selectedSlot === slot}
                              onChange={(e) => setSelectedSlot(e.target.value)}
                              className="sr-only"
                              required
                            />
                            <span className="block text-center">{slot}</span>
                          </label>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  className={`w-full py-3 rounded-lg text-white transition-colors ${
                    !selectedDoctorId || !selectedDate || !selectedSlot
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-blue-600 hover:bg-blue-700'
                  }`}
                  disabled={!selectedDoctorId || !selectedDate || !selectedSlot}
                >
                  Confirm Booking
                </button>
              </form>
            )}
          </div>

          {/* Information Card */}
          <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h5 className="text-xl mb-3">⏰ Time Slot Information</h5>
            <ul className="space-y-2 text-gray-700">
              <li>• Consultation hours: 10:00 AM - 4:00 PM</li>
              <li>• Each time slot is 1 hour long</li>
              <li>• Only available time slots are shown</li>
              <li>• You can only book one slot per doctor per day</li>
              <li>• Please arrive 10 minutes before your scheduled time</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
