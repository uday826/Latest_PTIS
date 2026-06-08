'use client';

import ErrorPage from '@/components/common/ErrorPage';

/**
 * Error boundary component for the Configuration Master module.
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
