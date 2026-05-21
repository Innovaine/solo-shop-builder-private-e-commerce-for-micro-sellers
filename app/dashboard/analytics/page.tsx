'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/ui/Header';
import { Card } from '@/components/ui/Card';
import { EmptyState } from '@/components/ui/EmptyState';
import { formatPrice, type Currency } from '@/lib/currency';

interface ProductAnalytics {
  productId: string;
  productTitle: string;
  totalQuantity: number;
  totalRevenue: number;
}

interface DailyRevenue {
  date: string;
  revenue: number;
}

interface Analytics {
  totalRevenue: number;
  orderCount: number;
  topProducts: ProductAnalytics[];
  dailyRevenue: DailyRevenue[];
  periodDays: number;
}

export default function AnalyticsPage() {
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [error, setError] = useState('');
  const [shopCurrency, setShopCurrency] = useState<Currency>('USD');

  useEffect(() => {
    async function loadAnalytics() {
      try {
        const [analyticsRes, shopsRes] = await Promise.all([
          fetch('/api/analytics'),
          fetch('/api/shops'),
        ]);
        
        if (!analyticsRes.ok) throw new Error('Failed to load analytics');
        const data = await analyticsRes.json();
        setAnalytics(data.analytics);
        
        // Load shop currency
        if (shopsRes.ok) {
          const shopsData = await shopsRes.json();
          if (Array.isArray(shopsData) && shopsData.length > 0 && shopsData[0].currency) {
            setShopCurrency(shopsData[0].currency as Currency);
          }
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    loadAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-cream">
        <Header />
        <main className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center py-12">
            <div className="text-4xl mb-4">📊</div>
            <p className="text-slate">Loading analytics...</p>
          </div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-cream">
        <Header />
        <main className="max-w-7xl mx-auto px-4 py-8">
          <div className="bg-rose/10 border border-rose text-rose px-4 py-3 rounded">
            {error}
          </div>
        </main>
      </div>
    );
  }

  const avgOrderValue = analytics && analytics.orderCount > 0
    ? analytics.totalRevenue / analytics.orderCount
    : 0;

  const hasOrders = analytics && analytics.orderCount > 0;
  const hasProducts = analytics && analytics.topProducts && analytics.topProducts.length > 0;
  const hasDailyData = analytics && analytics.dailyRevenue && analytics.dailyRevenue.length > 0;

  // Calculate max revenue for chart scaling
  const maxRevenue = hasDailyData
    ? Math.max(...analytics!.dailyRevenue.map(d => d.revenue))
    : 0;

  return (
    <div className="min-h-screen bg-cream">
      <Header />
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-charcoal mb-2">Analytics Dashboard</h1>
          <p className="text-slate">Insights into your shop performance over the last 30 days</p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="text-xs font-semibold text-slate mb-1 uppercase tracking-wide">TOTAL REVENUE</div>
                <div className="text-xs text-slate/60">Last 30 days</div>
              </div>
              <div className="text-3xl">💰</div>
            </div>
            <div className="text-4xl font-bold text-emerald">
              {formatPrice(analytics?.totalRevenue || 0, shopCurrency)}
            </div>
          </Card>

          <Card>
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="text-xs font-semibold text-slate mb-1 uppercase tracking-wide">TOTAL ORDERS</div>
                <div className="text-xs text-slate/60">Last 30 days</div>
              </div>
              <div className="text-3xl">📦</div>
            </div>
            <div className="text-4xl font-bold text-slate-blue">
              {analytics?.orderCount || 0}
            </div>
          </Card>

          <Card>
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="text-xs font-semibold text-slate mb-1 uppercase tracking-wide">AVG ORDER VALUE</div>
                <div className="text-xs text-slate/60">Per transaction</div>
              </div>
              <div className="text-3xl">💵</div>
            </div>
            <div className="text-4xl font-bold text-charcoal">
              {formatPrice(avgOrderValue, shopCurrency)}
            </div>
          </Card>
        </div>

        {/* FR-36: Daily Revenue Chart */}
        {hasDailyData && (
          <Card className="mb-8">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-charcoal mb-1">Daily Revenue</h2>
              <p className="text-slate text-sm">Revenue trends over the last 30 days</p>
            </div>
            
            <div className="bg-cream rounded-lg p-6" style={{ minHeight: '320px' }}>
              <div className="h-64 flex items-end justify-around gap-2">
                {analytics!.dailyRevenue.map((day, index) => {
                  const heightPercent = maxRevenue > 0 ? (day.revenue / maxRevenue) * 100 : 0;
                  const date = new Date(day.date);
                  const dayLabel = date.getDate();
                  
                  return (
                    <div key={index} className="flex-1 flex flex-col items-center justify-end h-full relative group">
                      {/* Bar */}
                      <div
                        className="w-full bg-slate-blue rounded-t hover:bg-emerald transition-colors relative"
                        style={{ height: `${heightPercent}%`, minHeight: day.revenue > 0 ? '4px' : '0' }}
                      >
                        {/* Tooltip on hover */}
                        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-charcoal text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                          {formatPrice(day.revenue, shopCurrency)}
                        </div>
                      </div>
                      
                      {/* Day label */}
                      <div className="text-xs text-slate mt-2">{dayLabel}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </Card>
        )}

        {/* Top Products */}
        <Card>
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-charcoal mb-1">Top Selling Products</h2>
            <p className="text-slate text-sm">Products ranked by quantity sold in the last 30 days</p>
          </div>

          {hasProducts ? (
            <div className="space-y-4">
              {analytics!.topProducts.map((product, index) => {
                const isTopSeller = index === 0;
                return (
                  <div
                    key={product.productId}
                    className={`flex items-center justify-between p-4 rounded-lg border ${
                      isTopSeller
                        ? 'bg-emerald/5 border-emerald/20'
                        : 'bg-white border-whisper'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold ${
                          isTopSeller
                            ? 'bg-emerald text-white'
                            : 'bg-slate/10 text-slate'
                        }`}
                      >
                        #{index + 1}
                      </div>
                      <div>
                        <div className="font-semibold text-charcoal mb-1">
                          {product.productTitle}
                          {isTopSeller && (
                            <span className="ml-2 text-xs bg-emerald text-white px-2 py-0.5 rounded">
                              BEST SELLER
                            </span>
                          )}
                        </div>
                        <div className="text-sm text-slate">
                          {product.totalQuantity} units sold
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-emerald mb-1">
                        {formatPrice(product.totalRevenue, shopCurrency)}
                      </div>
                      <div className="text-xs text-slate">
                        {formatPrice(product.totalRevenue / product.totalQuantity, shopCurrency)} avg
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <EmptyState
              icon="📦"
              title="No product sales yet"
              description={
                hasOrders
                  ? "You have orders but product data isn't available yet"
                  : 'Start selling to see your top products here'
              }
            />
          )}
        </Card>

        {/* Performance Insights */}
        {hasOrders && (
          <Card className="mt-6">
            <div className="mb-4">
              <h2 className="text-lg font-bold text-charcoal mb-1">Performance Insights</h2>
            </div>
            <div className="space-y-3 text-sm">
              {analytics!.totalRevenue >= 10000 && (
                <div className="flex items-start gap-3 p-3 bg-emerald/5 rounded border border-emerald/20">
                  <div className="text-xl">🎉</div>
                  <div>
                    <div className="font-medium text-charcoal">Great revenue!</div>
                    <div className="text-slate">
                      You've generated over {formatPrice(analytics!.totalRevenue, shopCurrency)} in the last 30 days.
                    </div>
                  </div>
                </div>
              )}
              
              {analytics!.orderCount >= 10 && (
                <div className="flex items-start gap-3 p-3 bg-emerald/5 rounded border border-emerald/20">
                  <div className="text-xl">📈</div>
                  <div>
                    <div className="font-medium text-charcoal">Healthy order volume</div>
                    <div className="text-slate">
                      {analytics!.orderCount} orders in 30 days means steady customer interest.
                    </div>
                  </div>
                </div>
              )}

              {avgOrderValue > 5000 && (
                <div className="flex items-start gap-3 p-3 bg-emerald/5 rounded border border-emerald/20">
                  <div className="text-xl">💎</div>
                  <div>
                    <div className="font-medium text-charcoal">High-value orders</div>
                    <div className="text-slate">
                      Your average order value of {formatPrice(avgOrderValue, shopCurrency)} is excellent.
                    </div>
                  </div>
                </div>
              )}

              {!hasProducts && (
                <div className="flex items-start gap-3 p-3 bg-amber/5 rounded border border-amber/20">
                  <div className="text-xl">💡</div>
                  <div>
                    <div className="font-medium text-charcoal">Tip</div>
                    <div className="text-slate">
                      Track which products are selling best to optimize your inventory.
                    </div>
                  </div>
                </div>
              )}
            </div>
          </Card>
        )}

        {/* Empty State */}
        {!hasOrders && (
          <Card className="mt-6">
            <EmptyState
              icon="📊"
              title="No analytics data yet"
              description="Start receiving orders to see your shop's performance metrics. Analytics are calculated based on the last 30 days of activity."
            />
          </Card>
        )}
      </main>
    </div>
  );
}
