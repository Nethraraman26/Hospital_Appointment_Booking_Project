import { useState } from 'react';
import { useNavigate } from 'react-router';
import { loginAdmin, loginPatient, registerPatient, setCurrentUser } from '../utils/storage';

export function LandingPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'admin' | 'patient-login' | 'patient-register'>('admin');
  
  // Admin login state
  const [adminUsername, setAdminUsername] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  
  // Patient login state
  const [patientName, setPatientName] = useState('');
  const [patientPassword, setPatientPassword] = useState('');
  
  // Patient registration state
  const [regName, setRegName] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');
  
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (loginAdmin(adminUsername, adminPassword)) {
      setCurrentUser({ type: 'admin', data: null });
      navigate('/admin');
    } else {
      setError('Invalid admin credentials');
    }
  };

  const handlePatientLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    const patient = loginPatient(patientName, patientPassword);
    if (patient) {
      setCurrentUser({ type: 'patient', data: patient });
      navigate('/patient');
    } else {
      setError('Invalid name or password');
    }
  };

  const handlePatientRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    try {
      const patient = registerPatient({
        name: regName,
        phone: regPhone,
        password: regPassword,
      });
      
      setSuccess('Registration successful! Please login.');
      setRegName('');
      setRegPhone('');
      setRegPassword('');
      
      // Auto switch to login tab after 2 seconds
      setTimeout(() => {
        setActiveTab('patient-login');
        setSuccess('');
      }, 2000);
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <nav className="bg-blue-600 text-white shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-2xl">🏥 Hospital Appointment System</h1>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="bg-blue-600 text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl mb-3">Welcome to Our Hospital</h2>
          <p className="text-xl">Book your appointment with our experienced doctors</p>
        </div>
      </div>

      {/* Login/Register Section */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-lg mx-auto">
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="p-6">
              {/* Tabs */}
              <div className="flex border-b mb-6">
                <button
                  className={`flex-1 py-3 px-4 text-center border-b-2 transition-colors ${
                    activeTab === 'admin'
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-gray-600 hover:text-blue-600'
                  }`}
                  onClick={() => {
                    setActiveTab('admin');
                    setError('');
                    setSuccess('');
                  }}
                >
                  Admin Login
                </button>
                <button
                  className={`flex-1 py-3 px-4 text-center border-b-2 transition-colors ${
                    activeTab === 'patient-login'
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-gray-600 hover:text-blue-600'
                  }`}
                  onClick={() => {
                    setActiveTab('patient-login');
                    setError('');
                    setSuccess('');
                  }}
                >
                  Patient Login
                </button>
                <button
                  className={`flex-1 py-3 px-4 text-center border-b-2 transition-colors ${
                    activeTab === 'patient-register'
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-gray-600 hover:text-blue-600'
                  }`}
                  onClick={() => {
                    setActiveTab('patient-register');
                    setError('');
                    setSuccess('');
                  }}
                >
                  Patient Register
                </button>
              </div>

              {/* Error/Success Messages */}
              {error && (
                <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
                  {error}
                </div>
              )}
              {success && (
                <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
                  {success}
                </div>
              )}

              {/* Admin Login Form */}
              {activeTab === 'admin' && (
                <form onSubmit={handleAdminLogin}>
                  <h4 className="text-xl mb-4">Admin Login</h4>
                  <div className="mb-4">
                    <label className="block text-gray-700 mb-2">Username</label>
                    <input
                      type="text"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={adminUsername}
                      onChange={(e) => setAdminUsername(e.target.value)}
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-700 mb-2">Password</label>
                    <input
                      type="password"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={adminPassword}
                      onChange={(e) => setAdminPassword(e.target.value)}
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Login as Admin
                  </button>
                  <div className="mt-3 text-gray-500 text-sm">
                    Default credentials: admin / admin123
                  </div>
                </form>
              )}

              {/* Patient Login Form */}
              {activeTab === 'patient-login' && (
                <form onSubmit={handlePatientLogin}>
                  <h4 className="text-xl mb-4">Patient Login</h4>
                  <div className="mb-4">
                    <label className="block text-gray-700 mb-2">Name</label>
                    <input
                      type="text"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={patientName}
                      onChange={(e) => setPatientName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-700 mb-2">Password</label>
                    <input
                      type="password"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={patientPassword}
                      onChange={(e) => setPatientPassword(e.target.value)}
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Login as Patient
                  </button>
                </form>
              )}

              {/* Patient Registration Form */}
              {activeTab === 'patient-register' && (
                <form onSubmit={handlePatientRegister}>
                  <h4 className="text-xl mb-4">Patient Registration</h4>
                  <div className="mb-4">
                    <label className="block text-gray-700 mb-2">Full Name</label>
                    <input
                      type="text"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={regName}
                      onChange={(e) => setRegName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-700 mb-2">Phone</label>
                    <input
                      type="tel"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={regPhone}
                      onChange={(e) => setRegPhone(e.target.value)}
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-700 mb-2">Password</label>
                    <input
                      type="password"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      required
                      minLength={6}
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Register
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-6 mt-12">
        <div className="container mx-auto px-4 text-center">
          <p>© 2026 Hospital Appointment System. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
