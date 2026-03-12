// Types
export interface Doctor {
  id: string;
  name: string;
  specialization: string;
  available: boolean;
}

export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  date: string;
  timeSlot: string;
}

export interface Patient {
  id: string;
  name: string;
  phone: string;
  password: string;
}

export interface Admin {
  username: string;
  password: string;
}

// Storage keys
const DOCTORS_KEY = 'hospital_doctors';
const APPOINTMENTS_KEY = 'hospital_appointments';
const PATIENTS_KEY = 'hospital_patients';
const CURRENT_USER_KEY = 'hospital_current_user';

// Initialize default admin credentials
const DEFAULT_ADMIN: Admin = {
  username: 'admin',
  password: 'admin123'
};

// Doctors management
export const getDoctors = (): Doctor[] => {
  const data = localStorage.getItem(DOCTORS_KEY);
  return data ? JSON.parse(data) : [];
};

export const saveDoctors = (doctors: Doctor[]) => {
  localStorage.setItem(DOCTORS_KEY, JSON.stringify(doctors));
};

export const addDoctor = (doctor: Omit<Doctor, 'id'>) => {
  const doctors = getDoctors();
  const newDoctor: Doctor = {
    ...doctor,
    id: Date.now().toString(),
  };
  doctors.push(newDoctor);
  saveDoctors(doctors);
  return newDoctor;
};

export const updateDoctorAvailability = (doctorId: string, available: boolean) => {
  const doctors = getDoctors();
  const updatedDoctors = doctors.map(doc =>
    doc.id === doctorId ? { ...doc, available } : doc
  );
  saveDoctors(updatedDoctors);
};

// Appointments management
export const getAppointments = (): Appointment[] => {
  const data = localStorage.getItem(APPOINTMENTS_KEY);
  return data ? JSON.parse(data) : [];
};

export const saveAppointments = (appointments: Appointment[]) => {
  localStorage.setItem(APPOINTMENTS_KEY, JSON.stringify(appointments));
};

export const addAppointment = (appointment: Omit<Appointment, 'id'>) => {
  const appointments = getAppointments();
  const newAppointment: Appointment = {
    ...appointment,
    id: Date.now().toString(),
  };
  appointments.push(newAppointment);
  saveAppointments(appointments);
  return newAppointment;
};

export const deleteAppointment = (id: string) => {
  const appointments = getAppointments();
  const filtered = appointments.filter(apt => apt.id !== id);
  saveAppointments(filtered);
};

export const isSlotBooked = (doctorId: string, date: string, timeSlot: string): boolean => {
  const appointments = getAppointments();
  return appointments.some(
    apt => apt.doctorId === doctorId && apt.date === date && apt.timeSlot === timeSlot
  );
};

export const getAvailableSlots = (doctorId: string, date: string): string[] => {
  const allSlots = [
    '10:00 AM - 11:00 AM',
    '11:00 AM - 12:00 PM',
    '12:00 PM - 1:00 PM',
    '1:00 PM - 2:00 PM',
    '2:00 PM - 3:00 PM',
    '3:00 PM - 4:00 PM',
  ];
  
  return allSlots.filter(slot => !isSlotBooked(doctorId, date, slot));
};

// Patients management
export const getPatients = (): Patient[] => {
  const data = localStorage.getItem(PATIENTS_KEY);
  return data ? JSON.parse(data) : [];
};

export const savePatients = (patients: Patient[]) => {
  localStorage.setItem(PATIENTS_KEY, JSON.stringify(patients));
};

export const registerPatient = (patient: Omit<Patient, 'id'>) => {
  const patients = getPatients();
  
  // Check if name already exists
  if (patients.some(p => p.name.toLowerCase() === patient.name.toLowerCase())) {
    throw new Error('Name already registered');
  }
  
  const newPatient: Patient = {
    ...patient,
    id: Date.now().toString(),
  };
  patients.push(newPatient);
  savePatients(patients);
  return newPatient;
};

export const loginPatient = (name: string, password: string): Patient | null => {
  const patients = getPatients();
  const patient = patients.find(p => p.name.toLowerCase() === name.toLowerCase() && p.password === password);
  return patient || null;
};

// Admin authentication
export const loginAdmin = (username: string, password: string): boolean => {
  return username === DEFAULT_ADMIN.username && password === DEFAULT_ADMIN.password;
};

// Current user management
export const setCurrentUser = (user: { type: 'admin' | 'patient'; data: Patient | null }) => {
  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
};

export const getCurrentUser = (): { type: 'admin' | 'patient'; data: Patient | null } | null => {
  const data = localStorage.getItem(CURRENT_USER_KEY);
  return data ? JSON.parse(data) : null;
};

export const logout = () => {
  localStorage.removeItem(CURRENT_USER_KEY);
};