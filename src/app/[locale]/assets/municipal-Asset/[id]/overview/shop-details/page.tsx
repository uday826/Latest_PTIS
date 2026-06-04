import { AssetDetailView } from '@/components/modules/assets/municipal-Asset/asset-Detail-View/AssetDetailView';

interface PageProps {
  params: Promise<{
    id: string;
    locale: string;
  }>;
}

export default async function MunicipalAssetShopDetailsPage({ params }: PageProps) {
  const { id } = await params;

  return <AssetDetailView assetId={id} />;
}
