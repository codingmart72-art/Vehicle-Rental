import React from 'react';
import { Routes, Route } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import ProtectedRoute from './ProtectedRoute';
import RoleGuard from './RoleGuard';

// Public Pages
import HomePage from '../pages/public/HomePage';
import SearchPage from '../pages/public/SearchPage';
import VehicleDetailPage from '../pages/public/VehicleDetailPage';
import FestivalOffersPage from '../pages/public/FestivalOffersPage';
import LoginPage from '../pages/public/LoginPage';
import RegisterPage from '../pages/public/RegisterPage';

// Customer Pages
import CustomerDashboard from '../pages/customer/CustomerDashboard';
import LicenseUploadPage from '../pages/customer/LicenseUploadPage';

// Vehicle Owner Pages
import OwnerDashboard from '../pages/owner/OwnerDashboard';
import AddEditVehiclePage from '../pages/owner/AddEditVehiclePage';

// Staff Pages
import StaffDashboard from '../pages/staff/StaffDashboard';

// Admin Pages
import AdminDashboard from '../pages/admin/AdminDashboard';

// Fallback
import NotFoundPage from '../pages/NotFoundPage';

export const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        {/* Public Routes */}
        <Route index element={<HomePage />} />
        <Route path="search" element={<SearchPage />} />
        <Route path="vehicle/:id" element={<VehicleDetailPage />} />
        <Route path="offers" element={<FestivalOffersPage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />

        {/* Customer Protected Routes */}
        <Route
          path="customer/dashboard"
          element={
            <ProtectedRoute>
              <RoleGuard allowedRoles={['CUSTOMER']}>
                <CustomerDashboard />
              </RoleGuard>
            </ProtectedRoute>
          }
        />
        <Route
          path="customer/license"
          element={
            <ProtectedRoute>
              <RoleGuard allowedRoles={['CUSTOMER']}>
                <LicenseUploadPage />
              </RoleGuard>
            </ProtectedRoute>
          }
        />

        {/* Vehicle Owner Protected Routes */}
        <Route
          path="owner/dashboard"
          element={
            <ProtectedRoute>
              <RoleGuard allowedRoles={['VEHICLE_OWNER']}>
                <OwnerDashboard />
              </RoleGuard>
            </ProtectedRoute>
          }
        />
        <Route
          path="owner/add-vehicle"
          element={
            <ProtectedRoute>
              <RoleGuard allowedRoles={['VEHICLE_OWNER']}>
                <AddEditVehiclePage />
              </RoleGuard>
            </ProtectedRoute>
          }
        />

        {/* Staff Protected Routes */}
        <Route
          path="staff/dashboard"
          element={
            <ProtectedRoute>
              <RoleGuard allowedRoles={['STAFF']}>
                <StaffDashboard />
              </RoleGuard>
            </ProtectedRoute>
          }
        />

        {/* Admin Protected Routes */}
        <Route
          path="admin/dashboard"
          element={
            <ProtectedRoute>
              <RoleGuard allowedRoles={['ADMIN']}>
                <AdminDashboard />
              </RoleGuard>
            </ProtectedRoute>
          }
        />

        {/* Catch All */}
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
