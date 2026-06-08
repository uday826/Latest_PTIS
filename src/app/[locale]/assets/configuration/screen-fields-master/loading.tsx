'use client';

import LoadingPage from '@/components/common/LoadingPage';

/**
 * Loading component for the Screen Fields Master module.
 * Provides a localized loading experience within the configuration master.
 */
export default function Loading() {
  return (
    <LoadingPage 
      translationNamespace="common.loading" 
    />
  );
}
