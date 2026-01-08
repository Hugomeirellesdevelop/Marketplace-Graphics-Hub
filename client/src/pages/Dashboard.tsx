import { useDashboardStats, useOrders } from "@/hooks/use-logistics";
import { StatCard } from "@/components/StatCard";
import { Package, Truck, Clock, AlertTriangle, TrendingUp } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { format } from "date-fns";

export default function Dashboard() {
  const { data: stats, isLoading: statsLoading } = useDashboardStats();
  const { data: orders } = useOrders();

  // Mock chart data derived from orders or static for demo
  const chartData = [
    { name: 'Mon', orders: 4 },
    { name: 'Tue', orders: 7 },
    { name: 'Wed', orders: 5 },
    { name: 'Thu', orders: 12 },
    { name: 'Fri', orders: 9 },
    { name: 'Sat', orders: 6 },
    { name: 'Sun', orders: 3 },
  ];

  if (statsLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold font-display text-slate-900">Dashboard</h1>
          <p className="text-slate-500">Overview of logistics performance</p>
        </div>
        <div className="flex items-center space-x-2 text-sm text-slate-500 bg-white px-4 py-2 rounded-full shadow-sm border border-slate-100">
          <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
          <span>System Online</span>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Orders" 
          value={stats?.totalOrders || 0} 
          icon={<Package className="h-6 w-6" />}
          trend="+12%"
          trendUp={true}
        />
        <StatCard 
          title="In Production" 
          value={stats?.ordersInProduction || 0} 
          icon={<Clock className="h-6 w-6" />}
          className="border-l-4 border-l-blue-500"
        />
        <StatCard 
          title="In Transit" 
          value={stats?.ordersInTransit || 0} 
          icon={<Truck className="h-6 w-6" />}
          className="border-l-4 border-l-purple-500"
        />
        <StatCard 
          title="Delayed Jobs" 
          value={stats?.delayedJobs || 0} 
          icon={<AlertTriangle className="h-6 w-6" />}
          trend="-2%"
          trendUp={true} // Less delay is good
          className="border-l-4 border-l-red-500"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-display text-lg font-bold">Order Volume</h3>
            <div className="flex items-center text-sm text-slate-500">
              <TrendingUp className="h-4 w-4 mr-1 text-green-500" />
              <span>+8.2% vs last week</span>
            </div>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorOrders" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#475569" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#475569" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                <Tooltip 
                  contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                />
                <Area type="monotone" dataKey="orders" stroke="#475569" strokeWidth={3} fillOpacity={1} fill="url(#colorOrders)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <h3 className="font-display text-lg font-bold mb-6">Recent Orders</h3>
          <div className="space-y-4">
            {orders?.slice(0, 5).map((order) => (
              <div key={order.id} className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer group">
                <div className="flex items-center space-x-3">
                  <div className="h-10 w-10 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600 group-hover:bg-primary group-hover:text-white transition-colors">
                    <Package className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-medium text-slate-900 text-sm">{order.customerName}</p>
                    <p className="text-xs text-slate-500">{order.productType}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-slate-900">{order.quantity}</p>
                  <p className="text-[10px] text-slate-400">{format(new Date(order.createdAt || new Date()), 'MMM d')}</p>
                </div>
              </div>
            ))}
            {!orders?.length && <p className="text-slate-400 text-sm text-center py-4">No recent activity</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
