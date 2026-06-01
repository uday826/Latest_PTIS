'use client';

import { Building2, IndianRupee, TrendingUp } from 'lucide-react';

interface StatsProps {
  onCardClick?: (type: 'leased' | 'demand' | 'collection') => void;
}

export function RevenueDashboardCards({ onCardClick }: StatsProps) {
  const stats = [
    {
      id: 'leased' as const,
      label: 'Leased Assets',
      value: '29',
      subtext: 'Properties under active rent',
      icon: Building2,
      color: 'from-violet-500 via-purple-600 to-indigo-700',
      badge: '94% Occupied',
      badgeColor: 'bg-violet-100 text-violet-700 border-violet-200',
    },
    {
      id: 'demand' as const,
      label: 'Monthly Demand',
      value: '₹14.85 L',
      subtext: 'Total target for current month',
      icon: IndianRupee,
      color: 'from-emerald-500 via-teal-600 to-cyan-600',
      badge: 'Target 100%',
      badgeColor: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    },
    {
      id: 'collection' as const,
      label: 'Collected Amount',
      value: '₹12.45 L',
      subtext: 'Collection rate achieved',
      icon: TrendingUp,
      color: 'from-pink-500 via-rose-600 to-amber-600',
      badge: '83.8% Collection Rate',
      badgeColor: 'bg-rose-100 text-rose-700 border-rose-200',
    },
  ];

  return (
    <div className="space-y-4">
      {/* ── KPI STATS GRID ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {stats.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.id}
              onClick={() => onCardClick?.(card.id)}
              className="group relative bg-white rounded-2xl border border-slate-100 p-5 shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-slate-50/50 via-white to-transparent pointer-events-none" />
              <div className="relative z-10 flex items-center justify-between">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded-full border text-[9px] font-bold tracking-wide uppercase ${card.badgeColor}`}>
                      {card.badge}
                    </span>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest">{card.label}</p>
                    <h3 className="text-2xl font-black text-slate-800 tracking-tight mt-0.5">{card.value}</h3>
                  </div>
                  <p className="text-[10px] text-slate-500 font-medium">{card.subtext}</p>
                </div>
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className="w-6 h-6 text-white drop-shadow-sm" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── PURE INTERACTIVE VISUAL TRENDS (SVG) ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Trend Graph */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-widest">Revenue Collection Trend</h4>
              <p className="text-[10px] text-slate-500 font-medium mt-0.5">Last 6 Months Demand vs Collections</p>
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

          <div className="relative h-44 w-full flex items-end justify-between px-2 pt-4">
            {/* SVG Background grids */}
            <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-50 py-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="border-t border-dashed border-slate-100 w-full" />
              ))}
            </div>

            {/* Custom Bar Graphs */}
            {[
              { month: 'Jan', demand: 90, collect: 72 },
              { month: 'Feb', demand: 95, collect: 80 },
              { month: 'Mar', demand: 110, collect: 98 },
              { month: 'Apr', demand: 105, collect: 88 },
              { month: 'May', demand: 120, collect: 102 },
              { month: 'Jun', demand: 148, collect: 124 },
            ].map((d, i) => (
              <div key={i} className="relative z-10 flex flex-col items-center gap-2 w-full group">
                <div className="flex items-end justify-center gap-1.5 h-28 w-full">
                  <div
                    style={{ height: `${(d.demand / 150) * 100}%` }}
                    className="w-4 rounded-t bg-gradient-to-b from-indigo-400 to-indigo-600 shadow-sm group-hover:brightness-95 transition-all duration-300"
                  />
                  <div
                    style={{ height: `${(d.collect / 150) * 100}%` }}
                    className="w-4 rounded-t bg-gradient-to-b from-emerald-400 to-emerald-600 shadow-sm group-hover:brightness-95 transition-all duration-300"
                  />
                </div>
                <span className="text-[10px] font-bold text-slate-500">{d.month}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Collection Status Breakdown */}
        <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm flex flex-col justify-between">
          <div>
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-widest mb-1">Collection Progress</h4>
            <p className="text-[10px] text-slate-500 font-medium">Real-time status tracking</p>
          </div>
          <div className="py-2 space-y-3">
            {[
              { label: 'UPI/QR Transactions', value: '45%', amount: '₹5.60 L', color: 'bg-indigo-500' },
              { label: 'Net Banking/Online', value: '35%', amount: '₹4.35 L', color: 'bg-emerald-500' },
              { label: 'Cheque/DD Clearings', value: '15%', amount: '₹1.87 L', color: 'bg-amber-500' },
              { label: 'Direct Cash counters', value: '5%', amount: '₹0.62 L', color: 'bg-slate-400' },
            ].map((item, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex items-center justify-between text-[10px] font-bold">
                  <span className="text-slate-600">{item.label}</span>
                  <span className="text-slate-800">{item.amount} ({item.value})</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-slate-100 overflow-hidden">
                  <div className={`h-full rounded-full ${item.color}`} style={{ width: item.value }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
