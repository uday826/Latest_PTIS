export interface AssetLeaseRentDetailsListItem {
  parentAssetId?: number | null;
  assetId: number;
  assetNo?: string | null;
  assetName?: string | null;
  category?: string | null;
  assetCategory?: string | null;
  assetCategoryName?: string | null;
  zone?: string | null;
  wardNo?: string | null;
  floorDetailsId?: number | null;
  roomWiseSubmissionDetailsId?: number | null;
  floorId?: number | null;
  floorDescription?: string | null;
  shopNo?: string | null;
  shopName?: string | null;
  tenantName?: string | null;
  tenantMobile?: string | null;
  tenantEmail?: string | null;
  tenantType?: string | null;
  tenantAadhaarNo?: string | null;
  tenantPanCardNo?: string | null;
  tenantAddress?: string | null;
  gstNo?: string | null;
  previousTenantName?: string | null;
  previousTenantMobile?: string | null;
  totalAreaSqFt?: number | null;
  applicationTypeId?: number | null;
  applicationTypeName?: string | null;
  leaseType?: string | null;
  leaseRentType?: string | null;
  oldLeaseStartDate?: string | null;
  oldLeaseEndDate?: string | null;
  leaseStartDate?: string | null;
  leaseEndDate?: string | null;
  terminationDate?: string | null;
  duration?: number | null;
  previousMonthlyRent?: number | null;
  monthlyRent?: number | null;
  rentAmount?: number | null;
  securityDeposit?: number | null;
  depositType?: string | null;
  paymentFrequency?: string | null;
  agreementId?: string | null;
  incrementFrequency?: string | null;
  incrementType?: string | null;
  incrementValue?: number | null;
  incrementMethod?: string | null;
  durationFrom?: string | null;
  durationTo?: string | null;
  increment?: string | null;
  incrementStatus?: boolean | null;
  rentMonthly?: number | null;
  reason?: string | null;
  workflowStatus?: string | null;
  rejectionReason?: string | null;
  isRejection?: boolean;
  rejectionBy?: number | null;
  rejectionDate?: string | null;
  isVerified?: boolean;
  verifiedBy?: number | null;
  verifiedDate?: string | null;
  isApproved?: boolean;
  approvedBy?: number | null;
  approvedDate?: string | null;
  rentStatus?: string | null;
  paymentStatus?: string | null;
  leaseDurationDisplay?: string | null;
  rentAmountDisplay?: string | null;
  remarks?: string | null;
  id: number;
  isActive?: boolean;
  createdDate?: string | null;
  updatedDate?: string | null;
}

export interface AssetLeaseRentDetailsListParams {
  pageNumber?: number;
  pageSize?: number;
  searchTerm?: string;
  workflowStatus?: string;
  paymentStatus?: string;
  assetCategoryId?: number;
  assetTypeId?: number;
  zoneId?: number;
  wardId?: number;
  assetId?: number;
  fromDate?: string;
  toDate?: string;
  isActive?: boolean;
}

export interface AssetLeaseRentDetailsUpdatePayload extends Partial<Omit<AssetLeaseRentDetailsListItem, 'id'>> {
  id: number;
}

export interface AssetLeaseRentDetailsMutationResponse {
  success: boolean;
  message: string;
  items: AssetLeaseRentDetailsListItem | null;
  errors: string[] | null;
  correlationId: string | null;
}

export interface LeaseRentRegistrationStats {
  totalApproved: number;
  totalVerified: number;
  verificationPending: number;
  approvalPending: number;
  totalRejected: number;
}

export interface LeaseRentRegistrationListItem {
  assetId: number;
  assetName?: string | null;
  assetNo?: string | null;
  category?: string | null;
  zone?: string | null;
  wardNo?: string | null;
  shopNo?: string | null;
  floor?: string | null;
  shopName?: string | null;
  tenantName?: string | null;
  tenantMobile?: string | null;
  tenantEmail?: string | null;
  tenantType?: string | null;
  tenantAadhaarNo?: string | null;
  tenantPanCardNo?: string | null;
  tenantAddress?: string | null;
  previousTenantName?: string | null;
  previousTenantMobile?: string | null;
  applicationType?: string | null;
  leaseType?: string | null;
  oldLeaseStartDate?: string | null;
  oldLeaseEndDate?: string | null;
  leaseStartDate?: string | null;
  leaseEndDate?: string | null;
  terminationDate?: string | null;
  previousMonthlyRent?: number | null;
  monthlyRent?: number | null;
  yearlyRent?: number | null;
  securityDeposit?: number | null;
  paymentFrequency?: string | null;
  reason?: string | null;
  workflowStatus?: string | null;
  rejectionReason?: string | null;
  rentStatus?: string | null;
  id: number;
  isActive?: boolean;
  createdDate?: string | null;
  updatedDate?: string | null;
}

export interface LeaseRentRegistrationListParams {
  pageNumber?: number;
  pageSize?: number;
  searchTerm?: string;
  workflowStatus?: string;
  assetCategoryId?: number;
  zoneId?: number;
  wardId?: number;
  assetId?: number;
}

export interface CreateLeaseRentRegistrationPayload {
  isActive: boolean;
  createdBy: number;
  assetId: number;
  shopNo?: string | null;
  floorId?: number | null;
  shopName?: string | null;
  tenantName: string;
  tenantMobile?: string | null;
  tenantEmail?: string | null;
  tenantType?: string | null;
  tenantAadhaarNo?: string | null;
  tenantPanCardNo?: string | null;
  tenantAddress?: string | null;
  previousTenantName?: string | null;
  previousTenantMobile?: string | null;
  applicationTypeId: number;
  leaseType?: string | null;
  oldLeaseStartDate?: string | null;
  oldLeaseEndDate?: string | null;
  leaseStartDate?: string | null;
  leaseEndDate?: string | null;
  terminationDate?: string | null;
  previousMonthlyRent?: number | null;
  monthlyRent?: number | null;
  securityDeposit?: number | null;
  paymentFrequency?: string | null;
  reason?: string | null;
}

export interface CreateLeaseRentRegistrationResponse {
  success: boolean;
  message: string;
  items: LeaseRentRegistrationListItem | null;
  errors: string[] | null;
  correlationId: string | null;
}

export interface ActionResponse {
  success: boolean;
  message: string;
  items: LeaseRentRegistrationListItem | null;
  errors: string[] | null;
  correlationId: string | null;
}

export interface PreviousTenantHistoryItem {
  id: number;
  actionType: string;
  actionLabel: string;
  performedDate: string;
  fromStatus: string;
  toStatus: string;
  remarks: string | null;
  tenantName: string;
  tenantMobile: string;
  tenantEmail: string | null;
  tenantType: string;
  tenantAadhaarNo: string;
  tenantPanCardNo: string;
  tenantAddress: string;
  previousTenantName: string | null;
  previousTenantMobile: string | null;
  leaseType: string;
  shopNo: string;
  floor: string | null;
  shopName: string;
  oldLeaseStartDate: string | null;
  oldLeaseEndDate: string | null;
  leaseStartDate: string;
  leaseEndDate: string;
  terminationDate: string | null;
  previousMonthlyRent: number | null;
  monthlyRent: number;
  securityDeposit: number;
  paymentFrequency: string;
  workflowStatus: string;
  rentStatus: string;
  duration?: number | null;
}

export interface CreateAssetLeaseRentDetailsPayload extends Partial<Omit<AssetLeaseRentDetailsListItem, 'id'>> {
  isActive: boolean;
  createdBy: number;
  assetId: number;
  applicationTypeId: number;
  tenantName: string;
}

