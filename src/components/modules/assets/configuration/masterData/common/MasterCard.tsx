import React from 'react';
import { Card } from '@/components/common/Card';
import { LucideIcon } from 'lucide-react';

interface MasterCardProps {
  title: React.ReactNode;
  icon?: LucideIcon;
  headerAction?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  headerClassName?: string;
  bodyClassName?: string;
  footer?: React.ReactNode;
}

export function MasterCard({
  title,
  icon: Icon,
  headerAction,
  children,
  className = '',
  headerClassName = '',
  bodyClassName = '',
  footer,
}: MasterCardProps) {
  return (
    <Card
      variant="bordered"
      padding="none"
      className={`w-full h-full rounded-2xl overflow-hidden bg-white border border-gray-200 shadow-md flex flex-col ${className}`}
    >
      {/* Header */}
      <div className={`h-[54px] shrink-0 bg-[#33445c] text-white px-5 flex items-center justify-between ${headerClassName}`}>
        <div className="flex items-center gap-2 font-semibold text-[15px]">
          {Icon && <Icon size={16} className="stroke-[2.2]" />}
          <span>{title}</span>
        </div>
        {headerAction}
      </div>

      {/* Body */}
      <div className={`flex-1 flex flex-col min-h-0 relative ${bodyClassName}`}>
        {children}
      </div>



      {/* Optional Footer */}
      {footer && (
        <div className="shrink-0 border-t border-gray-100 bg-gray-50/50 p-3">
          {footer}
        </div>
      )}
    </Card>
  );
}
