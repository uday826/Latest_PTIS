'use client';

import ErrorPage from '@/components/common/ErrorPage';

/**
 * Error boundary component for the Screen Fields Master module.
 * Provides a localized error experience within the configuration master.
 */
export default function Error({
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
      translationNamespace="common.error"
    />
  );
}
