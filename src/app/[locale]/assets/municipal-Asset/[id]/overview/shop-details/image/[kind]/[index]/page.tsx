import { AssetDetailView } from '@/components/modules/assets/municipal-Asset/asset-Detail-View/AssetDetailView';

interface PageProps {
  params: Promise<{
    id: string;
    kind: string;
    index: string;
    locale: string;
  }>;
}

export default async function MunicipalAssetShopDetailsImagePage({ params }: PageProps) {
  const { id } = await params;

  return <AssetDetailView assetId={id} />;
}
