import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import Papa from 'papaparse';

const prisma = new PrismaClient();

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

export async function POST(request: NextRequest) {
  try {
    // 1. Verify authentication
    const session = request.cookies.get('session');
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 2. Get seller from session (ASSUMPTION: session cookie contains seller ID)
    // In real implementation, would decode JWT or query session store
    const sellerId = session.value; // SIMPLIFIED for now

    // 3. Check if seller has a shop
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

      // Validate required fields
      if (!row.title || row.title.trim().length === 0) {
        errors.push({ row: rowNum, field: 'title', message: 'Title is required' });
        continue;
      }
      if (row.title.length > 200) {
        errors.push({ row: rowNum, field: 'title', message: 'Title too long (max 200 chars)' });
        continue;
      }

      if (!row.price || isNaN(parseFloat(row.price))) {
        errors.push({ row: rowNum, field: 'price', message: 'Invalid price (must be a number)' });
        continue;
      }
      const price = parseFloat(row.price);
      if (price <= 0) {
        errors.push({ row: rowNum, field: 'price', message: 'Price must be > 0' });
        continue;
      }

      if (!row.description || row.description.trim().length === 0) {
        errors.push({ row: rowNum, field: 'description', message: 'Description is required' });
        continue;
      }
      if (row.description.length > 1000) {
        errors.push({ row: rowNum, field: 'description', message: 'Description too long (max 1000 chars)' });
        continue;
      }

      if (!row.category || !VALID_CATEGORIES.includes(row.category)) {
        errors.push({ 
          row: rowNum, 
          field: 'category', 
          message: `Invalid category. Must be one of: ${VALID_CATEGORIES.join(', ')}` 
        });
        continue;
      }

      // Create product (price should be in cents)
      try {
        const product = await prisma.product.create({
          data: {
            title: row.title.trim(),
            price: Math.round(price * 100), // Convert dollars to cents
            description: row.description.trim(),
            category: row.category,
            imageUrl: row.image_url?.trim() || null,
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
