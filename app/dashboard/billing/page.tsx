'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/ui/Header';
import Card from '@/components/ui/Card';
import EmptyState from '@/components/ui/EmptyState';

interface BillingData {
  totalRevenue: number;
  totalOrders: number;
  averageOrderValue: number;
  stripeFees: number;
  netRevenue: number;
  transactions: {
    id: string;
    date: string;
    orderId: string;
    customerEmail: string;
    amount: number;
    stripeFee: number;
    net: number;
    status: string;
  }[];
}

export default function BillingPage() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<BillingData | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadBilling() {
      try {
        const res = await fetch('/api/billing');
        if (!res.ok) throw new Error('Failed to load billing data');
        const billingData = await res.json();
        setData(billingData);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    loadBilling();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-cream">
        <Header />
        <main className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center py-12">
            <div className="text-4xl mb-4">💳</div>
            <p className="text-slate">Loading billing data...</p>
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

  const hasTransactions = data && data.transactions && data.transactions.length > 0;

  return (
    <div className="min-h-screen bg-cream">
      <Header />
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-charcoal mb-2">Billing Dashboard</h1>
          <p className="text-slate">View your transaction history and revenue summary</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          <Card>
            <div className="text-sm text-slate mb-1">Total Revenue</div>
            <div className="text-3xl font-bold text-charcoal">
              ${((data?.totalRevenue || 0) / 100).toFixed(2)}
            </div>
          </Card>

          <Card>
            <div className="text-sm text-slate mb-1">Total Orders</div>
            <div className="text-3xl font-bold text-charcoal">
              {data?.totalOrders || 0}
            </div>
          </Card>

          <Card>
            <div className="text-sm text-slate mb-1">Average Order</div>
            <div className="text-3xl font-bold text-charcoal">
              ${((data?.averageOrderValue || 0) / 100).toFixed(2)}
            </div>
          </Card>

          <Card>
            <div className="text-sm text-slate mb-1">Stripe Fees</div>
            <div className="text-3xl font-bold text-rose">
              -${((data?.stripeFees || 0) / 100).toFixed(2)}
            </div>
          </Card>

          <Card>
            <div className="text-sm text-slate mb-1">Net Revenue</div>
            <div className="text-3xl font-bold text-emerald">
              ${((data?.netRevenue || 0) / 100).toFixed(2)}
            </div>
          </Card>
        </div>

        {/* Transaction History */}
        <Card>
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-charcoal mb-1">Transaction History</h2>
            <p className="text-slate text-sm">All time transactions from your shop</p>
          </div>

          {hasTransactions ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-whisper text-left">
                    <th className="pb-3 text-sm font-semibold text-charcoal">Date</th>
                    <th className="pb-3 text-sm font-semibold text-charcoal">Order ID</th>
                    <th className="pb-3 text-sm font-semibold text-charcoal">Customer</th>
                    <th className="pb-3 text-sm font-semibold text-charcoal text-right">Amount</th>
                    <th className="pb-3 text-sm font-semibold text-charcoal text-right">Stripe Fee</th>
                    <th className="pb-3 text-sm font-semibold text-charcoal text-right">Net</th>
                    <th className="pb-3 text-sm font-semibold text-charcoal">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {data!.transactions.map((txn) => (
                    <tr key={txn.id} className="border-b border-whisper/50">
                      <td className="py-3 text-sm text-slate">
                        {new Date(txn.date).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </td>
                      <td className="py-3 text-sm text-charcoal font-mono">
                        {txn.orderId.slice(0, 8)}
                      </td>
                      <td className="py-3 text-sm text-slate">{txn.customerEmail}</td>
                      <td className="py-3 text-sm text-charcoal text-right font-medium">
                        ${(txn.amount / 100).toFixed(2)}
                      </td>
                      <td className="py-3 text-sm text-rose text-right">
                        -${(txn.stripeFee / 100).toFixed(2)}
                      </td>
                      <td className="py-3 text-sm text-emerald text-right font-medium">
                        ${(txn.net / 100).toFixed(2)}
                      </td>
                      <td className="py-3">
                        <span
                          className={`inline-block px-2 py-1 text-xs font-medium rounded ${
                            txn.status === 'paid'
                              ? 'bg-emerald/10 text-emerald'
                              : 'bg-slate/10 text-slate'
                          }`}
                        >
                          {txn.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <EmptyState
              icon="💳"
              title="No transactions yet"
              description="Transactions will appear here once you start receiving orders"
            />
          )}
        </Card>

        {/* Fee Info */}
        <div className="mt-6 p-4 bg-amber/10 border border-amber rounded text-sm">
          <p className="font-medium text-charcoal mb-2">💡 About Stripe Fees</p>
          <p className="text-slate">
            Stripe charges 2.9% + $0.30 per successful transaction. Fees are automatically deducted and shown in the Net Revenue column.
            These fees are standard for online payment processing and cover fraud protection, compliance, and infrastructure.
          </p>
        </div>
      </main>
    </div>
  );
}
