export type Role = 'ADMIN' | 'CLIENT';

export interface User {
  id: string;
  name: string;
  phoneNumber: string;
  role: Role;
}

export interface Native {
  id: string;
  clientId: string;
  name: string;
  gender: 'Male' | 'Female' | 'Other';
  dob: string; // YYYY-MM-DD
  tob: string; // HH:MM
  placeOfBirth: string;
  timeZone: string;
}

export interface Service {
  id: string;
  title: string;
  description: string;
  price: number;
  durationMinutes: number;
  imageUrl?: string;
  subServices?: string[];
  discount?: {
    percentage: number;
    validUntil: string; // ISO String
  };
}

export type AppointmentStatus = 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';
export type ConsultationMode = 'IN_PERSON' | 'VIDEO' | 'PHONE';

export interface Appointment {
  id: string;
  clientId: string;
  clientName: string;
  nativeId: string;
  nativeName: string;
  serviceId: string;
  serviceName: string;
  dateTime: string; // ISO String
  status: AppointmentStatus;
  consultationMode: ConsultationMode;
  queryNotes: string;
  syncedToCalendar: boolean;
}

// Mock Google Calendar Config
export interface CalendarConfig {
  isConnected: boolean;
  calendarId: string;
}

export interface BlackoutDate {
  id: string;
  date: string; // YYYY-MM-DD
  startTime?: string; // HH:MM
  endTime?: string; // HH:MM
  reason: string;
}
