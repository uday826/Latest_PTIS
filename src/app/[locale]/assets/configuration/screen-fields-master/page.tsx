import { ScreenFieldsMaster } from '@/components/modules/assets/configuration/screen-fields-master/ScreenFieldsMaster';
import type { Metadata } from 'next';
import { 
  getAssetCategoriesAction, 
  getAssetTypesAction, 
  getFieldDefinitionsAction 
} from './action';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Screen Field Master | NTIS Configuration',
    description: 'Centralized Asset Field Configurations',
  };
}

export const dynamic = 'force-dynamic';
export const revalidate = 0;

interface PageProps {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

function sanitizeNumber(val: unknown, fallback = null): number | null {
  const num = parseInt(String(val));
  return isNaN(num) ? fallback : num;
}

export default async function ScreenFieldsMasterPage({ searchParams }: PageProps): Promise<React.ReactElement> {
  const params = await searchParams;
  
  const categoryId = sanitizeNumber(params.categoryId);
  const typeId = sanitizeNumber(params.typeId);
  const viewAll = params.viewAll === 'true';

  // 1. Fetch all categories
  const categoriesRes = await getAssetCategoriesAction(1, 1000);

  // 2. Fetch types (all types if viewAll is active, otherwise only for categoryId)
  const typesRes = viewAll
    ? await getAssetTypesAction(1, 1000, null)
    : (categoryId
      ? await getAssetTypesAction(1, 1000, categoryId)
      : { success: true, items: [], totalCount: 0 });

  // 3. Fetch field definitions (all field definitions if viewAll is active, otherwise for selected category & type)
  const fieldsRes = viewAll
    ? await getFieldDefinitionsAction(undefined, undefined, 1, 1000)
    : ((categoryId && typeId)
      ? await getFieldDefinitionsAction(categoryId, typeId, 1, 1000)
      : { success: true, items: [], totalCount: 0 });

  const initialData = {
    categoryId: viewAll ? null : categoryId,
    typeId: viewAll ? null : typeId,
    viewAll,
    categoriesResult: {
      items: (categoriesRes.success && 'items' in categoriesRes ? categoriesRes.items : []) as any[],
      totalCount: (categoriesRes.success && 'totalCount' in categoriesRes ? categoriesRes.totalCount : 0) as number,
    },
    typesResult: {
      items: (typesRes.success && 'items' in typesRes ? typesRes.items : []) as any[],
      totalCount: (typesRes.success && 'totalCount' in typesRes ? typesRes.totalCount : 0) as number,
    },
    fieldsResult: {
      items: (fieldsRes.success && 'items' in fieldsRes ? fieldsRes.items : []) as any[],
      totalCount: (fieldsRes.success && 'totalCount' in fieldsRes ? fieldsRes.totalCount : 0) as number,
    },
  };

  return (
    <ScreenFieldsMaster initialData={initialData} />
  );
}
