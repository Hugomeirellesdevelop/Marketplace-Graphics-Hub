import { pgTable, text, serial, integer, boolean, timestamp, date, jsonb, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { sql } from "drizzle-orm";

// === AUTH TABLES (Mandatory for Replit Auth) ===
export const sessions = pgTable("sessions", {
  sid: varchar("sid").primaryKey(),
  sess: jsonb("sess").notNull(),
  expire: timestamp("expire").notNull(),
});

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  role: text("role").default("client"), // client, factory, admin
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// === APP TABLES ===

export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  customerName: text("customer_name").notNull(),
  productType: text("product_type").notNull(), // e.g., "Business Cards", "Flyers"
  quantity: integer("quantity").notNull(),
  status: text("status").notNull().default("pending"), // pending, production, shipping, delivered
  priority: text("priority").default("normal"), // normal, high
  expectedDelivery: date("expected_delivery"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const productionQueue = pgTable("production_queue", {
  id: serial("id").primaryKey(),
  orderId: integer("order_id").references(() => orders.id),
  stage: text("stage").notNull().default("queued"), // queued, printing, cutting, finishing, completed
  machineId: text("machine_id"),
  progress: integer("progress").default(0),
  status: text("status").default("on_time"), // on_time, delayed
});

export const shipments = pgTable("shipments", {
  id: serial("id").primaryKey(),
  orderId: integer("order_id").references(() => orders.id),
  trackingCode: text("tracking_code"),
  carrier: text("carrier"),
  status: text("status").default("pending"), // pending, in_transit, delivered, exception
  estimatedArrival: date("estimated_arrival"),
});

export const alerts = pgTable("alerts", {
  id: serial("id").primaryKey(),
  type: text("type").notNull(), // production_delay, shipping_delay, system
  message: text("message").notNull(),
  severity: text("severity").default("info"), // info, warning, critical
  isRead: boolean("is_read").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

// === SCHEMAS ===

export const insertUserSchema = createInsertSchema(users).omit({ id: true, createdAt: true, updatedAt: true });
export const insertOrderSchema = createInsertSchema(orders).omit({ id: true, createdAt: true });
export const insertProductionSchema = createInsertSchema(productionQueue).omit({ id: true });
export const insertShipmentSchema = createInsertSchema(shipments).omit({ id: true });
export const insertAlertSchema = createInsertSchema(alerts).omit({ id: true, createdAt: true });

// === TYPES ===

export type User = typeof users.$inferSelect;
export type UpsertUser = typeof users.$inferInsert;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Order = typeof orders.$inferSelect;
export type InsertOrder = z.infer<typeof insertOrderSchema>;

export type ProductionJob = typeof productionQueue.$inferSelect;
export type InsertProductionJob = z.infer<typeof insertProductionSchema>;

export type Shipment = typeof shipments.$inferSelect;
export type InsertShipment = z.infer<typeof insertShipmentSchema>;

export type Alert = typeof alerts.$inferSelect;
export type InsertAlert = z.infer<typeof insertAlertSchema>;

// === API REQUEST/RESPONSE TYPES ===

// Dashboard Stats
export interface DashboardStats {
  totalOrders: number;
  ordersInProduction: number;
  ordersInTransit: number;
  delayedJobs: number;
}
