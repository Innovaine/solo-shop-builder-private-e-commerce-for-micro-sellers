// Script to add test orders for user salman.alahmed@outlook.com
// Task #189

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const email = 'salman.alahmed@outlook.com'
  
  // Find seller by email
  const seller = await prisma.seller.findUnique({
    where: { email },
    include: { shops: { include: { products: true } } },
  })

  if (!seller) {
    console.error(`❌ Seller with email ${email} not found`)
    process.exit(1)
  }

  console.log(`✓ Found seller: ${seller.email}`)

  if (seller.shops.length === 0) {
    console.error(`❌ Seller has no shops`)
    process.exit(1)
  }

  const shop = seller.shops[0]
  console.log(`✓ Found shop: ${shop.name} (${shop.slug})`)

  if (shop.products.length === 0) {
    console.error(`❌ Shop has no products`)
    process.exit(1)
  }

  console.log(`✓ Found ${shop.products.length} products`)

  // Create 3 test orders with different statuses
  const orders = [
    {
      shopId: shop.id,
      customerEmail: 'customer1@example.com',
      customerName: 'John Doe',
      status: 'paid',
      total: shop.products[0].price * 2,
      stripePaymentId: `pi_test_${Date.now()}_1`,
      items: [
        {
          productId: shop.products[0].id,
          productTitle: shop.products[0].title,
          price: shop.products[0].price,
          quantity: 2,
        },
      ],
    },
    {
      shopId: shop.id,
      customerEmail: 'customer2@example.com',
      customerName: 'Jane Smith',
      status: 'shipped',
      total: shop.products.length > 1 ? shop.products[1].price : shop.products[0].price,
      stripePaymentId: `pi_test_${Date.now()}_2`,
      trackingId: 'TRACK123456789',
      trackingUrl: 'https://example.com/track/TRACK123456789',
      items: [
        {
          productId: shop.products.length > 1 ? shop.products[1].id : shop.products[0].id,
          productTitle: shop.products.length > 1 ? shop.products[1].title : shop.products[0].title,
          price: shop.products.length > 1 ? shop.products[1].price : shop.products[0].price,
          quantity: 1,
        },
      ],
    },
    {
      shopId: shop.id,
      customerEmail: 'customer3@example.com',
      customerName: 'Bob Johnson',
      status: 'in_progress',
      total: shop.products[0].price * 3,
      stripePaymentId: `pi_test_${Date.now()}_3`,
      items: [
        {
          productId: shop.products[0].id,
          productTitle: shop.products[0].title,
          price: shop.products[0].price,
          quantity: 3,
        },
      ],
    },
  ]

  for (const orderData of orders) {
    const { items, ...orderFields } = orderData
    
    const order = await prisma.order.create({
      data: {
        ...orderFields,
        items: {
          create: items,
        },
      },
      include: {
        items: true,
      },
    })

    console.log(`✓ Created order ${order.id} - Status: ${order.status} - Total: $${(order.total / 100).toFixed(2)}`)
  }

  console.log(`\n✅ Successfully added ${orders.length} test orders for ${email}`)
}

main()
  .catch((e) => {
    console.error('Error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
