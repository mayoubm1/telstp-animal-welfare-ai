/**
 * Natural Alternatives Aggregation Service
 * Aggregates products from multiple sources with filtering and comparison
 */

export interface NaturalProduct {
  id: string;
  titleAr: string;
  titleEn: string;
  descriptionAr: string;
  descriptionEn: string;
  category: "food" | "supplement" | "treat" | "accessory" | "toy";
  price: number;
  currency: string;
  source: "shopify" | "amazon" | "chewy" | "alibaba" | "local";
  sourceUrl?: string;
  certifications: string[]; // "organic", "non-gmo", "eco-friendly", etc.
  deliveryDays: number;
  availability: "in-stock" | "pre-order" | "out-of-stock";
  rating: number; // 0-5
  reviews: number;
  quality: "premium" | "standard" | "budget";
  tags: string[];
  image?: string;
  shopifyHandle?: string; // For Shopify products
}

export interface FilterOptions {
  categories?: string[];
  certifications?: string[];
  maxPrice?: number;
  minPrice?: number;
  maxDeliveryDays?: number;
  quality?: string[];
  availability?: string[];
  sortBy?: "price-asc" | "price-desc" | "rating" | "delivery" | "newest";
}

// Mock database of natural products from multiple sources
export const naturalProductsDB: NaturalProduct[] = [
  // Shopify Products
  {
    id: "shopify-1",
    titleAr: "طعام الكلاب العضوي الممتاز",
    titleEn: "Premium Organic Dog Food",
    descriptionAr: "طعام عضوي معتمد بدون حبوب مع مكونات طبيعية 100%",
    descriptionEn: "Certified organic grain-free food with 100% natural ingredients",
    category: "food",
    price: 45.99,
    currency: "EGP",
    source: "shopify",
    sourceUrl: "https://shopify.example.com/products/premium-dog-food",
    certifications: ["organic", "non-gmo", "grain-free"],
    deliveryDays: 2,
    availability: "in-stock",
    rating: 4.8,
    reviews: 234,
    quality: "premium",
    tags: ["organic", "natural", "grain-free", "premium"],
    shopifyHandle: "premium-organic-grain-free-dog-food",
  },
  {
    id: "shopify-2",
    titleAr: "حبل التدريب الاحترافي",
    titleEn: "Professional Training Leash",
    descriptionAr: "حبل تدريب متين قابل للتعديل مع معدات ثقيلة",
    descriptionEn: "Durable adjustable training leash with heavy-duty hardware",
    category: "accessory",
    price: 29.99,
    currency: "EGP",
    source: "shopify",
    sourceUrl: "https://shopify.example.com/products/training-leash",
    certifications: ["eco-friendly"],
    deliveryDays: 2,
    availability: "in-stock",
    rating: 4.6,
    reviews: 156,
    quality: "premium",
    tags: ["training", "professional", "durable"],
    shopifyHandle: "professional-training-leash",
  },

  // Amazon Products (Mock)
  {
    id: "amazon-1",
    titleAr: "مكملات الجلوكوسامين الطبيعية",
    titleEn: "Natural Glucosamine Supplements",
    descriptionAr: "مكملات طبيعية لصحة المفاصل والحركة",
    descriptionEn: "Natural supplements for joint health and mobility",
    category: "supplement",
    price: 35.5,
    currency: "EGP",
    source: "amazon",
    sourceUrl: "https://amazon.example.com/Natural-Glucosamine",
    certifications: ["natural", "non-gmo"],
    deliveryDays: 3,
    availability: "in-stock",
    rating: 4.5,
    reviews: 89,
    quality: "premium",
    tags: ["supplement", "joint-health", "natural"],
  },

  // Chewy Products (Mock)
  {
    id: "chewy-1",
    titleAr: "علاجات لحم البقر الطبيعية",
    titleEn: "Natural Beef Treats",
    descriptionAr: "علاجات لحم بقر طبيعي 100% بدون إضافات",
    descriptionEn: "100% natural beef treats with no additives",
    category: "treat",
    price: 22.99,
    currency: "EGP",
    source: "chewy",
    sourceUrl: "https://chewy.example.com/natural-beef-treats",
    certifications: ["natural", "no-additives"],
    deliveryDays: 1,
    availability: "in-stock",
    rating: 4.7,
    reviews: 342,
    quality: "premium",
    tags: ["treats", "beef", "natural", "high-protein"],
  },

  // Budget Alternatives
  {
    id: "local-1",
    titleAr: "طعام الكلاب الطبيعي القياسي",
    titleEn: "Standard Natural Dog Food",
    descriptionAr: "طعام طبيعي جيد الجودة بسعر معقول",
    descriptionEn: "Good quality natural food at reasonable price",
    category: "food",
    price: 24.99,
    currency: "EGP",
    source: "local",
    sourceUrl: "https://local-supplier.example.com/dog-food",
    certifications: ["natural"],
    deliveryDays: 3,
    availability: "in-stock",
    rating: 4.2,
    reviews: 67,
    quality: "standard",
    tags: ["natural", "budget-friendly", "local"],
  },

  // Alibaba/Bulk Options
  {
    id: "alibaba-1",
    titleAr: "ألعاب الكلاب الطبيعية بالجملة",
    titleEn: "Natural Dog Toys Bulk",
    descriptionAr: "ألعاب طبيعية آمنة للكلاب - شراء بالجملة",
    descriptionEn: "Safe natural dog toys - bulk purchase",
    category: "toy",
    price: 18.5,
    currency: "EGP",
    source: "alibaba",
    sourceUrl: "https://alibaba.example.com/natural-dog-toys",
    certifications: ["eco-friendly", "non-toxic"],
    deliveryDays: 7,
    availability: "pre-order",
    rating: 4.1,
    reviews: 45,
    quality: "standard",
    tags: ["toys", "bulk", "eco-friendly"],
  },
];

/**
 * Filter and search natural products
 */
export function filterNaturalProducts(
  query?: string,
  filters?: FilterOptions
): NaturalProduct[] {
  let results = [...naturalProductsDB];

  // Text search
  if (query) {
    const q = query.toLowerCase();
    results = results.filter(
      (p) =>
        p.titleEn.toLowerCase().includes(q) ||
        p.titleAr.includes(q) ||
        p.descriptionEn.toLowerCase().includes(q) ||
        p.tags.some((tag) => tag.toLowerCase().includes(q))
    );
  }

  // Apply filters
  if (filters) {
    if (filters.categories && filters.categories.length > 0) {
      results = results.filter((p) => filters.categories!.includes(p.category));
    }

    if (filters.certifications && filters.certifications.length > 0) {
      results = results.filter((p) =>
        filters.certifications!.some((cert) =>
          p.certifications.includes(cert)
        )
      );
    }

    if (filters.maxPrice !== undefined) {
      results = results.filter((p) => p.price <= filters.maxPrice!);
    }

    if (filters.minPrice !== undefined) {
      results = results.filter((p) => p.price >= filters.minPrice!);
    }

    if (filters.maxDeliveryDays !== undefined) {
      results = results.filter((p) => p.deliveryDays <= filters.maxDeliveryDays!);
    }

    if (filters.quality && filters.quality.length > 0) {
      results = results.filter((p) => filters.quality!.includes(p.quality));
    }

    if (filters.availability && filters.availability.length > 0) {
      results = results.filter((p) =>
        filters.availability!.includes(p.availability)
      );
    }
  }

  // Sort
  const sortBy = filters?.sortBy || "rating";
  results.sort((a, b) => {
    switch (sortBy) {
      case "price-asc":
        return a.price - b.price;
      case "price-desc":
        return b.price - a.price;
      case "rating":
        return b.rating - a.rating;
      case "delivery":
        return a.deliveryDays - b.deliveryDays;
      case "newest":
        return 0; // Would need timestamp
      default:
        return 0;
    }
  });

  return results;
}

/**
 * Get product comparison for same category
 */
export function compareProducts(
  category: string
): Array<Omit<NaturalProduct, "descriptionAr" | "descriptionEn">> {
  return filterNaturalProducts(undefined, { categories: [category] }).map(
    (p) => {
      const { descriptionAr, descriptionEn, ...rest } = p;
      return rest;
    }
  );
}

/**
 * Get best value products (price-to-rating ratio)
 */
export function getBestValueProducts(limit = 5): NaturalProduct[] {
  const withValue = naturalProductsDB.map((p) => ({
    ...p,
    value: p.rating / (p.price / 10), // Rating per 10 EGP
  }));

  return withValue
    .sort((a, b) => b.value - a.value)
    .slice(0, limit)
    .map(({ value, ...p }) => p);
}
