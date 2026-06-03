export interface PaymentRecord {
  srNo: number;
  zone: string;
  ward: string;
  assetId: string;
  complexName: string;
  shopPlotNo: string;
  assetName: string;
  tenantName: string;
  mobileNo: string;
  leaseRentType: string;
  rentDueAmount: number;
  status: 'unpaid' | 'paid';
}
