"use server";

import { floorDetailsService } from "@/lib/api/asset/floor-details.service";
import { departmentService } from "@/lib/api/asset/department.service";

export async function fetchSubUnitDropdowns() {
  try {
    const [optsRes, deptRes] = await Promise.all([
      floorDetailsService.getFloorDropdownOptions(),
      departmentService.getDepartments(),
    ]);

    const opts = optsRes.success && optsRes.data ? optsRes.data : {
      floorLevels: [],
      constructionTypes: [],
      useTypes: [],
    };

    const departments = deptRes.success && Array.isArray(deptRes.data)
      ? deptRes.data.map((d: any) => ({
          label: d.departmentName || d.owningDepartmentName || `Dept ${d.id}`,
          value: String(d.id),
        }))
      : [];

    return {
      success: true,
      data: {
        floorLevels: opts.floorLevels,
        constructionTypes: opts.constructionTypes,
        useTypes: opts.useTypes,
        departments,
      }
    };
  } catch (error) {
    return { success: false, data: null };
  }
}
