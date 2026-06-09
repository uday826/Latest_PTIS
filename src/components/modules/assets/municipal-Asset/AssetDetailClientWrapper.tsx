'use client';

import type { ReactNode } from 'react';

interface AssetDetailClientWrapperProps {
  children: ReactNode;
}

export function AssetDetailClientWrapper({ children }: AssetDetailClientWrapperProps) {
  return (
    <div className="flex h-[calc(100vh-140px)] overflow-hidden">
      <div className="flex-1 overflow-y-auto bg-slate-50/50 p-2 custom-scrollbar">
        <div className="mx-auto w-full max-w-[99%]">
          {children}
        </div>
      </div>
    </div>
  );
}
