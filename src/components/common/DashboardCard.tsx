import { ReactNode } from "react";
import { cn } from "@/lib/utils/cn";
 
export interface DashboardCardProps {
    label: string;
    value: string | number;
    subLabel?: string;
    icon?: ReactNode;
    iconBg?: string;
    valueColor?: string;
    className?: string;
    accentColor?: string;
}
export const DashboardCard = ({
    label,
    value,
    subLabel,
    icon,
    iconBg = "bg-slate-50 text-slate-700 border-slate-200",
    valueColor = "text-slate-900",
    className = "",
    accentColor,
}: DashboardCardProps) => {
    const baseClasses = cn(
        "relative flex items-center gap-4 rounded-lg bg-white px-5 py-4 border border-slate-200/80 shadow-[0_2px_4px_rgba(0,0,0,0.02),0_1px_2px_rgba(0,0,0,0.03)] transition-all duration-200 hover:shadow-[0_4px_12px_rgba(0,0,0,0.05)] hover:border-slate-300/80",
        className
    );
    return (
        <div
            className={baseClasses}
            role="region"
            aria-label={label}
        >
            {/* Accent bar */}
            <div className={cn("absolute left-0 top-0 bottom-0 w-1 rounded-l-lg", accentColor || "bg-[#1A86E8]")} />
            {/* Text */}
            <div className="flex-1 min-w-0">
                <p className="text-[12px] font-bold uppercase tracking-wider text-slate-500">{label}</p>
                <p
                    className={cn("mt-1 text-2xl font-extrabold tracking-tight", valueColor)}
                    title={String(value)}
                >
                    {value}
                </p>
                {subLabel && (
                    <p className="mt-1 text-xs text-slate-500 font-medium">{subLabel}</p>
                )}
            </div>
            {/* Icon */}
            {icon && (
                <div
                    className={cn(
                        "h-10 w-10 rounded-lg flex items-center justify-center border",
                        iconBg
                    )}
                    aria-hidden="true"
                >
                    {icon}
                </div>
            )}
        </div>
    );
};
 
DashboardCard.displayName = "DashboardCard";