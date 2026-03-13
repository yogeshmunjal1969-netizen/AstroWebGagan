import React, { useState, useEffect } from 'react';
import { User, Native, Service, Appointment, BlackoutDate, ConsultationMode, CalendarConfig } from './types';
import { api } from './services/mockData';
import {
  Sun, Moon, Calendar, LogOut,
  Menu, X, CheckCircle, Clock,
  Plus, ShieldCheck,
  LayoutDashboard, Users, Briefcase, Settings as SettingsIcon, Trash2, Edit2, Database,
  Timer, Image as ImageIcon, CheckCircle2, ListPlus, Tag, CalendarOff,
  BookOpen, FileText, Youtube, Sparkles, Phone, MonitorPlay
} from 'lucide-react';

// --- Components ---

const MandalaBackground = () => (
  <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 opacity-10 dark:opacity-5">
    <svg className="absolute -top-40 -left-40 w-[600px] h-[600px] text-astro-saffron mandala-spin" viewBox="0 0 100 100" fill="currentColor">
      <path d="M50 0 L60 40 L100 50 L60 60 L50 100 L40 60 L0 50 L40 40 Z" />
      <circle cx="50" cy="50" r="20" stroke="currentColor" strokeWidth="2" fill="none" />
      <circle cx="50" cy="50" r="30" stroke="currentColor" strokeWidth="1" fill="none" />
      <path d="M50 10 L55 35 L80 50 L55 65 L50 90 L45 65 L20 50 L45 35 Z" fill="none" stroke="currentColor" />
    </svg>
    <svg className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] text-astro-gold opacity-50" viewBox="0 0 100 100" fill="none" stroke="currentColor">
      <circle cx="50" cy="50" r="45" strokeWidth="0.5" />
      <circle cx="50" cy="50" r="35" strokeWidth="0.5" />
      <path d="M50 5 L95 50 L50 95 L5 50 Z" strokeWidth="0.5" />
    </svg>
  </div>
);

const Logo = () => (
  <div className="flex items-center gap-3">
    <div className="relative w-10 h-10 flex-shrink-0">
      <svg viewBox="0 0 100 100" className="w-full h-full text-astro-saffron animate-[spin_60s_linear_infinite]">
        {/* Rays */}
        <path d="M50 0 L60 30 L90 20 L70 50 L90 80 L60 70 L50 100 L40 70 L10 80 L30 50 L10 20 L40 30 Z" fill="currentColor" opacity="0.2" />
        {/* Core Chakra */}
        <circle cx="50" cy="50" r="25" stroke="currentColor" strokeWidth="2" fill="none" />
        <circle cx="50" cy="50" r="18" stroke="#d4af37" strokeWidth="1.5" fill="none" />
        <circle cx="50" cy="50" r="8" fill="#d4af37" />
      </svg>
    </div>
    <div className="flex flex-col">
      <span className="text-xl font-serif font-bold leading-none text-astro-indigo dark:text-astro-gold">Gagan<span className="text-astro-saffron">.Astro</span></span>
      <span className="text-[10px] tracking-[0.2em] uppercase text-gray-500 dark:text-gray-400 font-medium mt-0.5">Vedic Consultant</span>
    </div>
  </div>
);

const Button = ({ children, onClick, variant = 'primary', className = '', disabled = false }: any) => {
  const baseStyle = "px-6 py-2 rounded-lg font-medium transition-all duration-300 transform active:scale-95 flex items-center justify-center gap-2";
  const variants = {
    primary: "bg-astro-saffron text-white hover:bg-orange-700 shadow-lg hover:shadow-orange-500/30",
    secondary: "bg-astro-gold text-astro-indigo hover:bg-yellow-500",
    outline: "border-2 border-astro-gold text-astro-gold hover:bg-astro-gold hover:text-astro-indigo",
    danger: "bg-red-600 text-white hover:bg-red-700",
    ghost: "bg-transparent text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyle} ${variants[variant as keyof typeof variants]} ${className} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      {children}
    </button>
  );
};

const Card = ({ children, className = '' }: any) => (
  <div className={`bg-white dark:bg-slate-800 p-6 rounded-xl shadow-xl border border-astro-gold/20 backdrop-blur-sm ${className}`}>
    {children}
  </div>
);

// --- Helpers ---

const getDiscountInfo = (service: Service) => {
  if (!service.discount || !service.discount.percentage || !service.discount.validUntil) return null;
  const now = new Date();
  const validUntil = new Date(service.discount.validUntil);
  if (validUntil < now) return null; // Discount expired

  const discountedPrice = service.price - (service.price * (service.discount.percentage / 100));

  const diffMs = validUntil.getTime() - now.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const diffHours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

  let timeLeft = '';
  if (diffDays > 0) timeLeft = `${diffDays} days left`;
  else if (diffHours > 0) timeLeft = `${diffHours} hours left`;
  else timeLeft = 'Expires soon';

  return { discountedPrice, timeLeft, percentage: service.discount.percentage };
};

// --- Pages & Sections ---

const Navbar = ({ user, toggleTheme, isDark, onNavigate, onLogout }: any) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-astro-cream/90 dark:bg-astro-indigo/90 backdrop-blur-md border-b border-astro-gold/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex-shrink-0 cursor-pointer" onClick={() => onNavigate('home')}>
            <Logo />
          </div>

          <div className="hidden lg:block">
            <div className="ml-10 flex items-baseline space-x-6">
              <button onClick={() => onNavigate('home')} className="hover:text-astro-saffron dark:text-gray-300 transition-colors text-sm font-medium">Home</button>
              <button onClick={() => onNavigate('services')} className="hover:text-astro-saffron dark:text-gray-300 transition-colors text-sm font-medium">Services</button>
              <button onClick={() => onNavigate('blog')} className="hover:text-astro-saffron dark:text-gray-300 transition-colors text-sm font-medium">Blog</button>
              <button onClick={() => onNavigate('articles')} className="hover:text-astro-saffron dark:text-gray-300 transition-colors text-sm font-medium">Articles</button>
              <button onClick={() => onNavigate('videos')} className="hover:text-astro-saffron dark:text-gray-300 transition-colors text-sm font-medium">Videos</button>
              <button onClick={() => onNavigate('daily')} className="hover:text-astro-saffron dark:text-gray-300 transition-colors text-sm font-medium">Daily Predictions</button>
              <button onClick={() => onNavigate('gallery')} className="hover:text-astro-saffron dark:text-gray-300 transition-colors text-sm font-medium">Gallery</button>

              {user ? (
                <div className="flex items-center gap-4 ml-4">
                  <span className="text-sm font-medium text-astro-indigo dark:text-astro-gold">
                    Hi, {user.name.split(' ')[0]}
                  </span>
                  <Button variant="outline" className="!py-1 !px-3 !text-sm" onClick={() => onNavigate('dashboard')}>
                    {user.role === 'ADMIN' ? 'Admin' : 'Dashboard'}
                  </Button>
                  <Button variant="ghost" className="!py-1 !px-3" onClick={onLogout}>
                    <LogOut size={18} />
                  </Button>
                </div>
              ) : (
                <Button variant="primary" className="ml-4 !py-1.5 !text-sm" onClick={() => onNavigate('login')}>Login</Button>
              )}

              <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-slate-700 transition-colors">
                {isDark ? <Sun className="text-astro-gold" size={20} /> : <Moon className="text-astro-indigo" size={20} />}
              </button>
            </div>
          </div>

          <div className="-mr-2 flex lg:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="p-2 text-gray-800 dark:text-white">
              {isOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="lg:hidden bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-gray-700">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 flex flex-col items-start">
            <button onClick={() => { onNavigate('home'); setIsOpen(false) }} className="block px-3 py-2 text-base font-medium hover:text-astro-saffron">Home</button>
            <button onClick={() => { onNavigate('services'); setIsOpen(false) }} className="block px-3 py-2 text-base font-medium hover:text-astro-saffron">Services</button>
            <button onClick={() => { onNavigate('blog'); setIsOpen(false) }} className="block px-3 py-2 text-base font-medium hover:text-astro-saffron">Blog</button>
            <button onClick={() => { onNavigate('articles'); setIsOpen(false) }} className="block px-3 py-2 text-base font-medium hover:text-astro-saffron">Articles</button>
            <button onClick={() => { onNavigate('videos'); setIsOpen(false) }} className="block px-3 py-2 text-base font-medium hover:text-astro-saffron">Videos</button>
            <button onClick={() => { onNavigate('daily'); setIsOpen(false) }} className="block px-3 py-2 text-base font-medium hover:text-astro-saffron">Daily Predictions</button>
            <button onClick={() => { onNavigate('gallery'); setIsOpen(false) }} className="block px-3 py-2 text-base font-medium hover:text-astro-saffron">Gallery</button>
            {user && <button onClick={() => { onNavigate('dashboard'); setIsOpen(false) }} className="block px-3 py-2 text-base font-medium text-astro-saffron">{user.role === 'ADMIN' ? 'Admin Dashboard' : 'My Dashboard'}</button>}
            {!user && <button onClick={() => { onNavigate('login'); setIsOpen(false) }} className="block px-3 py-2 text-base font-medium text-astro-saffron">Login</button>}
          </div>
        </div>
      )}
    </nav>
  );
};

const Hero = ({ onBookNow }: any) => (
  <div className="relative pt-16 pb-32 flex content-center items-center justify-center min-h-[80vh]">
    <div className="container relative mx-auto">
      <div className="items-center flex flex-wrap">
        <div className="w-full lg:w-6/12 px-4 ml-auto mr-auto text-center">
          <div className="pr-12">
            <h1 className="text-astro-indigo dark:text-white font-serif font-bold text-5xl leading-tight mb-6">
              Navigate Your Life with <span className="text-astro-saffron">Cosmic Wisdom</span>
            </h1>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-300 mb-8 font-light">
              Specializing in the ancient <strong>Sarvatobhadra Chakra (SBC)</strong> technique.
              Gagan Minhans brings decades of ICAS faculty experience to illuminate your path.
            </p>
            <Button onClick={onBookNow} className="mx-auto text-lg px-8 py-4">
              Book a Consultation
            </Button>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const ServicesList = ({ onSelectService }: { onSelectService: (s: Service) => void }) => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      const data = await api.getServices();
      setServices(data);
      setLoading(false);
    };
    fetchServices();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="w-12 h-12 border-4 border-astro-saffron border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-gray-500 animate-pulse">Loading cosmic services...</p>
      </div>
    );
  }

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 py-10 px-4 max-w-7xl mx-auto">
      {services.map(service => {
        const discountInfo = getDiscountInfo(service);

        return (
          <Card key={service.id} className="hover:-translate-y-2 transition-transform duration-300 !p-0 overflow-hidden flex flex-col h-full border-t-0">
            {/* Image Header */}
            <div className="h-48 relative overflow-hidden bg-gray-200">
              {service.imageUrl ? (
                <img src={service.imageUrl} alt={service.title} className="w-full h-full object-cover transition-transform duration-700 hover:scale-110" />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-astro-indigo/5 text-astro-indigo/20">
                  <Logo />
                </div>
              )}
              {discountInfo && (
                <div className="absolute top-0 right-0 bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-bl-lg z-10 shadow-md">
                  {discountInfo.percentage}% OFF
                </div>
              )}
            </div>

            <div className="p-6 flex flex-col flex-grow">
              <h3 className="text-xl font-serif font-bold text-astro-indigo dark:text-astro-gold mb-2">{service.title}</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2">{service.description}</p>

              {/* Sub Services */}
              {service.subServices && service.subServices.length > 0 && (
                <div className="flex-grow mb-4">
                  <ul className="space-y-1">
                    {service.subServices.slice(0, 4).map((sub, idx) => (
                      <li key={idx} className="flex items-start text-xs text-gray-500 dark:text-gray-400">
                        <CheckCircle2 size={12} className="text-astro-saffron mr-2 mt-0.5 flex-shrink-0" />
                        <span>{sub}</span>
                      </li>
                    ))}
                    {service.subServices.length > 4 && (
                      <li className="text-xs text-astro-saffron italic pl-5">
                        + {service.subServices.length - 4} more features
                      </li>
                    )}
                  </ul>
                </div>
              )}
              {!service.subServices && <div className="flex-grow"></div>}

              <div className="mt-auto pt-4 border-t border-gray-100 dark:border-gray-700">
                <div className="flex justify-between items-end mb-1">
                  {discountInfo ? (
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="block text-2xl font-bold text-astro-saffron">₹{discountInfo.discountedPrice.toFixed(0)}</span>
                        <span className="text-sm text-gray-400 line-through">₹{service.price}</span>
                      </div>
                      <div className="flex items-center gap-1 text-[10px] text-red-500 font-bold bg-red-50 dark:bg-red-900/20 px-2 py-0.5 rounded-full w-fit mt-1">
                        <Timer size={10} />
                        {discountInfo.timeLeft}
                      </div>
                    </div>
                  ) : (
                    <div>
                      <span className="block text-2xl font-bold text-astro-saffron">₹{service.price}</span>
                    </div>
                  )}
                  <div className="text-right">
                    <span className="text-xs text-gray-500 block mb-2">{service.durationMinutes} mins</span>
                    <Button onClick={() => onSelectService(service)} variant="secondary" className="!px-4 !py-1.5 text-sm !rounded-md">
                      Book Now
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
};

// --- Booking Wizard Components ---

const NativeForm = ({ onSubmit, onCancel }: any) => {
  const [formData, setFormData] = useState<Partial<Native>>({
    name: '', gender: 'Male', dob: '', tob: '', placeOfBirth: '', timeZone: '+05:30'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name && formData.dob) {
      onSubmit(formData);
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold text-astro-indigo dark:text-white">Add Birth Profile (Native)</h3>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          placeholder="Full Name"
          className="p-2 border rounded dark:bg-slate-700 dark:border-gray-600 dark:text-white"
          value={formData.name}
          onChange={e => setFormData({ ...formData, name: e.target.value })}
          required
        />
        <select
          className="p-2 border rounded dark:bg-slate-700 dark:border-gray-600 dark:text-white"
          value={formData.gender}
          onChange={e => setFormData({ ...formData, gender: e.target.value as any })}
        >
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
        </select>
        <div className="flex flex-col">
          <label className="text-xs text-gray-500">Date of Birth</label>
          <input
            type="date"
            className="p-2 border rounded dark:bg-slate-700 dark:border-gray-600 dark:text-white"
            value={formData.dob}
            onChange={e => setFormData({ ...formData, dob: e.target.value })}
            required
          />
        </div>
        <div className="flex flex-col">
          <label className="text-xs text-gray-500">Time of Birth</label>
          <input
            type="time"
            className="p-2 border rounded dark:bg-slate-700 dark:border-gray-600 dark:text-white"
            value={formData.tob}
            onChange={e => setFormData({ ...formData, tob: e.target.value })}
            required
          />
        </div>
        <input
          placeholder="Place of Birth (City, Country)"
          className="p-2 border rounded md:col-span-2 dark:bg-slate-700 dark:border-gray-600 dark:text-white"
          value={formData.placeOfBirth}
          onChange={e => setFormData({ ...formData, placeOfBirth: e.target.value })}
          required
        />
        <div className="md:col-span-2 flex justify-end gap-2">
          <Button type="button" variant="ghost" onClick={onCancel}>Cancel</Button>
          <Button type="submit">Save Profile</Button>
        </div>
      </form>
    </div>
  );
};

const BookingFlow = ({ service, client, onSuccess, onCancel }: any) => {
  const [step, setStep] = useState(1);
  const [natives, setNatives] = useState<Native[]>([]);
  const [selectedNative, setSelectedNative] = useState<string>('');
  const [showAddNative, setShowAddNative] = useState(false);
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [consultationMode, setConsultationMode] = useState<ConsultationMode>('VIDEO');
  const [notes, setNotes] = useState('');

  // Available Slots Logic
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [bookedSlots, setBookedSlots] = useState<string[]>([]);

  // Calculate price (handling discount if exists)
  const discountInfo = getDiscountInfo(service);
  const finalPrice = discountInfo ? discountInfo.discountedPrice : service.price;

  useEffect(() => {
    const fetchNatives = async () => {
      const data = await api.getNatives(client.id);
      setNatives(data);
    };
    fetchNatives();
  }, [client.id, showAddNative]);

  // Generate Slots when date changes
  useEffect(() => {
    if (date) {
      generateSlotsForDate(date);
    }
  }, [date, service.durationMinutes]);

  const generateSlotsForDate = async (selectedDateStr: string) => {
    // 1. Get existing appointments for this date
    // Note: In a real app, we would query the API for range, here we get all and filter
    const [allAppts, allServices] = await Promise.all([
      api.getAppointments('admin-1', 'ADMIN'),
      api.getServices()
    ]);

    // Filter for the selected date
    const dateAppts = allAppts.filter(a => a.dateTime.startsWith(selectedDateStr) && a.status !== 'CANCELLED');

    // 2. Generate all possible start times (10:00 AM to 7:00 PM) in 30 min intervals
    const startHour = 10;
    const endHour = 19; // 7 PM
    const slots = [];

    for (let h = startHour; h < endHour; h++) {
      slots.push(`${h.toString().padStart(2, '0')}:00`);
      slots.push(`${h.toString().padStart(2, '0')}:30`);
    }

    const blocked: string[] = [];

    // 3. Check availability for each slot
    // We must check if the slot overlaps with any existing appointment
    // AND if the NEW appointment (with service.durationMinutes) would overlap existing ones

    const serviceDuration = service.durationMinutes;

    const convertToMins = (timeStr: string) => {
      const [h, m] = timeStr.split(':').map(Number);
      return h * 60 + m;
    };

    slots.forEach(slot => {
      const slotStart = convertToMins(slot);
      const slotEnd = slotStart + serviceDuration;

      let isBlocked = false;

      // Check against every existing appointment
      for (const appt of dateAppts) {
        const apptTime = appt.dateTime.split('T')[1].slice(0, 5); // Extract HH:MM
        const apptStart = convertToMins(apptTime);
        // Find existing duration. Since mock data might not have it in appointment, we find service
        // But for robust checking, let's assume standard durations based on seed.
        // In real app, appointment should store duration or link to service.
        const apptService = allServices.find(s => s.id === appt.serviceId);
        const apptDuration = apptService ? apptService.durationMinutes : 60; // Default fallback
        const apptEnd = apptStart + apptDuration;

        // Check Overlap: (StartA < EndB) && (EndA > StartB)
        if (slotStart < apptEnd && slotEnd > apptStart) {
          isBlocked = true;
          break;
        }
      }

      if (isBlocked) {
        blocked.push(slot);
      }
    });

    setAvailableSlots(slots);
    setBookedSlots(blocked);
  };

  const handleCreateNative = async (data: Native) => {
    const newNative = { ...data, id: `n-${Date.now()}`, clientId: client.id } as Native;
    await api.addNative(newNative);
    setShowAddNative(false);
    setSelectedNative(newNative.id);
  };

  const confirmBooking = async () => {
    const native = natives.find(n => n.id === selectedNative);
    if (!native) return;

    const appt: Appointment = {
      id: `appt-${Date.now()}`,
      clientId: client.id,
      clientName: client.name,
      nativeId: native.id,
      nativeName: native.name,
      serviceId: service.id,
      serviceName: service.title,
      dateTime: `${date}T${time}:00.000Z`,
      status: 'PENDING',
      consultationMode,
      queryNotes: notes,
      syncedToCalendar: false
    };

    await api.createAppointment(appt);
    onSuccess();
  };

  const ModeOption = ({ mode, label, icon: Icon }: any) => (
    <div
      onClick={() => setConsultationMode(mode)}
      className={`cursor-pointer flex flex-col items-center justify-center p-4 rounded-lg border-2 transition-all ${consultationMode === mode
        ? 'border-astro-saffron bg-orange-50 dark:bg-orange-900/20 text-astro-saffron'
        : 'border-gray-200 dark:border-gray-700 text-gray-500 hover:border-gray-300'
        }`}
    >
      <Icon size={24} className="mb-2" />
      <span className="text-sm font-medium">{label}</span>
    </div>
  );

  return (
    <Card className="max-w-2xl mx-auto my-10 animate-fade-in">
      <div className="flex justify-between items-center mb-6 border-b pb-4 dark:border-gray-700">
        <div>
          <h2 className="text-2xl font-serif text-astro-indigo dark:text-astro-gold">Booking: {service.title}</h2>
          <p className="text-sm dark:text-gray-400">
            Total: <span className="font-bold text-astro-saffron">₹{finalPrice.toFixed(0)}</span>
            <span className="text-xs text-gray-500 ml-1">({service.durationMinutes} Minutes)</span>
          </p>
        </div>
        <button onClick={onCancel}><X /></button>
      </div>

      {step === 1 && (
        <div className="space-y-6">
          <h3 className="font-semibold text-lg dark:text-white">1. Select Birth Chart (Native)</h3>

          {showAddNative ? (
            <NativeForm
              onSubmit={handleCreateNative}
              onCancel={() => setShowAddNative(false)}
            />
          ) : (
            <div className="space-y-3">
              {natives.map(n => (
                <div
                  key={n.id}
                  onClick={() => setSelectedNative(n.id)}
                  className={`p-4 border rounded-lg cursor-pointer flex justify-between items-center ${selectedNative === n.id ? 'border-astro-saffron bg-orange-50 dark:bg-orange-900/20' : 'dark:border-gray-600'}`}
                >
                  <span className="dark:text-white font-medium">{n.name} ({n.dob})</span>
                  {selectedNative === n.id && <CheckCircle className="text-astro-saffron" />}
                </div>
              ))}
              <Button variant="outline" className="w-full mt-4" onClick={() => setShowAddNative(true)}>
                <Plus size={16} /> Add New Profile
              </Button>
            </div>
          )}

          <div className="flex justify-end mt-6">
            <Button disabled={!selectedNative || showAddNative} onClick={() => setStep(2)}>Next</Button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-6">

          {/* Mode Selection */}
          <div>
            <h3 className="font-semibold text-lg dark:text-white mb-4">2. Mode of Consultation</h3>
            <div className="grid grid-cols-3 gap-4">
              <ModeOption mode="IN_PERSON" label="In-Person" icon={Users} />
              <ModeOption mode="VIDEO" label="Video Chat" icon={MonitorPlay} />
              <ModeOption mode="PHONE" label="Phone Call" icon={Phone} />
            </div>
          </div>

          <div className="border-t dark:border-gray-700 my-6"></div>

          {/* Date & Time Selection */}
          <h3 className="font-semibold text-lg dark:text-white mb-4">3. Select Date & Time</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-600 dark:text-gray-400 mb-2">Select Date</label>
              <input
                type="date"
                min={new Date().toISOString().split('T')[0]}
                className="w-full p-2 border rounded dark:bg-slate-700 dark:border-gray-600 dark:text-white"
                onChange={(e) => setDate(e.target.value)}
              />
            </div>

            {date && (
              <div>
                <label className="block text-sm text-gray-600 dark:text-gray-400 mb-2">Select Time Slot ({service.durationMinutes} mins)</label>
                <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
                  {availableSlots.map(t => {
                    const isBooked = bookedSlots.includes(t);
                    return (
                      <button
                        key={t}
                        disabled={isBooked}
                        onClick={() => setTime(t)}
                        className={`
                            py-2 text-sm rounded border transition-colors
                            ${isBooked
                            ? 'bg-gray-100 dark:bg-slate-700 text-gray-400 dark:text-gray-500 cursor-not-allowed line-through'
                            : time === t
                              ? 'bg-astro-saffron text-white border-astro-saffron shadow-lg'
                              : 'bg-white dark:bg-slate-800 dark:text-gray-200 border-gray-200 dark:border-gray-600 hover:border-astro-saffron'
                          }
                          `}
                      >
                        {t}
                      </button>
                    );
                  })}
                </div>
                <div className="flex gap-4 mt-2 text-xs text-gray-500">
                  <span className="flex items-center gap-1"><div className="w-3 h-3 bg-white border border-gray-300 rounded"></div> Available</span>
                  <span className="flex items-center gap-1"><div className="w-3 h-3 bg-gray-200 border border-gray-300 rounded"></div> Booked/Unavailable</span>
                </div>
              </div>
            )}
          </div>

          <div className="border-t dark:border-gray-700 my-6"></div>

          <div>
            <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">Questions / Specific Focus</label>
            <textarea
              className="w-full p-2 border rounded h-24 dark:bg-slate-700 dark:border-gray-600 dark:text-white"
              placeholder="E.g., Career changes in 2024, Health of mother..."
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>

          <div className="flex justify-between mt-6">
            <Button variant="ghost" onClick={() => setStep(1)}>Back</Button>
            <Button disabled={!date || !time} onClick={confirmBooking}>Request Appointment</Button>
          </div>
        </div>
      )}
    </Card>
  );
};

// --- Dashboard Logic ---

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'clients' | 'services' | 'settings'>('overview');
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [syncingId, setSyncingId] = useState<string | null>(null);

  // Data State
  const [services, setServices] = useState<Service[]>([]);
  const [clients, setClients] = useState<User[]>([]);
  const [blackoutDates, setBlackoutDates] = useState<BlackoutDate[]>([]);
  const [calendarConfig, setCalendarConfig] = useState<CalendarConfig>({ isConnected: false, calendarId: '' });

  // Form State for CMS
  const [editingService, setEditingService] = useState<Partial<Service> | null>(null);
  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);
  const [subServiceInput, setSubServiceInput] = useState('');

  // Form State for Blackout
  const [blackoutDateInput, setBlackoutDateInput] = useState('');
  const [blackoutStartTime, setBlackoutStartTime] = useState('');
  const [blackoutEndTime, setBlackoutEndTime] = useState('');
  const [isPartialBlackout, setIsPartialBlackout] = useState(false);

  useEffect(() => {
    refreshData();
  }, []);

  const refreshData = async () => {
    const [appts, svcs, clnts, bDates, calCfg] = await Promise.all([
      api.getAppointments('admin-1', 'ADMIN'),
      api.getServices(),
      api.getAllClients(),
      api.getBlackoutDates(),
      api.getCalendarConfig()
    ]);

    setAppointments([...appts]);
    setServices([...svcs]);
    setClients([...clnts]);
    setBlackoutDates([...bDates]);
    setCalendarConfig(calCfg);
  };

  const handleStatusChange = async (id: string, status: 'CONFIRMED' | 'CANCELLED') => {
    setSyncingId(id);
    setTimeout(async () => {
      await api.updateAppointmentStatus(id, status);
      setSyncingId(null);
      refreshData();
    }, 1500);
  };

  const handleSaveService = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingService?.title) {
      if (editingService.id) {
        await api.updateService(editingService as Service);
      } else {
        await api.addService({ ...editingService, id: `svc-${Date.now()}` } as Service);
      }
      setIsServiceModalOpen(false);
      setEditingService(null);
      refreshData();
    }
  };

  const handleDeleteService = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this service?")) {
      await api.deleteService(id);
      refreshData();
    }
  };

  const handleAddSubService = () => {
    if (!subServiceInput) return;
    const current = editingService?.subServices || [];
    setEditingService({ ...editingService, subServices: [...current, subServiceInput] });
    setSubServiceInput('');
  };

  const handleRemoveSubService = (index: number) => {
    const current = editingService?.subServices || [];
    setEditingService({ ...editingService, subServices: current.filter((_, i) => i !== index) });
  };

  const handleAddBlackout = async () => {
    if (blackoutDateInput) {
      const newBlackout: BlackoutDate = {
        id: `bo-${Date.now()}`,
        date: blackoutDateInput,
        reason: 'Admin Block'
      };

      if (isPartialBlackout && blackoutStartTime && blackoutEndTime) {
        newBlackout.startTime = blackoutStartTime;
        newBlackout.endTime = blackoutEndTime;
      }

      await api.addBlackoutDate(newBlackout);

      // Reset State
      setBlackoutDateInput('');
      setBlackoutStartTime('');
      setBlackoutEndTime('');
      setIsPartialBlackout(false);
      refreshData();
    }
  };

  const handleConnectCalendar = () => {
    const newConfig = { isConnected: true, calendarId: 'gagan.minhans@gmail.com' };
    api.setCalendarConfig(newConfig);
    refreshData();
    alert('Google Calendar Connected successfully!');
  };

  const TabButton = ({ id, label, icon: Icon }: any) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors ${activeTab === id
        ? 'border-astro-saffron text-astro-saffron font-bold'
        : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
        }`}
    >
      <Icon size={18} />
      {label}
    </button>
  );

  return (
    <div className="max-w-6xl mx-auto p-4 space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6">
        <h2 className="text-3xl font-serif text-astro-indigo dark:text-astro-gold">Admin Console</h2>
      </div>

      <div className="flex overflow-x-auto border-b border-gray-200 dark:border-gray-700 mb-6">
        <TabButton id="overview" label="Overview" icon={LayoutDashboard} />
        <TabButton id="clients" label="Clients & History" icon={Users} />
        <TabButton id="services" label="Services (CMS)" icon={Briefcase} />
        <TabButton id="settings" label="Settings" icon={SettingsIcon} />
      </div>

      {activeTab === 'overview' && (
        <div className="grid md:grid-cols-3 gap-6 animate-fade-in">
          <Card className="md:col-span-2">
            <h3 className="text-xl font-bold mb-4 dark:text-white flex items-center gap-2">
              <Clock className="text-astro-saffron" /> Pending Actions
            </h3>
            <div className="space-y-4">
              {appointments.filter(a => a.status === 'PENDING').length === 0 && (
                <p className="text-gray-500 italic p-4 text-center">No pending appointment requests.</p>
              )}
              {appointments.filter(a => a.status === 'PENDING').map(appt => (
                <div key={appt.id} className="border border-l-4 border-l-astro-saffron p-4 rounded bg-orange-50 dark:bg-slate-700 dark:border-gray-600">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-bold text-lg text-astro-indigo dark:text-white">{appt.serviceName}</p>
                        <span className="text-xs px-2 py-0.5 rounded bg-gray-200 dark:bg-gray-600 dark:text-white font-medium">{appt.consultationMode}</span>
                      </div>
                      <p className="text-sm dark:text-gray-300">Client: <strong>{appt.clientName}</strong></p>
                      <p className="text-sm dark:text-gray-300">Native: {appt.nativeName}</p>
                      <p className="text-sm dark:text-gray-300 mt-1">Requested: {new Date(appt.dateTime).toLocaleString()}</p>
                      <div className="mt-2 bg-white dark:bg-slate-800 p-2 rounded border border-gray-100 dark:border-gray-500 text-xs italic dark:text-gray-300">
                        "{appt.queryNotes}"
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <Button
                        variant="primary"
                        className="!text-xs !py-1 !px-2"
                        onClick={() => handleStatusChange(appt.id, 'CONFIRMED')}
                        disabled={syncingId === appt.id}
                      >
                        {syncingId === appt.id ? 'Syncing...' : 'Approve'}
                      </Button>
                      <Button variant="danger" className="!text-xs !py-1 !px-2" onClick={() => handleStatusChange(appt.id, 'CANCELLED')}>
                        Reject
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <div className="space-y-6">
            <Card>
              <h3 className="text-xl font-bold mb-4 dark:text-white">Quick Stats</h3>
              <div className="space-y-3">
                <div className="flex justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded">
                  <span className="dark:text-gray-300">Confirmed</span>
                  <span className="font-bold text-green-700 dark:text-green-400">{appointments.filter(a => a.status === 'CONFIRMED').length}</span>
                </div>
                <div className="flex justify-between p-3 bg-orange-50 dark:bg-orange-900/20 rounded">
                  <span className="dark:text-gray-300">Pending</span>
                  <span className="font-bold text-orange-700 dark:text-orange-400">{appointments.filter(a => a.status === 'PENDING').length}</span>
                </div>
                <div className="flex justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded">
                  <span className="dark:text-gray-300">Clients</span>
                  <span className="font-bold text-blue-700 dark:text-blue-400">{clients.length}</span>
                </div>
              </div>
            </Card>
          </div>

          <Card className="md:col-span-3">
            <h3 className="text-xl font-bold mb-4 dark:text-white">Upcoming Confirmed Appointments</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left dark:text-gray-300">
                <thead className="bg-gray-50 dark:bg-slate-700">
                  <tr className="border-b dark:border-gray-600">
                    <th className="p-3">Date/Time</th>
                    <th className="p-3">Mode</th>
                    <th className="p-3">Client</th>
                    <th className="p-3">Service</th>
                    <th className="p-3">Calendar</th>
                    <th className="p-3">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {appointments.filter(a => a.status === 'CONFIRMED').map(appt => (
                    <tr key={appt.id} className="border-b dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-slate-700">
                      <td className="p-3">{new Date(appt.dateTime).toLocaleString()}</td>
                      <td className="p-3"><span className="text-xs font-medium px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded">{appt.consultationMode}</span></td>
                      <td className="p-3">{appt.clientName}</td>
                      <td className="p-3">{appt.serviceName}</td>
                      <td className="p-3">
                        {appt.syncedToCalendar ? (
                          <span className="flex items-center text-green-600 text-xs"><ShieldCheck size={14} className="mr-1" /> Synced</span>
                        ) : (
                          <span className="text-gray-400 text-xs">Pending Sync</span>
                        )}
                      </td>
                      <td className="p-3">
                        <button className="text-red-500 hover:underline text-xs" onClick={() => handleStatusChange(appt.id, 'CANCELLED')}>Cancel</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}

      {activeTab === 'clients' && (
        <Card className="animate-fade-in">
          <h3 className="text-xl font-bold mb-6 dark:text-white">Registered Clients</h3>
          <div className="space-y-6">
            {clients.map(client => {
              const clientAppts = appointments.filter(a => a.clientId === client.id);
              return (
                <div key={client.id} className="border dark:border-gray-700 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <h4 className="text-lg font-bold text-astro-indigo dark:text-gold">{client.name}</h4>
                      <p className="text-sm text-gray-500">{client.phoneNumber}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded dark:text-gray-300">
                        Total Bookings: {clientAppts.length}
                      </span>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4 bg-gray-50 dark:bg-slate-900/50 p-3 rounded">
                    <div>
                      <h5 className="text-xs font-bold uppercase text-gray-500 mb-2">Profiles (Natives)</h5>
                      <NativeList clientId={client.id} />
                    </div>
                    <div>
                      <h5 className="text-xs font-bold uppercase text-gray-500 mb-2">Recent History</h5>
                      <ul className="text-sm dark:text-gray-400 space-y-1">
                        {clientAppts.slice(0, 3).map(a => (
                          <li key={a.id} className="flex justify-between">
                            <span>{new Date(a.dateTime).toLocaleDateString()} - {a.serviceName}</span>
                            <span className={`text-xs ${a.status === 'CONFIRMED' ? 'text-green-600' : 'text-orange-500'}`}>{a.status}</span>
                          </li>
                        ))}
                        {clientAppts.length === 0 && <li className="italic">No history.</li>}
                      </ul>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      )}

      {activeTab === 'services' && (
        <Card className="animate-fade-in">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold dark:text-white">Services CMS</h3>
            <Button className="!py-1" onClick={() => { setEditingService({}); setIsServiceModalOpen(true); }}>
              <Plus size={16} /> Add New Service
            </Button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left dark:text-gray-300 border-collapse">
              <thead>
                <tr className="border-b dark:border-gray-700 bg-gray-50 dark:bg-slate-700">
                  <th className="p-3">Service</th>
                  <th className="p-3">Price (₹)</th>
                  <th className="p-3">Duration</th>
                  <th className="p-3">Features</th>
                  <th className="p-3">Discount</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {services.map(s => {
                  const discount = getDiscountInfo(s);
                  return (
                    <tr key={s.id} className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-slate-700">
                      <td className="p-3">
                        <div className="flex items-center gap-3">
                          {s.imageUrl && <img src={s.imageUrl} className="w-10 h-10 rounded object-cover" alt="" />}
                          <div>
                            <div className="font-medium">{s.title}</div>
                            <div className="text-xs text-gray-500 max-w-xs truncate">{s.description}</div>
                          </div>
                        </div>
                      </td>
                      <td className="p-3">{s.price}</td>
                      <td className="p-3">{s.durationMinutes} min</td>
                      <td className="p-3">
                        <span className="text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                          {s.subServices?.length || 0} features
                        </span>
                      </td>
                      <td className="p-3">
                        {discount ? (
                          <div className="text-xs">
                            <span className="font-bold text-red-500">{discount.percentage}% OFF</span>
                            <div className="text-gray-500">{discount.timeLeft}</div>
                          </div>
                        ) : <span className="text-gray-400">-</span>}
                      </td>
                      <td className="p-3 flex justify-end gap-2">
                        <button onClick={() => { setEditingService(s); setIsServiceModalOpen(true); }} className="text-blue-500 hover:bg-blue-50 p-1 rounded"><Edit2 size={18} /></button>
                        <button onClick={() => handleDeleteService(s.id)} className="text-red-500 hover:bg-red-50 p-1 rounded"><Trash2 size={18} /></button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {/* Service Modal */}
          {isServiceModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
              <div className="bg-white dark:bg-slate-800 p-6 rounded-lg w-full max-w-lg shadow-2xl overflow-y-auto max-h-[90vh]">
                <h3 className="text-xl font-bold mb-4 dark:text-white">{editingService?.id ? 'Edit Service' : 'Add Service'}</h3>
                <form onSubmit={handleSaveService} className="space-y-4">
                  <input
                    placeholder="Service Title"
                    className="w-full p-2 border rounded dark:bg-slate-700 dark:border-gray-600 dark:text-white"
                    value={editingService?.title || ''}
                    onChange={e => setEditingService({ ...editingService, title: e.target.value })}
                    required
                  />
                  <textarea
                    placeholder="Description"
                    className="w-full p-2 border rounded dark:bg-slate-700 dark:border-gray-600 dark:text-white"
                    value={editingService?.description || ''}
                    onChange={e => setEditingService({ ...editingService, description: e.target.value })}
                    required
                  />

                  <div>
                    <label className="text-xs text-gray-500 mb-1 flex items-center gap-1"><ImageIcon size={12} /> Image URL</label>
                    <input
                      placeholder="https://example.com/image.jpg"
                      className="w-full p-2 border rounded dark:bg-slate-700 dark:border-gray-600 dark:text-white"
                      value={editingService?.imageUrl || ''}
                      onChange={e => setEditingService({ ...editingService, imageUrl: e.target.value })}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="number" placeholder="Price"
                      className="w-full p-2 border rounded dark:bg-slate-700 dark:border-gray-600 dark:text-white"
                      value={editingService?.price || ''}
                      onChange={e => setEditingService({ ...editingService, price: Number(e.target.value) })}
                      required
                    />
                    <input
                      type="number" placeholder="Duration (min)"
                      className="w-full p-2 border rounded dark:bg-slate-700 dark:border-gray-600 dark:text-white"
                      value={editingService?.durationMinutes || ''}
                      onChange={e => setEditingService({ ...editingService, durationMinutes: Number(e.target.value) })}
                      required
                    />
                  </div>

                  {/* Sub Services Management */}
                  <div className="bg-gray-50 dark:bg-slate-900/50 p-3 rounded border dark:border-gray-700">
                    <label className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                      <ListPlus size={16} className="text-astro-saffron" /> Features / Sub-services
                    </label>
                    <div className="flex gap-2 mb-2">
                      <input
                        className="flex-grow p-2 text-sm border rounded dark:bg-slate-700 dark:border-gray-600 dark:text-white"
                        placeholder="Add feature (e.g., Gemstone analysis)"
                        value={subServiceInput}
                        onChange={e => setSubServiceInput(e.target.value)}
                        onKeyPress={e => { if (e.key === 'Enter') { e.preventDefault(); handleAddSubService(); } }}
                      />
                      <Button type="button" onClick={handleAddSubService} className="!py-1 !px-3 text-sm">Add</Button>
                    </div>
                    <ul className="space-y-1 max-h-32 overflow-y-auto">
                      {editingService?.subServices?.map((sub, idx) => (
                        <li key={idx} className="flex justify-between items-center text-sm bg-white dark:bg-slate-800 p-1.5 rounded border dark:border-gray-700">
                          <span className="truncate dark:text-gray-300 flex items-center gap-2"><CheckCircle2 size={12} className="text-green-500" /> {sub}</span>
                          <button type="button" onClick={() => handleRemoveSubService(idx)} className="text-red-500 hover:text-red-700">
                            <X size={14} />
                          </button>
                        </li>
                      ))}
                      {(!editingService?.subServices || editingService.subServices.length === 0) && (
                        <li className="text-xs text-gray-400 italic text-center py-2">No features added yet.</li>
                      )}
                    </ul>
                  </div>

                  <div className="border-t pt-4 dark:border-gray-700">
                    <h4 className="text-sm font-bold text-astro-saffron mb-2 flex items-center gap-2"><Tag size={14} /> Discount Settings (Optional)</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs text-gray-500 mb-1 block">Discount %</label>
                        <input
                          type="number" placeholder="0"
                          className="w-full p-2 border rounded dark:bg-slate-700 dark:border-gray-600 dark:text-white"
                          value={editingService?.discount?.percentage || ''}
                          onChange={e => setEditingService({
                            ...editingService,
                            discount: {
                              percentage: Number(e.target.value),
                              validUntil: editingService?.discount?.validUntil || ''
                            }
                          })}
                        />
                      </div>
                      <div>
                        <label className="text-xs text-gray-500 mb-1 block">Valid Until</label>
                        <input
                          type="datetime-local"
                          className="w-full p-2 border rounded dark:bg-slate-700 dark:border-gray-600 dark:text-white"
                          value={editingService?.discount?.validUntil ? new Date(editingService.discount.validUntil).toISOString().slice(0, 16) : ''}
                          onChange={e => setEditingService({
                            ...editingService,
                            discount: {
                              percentage: editingService?.discount?.percentage || 0,
                              validUntil: new Date(e.target.value).toISOString()
                            }
                          })}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 mt-4 pt-4 border-t dark:border-gray-700">
                    <Button type="button" variant="ghost" onClick={() => setIsServiceModalOpen(false)}>Cancel</Button>
                    <Button type="submit">Save Service</Button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </Card>
      )}

      {activeTab === 'settings' && (
        <div className="grid md:grid-cols-2 gap-6 animate-fade-in">
          <Card>
            <h3 className="text-xl font-bold mb-4 dark:text-white flex items-center gap-2">
              <Calendar className="text-astro-saffron" /> Calendar Integration
            </h3>
            <div className="bg-gray-50 dark:bg-slate-700 p-4 rounded border dark:border-gray-600">
              <div className="flex items-center gap-4 mb-4">
                <div className={`w-4 h-4 rounded-full ${calendarConfig.isConnected ? 'bg-green-500' : 'bg-gray-300'}`} />
                <div>
                  <p className="font-bold dark:text-white">{calendarConfig.isConnected ? 'Connected' : 'Disconnected'}</p>
                  <p className="text-xs text-gray-500">{calendarConfig.isConnected ? `Linked to ${calendarConfig.calendarId}` : 'No account linked'}</p>
                </div>
              </div>
              {!calendarConfig.isConnected ? (
                <Button onClick={handleConnectCalendar} className="w-full">Link Google Calendar</Button>
              ) : (
                <Button variant="outline" className="w-full" onClick={() => { api.setCalendarConfig({ ...calendarConfig, isConnected: false }); refreshData(); }}>Disconnect</Button>
              )}
            </div>

            <div className="mt-8 border-t pt-6 dark:border-gray-700">
              <h4 className="font-bold text-red-500 mb-2 flex items-center gap-2"><Database size={16} /> Dangerous Zone</h4>
              <p className="text-xs text-gray-500 mb-3">Resetting the database will wipe all current data and restore the initial sample data.</p>
              <Button variant="danger" className="w-full !py-1 text-sm" onClick={() => { if (window.confirm('Are you sure you want to wipe all data?')) api.resetDatabase() }}>
                Reset Database (Wipe All Data)
              </Button>
            </div>
          </Card>

          <Card>
            <h3 className="text-xl font-bold mb-4 dark:text-white flex items-center gap-2">
              <CalendarOff className="text-red-500" /> Blackout Dates
            </h3>

            <div className="space-y-3 mb-4 p-4 bg-gray-50 dark:bg-slate-700 rounded-lg border dark:border-gray-600">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium dark:text-gray-300">Date</label>
                <input
                  type="date"
                  className="w-full p-2 border rounded dark:bg-slate-600 dark:border-gray-500 dark:text-white"
                  value={blackoutDateInput}
                  onChange={(e) => setBlackoutDateInput(e.target.value)}
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="partialCheck"
                  checked={isPartialBlackout}
                  onChange={(e) => setIsPartialBlackout(e.target.checked)}
                  className="w-4 h-4 text-astro-saffron rounded"
                />
                <label htmlFor="partialCheck" className="text-sm dark:text-gray-300">Partial Day (Specific Time)</label>
              </div>

              {isPartialBlackout && (
                <div className="grid grid-cols-2 gap-4 animate-fade-in">
                  <div>
                    <label className="text-xs text-gray-500 dark:text-gray-400">Start Time</label>
                    <input
                      type="time"
                      className="w-full p-2 border rounded dark:bg-slate-600 dark:border-gray-500 dark:text-white"
                      value={blackoutStartTime}
                      onChange={(e) => setBlackoutStartTime(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 dark:text-gray-400">End Time</label>
                    <input
                      type="time"
                      className="w-full p-2 border rounded dark:bg-slate-600 dark:border-gray-500 dark:text-white"
                      value={blackoutEndTime}
                      onChange={(e) => setBlackoutEndTime(e.target.value)}
                    />
                  </div>
                </div>
              )}

              <Button className="w-full justify-center" onClick={handleAddBlackout} disabled={!blackoutDateInput || (isPartialBlackout && (!blackoutStartTime || !blackoutEndTime))}>
                Block Date
              </Button>
            </div>

            <div className="space-y-2 max-h-60 overflow-y-auto">
              {blackoutDates.length === 0 && <p className="text-sm text-gray-500 italic">No blackout dates set.</p>}
              {blackoutDates.map(date => (
                <div key={date.id} className="flex justify-between items-center p-2 bg-red-50 dark:bg-red-900/20 rounded border border-red-100 dark:border-red-800">
                  <div>
                    <span className="dark:text-white font-medium block">{new Date(date.date).toDateString()}</span>
                    {date.startTime && date.endTime ? (
                      <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                        <Clock size={12} /> {date.startTime} - {date.endTime}
                      </span>
                    ) : (
                      <span className="text-xs text-red-500">Full Day</span>
                    )}
                  </div>
                  <button onClick={async () => { await api.removeBlackoutDate(date.id); refreshData(); }} className="text-red-500 hover:bg-red-200 rounded p-1">
                    <X size={16} />
                  </button>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

const ClientDashboard = ({ user }: { user: User }) => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const data = await api.getAppointments(user.id, 'CLIENT');
      setAppointments(data);
      setLoading(false);
    };
    fetchData();
  }, [user.id]);

  if (loading) return <div className="p-20 text-center text-gray-500">Loading your consultations...</div>;

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      <h2 className="text-3xl font-serif text-astro-indigo dark:text-astro-gold mb-6">My Consultations</h2>

      <Card>
        <h3 className="text-xl font-bold mb-4 dark:text-white">Appointment History</h3>
        {appointments.length === 0 ? (
          <p className="text-gray-500 italic">You haven't booked any consultations yet.</p>
        ) : (
          <div className="space-y-4">
            {appointments.map(appt => (
              <div key={appt.id} className="border dark:border-gray-700 p-4 rounded-lg bg-gray-50 dark:bg-slate-700">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-bold text-lg dark:text-white">{appt.serviceName}</h4>
                      <span className="text-xs bg-gray-100 dark:bg-gray-600 px-2 py-0.5 rounded dark:text-white">{appt.consultationMode}</span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {new Date(appt.dateTime).toLocaleString()}
                    </p>
                    <p className="text-sm dark:text-gray-400 mt-1">For: {appt.nativeName}</p>
                    <p className="text-xs italic text-gray-500 mt-2">"{appt.queryNotes}"</p>
                  </div>
                  <div className="text-right">
                    <span className={`px-2 py-1 rounded text-xs font-bold ${appt.status === 'CONFIRMED' ? 'bg-green-100 text-green-700' :
                      appt.status === 'PENDING' ? 'bg-orange-100 text-orange-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                      {appt.status}
                    </span>
                    {appt.status === 'PENDING' && (
                      <p className="text-xs text-gray-500 mt-2">Waiting for confirmation</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
};

const NativeList = ({ clientId }: { clientId: string }) => {
  const [natives, setNatives] = useState<Native[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNatives = async () => {
      const data = await api.getNatives(clientId);
      setNatives(data);
      setLoading(false);
    };
    fetchNatives();
  }, [clientId]);

  if (loading) return <span className="text-xs text-gray-400 italic">Finding profiles...</span>;

  return (
    <ul className="text-sm dark:text-gray-400 list-disc ml-4">
      {natives.map(n => <li key={n.id}>{n.name} ({n.gender}, {n.dob})</li>)}
      {natives.length === 0 && <li>No profiles added yet.</li>}
    </ul>
  );
};

// --- Reusable Placeholder for new pages ---
const PlaceholderPage = ({ title, icon: Icon, description }: any) => (
  <div className="text-center py-20 animate-fade-in">
    <div className="flex justify-center mb-6">
      <div className="p-6 bg-astro-cream dark:bg-slate-800 rounded-full border-2 border-astro-gold/30">
        <Icon size={64} className="text-astro-saffron" />
      </div>
    </div>
    <h2 className="text-4xl font-serif font-bold mb-4 text-astro-indigo dark:text-astro-gold">{title}</h2>
    <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">{description}</p>
    <div className="mt-8">
      <span className="inline-block px-4 py-1 rounded-full bg-astro-indigo text-white text-sm font-bold tracking-wider uppercase">Coming Soon</span>
    </div>
  </div>
);

const App = () => {
  const [isDark, setIsDark] = useState(false);
  const [page, setPage] = useState('home');
  const [user, setUser] = useState<User | null>(null);
  const [selectedService, setSelectedService] = useState<Service | null>(null);

  // Login Form State
  const [loginPhone, setLoginPhone] = useState('');
  const [loginName, setLoginName] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isRegistering) {
        if (!loginName || !loginPhone) return;
        const newUser = await api.register(loginName, loginPhone);
        setUser(newUser);
        setPage('home');
        alert('Welcome! Registration successful.');
      } else {
        if (!loginPhone) return;
        const foundUser = await api.login(loginPhone);
        if (foundUser) {
          setUser(foundUser);
          setPage('home');
        } else {
          alert('User not found. Please register.');
          setIsRegistering(true);
        }
      }
    } catch (error: any) {
      console.error("Auth error:", error);
      alert(`Error: ${error.message}`);
    }
  };

  const onBookNow = () => setPage('services');

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDark ? 'bg-slate-900 text-gray-100' : 'bg-astro-cream text-gray-800'}`}>
      <MandalaBackground />
      <Navbar
        user={user}
        toggleTheme={() => setIsDark(!isDark)}
        isDark={isDark}
        onNavigate={setPage}
        onLogout={() => { setUser(null); setPage('home'); }}
      />

      <main className="container mx-auto px-4 py-8 relative z-10">
        {page === 'home' && <Hero onBookNow={onBookNow} />}

        {page === 'services' && (
          <ServicesList onSelectService={(s) => {
            if (!user) {
              alert('Please login to book this service.');
              setPage('login');
              return;
            }
            setSelectedService(s);
            setPage('booking');
          }} />
        )}

        {page === 'booking' && selectedService && user && (
          <BookingFlow
            service={selectedService}
            client={user}
            onSuccess={() => {
              alert('Booking Requested Successfully!');
              setPage('dashboard');
              setSelectedService(null);
            }}
            onCancel={() => {
              setSelectedService(null);
              setPage('services');
            }}
          />
        )}

        {page === 'dashboard' && user && (
          user.role === 'ADMIN' ? <AdminDashboard /> : <ClientDashboard user={user} />
        )}

        {page === 'login' && !user && (
          <div className="max-w-md mx-auto mt-20 animate-fade-in">
            <Card>
              <h2 className="text-2xl font-serif font-bold text-center mb-6 dark:text-white">
                {isRegistering ? 'Join Gagan.Astro' : 'Welcome Back'}
              </h2>
              <form onSubmit={handleLogin} className="space-y-4">
                {isRegistering && (
                  <div>
                    <label className="block text-sm mb-1 dark:text-gray-300">Full Name</label>
                    <input
                      className="w-full p-2 border rounded dark:bg-slate-700 dark:border-gray-600 dark:text-white"
                      value={loginName}
                      onChange={e => setLoginName(e.target.value)}
                      required
                    />
                  </div>
                )}
                <div>
                  <label className="block text-sm mb-1 dark:text-gray-300">Phone Number</label>
                  <input
                    className="w-full p-2 border rounded dark:bg-slate-700 dark:border-gray-600 dark:text-white"
                    value={loginPhone}
                    onChange={e => setLoginPhone(e.target.value)}
                    placeholder="9876543210"
                    required
                  />
                </div>
                <Button className="w-full" type="submit">
                  {isRegistering ? 'Register' : 'Login'}
                </Button>
              </form>
              <div className="mt-4 text-center">
                <button
                  type="button"
                  className="text-sm text-astro-saffron hover:underline"
                  onClick={() => setIsRegistering(!isRegistering)}
                >
                  {isRegistering ? 'Already have an account? Login' : 'New here? Create account'}
                </button>
              </div>

              <div className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-700 text-xs text-gray-400 text-center">
                <p className="font-semibold mb-1">Demo Login:</p>
                <div className="flex justify-center gap-4">
                  <span onClick={() => { setLoginPhone('9999999999'); setIsRegistering(false); }} className="cursor-pointer hover:text-astro-saffron">Admin: 9999999999</span>
                  <span onClick={() => { setLoginPhone('9876543210'); setIsRegistering(false); }} className="cursor-pointer hover:text-astro-saffron">Client: 9876543210</span>
                </div>
              </div>
            </Card>
          </div>
        )}

        {page === 'gallery' && (
          <div className="text-center py-20">
            <h2 className="text-3xl font-serif mb-4 dark:text-white">Gallery</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="aspect-square bg-gray-200 dark:bg-slate-800 rounded-lg flex items-center justify-center">
                  <ImageIcon className="text-gray-400" />
                </div>
              ))}
            </div>
            <p className="text-gray-500 mt-6">Gallery under construction...</p>
          </div>
        )}

        {/* New Pages */}
        {page === 'blog' && (
          <PlaceholderPage
            title="Astrology Insights"
            icon={BookOpen}
            description="Explore deep dives into Vedic wisdom, planetary transits, and ancient scriptures."
          />
        )}
        {page === 'articles' && (
          <PlaceholderPage
            title="Featured Articles"
            icon={FileText}
            description="Curated research papers and articles on Sarvatobhadra Chakra and Nadi Astrology."
          />
        )}
        {page === 'videos' && (
          <PlaceholderPage
            title="Video Library"
            icon={Youtube}
            description="Watch recorded sessions, tutorials, and weekly forecasts by Gagan Minhans."
          />
        )}
        {page === 'daily' && (
          <PlaceholderPage
            title="Daily Predictions"
            icon={Sparkles}
            description="Your daily horoscope and Panchang insights will be available here soon."
          />
        )}

      </main>
    </div>
  );
};

export default App;