-- Add seller profile and branding fields to Shop table (FR-31, FR-33, FR-35)

-- FR-31: Seller profile fields
ALTER TABLE "Shop" ADD COLUMN "description" TEXT;
ALTER TABLE "Shop" ADD COLUMN "instagramUrl" TEXT;
ALTER TABLE "Shop" ADD COLUMN "facebookUrl" TEXT;
ALTER TABLE "Shop" ADD COLUMN "twitterUrl" TEXT;

-- FR-33: Shop branding fields
ALTER TABLE "Shop" ADD COLUMN "primaryColor" TEXT DEFAULT '#3B4C63';
ALTER TABLE "Shop" ADD COLUMN "accentColor" TEXT DEFAULT '#10B981';
ALTER TABLE "Shop" ADD COLUMN "logoUrl" TEXT;

-- FR-35: Email template customization
ALTER TABLE "Shop" ADD COLUMN "emailTemplateBody" TEXT;
