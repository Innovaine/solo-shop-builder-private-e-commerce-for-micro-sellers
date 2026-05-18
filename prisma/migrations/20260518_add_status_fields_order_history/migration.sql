-- FR-152: Add status field to Shop (ACTIVE/PAUSED)
ALTER TABLE "Shop" ADD COLUMN "status" TEXT NOT NULL DEFAULT 'ACTIVE';

-- FR-153: Add status field to Product (PUBLISHED/DRAFT)
ALTER TABLE "Product" ADD COLUMN "status" TEXT NOT NULL DEFAULT 'PUBLISHED';

-- FR-154: Create OrderHistory table for status change audit trail
CREATE TABLE "OrderHistory" (
  "id" TEXT NOT NULL,
  "orderId" TEXT NOT NULL,
  "statusFrom" TEXT,
  "statusTo" TEXT NOT NULL,
  "note" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "OrderHistory_pkey" PRIMARY KEY ("id")
);

-- Add indexes for OrderHistory
CREATE INDEX "OrderHistory_orderId_idx" ON "OrderHistory"("orderId");
CREATE INDEX "OrderHistory_createdAt_idx" ON "OrderHistory"("createdAt");
