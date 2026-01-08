import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import type { 
  Order, InsertOrder, 
  ProductionJob, InsertProductionJob,
  Shipment, 
  Alert,
  DashboardStats
} from "@shared/schema";

// === DASHBOARD ===
export function useDashboardStats() {
  return useQuery({
    queryKey: [api.dashboard.stats.path],
    queryFn: async () => {
      const res = await fetch(api.dashboard.stats.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch dashboard stats");
      return api.dashboard.stats.responses[200].parse(await res.json());
    },
  });
}

// === ORDERS ===
export function useOrders() {
  return useQuery({
    queryKey: [api.orders.list.path],
    queryFn: async () => {
      const res = await fetch(api.orders.list.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch orders");
      return api.orders.list.responses[200].parse(await res.json());
    },
  });
}

export function useCreateOrder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: InsertOrder) => {
      const validated = api.orders.create.input.parse(data);
      const res = await fetch(api.orders.create.path, {
        method: api.orders.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validated),
        credentials: "include",
      });
      if (!res.ok) {
        if (res.status === 400) {
           const error = api.orders.create.responses[400].parse(await res.json());
           throw new Error(error.message);
        }
        throw new Error("Failed to create order");
      }
      return api.orders.create.responses[201].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.orders.list.path] });
      queryClient.invalidateQueries({ queryKey: [api.dashboard.stats.path] });
    },
  });
}

// === PRODUCTION ===
export function useProductionQueue() {
  return useQuery({
    queryKey: [api.production.list.path],
    queryFn: async () => {
      const res = await fetch(api.production.list.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch production queue");
      return api.production.list.responses[200].parse(await res.json());
    },
  });
}

export function useUpdateProductionStage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updates }: { id: number } & Partial<InsertProductionJob>) => {
      const url = buildUrl(api.production.update.path, { id });
      const res = await fetch(url, {
        method: api.production.update.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to update production stage");
      return api.production.update.responses[200].parse(await res.json());
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [api.production.list.path] }),
  });
}

// === SHIPMENTS ===
export function useShipments() {
  return useQuery({
    queryKey: [api.shipments.list.path],
    queryFn: async () => {
      const res = await fetch(api.shipments.list.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch shipments");
      return api.shipments.list.responses[200].parse(await res.json());
    },
  });
}

// === ALERTS ===
export function useAlerts() {
  return useQuery({
    queryKey: [api.alerts.list.path],
    queryFn: async () => {
      const res = await fetch(api.alerts.list.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch alerts");
      return api.alerts.list.responses[200].parse(await res.json());
    },
  });
}

export function useMarkAlertRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const url = buildUrl(api.alerts.markRead.path, { id });
      const res = await fetch(url, { 
        method: api.alerts.markRead.method,
        credentials: "include" 
      });
      if (!res.ok) throw new Error("Failed to mark alert as read");
      return api.alerts.markRead.responses[200].parse(await res.json());
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [api.alerts.list.path] }),
  });
}
