import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  trend?: string;
  trendUp?: boolean;
  className?: string;
}

export function StatCard({ title, value, icon, trend, trendUp, className }: StatCardProps) {
  return (
    <div className={cn(
      "bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-lg transition-all duration-300 group",
      className
    )}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-slate-500 font-medium text-sm uppercase tracking-wider">{title}</h3>
        <div className="p-2 bg-slate-50 rounded-lg group-hover:bg-slate-100 transition-colors text-slate-400 group-hover:text-primary">
          {icon}
        </div>
      </div>
      <div className="flex items-end justify-between">
        <span className="text-3xl font-bold font-display text-slate-900">{value}</span>
        {trend && (
          <span className={cn(
            "text-xs font-bold px-2 py-1 rounded-full mb-1",
            trendUp 
              ? "bg-green-100 text-green-700" 
              : "bg-red-100 text-red-700"
          )}>
            {trend}
          </span>
        )}
      </div>
    </div>
  );
}
