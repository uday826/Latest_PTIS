import { redirect } from 'next/navigation';

interface PageProps {
  params: Promise<{
    locale: string;
  }>;
}

export default async function Page({ params }: PageProps) {
  const { locale } = await params;
  redirect(`/${locale}/assets/municipal-Asset/asset-register/2`);
}
