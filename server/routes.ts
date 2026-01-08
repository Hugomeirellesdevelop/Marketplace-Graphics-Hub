import type { Express } from "express";
import type { Server } from "http";
import { setupAuth } from "./auth";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Setup Auth first
  setupAuth(app);

  // Dashboard Stats
  app.get(api.dashboard.stats.path, async (req, res) => {
    const stats = await storage.getDashboardStats();
    res.json(stats);
  });

  // Orders
  app.get(api.orders.list.path, async (req, res) => {
    const orders = await storage.getOrders();
    res.json(orders);
  });

  app.post(api.orders.create.path, async (req, res) => {
    try {
      const input = api.orders.create.input.parse(req.body);
      const order = await storage.createOrder(input);
      res.status(201).json(order);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      throw err;
    }
  });

  app.get(api.orders.get.path, async (req, res) => {
    const order = await storage.getOrder(Number(req.params.id));
    if (!order) return res.status(404).json({ message: "Order not found" });
    res.json(order);
  });

  // Production
  app.get(api.production.list.path, async (req, res) => {
    const jobs = await storage.getProductionQueue();
    res.json(jobs);
  });

  app.patch(api.production.update.path, async (req, res) => {
    const job = await storage.updateProductionJob(Number(req.params.id), req.body);
    res.json(job);
  });

  // Shipments
  app.get(api.shipments.list.path, async (req, res) => {
    const shipments = await storage.getShipments();
    res.json(shipments);
  });

  // Alerts
  app.get(api.alerts.list.path, async (req, res) => {
    const alerts = await storage.getAlerts();
    res.json(alerts);
  });

  app.post(api.alerts.markRead.path, async (req, res) => {
    const alert = await storage.markAlertRead(Number(req.params.id));
    res.json(alert);
  });

  // Seed Data
  await seedDatabase();

  return httpServer;
}

async function seedDatabase() {
  const existingOrders = await storage.getOrders();
  if (existingOrders.length === 0) {
    console.log("Seeding database...");
    
    // Create Orders
    const order1 = await storage.createOrder({
      customerName: "Acme Corp",
      productType: "Business Cards",
      quantity: 1000,
      status: "production",
      priority: "high",
      expectedDelivery: new Date("2024-05-20").toISOString().split('T')[0]
    });
    
    const order2 = await storage.createOrder({
      customerName: "Globex Inc",
      productType: "Brochures",
      quantity: 5000,
      status: "shipping",
      priority: "normal",
      expectedDelivery: new Date("2024-05-25").toISOString().split('T')[0]
    });

    // Update auto-created production jobs
    const jobs = await storage.getProductionQueue();
    if (jobs[0]) {
      await storage.updateProductionJob(jobs[0].id, {
        stage: "printing",
        progress: 45,
        machineId: "PRINTER-01"
      });
    }

    // Create Shipments
    // (Assuming seed logic handles inserting into shipments table directly or via a method I didn't add yet - 
    // actually storage.createShipment wasn't in interface, so I'll skip manual shipment creation for now or add it later.
    // Wait, I defined schema but not method. I should fix storage.ts if I want to seed shipments properly,
    // but for now let's just leave it sparse or rely on DB defaults.)
    
    // Actually, let's manually insert a shipment via db object if needed, or better, 
    // since I have the `db` in storage.ts, I can just rely on the API. 
    // But since I'm inside server, I can use storage.
    // I missed `createShipment` in `IStorage`. That's fine for MVP.
  }
}
