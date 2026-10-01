export const INITIAL_VEHICLES = [
  {
    id: 'veh-001',
    name: 'Tesla Model 3 Performance',
    category: 'Electric',
    type: 'Car',
    brand: 'Tesla',
    model: 'Model 3',
    year: 2024,
    licensePlate: 'EV-889-XX',
    dailyRate: 120,
    seats: 5,
    transmission: 'Automatic',
    fuelType: 'Electric',
    rangeKm: 540,
    location: 'Downtown Hub - Terminal 1',
    status: 'AVAILABLE',
    ownerId: 'usr-owner-1',
    ownerName: 'Apex Mobility Fleet',
    image: 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?auto=format&fit=crop&w=800&q=80',
    features: ['Autopilot', 'Glass Roof', '0-100 in 3.1s', 'Premium Sound'],
    rating: 4.9,
    tripsCount: 42
  },
  {
    id: 'veh-002',
    name: 'BMW X5 xDrive40i M Sport',
    category: 'SUV',
    type: 'Car',
    brand: 'BMW',
    model: 'X5',
    year: 2023,
    licensePlate: 'LUX-404-BM',
    dailyRate: 150,
    seats: 7,
    transmission: 'Automatic',
    fuelType: 'Petrol',
    rangeKm: 700,
    location: 'Airport Express Terminal',
    status: 'AVAILABLE',
    ownerId: 'usr-owner-1',
    ownerName: 'Apex Mobility Fleet',
    image: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=800&q=80',
    features: ['Panoramic Sunroof', 'xDrive AWD', 'Heated Leather', 'Harman Kardon'],
    rating: 4.85,
    tripsCount: 28
  },
  {
    id: 'veh-003',
    name: 'Ducati Panigale V4 S',
    category: 'Superbike',
    type: 'Bike',
    brand: 'Ducati',
    model: 'Panigale V4',
    year: 2024,
    licensePlate: 'BK-991-DC',
    dailyRate: 95,
    seats: 1,
    transmission: 'Manual',
    fuelType: 'Petrol',
    rangeKm: 280,
    location: 'Westside Station',
    status: 'AVAILABLE',
    ownerId: 'usr-owner-2',
    ownerName: 'Superbike Rentals Ltd',
    image: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=800&q=80',
    features: ['214 HP V4', 'Ohlins Suspension', 'Quickshifter', 'Riding Modes'],
    rating: 4.95,
    tripsCount: 19
  },
  {
    id: 'veh-004',
    name: 'Mercedes-Benz C-Class AMG Line',
    category: 'Sedan',
    type: 'Car',
    brand: 'Mercedes',
    model: 'C300',
    year: 2023,
    licensePlate: 'MB-772-CL',
    dailyRate: 110,
    seats: 5,
    transmission: 'Automatic',
    fuelType: 'Hybrid',
    rangeKm: 820,
    location: 'Downtown Hub - Terminal 1',
    status: 'BOOKED',
    ownerId: 'usr-owner-1',
    ownerName: 'Apex Mobility Fleet',
    image: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=800&q=80',
    features: ['MBUX Hyperscreen', 'Ambient Lighting', 'Burmester Sound'],
    rating: 4.78,
    tripsCount: 35
  },
  {
    id: 'veh-005',
    name: 'Vespa GTS 300 SuperTech',
    category: 'Scooter',
    type: 'Bike',
    brand: 'Vespa',
    model: 'GTS 300',
    year: 2024,
    licensePlate: 'SC-302-VP',
    dailyRate: 45,
    seats: 2,
    transmission: 'Automatic',
    fuelType: 'Petrol',
    rangeKm: 320,
    location: 'City Center Hub',
    status: 'AVAILABLE',
    ownerId: 'usr-owner-2',
    ownerName: 'Superbike Rentals Ltd',
    image: 'https://images.unsplash.com/photo-1525160354320-d8e92641c563?auto=format&fit=crop&w=800&q=80',
    features: ['TFT Display', 'ABS Traction Control', 'USB Port', 'Helmet Storage'],
    rating: 4.88,
    tripsCount: 54
  }
];

export const INITIAL_OFFERS = [
  {
    id: 'off-001',
    code: 'FESTIVAL25',
    title: 'Grand Festive Journey 25% OFF',
    description: 'Get 25% discount on all SUV and Electric car rentals over 3 days.',
    discountPercent: 25,
    minDays: 3,
    validUntil: '2026-10-31',
    isActive: true,
    applicableCategories: ['Electric', 'SUV']
  },
  {
    id: 'off-002',
    code: 'RIDEBIKE15',
    title: 'Weekend Rider Special 15% OFF',
    description: '15% instant off on Ducati & Vespa rentals.',
    discountPercent: 15,
    minDays: 1,
    validUntil: '2026-11-15',
    isActive: true,
    applicableCategories: ['Superbike', 'Scooter']
  },
  {
    id: 'off-003',
    code: 'WELCOME10',
    title: 'First Trip Discount 10% OFF',
    description: 'Welcome bonus for all newly verified license holders.',
    discountPercent: 10,
    minDays: 1,
    validUntil: '2026-12-31',
    isActive: true,
    applicableCategories: ['All']
  }
];

export const INITIAL_USERS = [
  {
    id: 'usr-cust-1',
    name: 'Alex Mercer',
    email: 'customer@demo.com',
    role: 'CUSTOMER',
    phone: '+1 555-0192',
    status: 'ACTIVE',
    licenseStatus: 'VERIFIED',
    licenseNumber: 'DL-98721456-X',
    registeredAt: '2026-01-15'
  },
  {
    id: 'usr-owner-1',
    name: 'Apex Mobility Fleet',
    email: 'owner@demo.com',
    role: 'VEHICLE_OWNER',
    phone: '+1 555-8831',
    status: 'ACTIVE',
    registeredAt: '2025-11-10'
  },
  {
    id: 'usr-staff-1',
    name: 'Sarah Connor',
    email: 'staff@demo.com',
    role: 'STAFF',
    phone: '+1 555-7722',
    status: 'ACTIVE',
    registeredAt: '2025-08-20'
  },
  {
    id: 'usr-admin-1',
    name: 'System Administrator',
    email: 'admin@demo.com',
    role: 'ADMIN',
    phone: '+1 555-0001',
    status: 'ACTIVE',
    registeredAt: '2025-01-01'
  }
];

export const INITIAL_LICENSES = [
  {
    id: 'lic-001',
    userId: 'usr-cust-1',
    userName: 'Alex Mercer',
    userEmail: 'customer@demo.com',
    licenseNumber: 'DL-98721456-X',
    expiryDate: '2029-08-14',
    issueState: 'California',
    status: 'VERIFIED',
    submittedAt: '2026-09-28T10:30:00Z',
    verifiedAt: '2026-09-28T14:15:00Z',
    verifiedBy: 'Sarah Connor',
    documentFrontUrl: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=800&q=80',
    notes: 'Document verified & state record cross-checked cleanly.'
  },
  {
    id: 'lic-002',
    userId: 'usr-cust-2',
    userName: 'Jordan Lee',
    userEmail: 'jordan@demo.com',
    licenseNumber: 'DL-55219084-B',
    expiryDate: '2028-11-20',
    issueState: 'Texas',
    status: 'PENDING',
    submittedAt: '2026-10-01T09:12:00Z',
    verifiedAt: null,
    verifiedBy: null,
    documentFrontUrl: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=800&q=80',
    notes: 'Awaiting Staff Review'
  }
];

export const INITIAL_BOOKINGS = [
  {
    id: 'bk-1001',
    customerId: 'usr-cust-1',
    customerName: 'Alex Mercer',
    customerEmail: 'customer@demo.com',
    vehicleId: 'veh-001',
    vehicleName: 'Tesla Model 3 Performance',
    startDate: '2026-10-05',
    endDate: '2026-10-08',
    totalDays: 3,
    dailyRate: 120,
    subtotal: 360,
    offerCode: 'FESTIVAL25',
    discountAmount: 90,
    finalPrice: 270,
    status: 'BOOKED',
    paymentStatus: 'PAID',
    paymentId: 'pay-77821',
    createdAt: '2026-09-30T16:20:00Z',
    pickupLocation: 'Downtown Hub - Terminal 1'
  }
];

export const INITIAL_INSPECTIONS = [
  {
    id: 'insp-1001',
    bookingId: 'bk-1001',
    vehicleId: 'veh-001',
    type: 'PICKUP',
    odometer: 14250,
    fuelLevel: '100%',
    cleanliness: 'EXCELLENT',
    existingScratches: 'Minor micro-scratch on rear left bumper.',
    evidenceUrls: ['https://images.unsplash.com/photo-1560958089-b8a1929cea89?auto=format&fit=crop&w=800&q=80'],
    customerAcknowledged: true,
    staffName: 'Sarah Connor',
    inspectedAt: '2026-10-05T09:00:00Z',
    status: 'APPROVED'
  }
];

export const INITIAL_DAMAGE_REPORTS = [];

export const INITIAL_AUDIT_LOGS = [
  {
    id: 'log-001',
    actor: 'admin@demo.com',
    role: 'ADMIN',
    action: 'CREATE_FESTIVAL_OFFER',
    details: 'Created offer FESTIVAL25 (25% off)',
    timestamp: '2026-09-25T11:00:00Z',
    ipAddress: '192.168.1.45'
  },
  {
    id: 'log-002',
    actor: 'staff@demo.com',
    role: 'STAFF',
    action: 'VERIFY_LICENSE',
    details: 'Verified license for user Alex Mercer (DL-98721456-X)',
    timestamp: '2026-09-28T14:15:00Z',
    ipAddress: '192.168.1.88'
  },
  {
    id: 'log-003',
    actor: 'customer@demo.com',
    role: 'CUSTOMER',
    action: 'CONFIRM_BOOKING',
    details: 'Created booking bk-1001 for Tesla Model 3',
    timestamp: '2026-09-30T16:20:00Z',
    ipAddress: '172.56.21.9'
  }
];

export const INITIAL_SECURITY_EVENTS = [
  {
    id: 'sec-001',
    type: 'ROLE_GUARD_TRIGGER',
    severity: 'INFO',
    description: 'Role switch verified to ADMIN by system administrator.',
    user: 'admin@demo.com',
    timestamp: '2026-10-01T08:00:00Z',
    ip: '192.168.1.45'
  },
  {
    id: 'sec-002',
    type: 'AUTHENTICATION_SUCCESS',
    severity: 'LOW',
    description: 'User customer@demo.com logged in successfully.',
    user: 'customer@demo.com',
    timestamp: '2026-10-01T10:15:00Z',
    ip: '172.56.21.9'
  }
];
