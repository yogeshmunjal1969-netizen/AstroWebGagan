import { User, Service, Native, Appointment, CalendarConfig, BlackoutDate } from '../types';
import { db } from './firebase';
import {
  collection,
  getDocs,
  setDoc,
  doc,
  query,
  where,
  deleteDoc,
  updateDoc
} from 'firebase/firestore';

// --- Database Configuration ---
const DB_KEY = 'gagan_astro_db_v8';

// --- Initial Seed Data (Used only if DB is empty) ---
const SEED_SERVICES: Service[] = [
  {
    id: '1',
    title: 'SBC Chart Reading',
    description: 'Specialized deep dive using Sarvatobhadra Chakra technique for precise predictions.',
    price: 2500,
    durationMinutes: 60,
    imageUrl: 'https://images.unsplash.com/photo-1532968961962-8a0cb3a2d4f5?auto=format&fit=crop&q=80&w=600',
    subServices: [
      'Detailed Vedha (Obstruction) Analysis',
      'Nakshatra Transit Impact',
      'Pancha-Pakshi Assessment',
      'Customized Timing for Events'
    ]
  },
  {
    id: '2',
    title: 'Detailed Chart Reading',
    description: 'Comprehensive analysis of Lagna, Navamsa, and Dasha periods for overall life guidance.',
    price: 3500,
    durationMinutes: 90,
    imageUrl: 'https://images.unsplash.com/photo-1502481851541-7cc86ac62863?auto=format&fit=crop&q=80&w=600',
    discount: {
      percentage: 15,
      validUntil: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString()
    },
    subServices: [
      'Lagna & Navamsa Analysis',
      'Vimshottari Dasha Trends',
      'Strength of Planets (Shadbala)',
      'Next 5 Years Overview'
    ]
  },
  {
    id: '3',
    title: 'Birth Time Rectification',
    description: 'Precise calculation to determine exact birth time for accurate charts.',
    price: 5000,
    durationMinutes: 90,
    imageUrl: 'https://images.unsplash.com/photo-1501139083538-0139583c61df?auto=format&fit=crop&q=80&w=600',
    subServices: [
      'Tattva Shodhana Theory',
      'Past Event Verification',
      'Physical Features Matching',
      'Rectified Chart Generation'
    ]
  },
  {
    id: '4',
    title: 'Upayas (Remedial Measures)',
    description: 'Customized Vedic remedies, gemstones, and mantra suggestions for dosha nivaran.',
    price: 1100,
    durationMinutes: 30,
    imageUrl: 'https://images.unsplash.com/photo-1606041008023-472dfb5e530f?auto=format&fit=crop&q=80&w=600',
    subServices: [
      'Gemstone Recommendation',
      'Mantra Chanting Selection',
      'Dana (Donation) Suggestions',
      'Yantra Application'
    ]
  },
  {
    id: '5',
    title: 'Aura Cleansing',
    description: 'Spiritual energy cleansing session to remove negativity and blockages.',
    price: 2100,
    durationMinutes: 60,
    imageUrl: 'https://images.unsplash.com/photo-1514373941175-0a141072bbc8?auto=format&fit=crop&q=80&w=600',
    subServices: [
      'Chakra Balancing',
      'Negative Energy Removal',
      'Protective Shield Visualization',
      'Post-Session Grounding Tips'
    ]
  },
  {
    id: '6',
    title: 'Vastu Consultation',
    description: 'Remote analysis of home or office floor plans for energy balance.',
    price: 7500,
    durationMinutes: 60,
    imageUrl: 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&q=80&w=600',
    subServices: [
      'Floor Plan Analysis',
      'Directional Strength Check',
      'Element Balancing (Fire/Water)',
      'Remedies without Demolition'
    ]
  },
  {
    id: '7',
    title: 'Match Making',
    description: 'Detailed Guna Milan and compatibility analysis for marriage prospects.',
    price: 2100,
    durationMinutes: 60,
    imageUrl: 'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&q=80&w=600',
    discount: {
      percentage: 10,
      validUntil: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
    },
    subServices: [
      'Ashtakoot Guna Milan',
      'Mangal Dosha Check',
      'Mental & Emotional Compatibility',
      'Longevity & Progeny Potential'
    ]
  },
  {
    id: '8',
    title: 'Career Consultancy',
    description: 'Guidance on professional path, job changes, business ventures, and promotion timing.',
    price: 2100,
    durationMinutes: 60,
    imageUrl: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=80&w=600',
    subServices: [
      'Job vs Business Analysis',
      'Promotion Timing',
      'Industry Suitability',
      'Financial Stability Check'
    ]
  },
  {
    id: '9',
    title: 'Litigation Consultancy',
    description: 'Astrological insights on court cases, legal disputes, and conflict resolution.',
    price: 2500,
    durationMinutes: 60,
    imageUrl: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&q=80&w=600',
    subServices: [
      'Victory Probability',
      'Settlement vs Court Battle',
      'Favorable Dates for Hearings',
      'Hidden Enemies Identification'
    ]
  },
  {
    id: '10',
    title: 'Health Consultancy',
    description: 'Medical astrology analysis to identify physical vulnerabilities and recovery periods.',
    price: 2100,
    durationMinutes: 60,
    imageUrl: 'https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?auto=format&fit=crop&q=80&w=600',
    subServices: [
      'Vulnerable Body Parts',
      'Surgery Timing (Muhurta)',
      'Chronic Disease Analysis',
      'Ayurvedic Constitution (Dosha)'
    ]
  },
  {
    id: '11',
    title: 'Matrimonial Consultancy',
    description: 'Counseling for marital discord, relationship harmony, and timing of marriage.',
    price: 2100,
    durationMinutes: 60,
    imageUrl: 'https://images.unsplash.com/photo-1636202339022-7d67f7447e3a?auto=format&fit=crop&q=80&w=600',
    subServices: [
      'Conflict Resolution',
      'Divorce/Separation Analysis',
      'Second Marriage Prospects',
      'Harmony Remedies'
    ]
  },
  {
    id: '12',
    title: 'Progeny Consultancy',
    description: 'Analysis regarding childbirth timing, conceiving issues, and well-being of children.',
    price: 2100,
    durationMinutes: 60,
    imageUrl: 'https://images.unsplash.com/photo-1504198266287-1659872e6590?auto=format&fit=crop&q=80&w=600',
    subServices: [
      'Conception Timing (Kshetra/Beeja)',
      'IVF Success Probability',
      'Child Well-being Analysis',
      'Remedies for Delay'
    ]
  },
  {
    id: '13',
    title: 'Financial Consultancy',
    description: 'In-depth analysis of wealth potential, investment timing, and financial stability.',
    price: 2500,
    durationMinutes: 60,
    imageUrl: 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?auto=format&fit=crop&q=80&w=600',
    subServices: [
      'Wealth Yoga Analysis (Dhan Yoga)',
      'Investment Timing',
      'Loss Prevention Remedies',
      'Stock Market Suitability'
    ]
  },
  {
    id: '14',
    title: 'Business Consultancy',
    description: 'Strategic astrological advice for startups, partnerships, and business expansion.',
    price: 3100,
    durationMinutes: 60,
    imageUrl: 'https://images.unsplash.com/photo-1664575602554-2087b04935a5?auto=format&fit=crop&q=80&w=600',
    subServices: [
      'New Venture Muhurta',
      'Partnership Compatibility',
      'Brand Name Numerology',
      'Expansion Timing'
    ]
  },
  {
    id: '15',
    title: 'Education Consultancy',
    description: 'Guidance for students regarding stream selection, competitive exams, and foreign studies.',
    price: 1500,
    durationMinutes: 30,
    imageUrl: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&q=80&w=600',
    subServices: [
      'Subject/Stream Selection',
      'Competitive Exam Success',
      'Higher Studies Abroad',
      'Focus & Concentration Remedies'
    ]
  },
  {
    id: '16',
    title: 'House Construction Consultancy',
    description: 'Muhurta and Vastu guidance for building your dream home.',
    price: 5100,
    durationMinutes: 60,
    imageUrl: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&q=80&w=600',
    subServices: [
      'Bhoomi Pujan Muhurta',
      'Construction Start Date',
      'Griha Pravesh Timing',
      'Vastu for Floor Plan'
    ]
  },
  {
    id: '17',
    title: 'Astrology Learning Guidance',
    description: 'Mentorship for aspiring astrologers and guidance on learning resources.',
    price: 1100,
    durationMinutes: 60,
    imageUrl: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&q=80&w=600',
    subServices: [
      'Concept Clarification',
      'Book Recommendations',
      'Chart Reading Practice',
      'Technique Application'
    ]
  },
  {
    id: '18',
    title: 'Authorities Dispute Consultancy',
    description: 'Remedies and analysis for issues with government, taxes, or management.',
    price: 2500,
    durationMinutes: 60,
    imageUrl: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&q=80&w=600',
    subServices: [
      'Government Job Issues',
      'Tax & Legal Complications',
      'Conflict with Superiors',
      'Resolution Timing'
    ]
  },
  {
    id: '19',
    title: 'Dosha Removal Puja',
    description: 'Arrangement and guidance for specific Vedic pujas to neutralize negative doshas.',
    price: 5100,
    durationMinutes: 30,
    imageUrl: 'https://images.unsplash.com/photo-1601121853354-e6e866bd2bac?auto=format&fit=crop&q=80&w=600',
    subServices: [
      'Kaal Sarp Dosh Puja',
      'Pitra Dosh Nivaran',
      'Manglik Dosh Shanti',
      'Navagraha Shanti'
    ]
  },
  {
    id: '20',
    title: 'Miscellaneous Advice',
    description: 'For any specific question or life situation not covered in other categories.',
    price: 1500,
    durationMinutes: 30,
    imageUrl: 'https://images.unsplash.com/photo-1456406644174-8ddd4cd52a06?auto=format&fit=crop&q=80&w=600',
    subServices: [
      'Prashna Kundali (Horary)',
      'Dream Interpretation',
      'Lost Item Recovery',
      'General Guidance'
    ]
  }
];

const SEED_USERS: User[] = [
  { id: 'admin-1', name: 'Gagan Minhans', phoneNumber: '9999999999', role: 'ADMIN' },
  { id: 'client-1', name: 'Rahul Sharma', phoneNumber: '9876543210', role: 'CLIENT' },
  { id: 'client-2', name: 'Priya Verma', phoneNumber: '9876543211', role: 'CLIENT' },
];

const SEED_NATIVES: Native[] = [
  { id: 'n-1', clientId: 'client-1', name: 'Rahul Sharma', gender: 'Male', dob: '1990-05-15', tob: '14:30', placeOfBirth: 'Delhi', timeZone: '+05:30' },
  { id: 'n-2', clientId: 'client-1', name: 'Priya Sharma (Wife)', gender: 'Female', dob: '1992-08-20', tob: '09:15', placeOfBirth: 'Mumbai', timeZone: '+05:30' },
  { id: 'n-3', clientId: 'client-2', name: 'Priya Verma', gender: 'Female', dob: '1995-01-10', tob: '08:00', placeOfBirth: 'Chandigarh', timeZone: '+05:30' },
];

const SEED_APPOINTMENTS: Appointment[] = [
  {
    id: 'appt-1',
    clientId: 'client-1',
    clientName: 'Rahul Sharma',
    nativeId: 'n-1',
    nativeName: 'Rahul Sharma',
    serviceId: '1',
    serviceName: 'SBC Chart Reading',
    dateTime: new Date(Date.now() + 86400000).toISOString(),
    status: 'PENDING',
    consultationMode: 'VIDEO',
    queryNotes: 'Career stability questions.',
    syncedToCalendar: false
  },
  {
    id: 'appt-2',
    clientId: 'client-2',
    clientName: 'Priya Verma',
    nativeId: 'n-3',
    nativeName: 'Priya Verma',
    serviceId: '3',
    serviceName: 'Birth Time Rectification',
    dateTime: new Date(Date.now() - 86400000).toISOString(),
    status: 'COMPLETED',
    consultationMode: 'IN_PERSON',
    queryNotes: 'Clarifying birth time.',
    syncedToCalendar: true
  }
];

// --- Database State Interface ---
interface DatabaseState {
  users: User[];
  services: Service[];
  natives: Native[];
  appointments: Appointment[];
  blackoutDates: BlackoutDate[];
  calendarConfig: CalendarConfig;
}

// --- Persistence Logic ---

const loadDatabase = (): DatabaseState => {
  try {
    const serialized = localStorage.getItem(DB_KEY);
    if (serialized) {
      return JSON.parse(serialized);
    }
  } catch (e) {
    console.error("Failed to load DB", e);
  }

  const initialData: DatabaseState = {
    users: SEED_USERS,
    services: SEED_SERVICES,
    natives: SEED_NATIVES,
    appointments: SEED_APPOINTMENTS,
    blackoutDates: [],
    calendarConfig: { isConnected: false, calendarId: '' }
  };

  localStorage.setItem(DB_KEY, JSON.stringify(initialData));
  return initialData;
};

const saveDatabase = (localDb: DatabaseState) => {
  localStorage.setItem(DB_KEY, JSON.stringify(localDb));
};

// Initialize Local DB in memory for legacy support and faster reads
let localDb = loadDatabase();

// --- API Implementation ---

export const api = {
  // Authentication
  login: async (phone: string): Promise<User | null> => {
    try {
      const q = query(collection(db, 'users'), where('phoneNumber', '==', phone));
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        return querySnapshot.docs[0].data() as User;
      }
    } catch (e) {
      console.warn("Firestore login failed, falling back to localDb", e);
    }
    const user = localDb.users.find(u => u.phoneNumber === phone);
    return user || null;
  },

  register: async (name: string, phone: string): Promise<User> => {
    const newUser: User = { id: `client-${Date.now()}`, name, phoneNumber: phone, role: 'CLIENT' };
    try {
      await setDoc(doc(db, 'users', newUser.id), newUser);
      console.log("Firestore registration successful");
    } catch (e: any) {
      console.error("Firestore registration failed:", e);
      throw new Error(e.message || "Failed to save to database. Please check your internet connection.");
    }
    localDb.users.push(newUser);
    saveDatabase(localDb);
    return newUser;
  },

  // Services
  getServices: async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'services'));
      if (!querySnapshot.empty) {
        return querySnapshot.docs.map(doc => doc.data() as Service);
      }
    } catch (e) {
      console.warn("Firestore getServices failed", e);
    }
    return [...localDb.services];
  },

  addService: async (service: Service) => {
    try {
      await setDoc(doc(db, 'services', service.id), service);
    } catch (e) {
      console.warn("Firestore addService failed", e);
    }
    localDb.services.push(service);
    saveDatabase(localDb);
    return service;
  },

  updateService: async (service: Service) => {
    try {
      await setDoc(doc(db, 'services', service.id), service);
    } catch (e) {
      console.warn("Firestore updateService failed", e);
    }
    const idx = localDb.services.findIndex(s => s.id === service.id);
    if (idx !== -1) {
      localDb.services[idx] = service;
      saveDatabase(localDb);
    }
    return service;
  },

  deleteService: async (id: string) => {
    try {
      await deleteDoc(doc(db, 'services', id));
    } catch (e) {
      console.warn("Firestore deleteService failed", e);
    }
    localDb.services = localDb.services.filter(s => s.id !== id);
    saveDatabase(localDb);
    return true;
  },

  // Natives
  getNatives: async (clientId: string) => {
    try {
      const q = query(collection(db, 'natives'), where('clientId', '==', clientId));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => doc.data() as Native);
    } catch (e) {
      console.warn("Firestore getNatives failed", e);
    }
    return localDb.natives.filter(n => n.clientId === clientId);
  },

  addNative: async (native: Native) => {
    try {
      await setDoc(doc(db, 'natives', native.id), native);
    } catch (e) {
      console.warn("Firestore addNative failed", e);
    }
    localDb.natives.push(native);
    saveDatabase(localDb);
    return native;
  },

  // Clients
  getAllClients: async () => {
    try {
      const q = query(collection(db, 'users'), where('role', '==', 'CLIENT'));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => doc.data() as User);
    } catch (e) {
      console.warn("Firestore getAllClients failed", e);
    }
    return localDb.users.filter(u => u.role === 'CLIENT');
  },

  // Appointments
  getAppointments: async (userId: string, role: string) => {
    try {
      let q;
      if (role === 'ADMIN') {
        q = collection(db, 'appointments');
      } else {
        q = query(collection(db, 'appointments'), where('clientId', '==', userId));
      }
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => doc.data() as Appointment);
    } catch (e) {
      console.warn("Firestore getAppointments failed", e);
    }
    if (role === 'ADMIN') return [...localDb.appointments];
    return localDb.appointments.filter(a => a.clientId === userId);
  },

  createAppointment: async (appt: Appointment) => {
    try {
      await setDoc(doc(db, 'appointments', appt.id), appt);
    } catch (e) {
      console.warn("Firestore createAppointment failed", e);
    }
    localDb.appointments.push(appt);
    saveDatabase(localDb);
    return appt;
  },

  updateAppointmentStatus: async (apptId: string, status: 'CONFIRMED' | 'CANCELLED') => {
    try {
      await updateDoc(doc(db, 'appointments', apptId), { status });
    } catch (e) {
      console.warn("Firestore updateAppointmentStatus failed", e);
    }
    const idx = localDb.appointments.findIndex(a => a.id === apptId);
    if (idx !== -1) {
      localDb.appointments[idx].status = status;
      if (status === 'CONFIRMED' && localDb.calendarConfig.isConnected) {
        localDb.appointments[idx].syncedToCalendar = true;
      }
      saveDatabase(localDb);
    }
    return localDb.appointments[idx];
  },

  // Admin Settings
  getCalendarConfig: async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'config'));
      if (!querySnapshot.empty) {
        return querySnapshot.docs[0].data() as CalendarConfig;
      }
    } catch (e) {
      console.warn("Firestore getCalendarConfig failed", e);
    }
    return localDb.calendarConfig;
  },

  setCalendarConfig: async (config: CalendarConfig) => {
    try {
      await setDoc(doc(db, 'config', 'calendar'), config);
    } catch (e) {
      console.warn("Firestore setCalendarConfig failed", e);
    }
    localDb.calendarConfig = config;
    saveDatabase(localDb);
    return localDb.calendarConfig;
  },

  getBlackoutDates: async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'blackoutDates'));
      return querySnapshot.docs.map(doc => doc.data() as BlackoutDate);
    } catch (e) {
      console.warn("Firestore getBlackoutDates failed", e);
    }
    return [...localDb.blackoutDates];
  },

  addBlackoutDate: async (date: BlackoutDate) => {
    try {
      await setDoc(doc(db, 'blackoutDates', date.id), date);
    } catch (e) {
      console.warn("Firestore addBlackoutDate failed", e);
    }
    localDb.blackoutDates.push(date);
    saveDatabase(localDb);
    return date;
  },

  removeBlackoutDate: async (id: string) => {
    try {
      await deleteDoc(doc(db, 'blackoutDates', id));
    } catch (e) {
      console.warn("Firestore removeBlackoutDate failed", e);
    }
    localDb.blackoutDates = localDb.blackoutDates.filter(d => d.id !== id);
    saveDatabase(localDb);
    return true;
  },

  // Dev Utils
  resetDatabase: () => {
    localStorage.removeItem(DB_KEY);
    window.location.reload();
  }
};
