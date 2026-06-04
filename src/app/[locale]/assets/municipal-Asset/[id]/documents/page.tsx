import { AssetDetailView } from '@/components/modules/assets/municipal-Asset/asset-Detail-View/AssetDetailView';
import { sanitizeParams } from '@/lib/utils/asset-utils/sanitizeParams';
import { getMunicipalAssetByIdAction } from '../actions';

interface PageProps {
  params: Promise<{
    id: string;
    locale: string;
  }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

const ALLOWED_SORT_COLUMNS = ['shopNumber', 'shopName', 'floorName'] as const;
const MAX_PAGE_SIZE = 100;

export default async function MunicipalAssetDocumentsPage({ params, searchParams }: PageProps) {
  // 1. Resolve params
  const { id } = await params;

  // 2. Sanitize searchParams
  const sParams = await searchParams;
  const { pageNumber, pageSize, searchTerm, sortBy, sortOrder } = sanitizeParams(sParams, {
    allowedSortColumns: ALLOWED_SORT_COLUMNS,
    maxPageSize: MAX_PAGE_SIZE,
  });

  // 3. Fetch in parallel with Promise.all
  const [asset] = await Promise.all([
    getMunicipalAssetByIdAction(id),
  ]);

  // 4. Pass props to client component
  return (
    <AssetDetailView
      asset={asset}
      assetId={id}
    />
  );
}
