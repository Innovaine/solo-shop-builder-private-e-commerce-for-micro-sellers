-- Add currency field to Shop table
ALTER TABLE "Shop" ADD COLUMN "currency" TEXT NOT NULL DEFAULT 'USD';
