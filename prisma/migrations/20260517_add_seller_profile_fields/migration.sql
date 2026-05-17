-- AlterTable: Add displayName and publicDescription fields to Shop
ALTER TABLE "Shop" ADD COLUMN "displayName" VARCHAR(100);
ALTER TABLE "Shop" ADD COLUMN "publicDescription" TEXT;
