"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { AddAssetDrawer } from "@/components/modules/assets/municipal-Asset/add-New-Asset/AddAssetDrawer";
import { AssetCategory } from "@/lib/api/asset/category-type.service";
import { Zone } from "@/lib/api/asset/zone.service";
import { Ward } from "@/lib/api/asset/ward.service";

interface AddAssetDrawerClientProps {
  initialCategories: AssetCategory[];
  initialZones: Zone[];
  initialWards: Ward[];
}

export function AddAssetDrawerClient({
  initialCategories,
  initialZones,
  initialWards,
}: AddAssetDrawerClientProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(true);

  const handleClose = () => {
    setIsOpen(false);
    // Use setTimeout to allow the drawer exit animation to finish before navigating away
    setTimeout(() => {
      const segments = pathname.split("/").filter(Boolean);
      const locale = segments[0] || "en";
      router.push(`/${locale}/assets/municipal-Asset`);
    }, 300);
  };

  return (
    <>
      <AddAssetDrawer 
        open={isOpen} 
        onClose={handleClose} 
        initialCategories={initialCategories}
        initialZones={initialZones}
        initialWards={initialWards}
      />
    </>
  );
}
