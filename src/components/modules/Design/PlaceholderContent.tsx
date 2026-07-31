import React from 'react';
import { ShieldAlert, Compass } from 'lucide-react';

export default function PlaceholderContent({ title }: { title: string }) {

  // Format the slug title to human readable
  const formatTitle = (slug: string) => {
    return slug
      .split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center bg-gray-50/50 p-6 font-sans text-gray-800 animate-fadeIn">
      <div className="bg-white border border-gray-150 rounded-2xl p-8 max-w-md text-center shadow-lg flex flex-col items-center">
        <div className="bg-blue-50 p-4 rounded-full text-blue-600 mb-4 animate-pulse">
          <Compass size={40} />
        </div>
        <h2 className="text-lg font-bold text-[#1e2b58] mb-2">{formatTitle(title)} Module</h2>
        <p className="text-xs text-gray-500 leading-relaxed mb-6">
          This system module design is finalized. Live endpoints will be connected as soon as the TMC backend API goes online.
        </p>
        <div className="bg-orange-50 border border-orange-100 text-orange-700 p-3 rounded-lg flex items-start gap-2.5 text-left text-[11px] w-full">
          <ShieldAlert size={18} className="shrink-0 mt-0.5" />
          <div>
            <p className="font-bold">Design Mockup Active</p>
            <p className="mt-0.5 text-orange-600">The frontend static fields are mapped. You can return to "Property Details" or "Dashboard" from the sidebar menu.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
