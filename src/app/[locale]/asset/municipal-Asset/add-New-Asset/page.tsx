"use client";

import React, { useEffect } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";

const AddNewAssetPage: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Automatically redirect /add-New-Asset to the first wizard step (/add-New-Asset/basic-Info)
  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    router.replace(`${pathname}/basic-Info?${params.toString()}`);
  }, [pathname, searchParams, router]);

  return (
    <div className="flex items-center justify-center p-12 bg-white rounded-3xl border border-slate-100 shadow-md max-w-4xl mx-auto">
      <div className="flex flex-col items-center gap-3">
        <div className="size-8 rounded-full border-4 border-blue-100 border-t-blue-600 animate-spin" />
        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Redirecting to Registration...</p>
      </div>
    </div>
  );
};

export default AddNewAssetPage;