"use client";

/**
 * Floor Details & Media — Error Boundary
 * Caught and rendered by Next.js when the floor-details segment throws.
 */
import { AlertTriangle, RefreshCw } from "lucide-react";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function FloorDetailsError({ error, reset }: ErrorProps) {
  return (
    <div className="flex items-center justify-center min-h-[320px]">
      <div className="bg-white border border-red-200 rounded-2xl shadow-sm p-8 max-w-md w-full text-center space-y-4">
        <div className="flex justify-center">
          <div className="bg-red-50 p-3 rounded-full">
            <AlertTriangle className="size-7 text-red-500" />
          </div>
        </div>
        <div className="space-y-1">
          <h2 className="text-sm font-black text-slate-800 uppercase tracking-wider">
            Floor Details Error
          </h2>
          <p className="text-[11px] text-slate-500 font-medium">
            {error.message || "An unexpected error occurred while loading floor details."}
          </p>
          {error.digest && (
            <p className="text-[9px] font-mono text-slate-400 mt-1">
              Error ID: {error.digest}
            </p>
          )}
        </div>
        <button
          type="button"
          onClick={reset}
          className="inline-flex items-center gap-2 px-4 py-2 bg-[#0f172a] hover:bg-slate-800 text-white rounded-xl text-[10px] font-black uppercase tracking-wider transition-all shadow-sm cursor-pointer"
        >
          <RefreshCw className="size-3.5" />
          Try Again
        </button>
      </div>
    </div>
  );
}
