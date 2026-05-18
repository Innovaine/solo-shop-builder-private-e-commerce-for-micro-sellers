import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import prisma from '@/lib/db';
import { verifySession } from '@/lib/auth';

// GET /api/billing — Get billing dashboard data (FR-37)
export async function GET(req: NextRequest) {
  try {
    // Auth check
    const sessionCookie = cookies().get('session');
    if (!sessionCookie) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const session = await verifySession(sessionCookie.value);
    if (!session) {
      return NextResponse.json({ error: 'Session expired' }, { status: 401 });
    }

    // Get first shop for this seller
    const shop = await prisma.shop.findFirst({
      where: { sellerId: session.sellerId },
    });
    
    if (!shop) {
      return NextResponse.json({ error: 'No shop found' }, { status: 404 });
    }

    // Get all paid orders for this shop
    const orders = await prisma.order.findMany({
      where: {
        shopId: shop.id,
        status: 'paid',
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Calculate metrics
    const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
    const totalOrders = orders.length;
    const averageOrderValue = totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0;

    // ASSUMPTION: Stripe fee is 2.9% + $0.30 per transaction
    const stripeFees = orders.reduce((sum, order) => {
      const percentFee = Math.round(order.total * 0.029); // 2.9%
      const fixedFee = 30; // $0.30 in cents
      return sum + percentFee + fixedFee;
    }, 0);

    const netRevenue = totalRevenue - stripeFees;

    // Format transactions
    const transactions = orders.map((order) => {
      const amount = order.total;
      const percentFee = Math.round(amount * 0.029);
      const fixedFee = 30;
      const stripeFee = percentFee + fixedFee;
      const net = amount - stripeFee;

      return {
        id: order.id,
        date: order.createdAt.toISOString(),
        orderId: order.id,
        customerEmail: order.customerEmail,
        amount,
        stripeFee,
        net,
        status: order.status,
      };
    });

    return NextResponse.json({
      totalRevenue,
      totalOrders,
      averageOrderValue,
      stripeFees,
      netRevenue,
      transactions,
    });
  } catch (error: any) {
    console.error('Billing data error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
