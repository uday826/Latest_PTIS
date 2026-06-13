import type { LucideIcon } from 'lucide-react';
import type { AssetLeaseRentDetailsListItem } from '@/lib/api/asset/asset-lease-rent-details.service';
import type { LeaseRentPaymentListItem } from '@/types/asset/leaseRentPayment.types';

export interface FilterOption {
  label: string;
  value: string;
}

export interface RevenueDashboardCardData {
  id: 'leased' | 'demand' | 'collection' | string;
  label: string;
  value: string;
  subtext: string;
  icon: LucideIcon;
  color: string;
  badge: string;
}

export interface RevenueDashboardTrendPoint {
  month: string;
  demand: number;
  collect: number;
}

export interface RevenueDashboardBreakdownItem {
  label: string;
  value: string;
  amount: string;
  color: string;
}

export interface LeaseRentRecord extends Record<string, unknown> {
  id: string;
  assetId: string;
  assetMasterId?: number;
  assetName?: string;
  assetNo?: string;
  totalAreaSqFt?: number | null;
  assetCategory?: string;
  shopNo: string;
  floor: string;
  floorDescription?: string;
  shopName: string;
  tenantName: string;
  tenantMobile?: string | null;
  tenantEmail?: string | null;
  tenantType?: string | null;
  tenantAadhaarNo?: string | null;
  tenantPanCardNo?: string | null;
  tenantAddress?: string | null;
  pinCode?: string | null;
  leaseType: string;
  applicationTypeName?: string;
  applicationTypeId?: number | null;
  leaseRentType?: string;
  rentStatus: 'In use' | 'Vacant' | 'Pending';
  rentAmount: number;
  monthlyRent?: number | null;
  securityDeposit?: number | null;
  paymentFrequency?: string | null;
  previousTenantName?: string | null;
  previousTenantMobile?: string | null;
  previousMonthlyRent?: number | null;
  oldLeaseStartDate?: string | null;
  oldLeaseEndDate?: string | null;
  leaseStartDate?: string | null;
  leaseEndDate?: string | null;
  terminationDate?: string | null;
  reason?: string | null;
  rentAmountDisplay?: string;
  leaseDurationDisplay?: string;
  workflowStatus?: string;
  rejectionReason?: string;
  category?: string;
  zone?: string;
  ward?: string;
  submittedDate?: string;
}

export interface VerificationRecord extends Record<string, unknown> {
  id: string;
  assetId: string;
  assetCategory: string;
  assetSubCategory: string;
  tenantName: string;
  applicationType: string;
  submittedDate: string;
  status: string;
}

export interface ApprovalRecord extends Record<string, unknown> {
  id: string;
  grievanceNo: string;
  assetId: string;
  assetCategory: string;
  tenantName: string;
  leaseType: string;
  rentAmount: number;
  submittedDate: string;
  status: string;
}

export interface ManageRentersTabCounts {
  registrationCount: number;
  verificationCount: number;
  approvalCount: number;
  revertedCount: number;
}

export interface LeaseRentRegistrationStats {
  totalApproved: number;
  totalVerified: number;
  verificationPending: number;
  approvalPending: number;
  totalRejected: number;
}

export interface ApplicationTypeItem {
  id: number;
  applicationTypeCode: string;
  applicationTypeName: string;
  description: string;
  displayOrder: number;
  isActive: boolean;
  createdBy: number;
  createdDate: string;
  updatedBy: number | null;
  updatedDate: string | null;
}

export interface ManageRentersPageData {
  records: LeaseRentRecord[];
  stats: LeaseRentRegistrationStats;
  pageNumber: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  searchTerm: string;
  assetCategoryId: number | null;
  zoneId: number | null;
  wardId: number | null;
  assetId: number | null;
  categoryOptions: FilterOption[];
  zoneOptions: FilterOption[];
  wardOptions: FilterOption[];
  assetOptions: FilterOption[];
}

interface ManageRentersWorkflowBaseData {
  pageNumber: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  searchTerm: string;
  assetCategoryId: number | null;
  categoryOptions: FilterOption[];
}

export interface ManageRentersVerificationPageData extends ManageRentersWorkflowBaseData {
  records: VerificationRecord[];
}

export interface ManageRentersApprovalPageData extends ManageRentersWorkflowBaseData {
  records: ApprovalRecord[];
}

export interface LeaseRentFormSubmitData {
  assetId: number;
  applicationTypeId: number;
  shopNo?: string;
  floorId?: number;
  shopName?: string;
  tenantName: string;
  tenantMobile?: string;
  tenantEmail?: string;
  tenantType?: string;
  tenantAadhaarNo?: string;
  tenantPanCardNo?: string;
  tenantAddress?: string;
  previousTenantName?: string;
  previousTenantMobile?: string;
  leaseType?: string;
  oldLeaseStartDate?: string;
  oldLeaseEndDate?: string;
  leaseStartDate?: string;
  leaseEndDate?: string;
  terminationDate?: string;
  previousMonthlyRent?: number;
  monthlyRent?: number;
  securityDeposit?: number;
  paymentFrequency?: string;
  reason?: string;
}

export interface PaymentRecordsQuery {
  pageSize: number;
  pageNumber: number;
  zone: string;
  ward: string;
  assetCategory: string;
  leaseRentType: string;
  status: string;
  search: string;
  sortBy: keyof LeaseRentPaymentListItem | '';
  sortOrder: 'asc' | 'desc';
}

export interface PaymentRecordsPageData {
  query: PaymentRecordsQuery;
  records: LeaseRentPaymentListItem[];
  totalEntries: number;
  totalPages: number;
  startIndex: number;
  endIndex: number;
}

export interface PaymentFilterOptions {
  zoneOptions: Array<{ label: string; value: string }>;
  wardOptions: Array<{ label: string; value: string }>;
  assetCategoryOptions: Array<{ label: string; value: string }>;
}

export type PaymentMode = 'Cash' | 'DD' | 'Cheque' | 'QR / UPI' | 'Online' | '';

export interface AssetMasterDetails extends Record<string, unknown> {
  id?: number;
  assetNo?: string;
  assetName?: string;
  assetCategoryName?: string;
  assetTypeName?: string;
  zoneName?: string;
  wardName?: string;
  address?: string;
  inChargeName?: string | null;
  inChargeMobile?: string | null;
  inChargeEmail?: string | null;
  pinCode?: string | null;
  status?: string;
  createdDate?: string;
  updatedDate?: string | null;
  updatedBy?: number | null;
}

export interface RenterDetailsFormData {
  tenantName: string;
  mobileNo: string;
  email: string;
  category: string;
  assetNumber: string;
  rentAmount: string;
  depositAmount: string;
  startDate: string;
  endDate: string;
}

export interface RenterDetailsFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export interface RevenueManagementProps {
  dashboardCards?: RevenueDashboardCardData[];
  trendPoints?: RevenueDashboardTrendPoint[];
  breakdownItems?: RevenueDashboardBreakdownItem[];
  renterRecords?: LeaseRentRecord[];
  paymentPageData?: PaymentRecordsPageData;
}

export type ActiveTab = 'dashboard' | 'renters' | 'payment';

export interface ManageRentersTabsProps {
  locale: string;
  counts?: ManageRentersTabCounts;
}

export type ManageRentersTabKey = 'registration' | 'verification' | 'approval' | 'reverted';

export interface NewLeaseRegistrationDrawerProps {
  asset: AssetMasterDetails;
  record?: LeaseRentRecord | null;
  documents?: import('@/types/municipal-asset/detail-tabs.types').AssetDocumentListItem[];
  applicationTypes?: ApplicationTypeItem[];
  onClose: () => void;
}

export interface RegistrationHistoryModalProps {
  record: {
    id?: string;
    shopName?: string;
    assetId?: string;
    category?: string;
    tenantName?: string;
    leaseType?: string;
    rentAmount?: number;
    paymentFrequency?: string;
  };
  onClose: () => void;
}

export interface RejectRegistrationModalProps {
  record: AssetLeaseRentDetailsListItem;
  onClose: () => void;
}

export interface ApprovalLeaseModalProps {
  record: AssetLeaseRentDetailsListItem;
  onClose: () => void;
  assetDetails?: unknown | null;
  documents?: import('@/types/municipal-asset/detail-tabs.types').AssetDocumentListItem[];
  assetPhotosAndPlans?: import('@/types/municipal-asset/detail-tabs.types').AssetDocumentListItem[];
}

export interface VerificationLeaseModalProps {
  record: AssetLeaseRentDetailsListItem;
  onClose: () => void;
  assetDetails?: unknown | null;
  documents?: import('@/types/municipal-asset/detail-tabs.types').AssetDocumentListItem[];
  assetPhotosAndPlans?: import('@/types/municipal-asset/detail-tabs.types').AssetDocumentListItem[];
}

export interface PaymentSectionProps {
  pageData?: PaymentRecordsPageData;
  filterOptions?: PaymentFilterOptions;
}

export interface PaymentSectionDefaults {
  pageData: PaymentRecordsPageData;
  filterOptions: PaymentFilterOptions;
}

export interface LeaseRentRegistrationProps {
  stage?: 'registration' | 'verification' | 'approval' | 'reverted';
  initialRecords?: LeaseRentRecord[];
  pageNumber?: number;
  pageSize?: number;
  totalCount?: number;
  totalPages?: number;
  searchTerm?: string;
  assetCategoryId?: number | null;
  zoneId?: number | null;
  wardId?: number | null;
  assetId?: number | null;
  verificationRecords?: VerificationRecord[];
  approvalRecords?: ApprovalRecord[];
  drawerAssetId?: number | null;
  selectedAsset?: unknown | null;
  assetDocuments?: import('@/types/municipal-asset/detail-tabs.types').AssetDocumentListItem[];
  leaseRentDocuments?: import('@/types/municipal-asset/detail-tabs.types').AssetDocumentListItem[];
  assetPhotosAndPlans?: import('@/types/municipal-asset/detail-tabs.types').AssetDocumentListItem[];
  applicationTypes?: ApplicationTypeItem[];
  selectedRegistration?: LeaseRentRecord | null;
  verificationDrawerId?: number | null;
  selectedVerification?: AssetLeaseRentDetailsListItem | null;
  approvalDrawerId?: number | null;
  selectedApproval?: AssetLeaseRentDetailsListItem | null;
  rejectDrawerId?: number | null;
  selectedRejection?: AssetLeaseRentDetailsListItem | null;
  revertDrawerId?: number | null;
  selectedRevert?: AssetLeaseRentDetailsListItem | null;
  categoryOptions?: FilterOption[];
  zoneOptions?: FilterOption[];
  wardOptions?: FilterOption[];
  assetOptions?: FilterOption[];
}

export type FormState = {
  applicationType: string;
  tenantName: string;
  mobileNumber: string;
  emailAddress: string;
  tenantType: string;
  aadhaarNumber: string;
  panNumber: string;
  pinCode: string;
  residentialAddress: string;
  shopNo: string;
  shopName: string;
  leaseType: string;
  leaseStartDate: string;
  leaseEndDate: string;
  monthlyRent: string;
  securityDeposit: string;
  paymentFrequency: string;
  existingTenantName: string;
  oldLeaseStartDate: string;
  oldLeaseEndDate: string;
  renewalStartDate: string;
  renewalEndDate: string;
  previousRent: string;
  revisedRent: string;
  reasonForRenewal: string;
  newTenantDetails: string;
  newTenantMobile: string;
  relationship: string;
  nocFromExistingTenant: string;
  reasonForTransfer: string;
  vacatingDate: string;
  reasonForTermination: string;
  pendingDues: string;
  securityDepositRefund: string;
  finalInspectionReport: string;
  remarksDescription: string;
};

export interface FieldDef {
  key: keyof FormState;
  label: string;
  icon: LucideIcon;
  type: 'text' | 'date' | 'select' | 'textarea' | 'number';
  placeholder?: string;
  options?: string[];
  colSpan?: 1 | 2;
  required?: boolean;
}

export interface TemplateDef {
  title: string;
  submitLabel: string;
  submitIcon: LucideIcon;
  fields: FieldDef[];
  secondaryButtons?: Array<{ label: string; icon: LucideIcon; variant: 'primary' | 'secondary' | 'success' | 'delete' | 'danger' }>;
}

export interface NewLeaseRegistrationModalProps {
  asset: AssetMasterDetails;
  record?: LeaseRentRecord | null;
  documents?: import('@/types/municipal-asset/detail-tabs.types').AssetDocumentListItem[];
  assetPhotosAndPlans?: import('@/types/municipal-asset/detail-tabs.types').AssetDocumentListItem[];
  applicationTypes?: ApplicationTypeItem[];
  onClose: () => void;
}
