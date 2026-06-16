import { apiClient } from "@/services/api.service";
import { ApiResponse } from "@/types/common.types";

export interface Department {
  id: number;
  departmentName: string;
  departmentCode?: string;
  imageUrl?: string;
  logo?: string;
  logoUrl?: string;
  icon?: string;
  image?: string;
  isActive?: boolean;
}

/**
 * Service for fetching Department master data
 */
export const departmentService = {
  /**
   * Get all active Departments
   */
  getDepartments: async (): Promise<ApiResponse<Department[]>> => {
    const response = await apiClient.get<any>("/OwningDepartment?pageSize=-1", { cacheStrategy: 300 });
    if (response.success) {
      const items = Array.isArray(response.data)
        ? response.data
        : (response.data?.items || response.data?.Items || response.data?.data || []);
      const normalized = items
        .filter((item: any) => 
          item.isActive !== false && item.isActive !== 0 && 
          item.IsActive !== false && item.IsActive !== 0 && 
          item.status?.toLowerCase() !== 'inactive'
        )
        .map((item: any) => {
          const departmentName = item.owningDepartmentName || item.departmentName || `Department ${item.id}`;
          const imageUrl = item.departmentIcon || item.imageUrl || item.logo || item.logoUrl || item.icon || item.image || item.deptImage || item.deptLogo || "";
          return {
            ...item,
            departmentName,
            imageUrl
          };
        });
      return { ...response, data: normalized };
    }
    return response;
  },
};
