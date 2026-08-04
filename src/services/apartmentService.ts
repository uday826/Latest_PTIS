import { apiConfig, apiRequest } from '@/api/apiClient';
import { SocietyDetails, WingDetailsDTO, ComparisonRowDTO, AddWingPayload } from '@/types/apartment';
import { initialWings, comparisonRows } from '@/components/modules/Apartment_design/mockData';

// Local Mock Database for society details
const mockSocietyDetails: SocietyDetails = {
  name: 'Royal Palms CHS Ltd.',
  registrationNumber: 'MUM/CHS/4429/2021',
  reraRegistration: 'P51800029310',
  totalTaxAssessmentId: 'BLDG-ROYAL-PALMS-992',
  auditStatus: 'Compliant (Last audited May 2025)',
  chairman: 'Mr. Prakash R. Deshmukh',
  chairmanContact: '+91 98201 22390',
  secretary: 'Mrs. Ananya Sen',
  secretaryContact: '+91 99304 88102',
  treasurer: 'Mr. Rajesh Nair',
  treasurerContact: '+91 98112 04958',
  officeAddress: 'Ground Floor, A Wing Clubhouse Lobby',
  emailContact: 'royalpalms.chs@outlook.com'
};

export const apartmentService = {
  async getSocietyDetails(apartmentId: string): Promise<SocietyDetails> {
    if (apiConfig.useMock) {
      return Promise.resolve(mockSocietyDetails);
    }
    return apiRequest<SocietyDetails>(`/apartments/${apartmentId}`);
  },

  async getWingsList(apartmentId: string): Promise<WingDetailsDTO[]> {
    if (apiConfig.useMock) {
      // Cast the mock initialWings to match WingDetailsDTO signature
      return Promise.resolve(initialWings as unknown as WingDetailsDTO[]);
    }
    return apiRequest<WingDetailsDTO[]>(`/apartments/${apartmentId}/wings`);
  },

  async getComparisonRows(wingId: string): Promise<ComparisonRowDTO[]> {
    if (apiConfig.useMock) {
      return Promise.resolve(comparisonRows as ComparisonRowDTO[]);
    }
    return apiRequest<ComparisonRowDTO[]>(`/wings/${wingId}/comparison`);
  },

  async addWing(apartmentId: string, payload: AddWingPayload): Promise<WingDetailsDTO> {
    if (apiConfig.useMock) {
      const newWing: WingDetailsDTO = {
        id: payload.wingName.toLowerCase().replace(/\s+/g, '-'),
        grade: 'A',
        wing: payload.wingName,
        name: payload.blockName,
        floors: `G + ${payload.floorsCount}`,
        units: payload.unitsCount.toString(),
        res: payload.primaryUse === 'Residential' ? payload.unitsCount.toString() : '0',
        com: payload.primaryUse === 'Commercial' ? payload.unitsCount.toString() : '0',
        amen: '0',
        newDem: '₹0',
        retroDem: '₹0',
        discount: '0%',
        discLabel: 'None',
        exemp: '0%',
        exempLabel: 'None',
        rvImpact: '₹0',
        rvLabel: 'None',
        themeColor: 'text-green-700',
        gradeBorderColor: 'border-green-200',
        badgeBgColor: 'bg-green-50',
        collection: '₹0',
        outstanding: '₹0',
        additionalRevenue: '₹0',
        collectionPct: '0%',
        mods: { matched: '0', missing: '0', newCount: '0', modified: '0' }
      };
      return Promise.resolve(newWing);
    }
    return apiRequest<WingDetailsDTO>(`/apartments/${apartmentId}/wings`, {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  }
};
