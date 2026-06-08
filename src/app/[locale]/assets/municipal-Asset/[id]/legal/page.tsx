import { AssetDetailView } from '@/components/modules/assets/municipal-Asset/asset-Detail-View/AssetDetailView';
import { getMunicipalAssetByIdAction } from '../actions';

interface PageProps {
  params: Promise<{
    id: string;
    locale: string;
  }>;
}

export default async function MunicipalAssetLegalPage({ params }: PageProps) {
  // 1. Resolve params
  const { id } = await params;

  // 2. Fetch asset details
  const asset = await getMunicipalAssetByIdAction(id);

  // 3. Pass props to client component
  return (
    <AssetDetailView
      asset={asset}
      assetId={id}
    />
  );
}
