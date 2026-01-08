import { Link, useLocation } from "wouter";
import { 
  LayoutDashboard, 
  Package, 
  Factory, 
  Truck, 
  Bell, 
  LogOut,
  Settings,
  Printer
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/use-auth";

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Orders', href: '/orders', icon: Package },
  { name: 'Production', href: '/production', icon: Factory },
  { name: 'Shipments', href: '/shipments', icon: Truck },
  { name: 'Alerts', href: '/alerts', icon: Bell },
];

export function Sidebar() {
  const [location] = useLocation();
  const { user, logout } = useAuth();

  return (
    <div className="flex flex-col h-full bg-slate-900 text-white w-64 border-r border-slate-800 shadow-2xl">
      <div className="p-6 flex items-center space-x-3 border-b border-slate-800/50">
        <div className="bg-accent p-2 rounded-lg">
          <Printer className="h-6 w-6 text-slate-900" />
        </div>
        <div>
          <h1 className="text-xl font-bold font-display tracking-wide">PRINT<span className="text-accent">LOGIC</span></h1>
          <p className="text-xs text-slate-400">Control Center</p>
        </div>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-2">
        {navigation.map((item) => {
          const isActive = location === item.href;
          return (
            <Link key={item.name} href={item.href}>
              <div
                className={cn(
                  "flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 cursor-pointer group",
                  isActive 
                    ? "bg-primary text-white shadow-lg shadow-primary/25 translate-x-1" 
                    : "text-slate-400 hover:bg-slate-800 hover:text-white hover:translate-x-1"
                )}
              >
                <item.icon className={cn("h-5 w-5 transition-colors", isActive ? "text-accent" : "text-slate-500 group-hover:text-white")} />
                <span className="font-medium">{item.name}</span>
                {item.name === 'Alerts' && (
                  <span className="ml-auto bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                    3
                  </span>
                )}
              </div>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-800/50">
        <div className="flex items-center space-x-3 mb-4 px-4">
          <div className="h-10 w-10 rounded-full bg-slate-800 flex items-center justify-center text-lg font-bold text-accent border border-slate-700">
            {user?.firstName?.[0] || 'U'}
          </div>
          <div className="flex-1 overflow-hidden">
            <p className="text-sm font-medium truncate text-white">{user?.firstName || 'User'}</p>
            <p className="text-xs text-slate-500 truncate">{user?.email}</p>
          </div>
        </div>
        <button 
          onClick={() => logout()}
          className="w-full flex items-center justify-center space-x-2 bg-slate-800 hover:bg-slate-700 text-slate-300 py-2 rounded-lg transition-colors text-sm font-medium"
        >
          <LogOut className="h-4 w-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );
}
