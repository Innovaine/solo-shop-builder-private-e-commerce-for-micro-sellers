import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { requireAuth } from '@/lib/auth';
import Papa from 'papaparse';
import { z } from 'zod';

// ASSUMPTION: Using PapaParse for CSV parsing (client-side library, but works in Node)
// ASSUMPTION: File size validation done client-side; server processes uploaded data
// ASSUMPTION: Invalid rows logged but don't block import

interface CSVRow {
  title: string;
  price: string;
  description: string;
  category: string;
  image_url?: string;
}

interface ImportError {
  row: number;
  field: string;
  message: string;
}

const VALID_CATEGORIES = ['Handmade', 'Vintage', 'Supplies', 'Other'];

// Zod schema for CSV row validation
const csvRowSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title too long (max 200 chars)'),
  price: z.string().refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0, {
    message: 'Price must be a positive number',
  }),
  description: z.string().min(1, 'Description is required').max(1000, 'Description too long (max 1000 chars)'),
  category: z.enum(['Handmade', 'Vintage', 'Supplies', 'Other'], {
    errorMap: () => ({ message: `Invalid category. Must be one of: ${VALID_CATEGORIES.join(', ')}` }),
  }),
  image_url: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    // 1. Verify authentication using requireAuth
    const { sellerId } = await requireAuth();

    // 2. Check if seller has a shop
    const shop = await prisma.shop.findFirst({
      where: { sellerId: sellerId }
    });

    if (!shop) {
      return NextResponse.json({ error: 'No shop found' }, { status: 404 });
    }

    // 4. Get uploaded file from FormData
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    // 5. Validate file type and size
    if (!file.name.endsWith('.csv')) {
      return NextResponse.json({ error: 'File must be a CSV' }, { status: 400 });
    }

    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      return NextResponse.json({ error: 'File too large (max 10MB)' }, { status: 400 });
    }

    // 6. Parse CSV
    const fileText = await file.text();
    const parseResult = Papa.parse<CSVRow>(fileText, {
      header: true,
      skipEmptyLines: true,
      transformHeader: (header) => header.trim().toLowerCase()
    });

    if (parseResult.errors.length > 0) {
      return NextResponse.json({ 
        error: 'CSV parsing failed', 
        details: parseResult.errors.map(e => e.message) 
      }, { status: 400 });
    }

    const rows = parseResult.data;
    const errors: ImportError[] = [];
    const imported: any[] = [];

    // 7. Validate and import each row
    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      const rowNum = i + 2; // +2 because: header row + zero-indexed

      // Validate row using zod schema
      const validationResult = csvRowSchema.safeParse(row);
      
      if (!validationResult.success) {
        // Extract first error from zod validation
        const firstError = validationResult.error.errors[0];
        errors.push({ 
          row: rowNum, 
          field: firstError.path[0]?.toString() || 'unknown', 
          message: firstError.message 
        });
        continue;
      }

      const validatedRow = validationResult.data;
      const price = parseFloat(validatedRow.price);

      // Create product (price should be in cents)
      try {
        const product = await prisma.product.create({
          data: {
            title: validatedRow.title.trim(),
            price: Math.round(price * 100), // Convert dollars to cents
            description: validatedRow.description.trim(),
            category: validatedRow.category,
            imageUrl: validatedRow.image_url?.trim() || null,
            shopId: shop.id,
            stock: 0, // Default stock
            createdAt: new Date(),
            updatedAt: new Date()
          }
        });
        imported.push(product);
      } catch (err: any) {
        errors.push({ row: rowNum, field: 'database', message: err.message || 'Database error' });
      }
    }

    // 8. Return results
    return NextResponse.json({
      success: true,
      imported: imported.length,
      errors: errors.length,
      errorDetails: errors
    }, { status: 200 });

  } catch (error: any) {
    console.error('CSV import error:', error);
    return NextResponse.json({ 
      error: 'Import failed', 
      message: error.message 
    }, { status: 500 });
  }
}
