'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/common';

interface RevenueHeaderProps {
  title: string;
  subtitle: string;
}

export function RevenueHeader({ title, subtitle }: RevenueHeaderProps) {
  const router = useRouter();

  return (
    <div className="flex items-center gap-3">
      <Button
        type="button"
        aria-label="Go back"
        onClick={() => router.back()}
        variant="ghost"
        size="sm"
        className="h-8 w-8 px-0 text-slate-600 hover:bg-slate-100 rounded-lg flex items-center justify-center border border-slate-200 bg-white shadow-sm transition-all hover:scale-105"
      >
        <ArrowLeft className="h-4 w-4" />
      </Button>
      <div className="h-8 w-px bg-slate-200" />
      <div className="flex flex-col">
        <h1 className="text-base font-semibold tracking-tight text-slate-900 leading-tight">
          {title}
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          {subtitle}
        </p>
      </div>
    </div>
  );
}
