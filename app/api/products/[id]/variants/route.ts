import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

// GET /api/products/:id/variants - List all variants for a product
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const productId = params.id;

    const variants = await prisma.productVariant.findMany({
      where: { productId },
      orderBy: { createdAt: 'asc' },
    });

    return NextResponse.json({ variants });
  } catch (error: any) {
    console.error('Error fetching variants:', error);
    return NextResponse.json(
      { error: 'Failed to load variants' },
      { status: 500 }
    );
  }
}

// POST /api/products/:id/variants - Create a new variant
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const productId = params.id;
    const body = await request.json();
    const { name, value, price, stock, sku } = body;

    if (!name || !value) {
      return NextResponse.json(
        { error: 'Name and value are required' },
        { status: 400 }
      );
    }

    // Verify product exists and belongs to the seller
    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: { shop: true },
    });

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    const variant = await prisma.productVariant.create({
      data: {
        productId,
        name,
        value,
        price: price ? parseInt(price) : null,
        stock: stock ? parseInt(stock) : 0,
        sku: sku || null,
      },
    });

    return NextResponse.json({ variant }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating variant:', error);
    return NextResponse.json(
      { error: 'Failed to create variant' },
      { status: 500 }
    );
  }
}
