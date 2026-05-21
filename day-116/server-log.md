# Server command log — day-116

Auto-recorded by the runner. Every approved SSH command + its output for this day goes here.
Historical entries (before per-day rotation) live in /server-log.md at repo root.

## 2026-05-21T16:45:04.871Z — Vitali ran 1 command(s)
_Pre-SSH: warehouse pushed to GitHub as commit `e87ca07` so the server's `git pull` will pick it up._

### Command 1 on www.soloshopbox.com as reviewer (✓ exit 0, 2584ms)
```
cd ~/solo-shop-builder-private-e-commerce-for-micro-sellers && git status 2>&1 | head -5 || echo "Repo not cloned yet"
```
STDOUT:
```
On branch main
Your branch is up to date with 'origin/main'.

Untracked files:
  (use "git add <file>..." to include in what will be committed)
```
Full output: [`server-runs/2026-05-21T16-45-04-www.soloshopbox.com-cd-solo-shop-builder-private-e-commerce--1.log`](server-runs/2026-05-21T16-45-04-www.soloshopbox.com-cd-solo-shop-builder-private-e-commerce--1.log)

## 2026-05-21T16:45:29.400Z — Vitali ran 1 command(s)
_Pre-SSH: warehouse pushed to GitHub as commit `585f886` so the server's `git pull` will pick it up._

### Command 1 on www.soloshopbox.com as reviewer (✓ exit 0, 2308ms) _(showing tail — full 3,610B stdout + 0B stderr)_
```
cd ~/solo-shop-builder-private-e-commerce-for-micro-sellers && schema-sync-check . --json 2>&1 | head -200
```
STDOUT:
```
…Name",
      "status",
      "total",
      "stripePaymentId",
      "trackingUrl",
      "trackingId",
      "metadata",
      "createdAt",
      "updatedAt",
      "shop",
      "items"
    ],
    "OrderItem": [
      "id",
      "orderId",
      "productId",
      "productTitle",
      "price",
      "quantity",
      "order"
    ],
    "OrderHistory": [
      "id",
      "orderId",
      "statusFrom",
      "statusTo",
      "note",
      "createdAt"
    ],
    "Webhook": [
      "id",
      "stripeEventId",
      "eventType",
      "payload",
      "status",
      "receivedAt",
      "processedAt",
      "createdAt"
    ]
  },
  "drift": [
    {
      "interface": "ProductAnalytics",
      "kind": "interface",
      "file": "api/analytics/route.ts",
      "line": 9,
      "matchedPrismaModel": "Product",
      "interfaceFields": [
        "productId",
        "productTitle",
        "totalQuantity",
        "totalRevenue"
      ],
      "prismaFields": [
        "id",
        "shopId",
        "title",
        "description",
        "price",
        "imageUrl",
        "category",
        "stock",
        "status",
        "createdAt",
        "updatedAt",
        "shop",
        "variants",
        "images"
      ],
      "fieldsNotInPrisma": [
        "productId",
        "productTitle",
        "totalQuantity",
        "totalRevenue"
      ]
    },
    {
      "interface": "ProductAnalytics",
      "kind": "interface",
      "file": "components/AnalyticsCards.tsx",
      "line": 9,
      "matchedPrismaModel": "Product",
      "interfaceFields": [
        "productId",
        "productTitle",
        "totalQuantity",
        "totalRevenue"
      ],
      "prismaFields": [
        "id",
        "shopId",
        "title",
        "description",
        "price",
        "imageUrl",
        "category",
        "stock",
        "status",
        "createdAt",
        "updatedAt",
        "shop",
        "variants",
        "images"
      ],
      "fieldsNotInPrisma": [
        "productId",
        "productTitle",
```
Full output: [`server-runs/2026-05-21T16-45-29-www.soloshopbox.com-cd-solo-shop-builder-private-e-commerce--1.log`](server-runs/2026-05-21T16-45-29-www.soloshopbox.com-cd-solo-shop-builder-private-e-commerce--1.log)

## 2026-05-21T16:45:51.621Z — Vitali ran 1 command(s)
_Pre-SSH: warehouse pushed to GitHub as commit `f94aa63` so the server's `git pull` will pick it up._

### Command 1 on www.soloshopbox.com as reviewer (✓ exit 0, 2322ms)
```
cd ~/solo-shop-builder-private-e-commerce-for-micro-sellers && schema-sync-check . --json 2>&1 | grep -E '"drift"\s*:\s*\[|"interface"|"file"|"line"|"matchedPrismaModel"|"fieldsNotInPrisma"' | head -100
```
STDOUT:
```
  "drift": [
      "interface": "ProductAnalytics",
      "kind": "interface",
      "file": "api/analytics/route.ts",
      "line": 9,
      "matchedPrismaModel": "Product",
      "fieldsNotInPrisma": [
      "interface": "ProductAnalytics",
      "kind": "interface",
      "file": "components/AnalyticsCards.tsx",
      "line": 9,
      "matchedPrismaModel": "Product",
      "fieldsNotInPrisma": [
      "interface": "ProductAnalytics",
      "kind": "interface",
      "file": "dashboard/analytics/page.tsx",
      "line": 9,
      "matchedPrismaModel": "Product",
      "fieldsNotInPrisma": [
      "interface": "OrderCount",
      "kind": "interface",
      "file": "dashboard/orders/page.tsx",
      "line": 24,
      "matchedPrismaModel": "Order",
      "fieldsNotInPrisma": [
```
Full output: [`server-runs/2026-05-21T16-45-51-www.soloshopbox.com-cd-solo-shop-builder-private-e-commerce--1.log`](server-runs/2026-05-21T16-45-51-www.soloshopbox.com-cd-solo-shop-builder-private-e-commerce--1.log)

## 2026-05-21T16:46:14.758Z — Vitali ran 1 command(s)
_Pre-SSH: warehouse pushed to GitHub as commit `70c8d58` so the server's `git pull` will pick it up._

### Command 1 on www.soloshopbox.com as reviewer (✓ exit 0, 2557ms)
```
cd ~/solo-shop-builder-private-e-commerce-for-micro-sellers && grep -rnE '^\s*(const|let|var)\s+[A-Za-z_][A-Za-z0-9_]*\s*=.*process\.env' app/ src/ lib/ --include='*.ts' --include='*.tsx' 2>/dev/null | head -20
```
STDOUT:
```
app/dashboard/page.tsx:34:  const appUrl = process.env.APP_URL || 'http://localhost:3000'
app/api/health/route.ts:16:  const isBuildTime = process.env.NODE_ENV === 'production' && !process.env.DATABASE_URL
app/api/checkout/myfatoorah/route.ts:62:    let appUrl = process.env.APP_URL
app/api/checkout/myfatoorah/route.ts:71:    const myfatoorahApiKey = process.env.MYFATOORAH_API_KEY
app/api/checkout/myfatoorah/route.ts:72:    const myfatoorahApiUrl = process.env.MYFATOORAH_API_URL || 'https://apitest.myfatoorah.com'
app/api/checkout/myfatoorah/callback/route.ts:13:    const baseUrl = process.env.APP_URL || 'https://www.soloshopbox.com'
app/api/checkout/myfatoorah/callback/route.ts:22:    const myfatoorahApiKey = process.env.MYFATOORAH_API_KEY
app/api/checkout/myfatoorah/callback/route.ts:23:    const myfatoorahApiUrl = process.env.MYFATOORAH_API_URL || 'https://apitest.myfatoorah.com'
app/api/checkout/myfatoorah/callback/route.ts:170:      const trackingUrl = `${process.env.APP_URL || 'http://localhost:3000'}/track/${updatedOrder.id}`
app/api/checkout/myfatoorah/callback/route.ts:209:    const baseUrl = process.env.APP_URL || 'https://www.soloshopbox.com'
app/api/checkout/myfatoorah/callback/route.ts:224:  const webhookSecret = process.env.MYFATOORAH_WEBHOOK_SECRET
app/api/checkout/route.ts:156:    let baseUrl = process.env.APP_URL
app/api/webhooks/stripe/route.ts:232:            const trackingUrl = `${process.env.APP_URL || 'http://localhost:3000'}/track/${order.id}`
src/lib/s3.ts:13:  const s3Provider = process.env.S3_PROVIDER || 'aws'
src/lib/s3.ts:17:  const doRegion = process.env.DO_SPACES_REGION || 'nyc3'
src/lib/s3.ts:18:  const doEndpoint = process.env.DO_SPACES_ENDPOINT || `https://${doRegion}.digitaloceanspaces.com`
src/lib/s3.ts:21:  const awsRegion = process.env.AWS_REGION || 'us-east-1'
src/lib/s3.ts:46:  const s3Provider = process.env.S3_PROVIDER || 'aws'
src/lib/s3.ts:57:    const doRegion = process.env.DO_SPACES_REGION || 'nyc3'
src/lib/s3.ts:89:  const s3Provider = process.env.S3_PROVIDER || 'aws'
```
Full output: [`server-runs/2026-05-21T16-46-14-www.soloshopbox.com-cd-solo-shop-builder-private-e-commerce--1.log`](server-runs/2026-05-21T16-46-14-www.soloshopbox.com-cd-solo-shop-builder-private-e-commerce--1.log)

## 2026-05-21T16:46:37.401Z — Vitali ran 1 command(s)
_Pre-SSH: warehouse pushed to GitHub as commit `e182105` so the server's `git pull` will pick it up._

### Command 1 on www.soloshopbox.com as reviewer (✓ exit 0, 2526ms)
```
cd ~/solo-shop-builder-private-e-commerce-for-micro-sellers && find . -name '*.ts' -o -name '*.tsx' | grep -vE 'node_modules|.next|dist|build' | xargs -n1 basename 2>/dev/null | grep -vE '^(page|route|layout|loading|error|not-found|template|default|global-error|index|middleware|instrumentation)\.(ts|tsx)$' | sort | uniq -d
```

## 2026-05-21T16:46:58.670Z — Vitali ran 1 command(s)
_Pre-SSH: warehouse pushed to GitHub as commit `b30c4c6` so the server's `git pull` will pick it up._

### Command 1 on www.soloshopbox.com as reviewer (✓ exit 0, 2331ms)
```
cd ~/solo-shop-builder-private-e-commerce-for-micro-sellers && grep -rn "cookies()" app/api/ src/ lib/ --include='*.ts' --include='*.tsx' 2>/dev/null | grep -v 'src/lib/auth.ts' | head -10
```
