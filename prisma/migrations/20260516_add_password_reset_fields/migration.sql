-- Add password reset fields to Seller table for FR-23 password reset flow
ALTER TABLE "Seller" ADD COLUMN "passwordResetToken" TEXT;
ALTER TABLE "Seller" ADD COLUMN "passwordResetExpires" TIMESTAMP(3);

-- Add unique constraint and index
CREATE UNIQUE INDEX "Seller_passwordResetToken_key" ON "Seller"("passwordResetToken");
CREATE INDEX "Seller_passwordResetToken_idx" ON "Seller"("passwordResetToken");
