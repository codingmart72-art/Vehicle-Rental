import {
  INITIAL_VEHICLES,
  INITIAL_OFFERS,
  INITIAL_USERS,
  INITIAL_LICENSES,
  INITIAL_BOOKINGS,
  INITIAL_INSPECTIONS,
  INITIAL_DAMAGE_REPORTS,
  INITIAL_AUDIT_LOGS,
  INITIAL_SECURITY_EVENTS,
} from './mockData';

// Storage Helper
const getStored = (key, fallback) => {
  const data = localStorage.getItem(`vrs_${key}`);
  if (!data) {
    localStorage.setItem(`vrs_${key}`, JSON.stringify(fallback));
    return fallback;
  }
  try {
    return JSON.parse(data);
  } catch (e) {
    return fallback;
  }
};

const setStored = (key, value) => {
  localStorage.setItem(`vrs_${key}`, JSON.stringify(value));
};

export const mockBackend = {
  // Auth
  login: async (email, password) => {
    await new Promise((res) => setTimeout(res, 500));
    const users = getStored('users', INITIAL_USERS);
    const user = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    
    if (!user) {
      // Fallback demo user generator by email role prefix
      let role = 'CUSTOMER';
      if (email.includes('admin')) role = 'ADMIN';
      else if (email.includes('owner')) role = 'VEHICLE_OWNER';
      else if (email.includes('staff')) role = 'STAFF';

      const newUser = {
        id: `usr-${Date.now()}`,
        name: email.split('@')[0].toUpperCase(),
        email,
        role,
        status: 'ACTIVE',
        licenseStatus: role === 'CUSTOMER' ? 'UNVERIFIED' : 'N/A',
        registeredAt: new Date().toISOString().split('T')[0],
      };
      users.push(newUser);
      setStored('users', users);
      return { token: `jwt-mock-token-${Date.now()}`, user: newUser };
    }
    
    if (user.status === 'DEACTIVATED') {
      throw new Error('Account has been deactivated. Please contact support.');
    }

    return { token: `jwt-mock-token-${Date.now()}`, user };
  },

  register: async (userData) => {
    await new Promise((res) => setTimeout(res, 600));
    const users = getStored('users', INITIAL_USERS);
    if (users.some((u) => u.email === userData.email)) {
      throw new Error('An account with this email address already exists.');
    }
    const newUser = {
      id: `usr-${Date.now()}`,
      name: userData.name,
      email: userData.email,
      phone: userData.phone || '+1 555-0000',
      role: 'CUSTOMER',
      status: 'ACTIVE',
      licenseStatus: 'UNVERIFIED',
      registeredAt: new Date().toISOString().split('T')[0],
    };
    users.push(newUser);
    setStored('users', users);
    
    // Add audit log
    mockBackend.addAuditLog(userData.email, 'CUSTOMER', 'REGISTER_ACCOUNT', `Registered new customer account ${userData.email}`);
    
    return { token: `jwt-mock-token-${Date.now()}`, user: newUser };
  },

  // Vehicles
  getVehicles: async () => {
    await new Promise((res) => setTimeout(res, 300));
    return getStored('vehicles', INITIAL_VEHICLES);
  },

  getVehicleDetails: async (id) => {
    await new Promise((res) => setTimeout(res, 300));
    const vehicles = getStored('vehicles', INITIAL_VEHICLES);
    const v = vehicles.find((item) => item.id === id);
    if (!v) throw new Error('Vehicle not found.');
    return v;
  },

  addVehicle: async (vehicleData, ownerUser) => {
    await new Promise((res) => setTimeout(res, 600));
    const vehicles = getStored('vehicles', INITIAL_VEHICLES);
    const newVehicle = {
      id: `veh-${Date.now()}`,
      ...vehicleData,
      status: 'AVAILABLE',
      ownerId: ownerUser.id,
      ownerName: ownerUser.name,
      rating: 5.0,
      tripsCount: 0,
      image: vehicleData.image || 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80',
    };
    vehicles.unshift(newVehicle);
    setStored('vehicles', vehicles);
    
    mockBackend.addAuditLog(ownerUser.email, 'VEHICLE_OWNER', 'ADD_VEHICLE', `Added vehicle ${newVehicle.name} (${newVehicle.licensePlate})`);
    return newVehicle;
  },

  updateVehicle: async (id, vehicleData) => {
    await new Promise((res) => setTimeout(res, 500));
    const vehicles = getStored('vehicles', INITIAL_VEHICLES);
    const idx = vehicles.findIndex((v) => v.id === id);
    if (idx === -1) throw new Error('Vehicle not found');
    vehicles[idx] = { ...vehicles[idx], ...vehicleData };
    setStored('vehicles', vehicles);
    return vehicles[idx];
  },

  // Licenses
  uploadLicense: async (userId, licenseData) => {
    await new Promise((res) => setTimeout(res, 700));
    const licenses = getStored('licenses', INITIAL_LICENSES);
    const users = getStored('users', INITIAL_USERS);

    const user = users.find((u) => u.id === userId);
    
    const existingIdx = licenses.findIndex((l) => l.userId === userId);
    const newRecord = {
      id: `lic-${Date.now()}`,
      userId,
      userName: user ? user.name : 'Customer',
      userEmail: user ? user.email : 'customer@demo.com',
      licenseNumber: licenseData.licenseNumber,
      expiryDate: licenseData.expiryDate,
      issueState: licenseData.issueState,
      status: 'PENDING',
      submittedAt: new Date().toISOString(),
      verifiedAt: null,
      verifiedBy: null,
      documentFrontUrl: licenseData.documentFrontUrl || 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=800&q=80',
      notes: 'Awaiting Staff License Verification',
    };

    if (existingIdx !== -1) {
      licenses[existingIdx] = newRecord;
    } else {
      licenses.unshift(newRecord);
    }
    setStored('licenses', licenses);

    // Update user license status to PENDING
    if (user) {
      user.licenseStatus = 'PENDING';
      setStored('users', users);
    }

    mockBackend.addAuditLog(user ? user.email : userId, 'CUSTOMER', 'UPLOAD_LICENSE', `Uploaded driving license ${licenseData.licenseNumber}`);
    return newRecord;
  },

  getLicenseQueue: async () => {
    await new Promise((res) => setTimeout(res, 400));
    const licenses = getStored('licenses', INITIAL_LICENSES);
    return licenses.filter((l) => l.status === 'PENDING');
  },

  getAllLicenses: async () => {
    await new Promise((res) => setTimeout(res, 300));
    return getStored('licenses', INITIAL_LICENSES);
  },

  getLicenseStatus: async (userId) => {
    await new Promise((res) => setTimeout(res, 300));
    const licenses = getStored('licenses', INITIAL_LICENSES);
    const users = getStored('users', INITIAL_USERS);
    const user = users.find((u) => u.id === userId);
    if (user && user.licenseStatus && user.licenseStatus !== 'UNVERIFIED') {
      return user.licenseStatus;
    }
    const lic = licenses.find((l) => l.userId === userId);
    return lic ? lic.status : 'UNVERIFIED';
  },

  verifyLicense: async (licenseId, decision, staffUser, notes) => {
    await new Promise((res) => setTimeout(res, 600));
    const licenses = getStored('licenses', INITIAL_LICENSES);
    const users = getStored('users', INITIAL_USERS);
    const lic = licenses.find((l) => l.id === licenseId);
    if (!lic) throw new Error('License request not found');

    lic.status = decision; // 'VERIFIED' or 'REJECTED'
    lic.verifiedAt = new Date().toISOString();
    lic.verifiedBy = staffUser.name;
    lic.notes = notes || (decision === 'VERIFIED' ? 'Approved by staff' : 'Document illegible or expired');
    setStored('licenses', licenses);

    // Update user record
    const user = users.find((u) => u.id === lic.userId || u.email === lic.userEmail);
    if (user) {
      user.licenseStatus = decision;
      setStored('users', users);
    }

    mockBackend.addAuditLog(staffUser.email, 'STAFF', 'VERIFY_LICENSE', `Set license ${lic.licenseNumber} status to ${decision}`);
    return lic;
  },

  // Bookings
  createBooking: async (bookingData, user) => {
    await new Promise((res) => setTimeout(res, 800));
    const bookings = getStored('bookings', INITIAL_BOOKINGS);
    const vehicles = getStored('vehicles', INITIAL_VEHICLES);
    const vehicle = vehicles.find((v) => v.id === bookingData.vehicleId);

    const newBooking = {
      id: `bk-${Math.floor(1000 + Math.random() * 9000)}`,
      customerId: user.id,
      customerName: user.name,
      customerEmail: user.email,
      vehicleId: vehicle.id,
      vehicleName: vehicle.name,
      startDate: bookingData.startDate,
      endDate: bookingData.endDate,
      totalDays: bookingData.totalDays,
      dailyRate: vehicle.dailyRate,
      subtotal: bookingData.subtotal,
      offerCode: bookingData.offerCode || null,
      discountAmount: bookingData.discountAmount || 0,
      finalPrice: bookingData.finalPrice,
      status: 'BOOKED',
      paymentStatus: 'PAID',
      paymentId: `pay-${Math.floor(10000 + Math.random() * 90000)}`,
      createdAt: new Date().toISOString(),
      pickupLocation: vehicle.location,
    };

    bookings.unshift(newBooking);
    setStored('bookings', bookings);

    // Mark vehicle as booked
    vehicle.status = 'BOOKED';
    setStored('vehicles', vehicles);

    mockBackend.addAuditLog(user.email, 'CUSTOMER', 'CREATE_BOOKING', `Created booking ${newBooking.id} for ${vehicle.name}`);
    return newBooking;
  },

  getBookings: async (filter = {}) => {
    await new Promise((res) => setTimeout(res, 400));
    let bookings = getStored('bookings', INITIAL_BOOKINGS);
    if (filter.customerId) {
      bookings = bookings.filter((b) => b.customerId === filter.customerId || b.customerEmail === filter.customerId);
    }
    return bookings;
  },

  // Inspections
  getPickupInspection: async (bookingId) => {
    await new Promise((res) => setTimeout(res, 300));
    const inspections = getStored('inspections', INITIAL_INSPECTIONS);
    return inspections.find((i) => i.bookingId === bookingId && i.type === 'PICKUP');
  },

  getDamageReports: async () => {
    await new Promise((res) => setTimeout(res, 300));
    return getStored('damageReports', INITIAL_DAMAGE_REPORTS);
  },

  submitPickupInspection: async (inspectionData, staffUser) => {
    await new Promise((res) => setTimeout(res, 700));
    const inspections = getStored('inspections', INITIAL_INSPECTIONS);
    const bookings = getStored('bookings', INITIAL_BOOKINGS);
    const vehicles = getStored('vehicles', INITIAL_VEHICLES);

    const booking = bookings.find((b) => b.id === inspectionData.bookingId);
    if (!booking) throw new Error('Booking not found');

    const newInsp = {
      id: `insp-${Date.now()}`,
      bookingId: booking.id,
      vehicleId: booking.vehicleId,
      type: 'PICKUP',
      odometer: inspectionData.odometer,
      fuelLevel: inspectionData.fuelLevel,
      cleanliness: inspectionData.cleanliness,
      existingScratches: inspectionData.existingScratches || 'None recorded',
      evidenceUrls: inspectionData.evidenceUrls || [],
      customerAcknowledged: true,
      staffName: staffUser.name,
      inspectedAt: new Date().toISOString(),
      status: 'APPROVED',
    };

    inspections.unshift(newInsp);
    setStored('inspections', inspections);

    // Update booking & vehicle status to ACTIVE / IN_USE
    booking.status = 'ACTIVE';
    setStored('bookings', bookings);

    const veh = vehicles.find((v) => v.id === booking.vehicleId);
    if (veh) {
      veh.status = 'ACTIVE';
      setStored('vehicles', vehicles);
    }

    mockBackend.addAuditLog(staffUser.email, 'STAFF', 'SUBMIT_PICKUP_INSPECTION', `Approved pickup inspection for booking ${booking.id}`);
    return newInsp;
  },

  submitReturnInspection: async (inspectionData, staffUser) => {
    await new Promise((res) => setTimeout(res, 800));
    const inspections = getStored('inspections', INITIAL_INSPECTIONS);
    const bookings = getStored('bookings', INITIAL_BOOKINGS);
    const vehicles = getStored('vehicles', INITIAL_VEHICLES);
    const damageReports = getStored('damageReports', INITIAL_DAMAGE_REPORTS);

    const booking = bookings.find((b) => b.id === inspectionData.bookingId);
    if (!booking) throw new Error('Booking not found');

    const hasNewDamage = inspectionData.hasNewDamage;

    const newInsp = {
      id: `insp-ret-${Date.now()}`,
      bookingId: booking.id,
      vehicleId: booking.vehicleId,
      type: 'RETURN',
      odometer: inspectionData.odometer,
      fuelLevel: inspectionData.fuelLevel,
      cleanliness: inspectionData.cleanliness,
      newDamageNotes: inspectionData.newDamageNotes || 'No new damage',
      additionalCharges: inspectionData.additionalCharges || 0,
      evidenceUrls: inspectionData.evidenceUrls || [],
      staffName: staffUser.name,
      inspectedAt: new Date().toISOString(),
      status: hasNewDamage ? 'DAMAGE_PENDING' : 'APPROVED',
    };

    inspections.unshift(newInsp);
    setStored('inspections', inspections);

    if (hasNewDamage) {
      const damageRep = {
        id: `dmg-${Date.now()}`,
        bookingId: booking.id,
        vehicleId: booking.vehicleId,
        vehicleName: booking.vehicleName,
        customerName: booking.customerName,
        description: inspectionData.newDamageNotes,
        estimatedCost: inspectionData.additionalCharges || 250,
        status: 'DAMAGE_PENDING',
        reportedBy: staffUser.name,
        reportedAt: new Date().toISOString(),
        evidenceUrls: inspectionData.evidenceUrls || [],
      };
      damageReports.unshift(damageRep);
      setStored('damageReports', damageReports);
      booking.status = 'DAMAGE_PENDING';
    } else {
      booking.status = 'RETURNED';
      const veh = vehicles.find((v) => v.id === booking.vehicleId);
      if (veh) {
        veh.status = 'AVAILABLE';
        setStored('vehicles', vehicles);
      }
    }

    setStored('bookings', bookings);
    mockBackend.addAuditLog(staffUser.email, 'STAFF', 'SUBMIT_RETURN_INSPECTION', `Submitted return inspection for booking ${booking.id}`);
    return newInsp;
  },

  // Admin Features
  getUsers: async () => {
    await new Promise((res) => setTimeout(res, 300));
    return getStored('users', INITIAL_USERS);
  },

  updateUserRole: async (userId, newRole, adminUser) => {
    await new Promise((res) => setTimeout(res, 500));
    const users = getStored('users', INITIAL_USERS);
    const u = users.find((item) => item.id === userId);
    if (!u) throw new Error('User not found');
    const oldRole = u.role;
    u.role = newRole;
    setStored('users', users);
    mockBackend.addAuditLog(adminUser.email, 'ADMIN', 'ASSIGN_ROLE', `Changed user ${u.email} role from ${oldRole} to ${newRole}`);
    return u;
  },

  updateUserStatus: async (userId, newStatus, adminUser) => {
    await new Promise((res) => setTimeout(res, 500));
    const users = getStored('users', INITIAL_USERS);
    const u = users.find((item) => item.id === userId);
    if (!u) throw new Error('User not found');
    u.status = newStatus;
    setStored('users', users);
    mockBackend.addAuditLog(adminUser.email, 'ADMIN', 'UPDATE_USER_STATUS', `Updated user ${u.email} status to ${newStatus}`);
    return u;
  },

  getOffers: async () => {
    await new Promise((res) => setTimeout(res, 300));
    return getStored('offers', INITIAL_OFFERS);
  },

  createOffer: async (offerData, adminUser) => {
    await new Promise((res) => setTimeout(res, 500));
    const offers = getStored('offers', INITIAL_OFFERS);
    const newOffer = {
      id: `off-${Date.now()}`,
      ...offerData,
      isActive: true,
    };
    offers.unshift(newOffer);
    setStored('offers', offers);
    mockBackend.addAuditLog(adminUser.email, 'ADMIN', 'CREATE_OFFER', `Created offer code ${newOffer.code}`);
    return newOffer;
  },

  getAuditLogs: async () => {
    await new Promise((res) => setTimeout(res, 300));
    return getStored('auditLogs', INITIAL_AUDIT_LOGS);
  },

  getSecurityEvents: async () => {
    await new Promise((res) => setTimeout(res, 300));
    return getStored('securityEvents', INITIAL_SECURITY_EVENTS);
  },

  addAuditLog: (actor, role, action, details) => {
    const logs = getStored('auditLogs', INITIAL_AUDIT_LOGS);
    logs.unshift({
      id: `log-${Date.now()}`,
      actor,
      role,
      action,
      details,
      timestamp: new Date().toISOString(),
      ipAddress: '127.0.0.1',
    });
    setStored('auditLogs', logs);
  },
};
