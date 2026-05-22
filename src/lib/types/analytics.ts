// Centralized analytics types
// Standards compliance: Single source of truth for ProductAnalytics DTO
// Used by: app/dashboard/analytics/page.tsx, app/components/AnalyticsCards.tsx

// Aligns with Prisma Product model (id, title fields) and API response
export interface ProductAnalytics {
  id: string;
  title: string;
  totalQuantity: number;
  totalRevenue: number;
}

export interface DailyRevenue {
  date: string;
  revenue: number;
}

export interface Analytics {
  totalRevenue: number;
  orderCount: number;
  productCount?: number; // Optional - added in later iterations
  topProducts: ProductAnalytics[];
  dailyRevenue?: DailyRevenue[]; // Optional - only in detailed analytics
  periodDays: number;
}
