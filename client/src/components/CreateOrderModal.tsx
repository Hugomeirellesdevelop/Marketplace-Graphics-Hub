import { useState } from "react";
import { useCreateOrder } from "@/hooks/use-logistics";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export function CreateOrderModal() {
  const [open, setOpen] = useState(false);
  const { mutate, isPending } = useCreateOrder();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    customerName: "",
    productType: "",
    quantity: "",
    priority: "normal",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutate(
      {
        customerName: formData.customerName,
        productType: formData.productType,
        quantity: parseInt(formData.quantity),
        priority: formData.priority,
        status: "pending",
        expectedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // +7 days
      },
      {
        onSuccess: () => {
          setOpen(false);
          setFormData({ customerName: "", productType: "", quantity: "", priority: "normal" });
          toast({ title: "Order Created", description: "The order has been successfully added to the queue." });
        },
        onError: (err) => {
          toast({ title: "Error", description: err.message, variant: "destructive" });
        }
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-accent hover:bg-accent/90 text-slate-900 font-bold shadow-lg shadow-accent/20">
          <Plus className="h-4 w-4 mr-2" /> New Order
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl">Create New Order</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="customer">Customer Name</Label>
            <Input 
              id="customer" 
              required
              value={formData.customerName}
              onChange={(e) => setFormData({...formData, customerName: e.target.value})}
              placeholder="e.g. Acme Corp"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="type">Product Type</Label>
              <Select 
                value={formData.productType} 
                onValueChange={(val) => setFormData({...formData, productType: val})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Business Cards">Business Cards</SelectItem>
                  <SelectItem value="Flyers">Flyers</SelectItem>
                  <SelectItem value="Banners">Banners</SelectItem>
                  <SelectItem value="Brochures">Brochures</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="quantity">Quantity</Label>
              <Input 
                id="quantity" 
                type="number" 
                required
                min="1"
                value={formData.quantity}
                onChange={(e) => setFormData({...formData, quantity: e.target.value})}
                placeholder="1000"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="priority">Priority Level</Label>
            <Select 
              value={formData.priority} 
              onValueChange={(val) => setFormData({...formData, priority: val})}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="normal">Normal Production</SelectItem>
                <SelectItem value="high">High Priority (Rush)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="pt-4 flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit" disabled={isPending} className="bg-primary text-white">
              {isPending ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              Create Order
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
