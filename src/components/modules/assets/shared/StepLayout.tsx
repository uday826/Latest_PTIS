'use client';

import React from 'react';

interface StepItem {
  number: number;
  label: string;
  isPrimary?: boolean;
}

interface StepLayoutProps {
  steps: StepItem[];
  children: React.ReactNode[]; // Expecting one child per step
}

export function StepLayout({ steps, children }: StepLayoutProps) {
  return (
    <div className="grid grid-cols-12 gap-6">
      {steps.map((step, index) => (
        <div 
          key={step.number} 
          className={`${index === 2 ? 'col-span-6' : 'col-span-3'} space-y-3`}
        >
          {/* Step Header */}
          <div className="flex items-center gap-2.5 px-1 mb-2">
            <span 
              className={`
                w-6 h-6 rounded-full text-[12px] flex items-center justify-center font-bold shrink-0
                ${step.isPrimary 
                  ? 'bg-[#0b89a3] text-white shadow-md shadow-[#0b89a3]/30' 
                  : 'bg-slate-200 text-slate-600'}
              `}
            >
              {step.number}
            </span>
            <span className="text-[12px] font-bold text-slate-500 uppercase tracking-[0.05em]">
              {step.label}
            </span>
          </div>

          {/* Column Content */}
          {children[index]}
        </div>
      ))}
    </div>
  );
}
