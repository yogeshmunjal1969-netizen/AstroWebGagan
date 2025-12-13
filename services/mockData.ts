import { User, Service, Native, Appointment, CalendarConfig, BlackoutDate } from '../types';

// --- Database Configuration ---
// Bumped version to v8 for duration and mode schema changes
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
    durationMinutes: 90, // Changed from 75 to 90
    imageUrl: 'https://images.unsplash.com/photo-1502481851541-7cc86ac62863?auto=format&fit=crop&q=80&w=600',
    discount: {
      percentage: 15,
      validUntil: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString() // Valid for 3 days
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
    durationMinutes: 60, // Changed from 45 to 60
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
    durationMinutes: 60, // Changed from 45 to 60
    imageUrl: 'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&q=80&w=600',
    discount: {
      percentage: 10,
      validUntil: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // Valid for 1 day
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
    durationMinutes: 60, // Changed from 45 to 60
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
    durationMinutes: 60, // Changed from 45 to 60
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
    durationMinutes: 60, // Changed from 45 to 60
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
    durationMinutes: 60, // Changed from 45 to 60
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
    durationMinutes: 60, // Changed from 45 to 60
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
    durationMinutes: 60, // Changed from 45 to 60
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
    durationMinutes: 60, // Changed from 45 to 60
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
    durationMinutes: 60, // Changed from 45 to 60
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
    dateTime: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
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
    dateTime: new Date(Date.now() - 86400000).toISOString(), // Yesterday
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
  
  // Return Seed Data if no DB found
  const initialData: DatabaseState = {
    users: SEED_USERS,
    services: SEED_SERVICES,
    natives: SEED_NATIVES,
    appointments: SEED_APPOINTMENTS,
    blackoutDates: [],
    calendarConfig: { isConnected: false, calendarId: '' }
  };
  
  // Save immediately to persist seed
  localStorage.setItem(DB_KEY, JSON.stringify(initialData));
  return initialData;
};

const saveDatabase = (db: DatabaseState) => {
  localStorage.setItem(DB_KEY, JSON.stringify(db));
};

// Initialize DB in memory
let db = loadDatabase();

// --- API Implementation ---

export const api = {
  // Authentication
  login: async (phone: string, password: string): Promise<User | null> => {
    // Simulate Network Delay
    await new Promise(r => setTimeout(r, 300));
    const user = db.users.find(u => u.phoneNumber === phone);
    return user || null;
  },

  register: async (name: string, phone: string): Promise<User> => {
    await new Promise(r => setTimeout(r, 300));
    const newUser: User = { id: `client-${Date.now()}`, name, phoneNumber: phone, role: 'CLIENT' };
    db.users.push(newUser);
    saveDatabase(db);
    return newUser;
  },

  // Services
  getServices: () => [...db.services],
  
  addService: async (service: Service) => {
    await new Promise(r => setTimeout(r, 200));
    db.services.push(service);
    saveDatabase(db);
    return service;
  },
  
  updateService: async (service: Service) => {
    await new Promise(r => setTimeout(r, 200));
    const idx = db.services.findIndex(s => s.id === service.id);
    if(idx !== -1) {
      db.services[idx] = service;
      saveDatabase(db);
    }
    return service;
  },
  
  deleteService: async (id: string) => {
    await new Promise(r => setTimeout(r, 200));
    db.services = db.services.filter(s => s.id !== id);
    saveDatabase(db);
    return true;
  },

  // Natives
  getNatives: (clientId: string) => db.natives.filter(n => n.clientId === clientId),
  
  addNative: async (native: Native) => {
    await new Promise(r => setTimeout(r, 200));
    db.natives.push(native);
    saveDatabase(db);
    return native;
  },

  // Clients
  getAllClients: () => db.users.filter(u => u.role === 'CLIENT'),

  // Appointments
  getAppointments: (userId: string, role: string) => {
    if (role === 'ADMIN') return [...db.appointments];
    return db.appointments.filter(a => a.clientId === userId);
  },

  createAppointment: async (appt: Appointment) => {
    await new Promise(r => setTimeout(r, 400));
    db.appointments.push(appt);
    saveDatabase(db);
    return appt;
  },

  updateAppointmentStatus: async (apptId: string, status: 'CONFIRMED' | 'CANCELLED') => {
    await new Promise(r => setTimeout(r, 400));
    const idx = db.appointments.findIndex(a => a.id === apptId);
    if (idx !== -1) {
      db.appointments[idx].status = status;
      
      // Simulate Google Calendar Sync logic
      if (status === 'CONFIRMED' && db.calendarConfig.isConnected) {
        console.log(`Syncing Appointment ${apptId} to Google Calendar...`);
        db.appointments[idx].syncedToCalendar = true; 
      }
      saveDatabase(db);
    }
    return db.appointments[idx];
  },

  // Admin Settings
  getCalendarConfig: () => db.calendarConfig,
  
  setCalendarConfig: (config: CalendarConfig) => {
    db.calendarConfig = config;
    saveDatabase(db);
    return db.calendarConfig;
  },

  getBlackoutDates: () => [...db.blackoutDates],
  
  addBlackoutDate: async (date: BlackoutDate) => {
    db.blackoutDates.push(date);
    saveDatabase(db);
    return date;
  },
  
  removeBlackoutDate: async (id: string) => {
    db.blackoutDates = db.blackoutDates.filter(d => d.id !== id);
    saveDatabase(db);
    return true;
  },

  // Dev Utils
  resetDatabase: () => {
    localStorage.removeItem(DB_KEY);
    window.location.reload();
  }
};
