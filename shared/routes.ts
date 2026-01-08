import { z } from 'zod';
import { 
  insertOrderSchema, 
  insertProductionSchema, 
  insertShipmentSchema, 
  insertAlertSchema,
  orders,
  productionQueue,
  shipments,
  alerts
} from './schema';

export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  notFound: z.object({
    message: z.string(),
  }),
  internal: z.object({
    message: z.string(),
  }),
};

export const api = {
  dashboard: {
    stats: {
      method: 'GET' as const,
      path: '/api/stats',
      responses: {
        200: z.object({
          totalOrders: z.number(),
          ordersInProduction: z.number(),
          ordersInTransit: z.number(),
          delayedJobs: z.number(),
        }),
      },
    },
  },
  orders: {
    list: {
      method: 'GET' as const,
      path: '/api/orders',
      responses: {
        200: z.array(z.custom<typeof orders.$inferSelect>()),
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/orders',
      input: insertOrderSchema,
      responses: {
        201: z.custom<typeof orders.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
    get: {
      method: 'GET' as const,
      path: '/api/orders/:id',
      responses: {
        200: z.custom<typeof orders.$inferSelect>(),
        404: errorSchemas.notFound,
      },
    },
  },
  production: {
    list: {
      method: 'GET' as const,
      path: '/api/production',
      responses: {
        200: z.array(z.custom<typeof productionQueue.$inferSelect>()),
      },
    },
    update: {
      method: 'PATCH' as const,
      path: '/api/production/:id',
      input: insertProductionSchema.partial(),
      responses: {
        200: z.custom<typeof productionQueue.$inferSelect>(),
        404: errorSchemas.notFound,
      },
    },
  },
  shipments: {
    list: {
      method: 'GET' as const,
      path: '/api/shipments',
      responses: {
        200: z.array(z.custom<typeof shipments.$inferSelect>()),
      },
    },
  },
  alerts: {
    list: {
      method: 'GET' as const,
      path: '/api/alerts',
      responses: {
        200: z.array(z.custom<typeof alerts.$inferSelect>()),
      },
    },
    markRead: {
      method: 'POST' as const,
      path: '/api/alerts/:id/read',
      responses: {
        200: z.custom<typeof alerts.$inferSelect>(),
      },
    },
  },
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}
