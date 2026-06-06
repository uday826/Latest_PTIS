export interface LeaseRentRecord extends Record<string, unknown> {
  id: string;
  assetId: string;
  assetMasterId?: number;
  assetName?: string;
  assetNo?: string;
  shopNo: string;
  floor: string;
  shopName: string;
  tenantName: string;
  leaseType: string;
  rentStatus: 'In use' | 'Vacant' | 'Pending';
  rentAmount: number;
  category?: string;
  zone?: string;
  ward?: string;
  submittedDate?: string;
}
