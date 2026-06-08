import { redirect } from 'next/navigation';

export default async function AssetConfigurationMasterRootPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  redirect(`/${locale}/assets/configuration/screen-fields-master`);
}
