export type BranchType = 'Store' | 'Office' | 'Warehouse' | 'Factory' | 'Other';
export type ConnectionType = 'Broadband' | 'FTTH' | 'Leased Line' | 'Wireless' | 'Dongle' | 'Backup Line';
export type BillingCycle = 'Monthly' | 'Quarterly' | 'Half-Yearly' | 'Yearly';
export type LocationStatus = 'Active' | 'Due Soon' | 'Overdue' | 'Recharged' | 'Disconnected' | 'Temporary Hold';
export type PriorityLevel = 'High' | 'Medium' | 'Low';

export interface ISPProvider {
  id: string;
  name: string;
  supportContact: string;
  portalUrl?: string;
  logo?: string;
}

export interface ISPPlan {
  id: string;
  providerId: string;
  name: string;
  bandwidth: string;
  amount: number;
  billingCycle: BillingCycle;
}

export interface Location {
  id: string;
  name: string;
  branchType: BranchType;
  city: string;
  state: string;
  address?: string;
  ispProviderId: string;
  connectionType: ConnectionType;
  planId: string;
  bandwidth: string;
  amount: number;
  billingCycle: BillingCycle;
  lastRechargeDate: string;
  nextDueDate: string;
  daysRemaining: number;
  accountId: string;
  registeredMobile: string;
  registeredEmail: string;
  loginId?: string;
  paymentMode: string;
  autoPay: boolean;
  status: LocationStatus;
  contactPerson: string;
  adminOwner: string;
  priority: PriorityLevel;
  criticality: PriorityLevel;
  backupAvailable: boolean;
  remarks?: string;
}

export type PaymentMode = 
  | 'UPI' 
  | 'Google Pay' 
  | 'PhonePe' 
  | 'Paytm' 
  | 'BHIM' 
  | 'Net Banking' 
  | 'Debit Card' 
  | 'Credit Card' 
  | 'Wallet' 
  | 'Bank Transfer' 
  | 'Manual Offline';

export type PaymentStatus = 
  | 'Pending' 
  | 'Pending Approval' 
  | 'Payment Initiated' 
  | 'Success' 
  | 'Failed' 
  | 'Cancelled' 
  | 'Reversed' 
  | 'Refunded' 
  | 'Verification Pending' 
  | 'Settled';

export interface Profile {
  id: string;
  fullName?: string;
  email: string;
  roleId?: string;
  avatarUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Role {
  id: string;
  name: string;
  description?: string;
  permissions: string[];
  createdAt: string;
}

export interface Approval {
  id: string;
  entityType: 'expense' | 'manual_payment' | 'discount' | 'recharge';
  entityId: string;
  requestedBy: string;
  status: 'pending' | 'approved' | 'rejected';
  comments?: string;
  approvedBy?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Report {
  id: string;
  name: string;
  reportType: 'GST' | 'Revenue' | 'Churn' | 'Inventory' | 'Audit';
  parameters: Record<string, any>;
  generatedBy: string;
  fileUrl?: string;
  createdAt: string;
}

export interface PaymentReconciliation {
  id: string;
  paymentId: string;
  gatewayStatementId?: string;
  matchedAt: string;
  status: 'matched' | 'mismatch' | 'flagged';
  discrepancyNotes?: string;
  reconciledBy?: string;
}

export interface Attachment {
  id: string;
  entityType: string;
  entityId: string;
  fileName: string;
  filePath: string;
  fileType?: string;
  fileSize?: number;
  uploadedBy: string;
  createdAt: string;
}

export interface AuditLog {
  id: string;
  userId: string;
  module: string;
  action: string;
  oldValue?: any;
  newValue?: any;
  ipAddress?: string;
  createdAt: string;
}

export interface Inventory {
  id: string;
  itemType: string;
  serialNo?: string;
  macAddress?: string;
  status: 'In Stock' | 'Assigned' | 'Faulty' | 'Dead';
  assignedToLocationId?: string;
  assignedToUserId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface RechargeTransaction {
  id: string;
  locationId: string;
  amount: number;
  tax: number;
  total: number;
  rechargeDate: string;
  validUntil: string;
  paymentMode: PaymentMode;
  paymentStatus: PaymentStatus;
  transactionId: string;
  bankReference?: string; // UTR
  gatewayName?: string;
  proofUrl?: string;
  settlementStatus: 'Unsettled' | 'Settled';
  remarks?: string;
  initiatedBy: string;
  approvedBy?: string;
  updatedBy?: string;
}

export interface DashboardStats {
  totalLocations: number;
  activePlans: number;
  dueSoon3Days: number;
  dueSoon7Days: number;
  overduePlans: number;
  rechargedThisMonth: number;
  monthlyCost: number;
  noBackupCount: number;
}

export type NotificationType = 'Email' | 'WhatsApp' | 'Push';

export interface NotificationTemplate {
  id: string;
  type: NotificationType;
  trigger: string;
  subject?: string;
  body: string;
  variables: string[];
  lastUpdated: string;
}
