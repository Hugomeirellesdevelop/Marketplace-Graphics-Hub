import { db } from "./db";
import { 
  users, orders, productionQueue, shipments, alerts,
  type User, type InsertUser, type UpsertUser,
  type Order, type InsertOrder,
  type ProductionJob, type InsertProductionJob,
  type Shipment, type InsertShipment,
  type Alert, type InsertAlert,
  type DashboardStats
} from "@shared/schema";
import { eq, sql } from "drizzle-orm";

export interface IStorage {
  // Users
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>; // Keep for legacy/compatibility if needed, or remove. Auth uses getUser(id)
  upsertUser(user: UpsertUser): Promise<User>; // Replit Auth uses this

  // Orders
  getOrders(): Promise<Order[]>;
  getOrder(id: number): Promise<Order | undefined>;
  createOrder(order: InsertOrder): Promise<Order>;
  
  // Production
  getProductionQueue(): Promise<ProductionJob[]>;
  updateProductionJob(id: number, updates: Partial<InsertProductionJob>): Promise<ProductionJob>;
  
  // Shipments
  getShipments(): Promise<Shipment[]>;
  
  // Alerts
  getAlerts(): Promise<Alert[]>;
  markAlertRead(id: number): Promise<Alert>;
  
  // Stats
  getDashboardStats(): Promise<DashboardStats>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  // Not used by Replit Auth but kept for interface consistency if needed
  async getUserByUsername(username: string): Promise<User | undefined> {
    // We don't have a username field anymore in the standard Replit Auth schema (it uses email/firstName/lastName)
    // But let's check if 'username' exists in schema. It doesn't.
    // So we'll return undefined or remove this method.
    // I'll implementation-stub it.
    return undefined;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  // Legacy createUser for interface compatibility if IStorage demands it, 
  // but I changed the interface to upsertUser for Auth.
  // Actually, I should probably implement createUser if I defined it in interface earlier?
  // Let's stick to IStorage definition above.

  async getOrders(): Promise<Order[]> {
    return await db.select().from(orders).orderBy(sql`${orders.createdAt} DESC`);
  }

  async getOrder(id: number): Promise<Order | undefined> {
    const [order] = await db.select().from(orders).where(eq(orders.id, id));
    return order;
  }

  async createOrder(insertOrder: InsertOrder): Promise<Order> {
    const [order] = await db.insert(orders).values(insertOrder).returning();
    // Also trigger initial production job
    await db.insert(productionQueue).values({
      orderId: order.id,
      stage: 'queued',
      progress: 0,
      status: 'on_time'
    });
    return order;
  }

  async getProductionQueue(): Promise<ProductionJob[]> {
    return await db.select().from(productionQueue);
  }

  async updateProductionJob(id: number, updates: Partial<InsertProductionJob>): Promise<ProductionJob> {
    const [job] = await db.update(productionQueue)
      .set(updates)
      .where(eq(productionQueue.id, id))
      .returning();
    return job;
  }

  async getShipments(): Promise<Shipment[]> {
    return await db.select().from(shipments);
  }

  async getAlerts(): Promise<Alert[]> {
    return await db.select().from(alerts).orderBy(sql`${alerts.createdAt} DESC`);
  }

  async markAlertRead(id: number): Promise<Alert> {
    const [alert] = await db.update(alerts)
      .set({ isRead: true })
      .where(eq(alerts.id, id))
      .returning();
    return alert;
  }

  async getDashboardStats(): Promise<DashboardStats> {
    const [stats] = await db.execute(sql`
      SELECT 
        (SELECT COUNT(*)::int FROM orders) as "totalOrders",
        (SELECT COUNT(*)::int FROM orders WHERE status = 'production') as "ordersInProduction",
        (SELECT COUNT(*)::int FROM orders WHERE status = 'shipping') as "ordersInTransit",
        (SELECT COUNT(*)::int FROM production_queue WHERE status = 'delayed') as "delayedJobs"
    `);
    // @ts-ignore
    return stats.rows[0] as DashboardStats; // Fix: stats.rows[0] for pg result
  }
}

export const storage = new DatabaseStorage();
// Re-export storage as authStorage for the auth module
export const authStorage = storage;
