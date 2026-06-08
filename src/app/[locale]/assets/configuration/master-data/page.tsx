import { redirect } from 'next/navigation';

export default async function MasterDataRootPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  redirect(`/${locale}/assets/configuration/master-data/asset-type`);
}
