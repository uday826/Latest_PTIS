/**
 * Floor Details & Media — Loading UI
 * Shown by Next.js Suspense while the page segment is streaming.
 */
export default function FloorDetailsLoading() {
  return (
    <div className="flex flex-col gap-3 animate-pulse">
      {/* Configurator skeleton */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-4 space-y-4">
        <div className="flex items-center gap-2.5 border-b border-slate-100 pb-3">
          <div className="size-8 bg-slate-200 rounded-lg" />
          <div className="space-y-1.5">
            <div className="h-3 w-48 bg-slate-200 rounded" />
            <div className="h-2 w-32 bg-slate-100 rounded" />
          </div>
        </div>
        {/* Form row skeleton */}
        <div className="grid grid-cols-5 gap-3">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="space-y-1">
              <div className="h-2 w-12 bg-slate-100 rounded" />
              <div className="h-8 bg-slate-100 rounded-lg" />
            </div>
          ))}
        </div>
        {/* Table skeleton */}
        <div className="border border-slate-200 rounded-xl overflow-hidden">
          <div className="h-9 bg-slate-100 border-b border-slate-200" />
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="h-9 border-b border-slate-100 bg-white flex items-center px-3 gap-4"
            >
              <div className="size-4 bg-slate-200 rounded" />
              <div className="h-2.5 w-16 bg-slate-100 rounded" />
              <div className="h-2.5 w-20 bg-slate-100 rounded" />
              <div className="h-2.5 w-12 bg-slate-100 rounded ml-auto" />
            </div>
          ))}
        </div>
        {/* Total CV skeleton */}
        <div className="h-14 bg-emerald-50 border border-emerald-200/80 rounded-xl" />
      </div>

      {/* Attachments / Media skeleton */}
      <div className="grid grid-cols-3 gap-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-4 space-y-3"
          >
            <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
              <div className="size-4 bg-slate-200 rounded" />
              <div className="h-2.5 w-32 bg-slate-100 rounded" />
            </div>
            <div className="h-44 bg-slate-100 rounded-xl" />
          </div>
        ))}
      </div>
    </div>
  );
}
