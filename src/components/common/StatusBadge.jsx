import React from 'react';
import {
  Clock, CheckCircle, XCircle, AlertCircle, Car, Shield, CheckCheck,
  CreditCard, Wrench, ShieldAlert, Award, Info
} from 'lucide-react';

export const StatusBadge = ({ status }) => {
  if (!status) return null;

  const normalized = status.toUpperCase();

  const getBadgeConfig = () => {
    switch (normalized) {
      case 'PENDING':
        return { class: 'badge-pending', icon: Clock, label: 'Pending' };
      case 'VERIFIED':
        return { class: 'badge-verified', icon: CheckCircle, label: 'Verified' };
      case 'REJECTED':
        return { class: 'badge-rejected', icon: XCircle, label: 'Rejected' };
      case 'AVAILABLE':
        return { class: 'badge-available', icon: Car, label: 'Available' };
      case 'UNAVAILABLE':
        return { class: 'badge-unavailable', icon: AlertCircle, label: 'Unavailable' };
      case 'BOOKED':
        return { class: 'badge-booked', icon: Shield, label: 'Booked' };
      case 'ACTIVE':
        return { class: 'badge-active', icon: Car, label: 'Active Rental' };
      case 'RETURNED':
        return { class: 'badge-returned', icon: CheckCheck, label: 'Returned' };
      case 'CANCELLED':
        return { class: 'badge-cancelled', icon: XCircle, label: 'Cancelled' };
      case 'PAYMENT_PENDING':
        return { class: 'badge-payment-pending', icon: CreditCard, label: 'Payment Pending' };
      case 'PAID':
        return { class: 'badge-paid', icon: CheckCircle, label: 'Paid' };
      case 'DAMAGE_PENDING':
        return { class: 'badge-damage-pending', icon: Wrench, label: 'Damage Pending' };
      case 'DAMAGE_VERIFIED':
        return { class: 'badge-damage-verified', icon: ShieldAlert, label: 'Damage Verified' };
      case 'COMPLETED':
        return { class: 'badge-completed', icon: Award, label: 'Completed' };
      default:
        return { class: 'badge-unavailable', icon: Info, label: normalized };
    }
  };

  const config = getBadgeConfig();
  const IconComponent = config.icon;

  return (
    <span className={`badge ${config.class}`}>
      <IconComponent size={13} />
      {config.label}
    </span>
  );
};

export default StatusBadge;
