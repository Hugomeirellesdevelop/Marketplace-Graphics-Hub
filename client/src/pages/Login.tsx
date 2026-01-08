import { Button } from "@/components/ui/button";
import { Printer } from "lucide-react";

export default function Login() {
  const handleLogin = () => {
    window.location.href = "/api/login";
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 w-full max-w-md p-8">
        <div className="bg-white rounded-2xl shadow-2xl border border-slate-100 p-8 text-center space-y-8">
          <div className="flex flex-col items-center space-y-4">
            <div className="h-16 w-16 bg-slate-900 rounded-2xl flex items-center justify-center shadow-lg transform rotate-3">
              <Printer className="h-8 w-8 text-accent" />
            </div>
            <div>
              <h1 className="text-3xl font-bold font-display text-slate-900 tracking-tight">PRINT<span className="text-accent">LOGIC</span></h1>
              <p className="text-slate-500 mt-2">Logistics Control Center</p>
            </div>
          </div>

          <div className="space-y-4">
            <Button 
              size="lg" 
              className="w-full bg-slate-900 hover:bg-slate-800 text-white font-medium h-12 shadow-xl shadow-slate-900/10"
              onClick={handleLogin}
            >
              Sign in with Replit
            </Button>
            <p className="text-xs text-slate-400">
              Secure access for authorized personnel only.
            </p>
          </div>
        </div>
        
        <div className="text-center mt-8 text-sm text-slate-400">
          &copy; 2024 PrintLogic Industries. All rights reserved.
        </div>
      </div>
    </div>
  );
}
