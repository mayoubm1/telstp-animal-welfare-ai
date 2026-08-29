import { router, protectedProcedure } from "../_core/trpc";
import { z } from "zod";
import type { User } from "../../drizzle/schema";
import {
  createOrder,
  routeOrderToSupplier,
  updateOrderStatus,
  calculateOrderMargin,
  getOrderSummary,
  calculateFulfillmentEstimates,
  type OrderItem,
  type Order,
} from "../services/order-fulfillment";

// Mock database for orders (in production, use actual database)
const ordersDB: Map<string, Order> = new Map();

export const ordersRouter = router({
  // Create order from cart
  create: protectedProcedure
    .input(
      z.object({
        items: z.array(
          z.object({
            productId: z.string(),
            productName: z.string(),
            quantity: z.number().min(1),
            price: z.number().min(0),
            source: z.enum(["shopify", "amazon", "chewy", "alibaba", "local"]),
          })
        ),
        shippingAddress: z.object({
          street: z.string(),
          city: z.string(),
          state: z.string(),
          postalCode: z.string(),
          country: z.string(),
        }),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const order = await createOrder((ctx.user as User).id.toString(), input.items, input.shippingAddress);
      ordersDB.set(order.id, order);

      // Route to supplier
      const routing = routeOrderToSupplier(order);

      return {
        orderId: order.id,
        status: order.status,
        totalPrice: order.totalPrice,
        estimatedDelivery: order.estimatedDelivery,
        supplier: routing.supplier,
        trackingUrl: routing.trackingUrl,
      };
    }),

  // Get order by ID
  get: protectedProcedure
    .input(z.object({ orderId: z.string() }))
    .query(({ input, ctx }) => {
      const order = ordersDB.get(input.orderId);
      if (!order) throw new Error("Order not found");
      if (order.userId !== (ctx.user as User).id.toString()) throw new Error("Unauthorized");
      return getOrderSummary(order);
    }) as any,

  // List user orders
  list: protectedProcedure.query(({ ctx }) => {
    const userOrders = Array.from(ordersDB.values()).filter(
      (order: Order) => order.userId === (ctx.user as User).id.toString()
    );
    return userOrders.map(getOrderSummary);
  }) as any,

  // Update order status (admin only)
  updateStatus: protectedProcedure
    .input(
      z.object({
        orderId: z.string(),
        status: z.enum(["pending", "confirmed", "processing", "shipped", "delivered", "cancelled"]),
        trackingNumber: z.string().optional(),
      })
    )
    .mutation(({ input, ctx }) => {
      const order = ordersDB.get(input.orderId);
      if (!order) throw new Error("Order not found");
      if ((ctx.user as User).role !== "admin" && order.userId !== (ctx.user as User).id.toString()) {
        throw new Error("Unauthorized");
      }

      const updated = updateOrderStatus(order, input.status as any, input.trackingNumber);
      ordersDB.set(input.orderId, updated);
      return getOrderSummary(updated);
    }) as any,

  // Get fulfillment estimates
  getFulfillmentEstimates: protectedProcedure
    .input(
      z.object({
        items: z.array(
          z.object({
            productId: z.string(),
            productName: z.string(),
            quantity: z.number(),
            price: z.number(),
            source: z.enum(["shopify", "amazon", "chewy", "alibaba", "local"]),
          })
        ),
      })
    )
    .query(({ input }) => {
      return calculateFulfillmentEstimates(input.items);
    }),

  // Get order analytics (admin only)
  analytics: protectedProcedure.query(({ ctx }) => {
    if ((ctx.user as User).role !== "admin") throw new Error("Unauthorized");

    const allOrders = Array.from(ordersDB.values());
    const totalOrders = allOrders.length;
    const totalRevenue = allOrders.reduce((sum, order) => sum + order.totalPrice, 0);

    // Calculate margins
    const margins = allOrders.map(calculateOrderMargin);
    const totalCost = margins.reduce((sum, m) => sum + m.totalCost, 0);
    const totalMargin = margins.reduce((sum, m) => sum + m.margin, 0);
    const avgMarginPercentage =
      margins.length > 0 ? margins.reduce((sum, m) => sum + m.marginPercentage, 0) / margins.length : 0;

    // Status breakdown
    const statusBreakdown = {
      pending: allOrders.filter((o: Order) => o.status === "pending").length,
      confirmed: allOrders.filter((o: Order) => o.status === "confirmed").length,
      processing: allOrders.filter((o: Order) => o.status === "processing").length,
      shipped: allOrders.filter((o: Order) => o.status === "shipped").length,
      delivered: allOrders.filter((o: Order) => o.status === "delivered").length,
      cancelled: allOrders.filter((o: Order) => o.status === "cancelled").length,
    };

    // Supplier breakdown
    const supplierBreakdown: Record<string, number> = {};
    allOrders.forEach((order) => {
      order.items.forEach((item) => {
        supplierBreakdown[item.source] = (supplierBreakdown[item.source] || 0) + item.quantity;
      });
    });

    return {
      totalOrders,
      totalRevenue,
      totalCost,
      totalMargin,
      avgMarginPercentage,
      statusBreakdown,
      supplierBreakdown,
      averageOrderValue: totalOrders > 0 ? totalRevenue / totalOrders : 0,
    };
  }),
});
