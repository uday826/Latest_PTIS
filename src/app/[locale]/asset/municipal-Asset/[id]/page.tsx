import { redirect } from 'next/navigation';

interface PageProps {
  params: Promise<{
    id: string;
    locale: string;
  }>;
}

export default async function MunicipalAssetDetailPage({ params }: PageProps) {
  const { id, locale } = await params;

  redirect(`/${locale}/asset/municipal-Asset/${id}/overview`);
}
