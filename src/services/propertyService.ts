import { apiConfig, apiRequest } from '@/api/apiClient';
import { PropertyDetails, TimelineStage, AuditHistoryEvent, TaxComparison } from '@/types/property';

// Local Mock Database for fallback and testing
const mockPropertyDetails: PropertyDetails = {
  upic: 'UPIC-270465-2024-000123',
  ownerName: 'MATOSHREE BUILDERS PVT LTD',
  mobile: '+91 98765 43210',
  useType: 'Residential',
  carpetArea: 538.20,
  builtUpArea: 538.20,
  division: 'कोपरी',
  moujaName: 'Kopri',
  category: 'Individual',
  surveyNo: 'CSN005A',
  subZoneNo: '-',
  flatShopNo: '-',
  plotNo: '55',
  wing: '-',
  taxZone: '1 - KOLSHEET',
  plotArea: 4305.60,
  plotAreaUnit: 'ft',
  status: 'Active',
  propertyHolder: 'MATOSHREE BUILDERS',
  propertyDescription: 'निवासी'
};

const mockTimelineStages: TimelineStage[] = [
  { id: 'geo', label: 'Geo-Sequencing', status: 'completed', date: '15-Jan-2024', officer: 'Officer A. R. Sharma' },
  { id: 'survey', label: 'Survey', status: 'completed', date: '10-Feb-2024', officer: 'Inspector Rahul Verma' },
  { id: 'verification', label: 'Verification', status: 'completed', date: '20-Feb-2024', officer: 'Officer Deepali Patil' },
  { id: 'assessment', label: 'Assessment', status: 'completed', date: '01-Apr-2024', officer: 'Assessor K. G. Joshi' },
  { id: 'approval', label: 'Approval', status: 'completed', date: '20-Apr-2024', officer: 'Commissioner S. K. Mehta' },
  { id: 'collection', label: 'Collection', status: 'completed', date: '05-May-2024', officer: 'Collector Manoj Shinde' }
];

const mockTaxComparison: TaxComparison = {
  generalTax: 33480,
  educationTax: 6480,
  treeCess: 1080,
  waterCess: 2160,
  roadCess: 6480,
  fireCess: 1080,
  lightCess: 10800,
  waterBenefitCess: 18360,
  sewageCess: 15120,
  specialEduTax: 3240
};

export const propertyService = {
  async getPropertyDetails(propertyId: string): Promise<PropertyDetails> {
    if (apiConfig.useMock) {
      return Promise.resolve(mockPropertyDetails);
    }
    return apiRequest<PropertyDetails>(`/properties/${propertyId}`);
  },

  async getTimelineStages(propertyId: string): Promise<TimelineStage[]> {
    if (apiConfig.useMock) {
      return Promise.resolve(mockTimelineStages);
    }
    return apiRequest<TimelineStage[]>(`/properties/${propertyId}/timeline`);
  },

  async getTaxComparison(propertyId: string): Promise<TaxComparison> {
    if (apiConfig.useMock) {
      return Promise.resolve(mockTaxComparison);
    }
    return apiRequest<TaxComparison>(`/properties/${propertyId}/taxes`);
  },

  async updatePropertyDetails(propertyId: string, data: Partial<PropertyDetails>): Promise<PropertyDetails> {
    if (apiConfig.useMock) {
      const updated = { ...mockPropertyDetails, ...data };
      return Promise.resolve(updated);
    }
    return apiRequest<PropertyDetails>(`/properties/${propertyId}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  }
};
