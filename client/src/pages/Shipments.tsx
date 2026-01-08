import { useShipments } from "@/hooks/use-logistics";
import { Truck, MapPin, PackageCheck, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function Shipments() {
  const { data: shipments, isLoading } = useShipments();

  if (isLoading) return <div className="p-8">Loading...</div>;

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold font-display text-slate-900">Shipments</h1>
        <p className="text-slate-500">Track outbound deliveries</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {shipments?.map((shipment) => (
          <div key={shipment.id} className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden hover:shadow-lg transition-all duration-300">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
                  <Truck className="h-6 w-6" />
                </div>
                <Badge variant={
                  shipment.status === 'delivered' ? 'default' : 
                  shipment.status === 'exception' ? 'destructive' : 'secondary'
                }>
                  {shipment.status?.toUpperCase()}
                </Badge>
              </div>
              
              <div className="space-y-4">
                <div>
                  <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Tracking Code</p>
                  <p className="font-mono text-lg font-bold text-slate-900">{shipment.trackingCode || 'N/A'}</p>
                </div>
                
                <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                  <div className="flex items-center text-sm text-slate-600">
                    <PackageCheck className="h-4 w-4 mr-2" />
                    <span>{shipment.carrier}</span>
                  </div>
                  <div className="flex items-center text-sm text-slate-600">
                    <MapPin className="h-4 w-4 mr-2" />
                    <span>ETA: {shipment.estimatedArrival || 'Unknown'}</span>
                  </div>
                </div>
              </div>
            </div>
            {shipment.status === 'in_transit' && (
              <div className="bg-slate-50 px-6 py-3 border-t border-slate-100">
                <div className="w-full bg-slate-200 rounded-full h-1.5">
                  <div className="bg-primary h-1.5 rounded-full w-[60%]"></div>
                </div>
                <p className="text-[10px] text-right text-slate-400 mt-1">In Transit - On Time</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
