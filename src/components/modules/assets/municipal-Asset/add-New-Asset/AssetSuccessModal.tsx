"use client";

import { useEffect } from "react";

interface SuccessModalProps {
  assetName: string;
  assetCode: string;
  onGoToDashboard: () => void;
}

export default function AssetSuccessModal({ assetName, assetCode, onGoToDashboard }: SuccessModalProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onGoToDashboard();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onGoToDashboard]);
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md transition-all duration-500">
      {/* Custom Styles Injector for premium micro-animations */}
      <style>{`
        @keyframes scaleIn {
          0% { transform: scale(0.9) translateY(20px); opacity: 0; }
          100% { transform: scale(1) translateY(0); opacity: 1; }
        }
        @keyframes drawCheck {
          0% { stroke-dashoffset: 48; }
          100% { stroke-dashoffset: 0; }
        }
        @keyframes pulseRing {
          0% { transform: scale(0.95); opacity: 0.5; }
          50% { transform: scale(1.15); opacity: 0.2; }
          100% { transform: scale(1.3); opacity: 0; }
        }
        @keyframes confettiFloat {
          0% { transform: translateY(0) rotate(0deg); opacity: 1; }
          100% { transform: translateY(-100px) rotate(360deg); opacity: 0; }
        }
        .animate-modal-card {
          animation: scaleIn 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }
        .animate-check {
          stroke-dasharray: 48;
          stroke-dashoffset: 48;
          animation: drawCheck 0.6s cubic-bezier(0.65, 0, 0.45, 1) 0.3s forwards;
        }
        .ring-pulse-1 {
          animation: pulseRing 2s cubic-bezier(0.25, 0, 0, 1) infinite;
        }
        .ring-pulse-2 {
          animation: pulseRing 2s cubic-bezier(0.25, 0, 0, 1) 0.6s infinite;
        }
      `}</style>

      {/* Stunning Animated Card */}
      <div className="animate-modal-card relative bg-white/95 border border-emerald-100 rounded-3xl shadow-2xl p-8 max-w-md w-full overflow-hidden text-center backdrop-blur-xl">
        {/* Floating background decorative details */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-1 bg-gradient-to-r from-teal-400 via-emerald-500 to-green-400 rounded-b-full shadow-lg" />
        <div className="absolute -top-10 -right-10 size-32 bg-emerald-100/30 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 size-32 bg-teal-100/30 rounded-full blur-2xl pointer-events-none" />

        {/* Premium Confetti Sparkles / Floating particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-40">
          <div className="absolute bottom-10 left-[15%] size-2.5 bg-yellow-400 rounded-sm" style={{ animation: 'confettiFloat 3s ease-out infinite' }} />
          <div className="absolute bottom-16 right-[20%] size-2 bg-pink-400 rounded-full" style={{ animation: 'confettiFloat 3.8s ease-out 0.5s infinite' }} />
          <div className="absolute bottom-8 left-[45%] size-3 bg-blue-400 rotate-45" style={{ animation: 'confettiFloat 4.2s ease-out 1s infinite' }} />
          <div className="absolute bottom-12 right-[40%] size-2 bg-emerald-400 rounded-sm" style={{ animation: 'confettiFloat 3.5s ease-out 0.2s infinite' }} />
        </div>

        {/* Stunning Animated Success Header (Floating circular badge) */}
        <div className="flex justify-center mb-6">
          <div className="relative flex items-center justify-center size-24">
            <div className="ring-pulse-1 absolute inset-0 rounded-full bg-emerald-500/20" />
            <div className="ring-pulse-2 absolute inset-0 rounded-full bg-teal-500/20" />
            <div className="relative size-20 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center shadow-lg border border-emerald-300">
              <svg className="size-11 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <polyline className="animate-check" points="20 6 9 17 4 12" />
              </svg>
            </div>
          </div>
        </div>

        {/* Title */}
        <h2 className="text-2xl font-black text-slate-800 tracking-tight mb-2 bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
          Asset Activated Successfully!
        </h2>
        <p className="text-xs text-slate-500 font-extrabold uppercase tracking-widest mb-6">
          The asset is now live and queryable
        </p>

        {/* Premium Informational Cards */}
        <div className="space-y-3 mb-8">
          <div className="bg-gradient-to-r from-slate-50 to-slate-100/50 rounded-2xl border border-slate-100 p-4 transition-all duration-300 hover:border-slate-200">
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-left">Asset Title</span>
              <span className="text-base font-extrabold text-slate-800 text-left truncate">{assetName || "Untitled Asset"}</span>
            </div>
          </div>

          <div className="bg-gradient-to-r from-slate-50 to-slate-100/50 rounded-2xl border border-slate-100 p-4 transition-all duration-300 hover:border-slate-200">
            <div className="flex items-center justify-between">
              <div className="flex flex-col gap-0.5">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-left">Generated Asset Code</span>
                <span className="text-sm font-mono font-black text-blue-700 tracking-wider mt-0.5 uppercase bg-blue-50/50 px-2.5 py-1 rounded-lg border border-blue-100">{assetCode || "PENDING"}</span>
              </div>
              <div className="flex items-center gap-1 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-100 text-emerald-700">
                <span className="relative flex size-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span className="text-[10px] font-black uppercase tracking-wider">Active</span>
              </div>
            </div>
          </div>
        </div>

        {/* CTA (Beautiful Gradient Hover Button) */}
        <button
          type="button"
          onClick={onGoToDashboard}
          className="w-full relative group rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-700 hover:to-teal-600 active:scale-[0.98] text-white text-xs font-black uppercase tracking-widest py-4 transition-all shadow-md hover:shadow-xl hover:shadow-emerald-500/10 cursor-pointer overflow-hidden"
        >
          <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out" />
          Go to Dashboard
        </button>
      </div>
    </div>
  );
}
