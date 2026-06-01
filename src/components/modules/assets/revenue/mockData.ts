export interface LeaseRentRecord {
  id: string;
  assetId: string;
  shopNo: string;
  floor: string;
  shopName: string;
  tenantName: string;
  leaseType: string;
  rentStatus: 'In use' | 'Vacant' | 'Pending';
  rentAmount: number;
}

export const mockLeaseRecords: LeaseRentRecord[] = [
  {
    id: '1',
    assetId: 'MPMS-AS-9',
    shopNo: '5',
    floor: 'Ground Floor',
    shopName: 'अक्कल बहुगुद्घास केंद्र',
    tenantName: 'कानाव्हा पिल्क्यो शाही',
    leaseType: 'Rent (729 days)',
    rentStatus: 'In use',
    rentAmount: 7986,
  },
  {
    id: '2',
    assetId: 'MPMS-AS-10',
    shopNo: '6',
    floor: 'Ground Floor',
    shopName: 'अक्कल बहुगुद्घास महाजन केंद्र',
    tenantName: 'कानाव्हा पिल्क्यो शाही',
    leaseType: 'Rent (729 days)',
    rentStatus: 'In use',
    rentAmount: 7986,
  },
  {
    id: '3',
    assetId: 'MPMS-AS-15',
    shopNo: '11',
    floor: 'First Floor',
    shopName: 'संकेत येथे निकोस शिंदे',
    tenantName: 'श्री शोभाकाजलवार',
    leaseType: 'Rent (729 days)',
    rentStatus: 'In use',
    rentAmount: 5553,
  },
  {
    id: '4',
    assetId: 'MPMS AS 16',
    shopNo: '4',
    floor: 'Ground Floor',
    shopName: 'मुकुंध क्षिटीज़ तांबे केंद्र',
    tenantName: 'मारालालामे',
    leaseType: 'Rent (729 days)',
    rentStatus: 'In use',
    rentAmount: 7986,
  },
  {
    id: '5',
    assetId: 'MPMS-AS-18',
    shopNo: '2',
    floor: '-',
    shopName: 'प्रशांत वास्तू पुरवठा नवसाळी',
    tenantName: 'श्री ब्रजेश शाह रेंटर',
    leaseType: 'Rent (729 days)',
    rentStatus: 'In use',
    rentAmount: 5391,
  },
];
