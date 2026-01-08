import { useProductionQueue, useUpdateProductionStage } from "@/hooks/use-logistics";
import { Loader2, Cog, Scissors, CheckCircle, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const stages = [
  { id: 'queued', label: 'Queued', icon: Clock, color: 'bg-slate-100 text-slate-600' },
  { id: 'printing', label: 'Printing', icon: Cog, color: 'bg-blue-100 text-blue-600' },
  { id: 'cutting', label: 'Cutting', icon: Scissors, color: 'bg-orange-100 text-orange-600' },
  { id: 'completed', label: 'Completed', icon: CheckCircle, color: 'bg-green-100 text-green-600' },
];

export default function Production() {
  const { data: queue, isLoading } = useProductionQueue();
  const { mutate: updateStage, isPending: isUpdating } = useUpdateProductionStage();

  const handleAdvance = (id: number, currentStage: string) => {
    const currentIndex = stages.findIndex(s => s.id === currentStage);
    if (currentIndex < stages.length - 1) {
      updateStage({ id, stage: stages[currentIndex + 1].id });
    }
  };

  if (isLoading) return <div className="flex justify-center p-12"><Loader2 className="animate-spin h-8 w-8" /></div>;

  return (
    <div className="h-[calc(100vh-2rem)] flex flex-col space-y-6">
      <div className="flex justify-between items-center px-1">
        <div>
          <h1 className="text-3xl font-bold font-display text-slate-900">Production Floor</h1>
          <p className="text-slate-500">Real-time manufacturing status</p>
        </div>
      </div>

      <div className="flex-1 overflow-x-auto">
        <div className="flex gap-6 h-full min-w-[1000px] pb-4">
          {stages.map((stage) => {
            const items = queue?.filter(item => item.stage === stage.id) || [];
            
            return (
              <div key={stage.id} className="w-1/4 flex flex-col bg-slate-50 rounded-xl border border-slate-200">
                <div className="p-4 border-b border-slate-200 bg-white rounded-t-xl flex items-center justify-between sticky top-0">
                  <div className="flex items-center space-x-2">
                    <stage.icon className={cn("h-5 w-5", stage.color.split(' ')[1])} />
                    <h3 className="font-bold font-display text-slate-900">{stage.label}</h3>
                  </div>
                  <span className="text-xs font-bold bg-slate-100 px-2 py-1 rounded-full text-slate-600">
                    {items.length}
                  </span>
                </div>

                <div className="p-4 space-y-3 overflow-y-auto flex-1 custom-scrollbar">
                  {items.map((job) => (
                    <div 
                      key={job.id} 
                      className="bg-white p-4 rounded-lg shadow-sm border border-slate-100 hover:shadow-md transition-all group relative overflow-hidden"
                    >
                      {/* Progress Bar Background */}
                      <div 
                        className="absolute bottom-0 left-0 h-1 bg-primary/20 w-full"
                      >
                        <div 
                          className="h-full bg-primary transition-all duration-500"
                          style={{ width: `${job.progress || 0}%` }}
                        />
                      </div>

                      <div className="flex justify-between items-start mb-2">
                        <span className="text-xs font-mono text-slate-400">JOB-{job.id}</span>
                        {job.status === 'delayed' && (
                          <span className="text-[10px] bg-red-100 text-red-600 px-1.5 py-0.5 rounded font-bold uppercase">Delayed</span>
                        )}
                      </div>
                      
                      <h4 className="font-bold text-slate-800 mb-1">Order #{job.orderId}</h4>
                      
                      <div className="flex items-center text-xs text-slate-500 mb-4 space-x-2">
                        <span>Machine: {job.machineId || 'Pending'}</span>
                      </div>

                      {stage.id !== 'completed' && (
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="w-full text-xs h-8 hover:bg-primary hover:text-white transition-colors"
                          onClick={() => handleAdvance(job.id, job.stage)}
                          disabled={isUpdating}
                        >
                          Advance Stage
                        </Button>
                      )}
                    </div>
                  ))}
                  
                  {items.length === 0 && (
                    <div className="text-center py-8 border-2 border-dashed border-slate-200 rounded-lg">
                      <p className="text-xs text-slate-400">No jobs in {stage.label}</p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
