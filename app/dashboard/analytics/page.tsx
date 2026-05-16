'use client';

import { useState, useEffect } from 'react';
import { Header, Card, EmptyState } from '@/app/components/ui';

interface ProductAnalytics {
  productId: string;
  productTitle: string;
  totalQuantity: number;
  totalRevenue: number;
}

interface Analytics {
  totalRevenue: number;
  orderCount: number;
  topProducts: ProductAnalytics[];
  periodDays: number;
}

export default function AnalyticsPage() {
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadAnalytics() {
      try {
        const res = await fetch('/api/analytics');
        if (!res.ok) throw new Error('Failed to load analytics');
        const data = await res.json();
        setAnalytics(data.analytics);
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
                <div className="text-sm font-semibold text-slate mb-1">TOTAL REVENUE</div>
                <div className="text-sm text-slate/60">Last 30 days</div>
              </div>
              <div className="text-3xl">💰</div>
            </div>
            <div className="text-4xl font-bold text-emerald">
              ${((analytics?.totalRevenue || 0) / 100).toFixed(2)}
            </div>
          </Card>

          <Card>
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="text-sm font-semibold text-slate mb-1">TOTAL ORDERS</div>
                <div className="text-sm text-slate/60">Last 30 days</div>
              </div>
              <div className="text-3xl">📦</div>
            </div>
            <div className="text-4xl font-bold text-slateBlue">
              {analytics?.orderCount || 0}
            </div>
          </Card>

          <Card>
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="text-sm font-semibold text-slate mb-1">AVG ORDER VALUE</div>
                <div className="text-sm text-slate/60">Per transaction</div>
              </div>
              <div className="text-3xl">💵</div>
            </div>
            <div className="text-4xl font-bold text-charcoal">
              ${(avgOrderValue / 100).toFixed(2)}
            </div>
          </Card>
        </div>

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
                        ${(product.totalRevenue / 100).toFixed(2)}
                      </div>
                      <div className="text-xs text-slate">
                        ${((product.totalRevenue / product.totalQuantity) / 100).toFixed(2)} avg
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
                      You've generated over ${((analytics!.totalRevenue / 100)).toFixed(0)} in the last 30 days.
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
                      Your average order value of ${(avgOrderValue / 100).toFixed(2)} is excellent.
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
