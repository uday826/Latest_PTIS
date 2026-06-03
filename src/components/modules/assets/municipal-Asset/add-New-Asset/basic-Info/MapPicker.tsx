"use client";

import dynamic from "next/dynamic";

export const MapPicker = dynamic(
  () => import("./MapPickerComponent").then((mod) => mod.MapPickerComponent),
  {
    ssr: false,
    loading: () => (
      <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-white border-t-transparent" />
      </div>
    ),
  }
);
