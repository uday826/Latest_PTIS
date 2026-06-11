import { fetchMunicipalAssetDashboardStats, fetchCategories, fetchAllTypes } from '@/app/[locale]/assets/municipal-Asset/actions';
import MunicipalAssetDashboard from '@/components/modules/assets/municipal-Asset/MunicipalAssetDashboard';

export default async function MunicipalAssetPage() {
  const [initialStats, categoriesRes, typesRes] = await Promise.all([
    fetchMunicipalAssetDashboardStats(),
    fetchCategories(),
    fetchAllTypes(),
  ]);

  return (
    <div className="flex h-[calc(100vh-140px)] overflow-hidden">
      <div className="flex-1 p-2 bg-slate-50/50 overflow-y-auto custom-scrollbar">
        <div className="mx-auto w-full max-w-[99%]">
          <MunicipalAssetDashboard
            initialStats={initialStats}
            initialCategories={categoriesRes.success ? categoriesRes.data : null}
            initialTypes={typesRes.success ? typesRes.data : null}
          />
        </div>
      </div>
    </div>
  );
}
