-- Add metadata field to Order table for storing payment provider details
ALTER TABLE "Order" ADD COLUMN IF NOT EXISTS "metadata" TEXT;
