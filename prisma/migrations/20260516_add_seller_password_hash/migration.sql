-- Add passwordHash field to Seller table for FR-21 password-based auth
-- Field is nullable to support both magic link and password login methods
ALTER TABLE "Seller" ADD COLUMN "passwordHash" TEXT;
