"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { AddAssetDrawer } from "@/components/modules/assets/municipal-Asset/add-New-Asset/AddAssetDrawer";

export default function AddNewAssetPage() {
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(true);

  const handleClose = () => {
    setIsOpen(false);
    // Use setTimeout to allow the drawer exit animation to finish before navigating away
    setTimeout(() => {
      const segments = pathname.split('/').filter(Boolean);
      const locale = segments[0] || 'en';
      router.push(`/${locale}/assets/municipal-Asset`);
    }, 300);
  };

  return (
    <div className="flex h-[calc(100vh-120px)] items-center justify-center bg-slate-50/50 rounded-3xl border border-slate-100">
      <div className="text-center space-y-3 opacity-60">
        <div className="size-10 mx-auto rounded-full border-4 border-slate-200 border-t-violet-400 animate-spin" />
        <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">Opening Registration</p>
      </div>
      <AddAssetDrawer open={isOpen} onClose={handleClose} />
    </div>
  );
}