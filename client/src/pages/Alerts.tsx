import { useAlerts, useMarkAlertRead } from "@/hooks/use-logistics";
import { AlertTriangle, Info, Bell, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";

export default function Alerts() {
  const { data: alerts, isLoading } = useAlerts();
  const { mutate: markRead } = useMarkAlertRead();

  const getIcon = (type: string) => {
    switch (type) {
      case 'production_delay': return <AlertTriangle className="h-5 w-5 text-orange-500" />;
      case 'shipping_delay': return <AlertTriangle className="h-5 w-5 text-red-500" />;
      default: return <Info className="h-5 w-5 text-blue-500" />;
    }
  };

  if (isLoading) return <div className="p-8">Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center space-x-3 mb-8">
        <div className="p-3 bg-red-100 text-red-600 rounded-xl">
          <Bell className="h-8 w-8" />
        </div>
        <div>
          <h1 className="text-3xl font-bold font-display text-slate-900">System Alerts</h1>
          <p className="text-slate-500">Notifications requiring attention</p>
        </div>
      </div>

      <div className="space-y-3">
        {alerts?.map((alert) => (
          <div 
            key={alert.id}
            className={cn(
              "flex items-start p-4 rounded-xl border transition-all duration-200",
              alert.isRead 
                ? "bg-white border-slate-100 opacity-60" 
                : "bg-white border-l-4 border-l-accent shadow-md border-y-slate-100 border-r-slate-100 scale-[1.01]"
            )}
          >
            <div className="mt-1 mr-4">
              {getIcon(alert.type)}
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-start">
                <h3 className={cn("font-bold text-slate-900", !alert.isRead && "text-lg")}>
                  {alert.type.replace('_', ' ').toUpperCase()}
                </h3>
                <span className="text-xs text-slate-400">
                  {format(new Date(alert.createdAt || new Date()), 'MMM d, h:mm a')}
                </span>
              </div>
              <p className="text-slate-600 mt-1">{alert.message}</p>
            </div>
            {!alert.isRead && (
              <Button
                variant="ghost"
                size="sm"
                className="ml-4 text-slate-400 hover:text-primary hover:bg-slate-100"
                onClick={() => markRead(alert.id)}
              >
                <Check className="h-4 w-4 mr-2" />
                Mark Read
              </Button>
            )}
          </div>
        ))}
        {alerts?.length === 0 && (
          <div className="text-center py-12 bg-white rounded-xl border border-dashed border-slate-200">
            <Bell className="h-12 w-12 text-slate-200 mx-auto mb-3" />
            <h3 className="text-slate-900 font-medium">All caught up!</h3>
            <p className="text-slate-400">No new alerts at this time.</p>
          </div>
        )}
      </div>
    </div>
  );
}
