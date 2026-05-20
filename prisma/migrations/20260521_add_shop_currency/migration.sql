-- Add currency field to Shop table
ALTER TABLE "Shop" ADD COLUMN IF NOT EXISTS "currency" TEXT NOT NULL DEFAULT 'USD';
