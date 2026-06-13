import 'server-only';
import { ApiResponse } from "@/types/common.types";
import { apiClient } from "@/services/api.service";

// ============ Types ============

export interface RentInformationDto {
  leaseRentType?: string;
  leaseStart?: string;
  leaseEnd?: string;
  duration?: string;
  rentFrequency?: string;
  rentAmount?: number;
  securityDeposit?: number;
  depositType?: string;
}

export interface FloorConfigurationDto {
  unitAreaSqFt?: number;
  calculatedCapitalValue?: number;
}

export interface RoomDetailDto {
  lengthMtr?: number;
  widthMtr?: number;
  heightMtr?: number;
  areaSqMtr?: number;
  base1Mtr?: number;
  base2Mtr?: number;
  noOfRooms?: number;
  totalAreaSqMtr?: number;
  roomNo?: string;
  roomType?: string;
  shape?: string;
  submissionType?: string;
  outerYesNo?: boolean;
  minusYesNo?: boolean;
}

export interface CreateSubUnitRequest {
  parentAssetId: number;
  assetId: number;
  complexName?: string;
  renterName?: string;
  propertyDescription?: string;
  shopUnitName?: string;
  zoneNo?: number;
  unitNo?: string;
  wardNo?: number;
  propertyNo?: string;
  partitionNo?: string;
  mobileNo?: string;
  surveyNo?: string;
  emailId?: string;
  gstNo?: string;
  totalAreaSqFt?: number;
  shopActNo?: string;
  aadhaarCardNo?: string;
  panCardNo?: string;
  createdBy?: number;
  rentInformation?: RentInformationDto;
  floorConfiguration?: FloorConfigurationDto;
  isRoomWiseValuationActive?: boolean;
  roomDetails?: RoomDetailDto[];
  // Department & Location
  departmentId?: number;
  locationAddress?: string;
  locationLat?: string;
  locationLng?: string;
}

export interface SubUnitResponseDto {
  id: number;
  parentAssetId: number;
  assetId: number;
  complexName?: string;
  shopUnitName?: string;
  unitNo?: string;
  totalAreaSqFt?: number;
  calculatedCapitalValue?: number;
  createdDate?: string;
}

// Bulk Generate Types
export interface BulkGenerateRequest {
  parentAssetId: number;
  floorDetailsId: number;
  type: string;
  prefix: string;
  startNumber: number;
  count: number;
  areaSqFt: number;
  createdBy?: number;
}

export interface GeneratedAssetDto {
  assetId: number;
  assetNo: string;
  assetName: string;
  roomWiseSubmissionDetailsId?: number;
}

export interface BulkGenerateResponse {
  totalGenerated: number;
  generatedAssets: GeneratedAssetDto[];
  errors: string[];
}

// ============ Unwrapping Helper ============
async function unwrapResponse<T>(res: ApiResponse<any>): Promise<ApiResponse<T>> {
  if (!res.success) {
    return {
      success: false,
      statusCode: res.statusCode,
      error: res.error || res.message,
      message: res.message || res.error,
    };
  }
  const body = res.data as any;
  return {
    success: true,
    statusCode: res.statusCode,
    data: body?.items ?? body?.data ?? (body as T),
    message: body?.message ?? res.message,
  };
}

// ============ Service ============

/**
 * ManageSubUnits API Service
 * Handles sub-unit (flat/shop) creation and management
 */
export const manageSubUnitsService = {
  /**
   * Bulk generate sub-units (flats, shops, etc.) under a parent asset
   * Creates assets in DB and returns their IDs
   */
  bulkGenerate: async (
    data: BulkGenerateRequest
  ): Promise<ApiResponse<BulkGenerateResponse>> => {
    const res = await apiClient.post('/ManageSubUnits/bulk-generate', data);
    return unwrapResponse<BulkGenerateResponse>(res);
  },

  /**
   * Create a new sub-unit (flat, shop, etc.)
   */
  create: async (
    data: CreateSubUnitRequest
  ): Promise<ApiResponse<SubUnitResponseDto>> => {
    const res = await apiClient.post('/ManageSubUnits/create', data);
    return unwrapResponse<SubUnitResponseDto>(res);
  },

  /**
   * Get all sub-units for an asset
   */
  getByAssetId: async (
    assetId: number
  ): Promise<ApiResponse<SubUnitResponseDto[]>> => {
    const res = await apiClient.get(`/ManageSubUnits/by-asset/${assetId}`);
    return unwrapResponse<SubUnitResponseDto[]>(res);
  },

  getById: async (
    id: number
  ): Promise<ApiResponse<any>> => {
    const res = await apiClient.get(`/ManageSubUnits/${id}`);
    if (!res.success) {
      return {
        success: false,
        statusCode: res.statusCode,
        error: res.error || res.message,
        message: res.message || res.error,
      };
    }
    // The backend wraps the response as:
    //   { success: true, message: '...', data: { id, roomDetails: [...], renterDetails: {...}, ... } }
    // We need to unwrap just the outer envelope to get the inner detail object.
    // Check for the API envelope wrapper by looking for a 'data' key that contains
    // any known sub-unit detail field (roomDetails, id, unitNo, assetId, etc.)
    const body = res.data as any;
    const targetPayload = body?.items ?? body?.data;
    const isEnvelope =
      body &&
      typeof body === 'object' &&
      !Array.isArray(body) &&
      targetPayload &&
      typeof targetPayload === 'object' &&
      !Array.isArray(targetPayload);

    const detail = isEnvelope ? targetPayload : body;
    return { success: true, statusCode: res.statusCode, data: detail };
  },

  /**
   * Update an existing sub-unit
   */
  update: async (
    id: number,
    data: Partial<CreateSubUnitRequest>
  ): Promise<ApiResponse<SubUnitResponseDto>> => {
    const res = await apiClient.put(`/ManageSubUnits/${id}`, data);
    return unwrapResponse<SubUnitResponseDto>(res);
  },

  /**
   * Delete a sub-unit
   */
  delete: async (
    id: number
  ): Promise<ApiResponse<void>> => {
    const res = await apiClient.delete(`/ManageSubUnits/${id}`);
    return unwrapResponse<void>(res);
  },
};

export default manageSubUnitsService;
