"use client";

import { AssetStepperProps } from "@/types/asset-types/basic-info/asset-wizard.types";
import { Check } from "lucide-react";
import React from "react";

export function AssetStepper({
  currentStepId,
  steps,
}: AssetStepperProps) {
  return (
    <div className="overflow-x-auto rounded-xl border border-[#CBD8EA] bg-white px-3 py-1.5 shadow-sm">
      <div className="flex min-w-max items-center gap-0">
        {steps.map((step, index) => {
          const isCompleted = step.id < currentStepId;
          const isCurrent = step.id === currentStepId;
          const Icon = step.icon;

          return (
            <React.Fragment key={step.id}>
              {index > 0 && (
                <div
                  className={`mx-1 h-0.5 w-8 rounded-full transition-colors ${isCompleted || isCurrent ? "bg-emerald-400" : "bg-slate-200"
                    }`}
                />
              )}

              <div className="flex items-center gap-1.5">
                <div
                  className={`flex size-6 shrink-0 items-center justify-center rounded-full text-[10px] font-bold transition-all ${isCompleted
                      ? "bg-emerald-500 text-white shadow-[0_0_8px_rgba(16,185,129,0.4)]"
                      : isCurrent
                        ? "bg-emerald-500 text-white shadow-[0_0_10px_rgba(16,185,129,0.5)] ring-2 ring-emerald-300/40"
                        : "bg-slate-200 text-slate-400"
                    }`}
                >
                  {isCompleted ? (
                    <Check className="size-3.5" strokeWidth={3} />
                  ) : (
                    <Icon className="size-3.5" />
                  )}
                </div>

                <span
                  className={`whitespace-nowrap text-[13px] transition-colors ${isCompleted
                      ? "text-emerald-600"
                      : isCurrent
                        ? "font-semibold text-slate-800"
                        : "text-slate-400"
                    }`}
                >
                  {step.label}
                </span>
              </div>
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}