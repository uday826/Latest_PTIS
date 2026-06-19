'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/common';

export function AssetRegisterBackButton() {
  const router = useRouter();
  
  return (
    <Button
      type="button"
      aria-label="Go back"
      onClick={() => router.back()}
      variant="ghost"
      size="sm"
    >
      <ArrowLeft className="h-5 w-5" />
    </Button>
  );
}
