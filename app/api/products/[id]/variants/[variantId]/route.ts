import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// PATCH /api/products/:id/variants/:variantId - Update a variant
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string; variantId: string } }
) {
  try {
    const { variantId } = params;
    const body = await request.json();
    const { name, value, price, stock, sku } = body;

    const updateData: any = {};
    if (name !== undefined) updateData.name = name;
    if (value !== undefined) updateData.value = value;
    if (price !== undefined) updateData.price = price ? parseInt(price) : null;
    if (stock !== undefined) updateData.stock = parseInt(stock);
    if (sku !== undefined) updateData.sku = sku || null;

    const variant = await prisma.productVariant.update({
      where: { id: variantId },
      data: updateData,
    });

    return NextResponse.json({ variant });
  } catch (error: any) {
    console.error('Error updating variant:', error);
    return NextResponse.json(
      { error: 'Failed to update variant' },
      { status: 500 }
    );
  }
}

// DELETE /api/products/:id/variants/:variantId - Delete a variant
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string; variantId: string } }
) {
  try {
    const { variantId } = params;

    await prisma.productVariant.delete({
      where: { id: variantId },
    });

    return NextResponse.json({ message: 'Variant deleted' });
  } catch (error: any) {
    console.error('Error deleting variant:', error);
    return NextResponse.json(
      { error: 'Failed to delete variant' },
      { status: 500 }
    );
  }
}
