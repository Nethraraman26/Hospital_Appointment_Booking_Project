import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import {
  getAppointments,
  getCurrentUser,
  logout,
  Appointment,
  Patient,
} from '../utils/storage';

export function PatientDashboard() {
  const navigate = useNavigate();
  const [patient, setPatient] = useState<Patient | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  useEffect(() => {
    // Check if user is logged in as patient
    const currentUser = getCurrentUser();
    if (!currentUser || currentUser.type !== 'patient' || !currentUser.data) {
      navigate('/');
      return;
    }

    setPatient(currentUser.data);
    loadAppointments(currentUser.data.id);
  }, [navigate]);

  const loadAppointments = (patientId: string) => {
    const allAppointments = getAppointments();
    const patientAppointments = allAppointments.filter(
      apt => apt.patientId === patientId
    );
    setAppointments(patientAppointments);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const goToBooking = () => {
    navigate('/book-appointment');
  };

  const goToDoctors = () => {
    navigate('/doctors');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <nav className="bg-blue-600 text-white shadow-lg">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl">🏥 Patient Dashboard</h1>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-white text-blue-600 rounded-lg hover:bg-gray-100 transition-colors"
          >
            Logout
          </button>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-6">
        {/* Welcome Section */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h3 className="text-2xl mb-2">Welcome, {patient?.name}!</h3>
          <p className="text-gray-600">Phone: {patient?.phone}</p>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow-lg p-6 text-center">
            <h5 className="text-xl mb-3">View Doctors</h5>
            <p className="text-gray-600 mb-4">Browse our list of available doctors</p>
            <button
              onClick={goToDoctors}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              View Doctors
            </button>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-6 text-center">
            <h5 className="text-xl mb-3">Book Appointment</h5>
            <p className="text-gray-600 mb-4">Schedule a new appointment with a doctor</p>
            <button
              onClick={goToBooking}
              className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Book Now
            </button>
          </div>
        </div>

        {/* My Appointments */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h4 className="text-2xl mb-6">My Appointments</h4>
          {appointments.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 mb-4">You don't have any appointments yet.</p>
              <button
                onClick={goToBooking}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Book Your First Appointment
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-3 text-left text-gray-700">Doctor</th>
                    <th className="px-6 py-3 text-left text-gray-700">Date</th>
                    <th className="px-6 py-3 text-left text-gray-700">Time Slot</th>
                    <th className="px-6 py-3 text-left text-gray-700">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {appointments.map((appointment) => {
                    const appointmentDate = new Date(appointment.date);
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);
                    const isPast = appointmentDate < today;
                    
                    return (
                      <tr key={appointment.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">{appointment.doctorName}</td>
                        <td className="px-6 py-4">{appointment.date}</td>
                        <td className="px-6 py-4">{appointment.timeSlot}</td>
                        <td className="px-6 py-4">
                          <span
                            className={`px-3 py-1 rounded-full text-sm ${
                              isPast
                                ? 'bg-gray-100 text-gray-800'
                                : 'bg-green-100 text-green-800'
                            }`}
                          >
                            {isPast ? 'Completed' : 'Upcoming'}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
