import {
  Clock,
  CheckCircle,
  XCircle,
  MessageSquare,
  Package,
  AlertTriangle,
  TrendingUp,
  Truck,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export interface StatusConfig {
  icon: LucideIcon;
  text: string;
  bgColor: string;
  textColor: string;
  borderColor: string;
}

export const STATUS_CONFIGS: Record<string, StatusConfig> = {
  pending: {
    icon: Clock,
    text: 'Pending',
    bgColor: 'bg-yellow-100',
    textColor: 'text-yellow-800',
    borderColor: 'border-yellow-200',
  },
  responded: {
    icon: MessageSquare,
    text: 'Responded',
    bgColor: 'bg-primary-50',
    textColor: 'text-primary-600',
    borderColor: 'border-primary-500/30',
  },
  accepted: {
    icon: CheckCircle,
    text: 'Accepted',
    bgColor: 'bg-green-100',
    textColor: 'text-green-800',
    borderColor: 'border-green-200',
  },
  rejected: {
    icon: XCircle,
    text: 'Rejected',
    bgColor: 'bg-red-100',
    textColor: 'text-red-800',
    borderColor: 'border-red-200',
  },
  cancelled: {
    icon: XCircle,
    text: 'Cancelled',
    bgColor: 'bg-gray-100',
    textColor: 'text-gray-800',
    borderColor: 'border-gray-200',
  },
  in_progress: {
    icon: TrendingUp,
    text: 'In Progress',
    bgColor: 'bg-indigo-100',
    textColor: 'text-indigo-800',
    borderColor: 'border-indigo-200',
  },
  shipped: {
    icon: Truck,
    text: 'Shipped',
    bgColor: 'bg-purple-100',
    textColor: 'text-purple-800',
    borderColor: 'border-purple-200',
  },
  delivered: {
    icon: Package,
    text: 'Delivered',
    bgColor: 'bg-teal-100',
    textColor: 'text-teal-800',
    borderColor: 'border-teal-200',
  },
  completed: {
    icon: CheckCircle,
    text: 'Completed',
    bgColor: 'bg-green-100',
    textColor: 'text-green-800',
    borderColor: 'border-green-200',
  },
  sent: {
    icon: Package,
    text: 'Sent',
    bgColor: 'bg-blue-100',
    textColor: 'text-blue-800',
    borderColor: 'border-blue-200',
  },
  approved: {
    icon: CheckCircle,
    text: 'Approved',
    bgColor: 'bg-green-100',
    textColor: 'text-green-800',
    borderColor: 'border-green-200',
  },
  under_review: {
    icon: Clock,
    text: 'Under Review',
    bgColor: 'bg-amber-100',
    textColor: 'text-amber-800',
    borderColor: 'border-amber-200',
  },
};

const DEFAULT_STATUS_CONFIG: StatusConfig = {
  icon: AlertTriangle,
  text: 'Unknown',
  bgColor: 'bg-gray-100',
  textColor: 'text-gray-800',
  borderColor: 'border-gray-200',
};

export const getStatusConfig = (status: string): StatusConfig => {
  const normalizedStatus = status?.toLowerCase().trim();
  return STATUS_CONFIGS[normalizedStatus] || {
    ...DEFAULT_STATUS_CONFIG,
    text: status || 'Unknown',
  };
};
