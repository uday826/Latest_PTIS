'use client';

import { ErrorPage } from '@/components/common/ErrorPage';

/**
 * Error boundary for furniture & fixtures inventory page.
 * Catches and displays errors that occur during inventory operations.
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
    />
  );
}
