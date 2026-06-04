import { redirect } from 'next/navigation';

interface DetailsPageProps {
  params: Promise<{ locale: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function PaymentDetailsRedirectPage({ params, searchParams }: DetailsPageProps) {
  const { locale } = await params;
  const query = await searchParams;
  const srNo = typeof query.srNo === 'string' ? query.srNo : null;
  const next = new URLSearchParams();

  Object.entries(query).forEach(([key, value]) => {
    if (key === 'srNo') return;
    if (typeof value === 'string' && value) next.set(key, value);
    if (Array.isArray(value)) {
      value.forEach((entry) => {
        if (entry) next.append(key, entry);
      });
    }
  });

  const queryString = next.toString();

  if (srNo) {
    redirect(queryString ? `/${locale}/assets/revenue/payment/details/${srNo}/make-payment?${queryString}` : `/${locale}/assets/revenue/payment/details/${srNo}/make-payment`);
  }

  redirect(`/${locale}/assets/revenue/payment`);
}
