"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";

interface SuccessModalProps {
  assetName: string;
  assetCode: string;
  onGoToDashboard: () => void;
}

export default function AssetSuccessModal({ assetName, assetCode, onGoToDashboard }: SuccessModalProps) {
  const t = useTranslations("addAssetForm");

  useEffect(() => {
    const timer = setTimeout(() => {
      onGoToDashboard();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onGoToDashboard]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md transition-all duration-500 overflow-hidden">
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
        @keyframes emojiPop {
          0% { transform: scale(0); opacity: 0; }
          70% { transform: scale(1.3); opacity: 1; }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes emojiBob {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-10px) rotate(5deg); }
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
      <div className="animate-modal-card relative z-10 bg-white/95 border border-emerald-100 rounded-3xl shadow-2xl p-8 max-w-md w-full overflow-visible text-center backdrop-blur-xl">
        {/* Floating background decorative details */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-1 bg-gradient-to-r from-teal-400 via-emerald-500 to-green-400 rounded-b-full shadow-lg" />
        <div className="absolute -top-10 -right-10 size-32 bg-emerald-100/30 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 size-32 bg-teal-100/30 rounded-full blur-2xl pointer-events-none" />

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
            {/* Single happy smiley floating next to the checkmark */}
            <span className="absolute -top-2 -right-2 text-4xl select-none pointer-events-none" style={{ animation: 'emojiPop 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards, emojiBob 3s ease-in-out 0.5s infinite' }}>😊</span>
          </div>
        </div>

        {/* Title */}
        <h2 className="text-2xl font-black text-slate-800 tracking-tight mb-6 bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
          {t("wizard.assetRegisteredSuccess")}
        </h2>

        {/* Premium Informational Cards */}
        <div className="space-y-3 mb-8">
          <div className="bg-gradient-to-r from-slate-50 to-slate-100/50 rounded-2xl border border-slate-100 p-4 transition-all duration-300 hover:border-slate-200">
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-left">{t("wizard.assetNameLabel")}</span>
              <span className="text-base font-extrabold text-slate-800 text-left truncate">{assetName || "Untitled Asset"}</span>
            </div>
          </div>

          <div className="bg-gradient-to-r from-slate-50 to-slate-100/50 rounded-2xl border border-slate-100 p-4 transition-all duration-300 hover:border-slate-200">
            <div className="flex flex-col gap-0.5">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-left">{t("wizard.assetNoLabel")}</span>
              <span className="text-sm font-mono font-black text-blue-700 tracking-wider mt-0.5 uppercase bg-blue-50/50 px-2.5 py-1 rounded-lg border border-blue-100 w-fit">{assetCode || "PENDING"}</span>
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
          {t("wizard.dashboardRedirect")}
        </button>
      </div>
    </div>
  );
}
