import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { getDoctors, getCurrentUser, Doctor } from '../utils/storage';

export function DoctorsPage() {
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [filterAvailable, setFilterAvailable] = useState(false);

  useEffect(() => {
    // Check if user is logged in
    const currentUser = getCurrentUser();
    if (!currentUser) {
      navigate('/');
      return;
    }

    loadDoctors();
  }, [navigate]);

  const loadDoctors = () => {
    setDoctors(getDoctors());
  };

  const filteredDoctors = filterAvailable
    ? doctors.filter(doc => doc.available)
    : doctors;

  const handleBookAppointment = () => {
    navigate('/book-appointment');
  };

  const handleBack = () => {
    const currentUser = getCurrentUser();
    if (currentUser?.type === 'patient') {
      navigate('/patient');
    } else {
      navigate('/admin');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <nav className="bg-blue-600 text-white shadow-lg">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl">🏥 Our Doctors</h1>
          <button
            onClick={handleBack}
            className="px-4 py-2 bg-white text-blue-600 rounded-lg hover:bg-gray-100 transition-colors"
          >
            Back to Dashboard
          </button>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-6">
        {/* Page Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl">Available Doctors</h2>
          <label className="flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={filterAvailable}
              onChange={(e) => setFilterAvailable(e.target.checked)}
              className="sr-only peer"
            />
            <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            <span className="ms-3 text-sm text-gray-700">Show only available</span>
          </label>
        </div>

        {/* Doctors Grid */}
        {filteredDoctors.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">
              {filterAvailable
                ? 'No available doctors at the moment.'
                : 'No doctors added yet.'}
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
            {filteredDoctors.map((doctor) => (
              <div key={doctor.id} className="bg-white rounded-lg shadow-lg p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h5 className="text-xl mb-1">Dr. {doctor.name}</h5>
                    <p className="text-gray-600">{doctor.specialization}</p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-sm ${
                      doctor.available
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {doctor.available ? 'Available' : 'Unavailable'}
                  </span>
                </div>
                
                <div className="mb-4">
                  <p className="text-sm text-gray-600">
                    <strong>Consultation Hours:</strong> 10:00 AM - 4:00 PM
                  </p>
                </div>

                {doctor.available && (
                  <button
                    onClick={handleBookAppointment}
                    className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Book Appointment
                  </button>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Info Card */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h5 className="text-xl mb-3">📅 Booking Information</h5>
          <ul className="space-y-2 text-gray-700">
            <li>• Appointment slots available from 10:00 AM to 4:00 PM</li>
            <li>• Each consultation is 1 hour long</li>
            <li>• Please arrive 10 minutes before your scheduled time</li>
            <li>• Bring your medical history and any relevant documents</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
