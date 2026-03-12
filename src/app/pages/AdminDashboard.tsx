import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import {
  getDoctors,
  addDoctor,
  updateDoctorAvailability,
  getAppointments,
  deleteAppointment,
  getCurrentUser,
  logout,
  getPatients,
  Doctor,
  Appointment,
  Patient,
} from '../utils/storage';

export function AdminDashboard() {
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [activeTab, setActiveTab] = useState<'doctors' | 'appointments' | 'patients'>('doctors');
  
  // Add doctor form state
  const [doctorName, setDoctorName] = useState('');
  const [doctorSpecialization, setDoctorSpecialization] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    // Check if user is logged in as admin
    const currentUser = getCurrentUser();
    if (!currentUser || currentUser.type !== 'admin') {
      navigate('/');
      return;
    }

    loadData();
  }, [navigate]);

  const loadData = () => {
    setDoctors(getDoctors());
    setAppointments(getAppointments());
    setPatients(getPatients());
  };

  const handleAddDoctor = (e: React.FormEvent) => {
    e.preventDefault();
    addDoctor({
      name: doctorName,
      specialization: doctorSpecialization,
      available: true,
    });
    setDoctorName('');
    setDoctorSpecialization('');
    setShowAddForm(false);
    loadData();
  };

  const handleToggleAvailability = (doctorId: string, currentStatus: boolean) => {
    updateDoctorAvailability(doctorId, !currentStatus);
    loadData();
  };

  const handleDeleteAppointment = (id: string) => {
    if (window.confirm('Are you sure you want to delete this appointment?')) {
      deleteAppointment(id);
      loadData();
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <nav className="bg-blue-600 text-white shadow-lg">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl">🏥 Admin Dashboard</h1>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-white text-blue-600 rounded-lg hover:bg-gray-100 transition-colors"
          >
            Logout
          </button>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-6">
        {/* Tabs */}
        <div className="flex border-b mb-6">
          <button
            className={`py-3 px-6 border-b-2 transition-colors ${
              activeTab === 'doctors'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-blue-600'
            }`}
            onClick={() => setActiveTab('doctors')}
          >
            Manage Doctors
          </button>
          <button
            className={`py-3 px-6 border-b-2 transition-colors ${
              activeTab === 'appointments'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-blue-600'
            }`}
            onClick={() => setActiveTab('appointments')}
          >
            Manage Appointments
          </button>
          <button
            className={`py-3 px-6 border-b-2 transition-colors ${
              activeTab === 'patients'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-blue-600'
            }`}
            onClick={() => setActiveTab('patients')}
          >
            Patients Data
          </button>
        </div>

        {/* Doctors Tab */}
        {activeTab === 'doctors' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl">Doctors</h3>
              <button
                onClick={() => setShowAddForm(!showAddForm)}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                {showAddForm ? 'Cancel' : '+ Add Doctor'}
              </button>
            </div>

            {/* Add Doctor Form */}
            {showAddForm && (
              <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
                <h5 className="text-xl mb-4">Add New Doctor</h5>
                <form onSubmit={handleAddDoctor}>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-gray-700 mb-2">Doctor Name</label>
                      <input
                        type="text"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={doctorName}
                        onChange={(e) => setDoctorName(e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 mb-2">Specialization</label>
                      <input
                        type="text"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={doctorSpecialization}
                        onChange={(e) => setDoctorSpecialization(e.target.value)}
                        required
                      />
                    </div>
                    <div className="flex items-end">
                      <button
                        type="submit"
                        className="w-full px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                      >
                        Add
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            )}

            {/* Doctors List */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              {doctors.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No doctors added yet.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b">
                      <tr>
                        <th className="px-6 py-3 text-left text-gray-700">Name</th>
                        <th className="px-6 py-3 text-left text-gray-700">Specialization</th>
                        <th className="px-6 py-3 text-left text-gray-700">Status</th>
                        <th className="px-6 py-3 text-left text-gray-700">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {doctors.map((doctor) => (
                        <tr key={doctor.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4">{doctor.name}</td>
                          <td className="px-6 py-4">{doctor.specialization}</td>
                          <td className="px-6 py-4">
                            <span
                              className={`px-3 py-1 rounded-full text-sm ${
                                doctor.available
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-red-100 text-red-800'
                              }`}
                            >
                              {doctor.available ? 'Available' : 'Unavailable'}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <label className="flex items-center cursor-pointer">
                              <input
                                type="checkbox"
                                checked={doctor.available}
                                onChange={() =>
                                  handleToggleAvailability(doctor.id, doctor.available)
                                }
                                className="sr-only peer"
                              />
                              <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                              <span className="ms-3 text-sm text-gray-700">Toggle Availability</span>
                            </label>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Appointments Tab */}
        {activeTab === 'appointments' && (
          <div>
            <h3 className="text-2xl mb-6">All Appointments</h3>
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              {appointments.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No appointments booked yet.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b">
                      <tr>
                        <th className="px-6 py-3 text-left text-gray-700">Patient Name</th>
                        <th className="px-6 py-3 text-left text-gray-700">Doctor Name</th>
                        <th className="px-6 py-3 text-left text-gray-700">Date</th>
                        <th className="px-6 py-3 text-left text-gray-700">Time Slot</th>
                        <th className="px-6 py-3 text-left text-gray-700">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {appointments.map((appointment) => (
                        <tr key={appointment.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4">{appointment.patientName}</td>
                          <td className="px-6 py-4">{appointment.doctorName}</td>
                          <td className="px-6 py-4">{appointment.date}</td>
                          <td className="px-6 py-4">{appointment.timeSlot}</td>
                          <td className="px-6 py-4">
                            <button
                              onClick={() => handleDeleteAppointment(appointment.id)}
                              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Patients Tab */}
        {activeTab === 'patients' && (
          <div>
            <h3 className="text-2xl mb-6">Registered Patients</h3>
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              {patients.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No patients registered yet.</p>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 p-6">
                  {patients.map((patient) => (
                    <div key={patient.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-center mb-3">
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-xl mr-3">
                          👤
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-800">{patient.name}</h4>
                          <p className="text-sm text-gray-500">Patient ID: {patient.id}</p>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center text-sm">
                          <span className="text-gray-600">📞 Phone:</span>
                          <span className="ml-2 text-gray-800">{patient.phone}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
