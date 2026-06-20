/**
 * Order Fulfillment Service
 * Handles order routing, tracking, and delivery coordination
 */

export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  source: "shopify" | "amazon" | "chewy" | "alibaba" | "local";
}

export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  totalPrice: number;
  currency: string;
  status: "pending" | "confirmed" | "processing" | "shipped" | "delivered" | "cancelled";
  createdAt: Date;
  estimatedDelivery?: Date;
  actualDelivery?: Date;
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  trackingNumber?: string;
  notes?: string;
}

export interface FulfillmentEstimate {
  estimatedDays: number;
  estimatedCost: number;
  supplier: string;
  confidence: number; // 0-1
}

/**
 * Calculate fulfillment estimates for an order
 */
export function calculateFulfillmentEstimates(
  items: OrderItem[]
): FulfillmentEstimate[] {
  const estimates: FulfillmentEstimate[] = [];

  // Group items by source
  const bySource = items.reduce(
    (acc, item) => {
      if (!acc[item.source]) acc[item.source] = [];
      acc[item.source].push(item);
      return acc;
    },
    {} as Record<string, OrderItem[]>
  );

  // Calculate estimate for each source
  for (const [source, sourceItems] of Object.entries(bySource)) {
    const totalPrice = sourceItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

    let estimatedDays = 2;
    let shippingCost = 0;
    let confidence = 0.9;

    switch (source) {
      case "shopify":
        estimatedDays = 2;
        shippingCost = totalPrice > 100 ? 0 : 15;
        confidence = 0.95;
        break;
      case "amazon":
        estimatedDays = 3;
        shippingCost = totalPrice > 150 ? 0 : 20;
        confidence = 0.92;
        break;
      case "chewy":
        estimatedDays = 1;
        shippingCost = totalPrice > 50 ? 0 : 10;
        confidence = 0.9;
        break;
      case "alibaba":
        estimatedDays = 7;
        shippingCost = 25;
        confidence = 0.7;
        break;
      case "local":
        estimatedDays = 3;
        shippingCost = 5;
        confidence = 0.85;
        break;
    }

    estimates.push({
      estimatedDays,
      estimatedCost: shippingCost,
      supplier: source,
      confidence,
    });
  }

  // Sort by estimated days
  return estimates.sort((a, b) => a.estimatedDays - b.estimatedDays);
}

/**
 * Create order from cart items
 */
export async function createOrder(
  userId: string,
  items: OrderItem[],
  shippingAddress: Order["shippingAddress"]
): Promise<Order> {
  const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // Calculate estimated delivery
  const estimates = calculateFulfillmentEstimates(items);
  const fastestEstimate = estimates[0];
  const estimatedDelivery = new Date();
  estimatedDelivery.setDate(estimatedDelivery.getDate() + fastestEstimate.estimatedDays);

  const order: Order = {
    id: `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    userId,
    items,
    totalPrice,
    currency: "EGP",
    status: "pending",
    createdAt: new Date(),
    estimatedDelivery,
    shippingAddress,
  };

  return order;
}

/**
 * Route order to appropriate supplier
 */
export function routeOrderToSupplier(order: Order): {
  supplier: string;
  trackingUrl?: string;
  estimatedDelivery: Date;
} {
  // Group items by source
  const bySource = order.items.reduce(
    (acc, item) => {
      if (!acc[item.source]) acc[item.source] = [];
      acc[item.source].push(item);
      return acc;
    },
    {} as Record<string, OrderItem[]>
  );

  // Find primary supplier (most items)
  const primarySupplier = Object.entries(bySource).sort(
    ([, a], [, b]) => b.length - a.length
  )[0][0];

  // Generate tracking URL based on supplier
  let trackingUrl: string | undefined;
  switch (primarySupplier) {
    case "shopify":
      trackingUrl = `https://shopify.example.com/track/${order.id}`;
      break;
    case "amazon":
      trackingUrl = `https://amazon.example.com/track/${order.id}`;
      break;
    case "chewy":
      trackingUrl = `https://chewy.example.com/track/${order.id}`;
      break;
    case "alibaba":
      trackingUrl = `https://alibaba.example.com/track/${order.id}`;
      break;
    case "local":
      trackingUrl = `https://local-supplier.example.com/track/${order.id}`;
      break;
  }

  return {
    supplier: primarySupplier,
    trackingUrl,
    estimatedDelivery: order.estimatedDelivery || new Date(),
  };
}

/**
 * Update order status
 */
export function updateOrderStatus(
  order: Order,
  newStatus: Order["status"],
  trackingNumber?: string
): Order {
  return {
    ...order,
    status: newStatus,
    trackingNumber: trackingNumber || order.trackingNumber,
  };
}

/**
 * Calculate order margin (for business analytics)
 */
export function calculateOrderMargin(order: Order): {
  totalCost: number;
  totalPrice: number;
  margin: number;
  marginPercentage: number;
} {
  // Mock cost calculation (typically 60-70% of retail price)
  const totalCost = order.totalPrice * 0.65;
  const margin = order.totalPrice - totalCost;
  const marginPercentage = (margin / order.totalPrice) * 100;

  return {
    totalCost,
    totalPrice: order.totalPrice,
    margin,
    marginPercentage,
  };
}

/**
 * Get order summary for user
 */
export function getOrderSummary(order: Order): {
  orderNumber: string;
  status: string;
  items: number;
  totalPrice: number;
  estimatedDelivery: string;
  trackingUrl?: string;
} {
  const routing = routeOrderToSupplier(order);

  return {
    orderNumber: order.id,
    status: order.status,
    items: order.items.reduce((sum, item) => sum + item.quantity, 0),
    totalPrice: order.totalPrice,
    estimatedDelivery: order.estimatedDelivery?.toLocaleDateString() || "TBD",
    trackingUrl: routing.trackingUrl,
  };
}
