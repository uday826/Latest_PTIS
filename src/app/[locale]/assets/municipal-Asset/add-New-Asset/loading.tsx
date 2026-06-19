import React from 'react';
import { Loader2 } from 'lucide-react';

export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center w-full h-full min-h-[400px] bg-slate-50/30">
      <div className="flex flex-col items-center gap-3">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        <p className="text-sm font-semibold text-slate-500 tracking-wide uppercase">
          Loading step data...
        </p>
      </div>
    </div>
  );
}
