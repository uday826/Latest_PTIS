'use client';

import ErrorPage from '@/components/common/ErrorPage';

export default function AssetCategoryError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <ErrorPage 
      error={error} 
      reset={reset} 
      translationNamespace="asset.configuration.masterData.error" 
    />
  );
}
