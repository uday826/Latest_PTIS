'use client';
/* eslint-disable i18next/no-literal-string */

import { DashboardCard } from '@/components/common/DashboardCard';
import type {
  RevenueDashboardBreakdownItem,
  RevenueDashboardCardData,
  RevenueDashboardTrendPoint,
} from '../../../../types/asset/revenue.types';

interface StatsProps {
  cards?: RevenueDashboardCardData[];
  trendPoints?: RevenueDashboardTrendPoint[];
  breakdownItems?: RevenueDashboardBreakdownItem[];
  onCardClick?: (type: string) => void;
}

export function RevenueDashboardCards({
  cards = [],
  trendPoints = [],
  breakdownItems = [],
  onCardClick,
}: StatsProps) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {cards.length > 0 ? (
          cards.map((card) => {
            const Icon = card.icon;
            return (
              <button
                key={card.id}
                type="button"
                onClick={() => onCardClick?.(card.id)}
                className="text-left cursor-pointer"
              >
                <DashboardCard
                  label={card.label}
                  value={card.value}
                  subLabel={`${card.badge} · ${card.subtext}`}
                  icon={<Icon className="w-5 h-5 text-white" />}
                  iconBg={`bg-gradient-to-br ${card.color}`}
                  valueColor="text-slate-800"
                  className="group transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg"
                />
              </button>
            );
          })
        ) : (
          <div className="md:col-span-3 rounded-2xl border border-dashed border-slate-200 bg-white p-6 text-center text-sm text-slate-500">
            No dashboard metrics available from the API.
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-widest">Revenue Collection Trend</h4>
              <p className="text-[10px] text-slate-500 font-medium mt-0.5">Live API trend data</p>
            </div>
            <div className="flex items-center gap-3 text-[10px] font-bold">
              <span className="flex items-center gap-1.5 text-slate-500">
                <span className="w-2.5 h-2.5 rounded bg-indigo-500 inline-block" /> Demand
              </span>
              <span className="flex items-center gap-1.5 text-slate-500">
                <span className="w-2.5 h-2.5 rounded bg-emerald-500 inline-block" /> Collected
              </span>
            </div>
          </div>

          {trendPoints.length > 0 ? (
            <div className="relative h-44 w-full flex items-end justify-between px-2 pt-4">
              <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-50 py-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="border-t border-dashed border-slate-100 w-full" />
                ))}
              </div>

              {trendPoints.map((point, i) => (
                <div key={`${point.month}-${i}`} className="relative z-10 flex flex-col items-center gap-2 w-full group">
                  <div className="flex items-end justify-center gap-1.5 h-28 w-full">
                    <div
                      style={{ height: `${(point.demand / 150) * 100}%` }}
                      className="w-4 rounded-t bg-gradient-to-b from-indigo-400 to-indigo-600 shadow-sm group-hover:brightness-95 transition-all duration-300"
                    />
                    <div
                      style={{ height: `${(point.collect / 150) * 100}%` }}
                      className="w-4 rounded-t bg-gradient-to-b from-emerald-400 to-emerald-600 shadow-sm group-hover:brightness-95 transition-all duration-300"
                    />
                  </div>
                  <span className="text-[10px] font-bold text-slate-500">{point.month}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 px-4 py-8 text-center text-sm text-slate-500">
              No trend data returned by the API.
            </div>
          )}
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm flex flex-col justify-between">
          <div>
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-widest mb-1">Collection Progress</h4>
            <p className="text-[10px] text-slate-500 font-medium">Live API breakdown</p>
          </div>

          {breakdownItems.length > 0 ? (
            <div className="py-2 space-y-3">
              {breakdownItems.map((item, idx) => (
                <div key={`${item.label}-${idx}`} className="space-y-1">
                  <div className="flex items-center justify-between text-[10px] font-bold">
                    <span className="text-slate-600">{item.label}</span>
                    <span className="text-slate-800">
                      {item.amount} ({item.value})
                    </span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-slate-100 overflow-hidden">
                    <div className={`h-full rounded-full ${item.color}`} style={{ width: item.value }} />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 px-4 py-8 text-center text-sm text-slate-500">
              No collection breakdown returned by the API.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
