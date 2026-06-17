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
      className="h-8 w-8 border border-white/15 bg-transparent px-0 text-white hover:bg-white/10"
    >
      <ArrowLeft className="h-4 w-4" />
    </Button>
  );
}
