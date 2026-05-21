# Server command log — day-109

Auto-recorded by the runner. Every approved SSH command + its output for this day goes here.
Historical entries (before per-day rotation) live in /server-log.md at repo root.

## 2026-05-21T00:35:21.786Z — Priya ran 1 command(s)
_Pre-SSH: warehouse pushed to GitHub as commit `8ae028c` so the server's `git pull` will pick it up._

### Command 1 on www.soloshopbox.com as tester (✓ exit 0, 2959ms) _(showing tail — full 8,615B stdout + 0B stderr)_
```
cd ~/solo-shop-builder-private-e-commerce-for-micro-sellers && git pull
```
STDOUT:
```
…reate mode 100644 day-106/design.md
 create mode 100644 day-106/engineering.md
 create mode 100644 day-106/review.md
 create mode 100644 day-106/server-log.md
 create mode 100644 day-106/stage-ship-check.md
 create mode 100644 day-106/standards-audit.md
 create mode 100644 day-106/standards_qa.md
 create mode 100644 day-106/task-verification.md
 create mode 100644 day-106/task_verifier.md
 create mode 100644 day-106/test.md
 create mode 100644 day-107/_index.md
 create mode 100644 day-107/_plan.md
 create mode 100644 day-107/connectivity-audit.md
 create mode 100644 day-107/connectivity_qa.md
 create mode 100644 day-107/engineering.md
 create mode 100644 day-107/review.md
 create mode 100644 day-107/server-log.md
 create mode 100644 day-107/stage-ship-check.md
 create mode 100644 day-107/standards-audit.md
 create mode 100644 day-107/standards_qa.md
 create mode 100644 day-107/task-verification.md
 create mode 100644 day-107/task_verifier.md
 create mode 100644 day-107/test.md
 create mode 100644 day-108/_index.md
 create mode 100644 day-108/_plan.md
 create mode 100644 day-108/connectivity-audit.md
 create mode 100644 day-108/connectivity_qa.md
 create mode 100644 day-108/engineering.md
 create mode 100644 day-108/review.md
 create mode 100644 day-108/server-log.md
 create mode 100644 day-108/stage-ship-check.md
 create mode 100644 day-108/standards_qa.md
 create mode 100644 day-108/task_verifier.md
 create mode 100644 day-108/test.md
 create mode 100644 day-109/_plan.md
 create mode 100644 day-109/engineering.md
 create mode 100644 design/pages/2fa-qr-setup.html
 create mode 100644 design/pages/refund-status-timeline.html
 create mode 100644 design/pages/webhook-signature-error.html
 create mode 100644 prisma/migrations/20260521_add_product_images/migration.sql
 create mode 100644 test-results/day-104/report.md
 create mode 100644 test-results/day-105/report.md
 create mode 100644 test-results/day-106/report.md
 create mode 100644 test-results/day-107/report.md
 create mode 100644 tests/web/day105-fixes.spec.ts
```
Full output: [`server-runs/2026-05-21T00-35-21-www.soloshopbox.com-cd-solo-shop-builder-private-e-commerce--1.log`](server-runs/2026-05-21T00-35-21-www.soloshopbox.com-cd-solo-shop-builder-private-e-commerce--1.log)

## 2026-05-21T00:35:45.811Z — Priya ran 1 command(s)
_Pre-SSH: warehouse pushed to GitHub as commit `1b1b415` so the server's `git pull` will pick it up._

### Command 1 on www.soloshopbox.com as tester (✓ exit 0, 2321ms)
```
docker ps --format "{{.Names}}\t{{.Status}}" | grep solo-shop
```
STDOUT:
```
solo-shop-builder-private-e-commerce-for-micro-sellers-app-1	Up 11 minutes
solo-shop-builder-private-e-commerce-for-micro-sellers-postgres-1	Up 12 minutes (healthy)
```
Full output: [`server-runs/2026-05-21T00-35-45-www.soloshopbox.com-docker-ps---format-.Names-t-.Status-grep-1.log`](server-runs/2026-05-21T00-35-45-www.soloshopbox.com-docker-ps---format-.Names-t-.Status-grep-1.log)

## 2026-05-21T00:36:23.293Z — Priya ran 1 command(s)
_Pre-SSH: warehouse pushed to GitHub as commit `d2f4993` so the server's `git pull` will pick it up._

### Command 1 on www.soloshopbox.com as tester (✗ exec-error: Connection timed out (mutating command — not auto-retried; queue it again if you want to try once more), 12639ms)
```
cd ~/solo-shop-builder-private-e-commerce-for-micro-sellers && nohup docker compose build > /tmp/day109-build.log 2>&1 &
echo $! > /tmp/day109-build.pid
echo "Started build, PID=$(cat /tmp/day109-build.pid)"
```
ERROR: Connection timed out (mutating command — not auto-retried; queue it again if you want to try once more)

## 2026-05-21T00:36:45.062Z — Priya ran 1 command(s)
_Pre-SSH: warehouse pushed to GitHub as commit `a1f8005` so the server's `git pull` will pick it up._

### Command 1 on www.soloshopbox.com as tester (✓ exit 0, 2489ms)
```
cd ~/solo-shop-builder-private-e-commerce-for-micro-sellers
nohup docker compose build > /tmp/day109-build.log 2>&1 &
echo $! > /tmp/day109-build.pid
echo "Started build, PID=$(cat /tmp/day109-build.pid)"
```
STDOUT:
```
Started build, PID=2138928
```
Full output: [`server-runs/2026-05-21T00-36-45-www.soloshopbox.com-cd-solo-shop-builder-private-e-commerce--1.log`](server-runs/2026-05-21T00-36-45-www.soloshopbox.com-cd-solo-shop-builder-private-e-commerce--1.log)

## 2026-05-21T00:37:06.929Z — Priya ran 1 command(s)
_Pre-SSH: warehouse pushed to GitHub as commit `823e703` so the server's `git pull` will pick it up._

### Command 1 on www.soloshopbox.com as tester (✓ exit 0, 2200ms) _(showing tail — full 2,853B stdout + 0B stderr)_
```
kill -0 $(cat /tmp/day109-build.pid) 2>/dev/null && echo "RUNNING" || echo "DONE"
tail -80 /tmp/day109-build.log
```
STDOUT:
```
…#11 CACHED

#12 [deps 2/4] WORKDIR /app
#12 CACHED

#13 [builder 3/7] COPY --from=deps /app/node_modules ./node_modules
#13 CACHED

#14 [builder 6/7] RUN mkdir -p public
#14 CACHED

#15 [builder 7/7] RUN npm run build
#15 0.274 
#15 0.274 > solo-shop-builder@0.1.0 build
#15 0.274 > prisma generate && next build
#15 0.274 
#15 0.645 Environment variables loaded from .env
#15 0.648 Prisma schema loaded from prisma/schema.prisma
#15 1.091 
#15 1.091 ✔ Generated Prisma Client (v5.14.0) to ./node_modules/@prisma/client in 146ms
#15 1.091 
#15 1.091 Start using Prisma Client in Node.js (See: https://pris.ly/d/client)
#15 1.091 ```
#15 1.091 import { PrismaClient } from '@prisma/client'
#15 1.091 const prisma = new PrismaClient()
#15 1.091 ```
#15 1.091 or start using Prisma Client at the edge (See: https://pris.ly/d/accelerate)
#15 1.091 ```
#15 1.091 import { PrismaClient } from '@prisma/client/edge'
#15 1.091 const prisma = new PrismaClient()
#15 1.091 ```
#15 1.091 
#15 1.091 See other ways of importing Prisma Client: http://pris.ly/d/importing-client
#15 1.091 
#15 1.091 ┌─────────────────────────────────────────────────────────────┐
#15 1.091 │  Deploying your app to serverless or edge functions?        │
#15 1.091 │  Try Prisma Accelerate for connection pooling and caching.  │
#15 1.091 │  https://pris.ly/cli/--accelerate                           │
#15 1.091 └─────────────────────────────────────────────────────────────┘
#15 1.091 
#15 1.782 Attention: Next.js now collects completely anonymous telemetry regarding usage.
#15 1.782 This information is used to shape Next.js' roadmap and prioritize features.
#15 1.782 You can learn more, including how to opt-out if you'd not like to participate in this anonymous program, by visiting the following URL:
#15 1.782 https://nextjs.org/telemetry
#15 1.782 
#15 1.833   ▲ Next.js 14.2.3
#15 1.833   - Environments: .env
#15 1.833 
#15 1.889    Creating an optimized production build ...
#15 14.36  ✓ Compiled successfully
#15 14.36    Linting and checking validity of types ...
```
Full output: [`server-runs/2026-05-21T00-37-06-www.soloshopbox.com-kill--0-cat-tmp-day109-build.pid-2-dev-n-1.log`](server-runs/2026-05-21T00-37-06-www.soloshopbox.com-kill--0-cat-tmp-day109-build.pid-2-dev-n-1.log)

## 2026-05-21T00:37:28.925Z — Priya ran 1 command(s)
_Pre-SSH: warehouse pushed to GitHub as commit `879a854` so the server's `git pull` will pick it up._

### Command 1 on www.soloshopbox.com as tester (✓ exit 0, 2236ms) _(showing tail — full 3,989B stdout + 0B stderr)_
```
kill -0 $(cat /tmp/day109-build.pid) 2>/dev/null && echo "RUNNING" || echo "DONE"
tail -100 /tmp/day109-build.log
```
STDOUT:
```
…33   - Environments: .env
#15 1.833 
#15 1.889    Creating an optimized production build ...
#15 14.36  ✓ Compiled successfully
#15 14.36    Linting and checking validity of types ...
#15 21.22 Failed to compile.
#15 21.22 
#15 21.22 ./app/api/shops/[slug]/currency/route.ts:43:38
#15 21.22 Type error: Expected 0 arguments, but got 1.
#15 21.22 
#15 21.22 [0m [90m 41 |[39m ) {[0m
#15 21.22 [0m [90m 42 |[39m   [36mtry[39m {[0m
#15 21.22 [0m[31m[1m>[22m[39m[90m 43 |[39m     [36mconst[39m seller [33m=[39m [36mawait[39m requireAuth(request)[0m
#15 21.22 [0m [90m    |[39m                                      [31m[1m^[22m[39m[0m
#15 21.22 [0m [90m 44 |[39m     [36mif[39m ([33m![39mseller) {[0m
#15 21.22 [0m [90m 45 |[39m       [36mreturn[39m [33mNextResponse[39m[33m.[39mjson([0m
#15 21.22 [0m [90m 46 |[39m         { error[33m:[39m [32m'Unauthorized'[39m }[33m,[39m[0m
#15 ERROR: process "/bin/sh -c npm run build" did not complete successfully: exit code: 1
------
 > [builder 7/7] RUN npm run build:
21.22 ./app/api/shops/[slug]/currency/route.ts:43:38
21.22 Type error: Expected 0 arguments, but got 1.
21.22 
21.22 [0m [90m 41 |[39m ) {[0m
21.22 [0m [90m 42 |[39m   [36mtry[39m {[0m
21.22 [0m[31m[1m>[22m[39m[90m 43 |[39m     [36mconst[39m seller [33m=[39m [36mawait[39m requireAuth(request)[0m
21.22 [0m [90m    |[39m                                      [31m[1m^[22m[39m[0m
21.22 [0m [90m 44 |[39m     [36mif[39m ([33m![39mseller) {[0m
21.22 [0m [90m 45 |[39m       [36mreturn[39m [33mNextResponse[39m[33m.[39mjson([0m
21.22 [0m [90m 46 |[39m         { error[33m:[39m [32m'Unauthorized'[39m }[33m,[39m[0m
------
Dockerfile:25

--------------------

  23 |     

  24 |     # Build Next.js app

  25 | >>> RUN npm run build

  26 |     

  27 |     # Production image, copy all the files and run next

--------------------

failed to solve: process "/bin/sh -c npm run build" did not complete successfully: exit code: 1
```
Full output: [`server-runs/2026-05-21T00-37-28-www.soloshopbox.com-kill--0-cat-tmp-day109-build.pid-2-dev-n-1.log`](server-runs/2026-05-21T00-37-28-www.soloshopbox.com-kill--0-cat-tmp-day109-build.pid-2-dev-n-1.log)

## 2026-05-21T00:38:07.436Z — Priya ran 1 command(s)
_Pre-SSH: warehouse pushed to GitHub as commit `4da5d7c` so the server's `git pull` will pick it up._

### Command 1 on www.soloshopbox.com as tester (✓ exit 0, 2825ms)
```
curl -sf https://www.soloshopbox.com/api/health
```
STDOUT:
```
{"status":"ok","timestamp":"2026-05-21T00:38:07.360Z","responseTime":"198ms","checks":{"database":{"status":"ok","responseTime":"1ms"},"email":{"status":"ok","responseTime":"197ms"}}}
```
Full output: [`server-runs/2026-05-21T00-38-07-www.soloshopbox.com-curl--sf-https-www.soloshopbox.com-api-h-1.log`](server-runs/2026-05-21T00-38-07-www.soloshopbox.com-curl--sf-https-www.soloshopbox.com-api-h-1.log)

## 2026-05-21T00:40:04.948Z — Vitali ran 1 command(s)
_Pre-SSH: warehouse pushed to GitHub as commit `4a0a38a` so the server's `git pull` will pick it up._

### Command 1 on www.soloshopbox.com as reviewer (✓ exit 0, 3515ms)
```
cd ~/solo-shop-builder-private-e-commerce-for-micro-sellers && npx tsc --noEmit 2>&1 | head -100
```
STDOUT:
```
error TS2688: Cannot find type definition file for 'node'.
  The file is in the program because:
    Entry point of type library 'node' specified in compilerOptions
```
Full output: [`server-runs/2026-05-21T00-40-04-www.soloshopbox.com-cd-solo-shop-builder-private-e-commerce--1.log`](server-runs/2026-05-21T00-40-04-www.soloshopbox.com-cd-solo-shop-builder-private-e-commerce--1.log)

## 2026-05-21T00:40:51.576Z — Vitali ran 1 command(s)
_Pre-SSH: warehouse pushed to GitHub as commit `26d4c2c` so the server's `git pull` will pick it up._

### Command 1 on www.soloshopbox.com as reviewer (✓ exit 0, 2281ms)
```
cd ~/solo-shop-builder-private-e-commerce-for-micro-sellers && grep -rnE '^(const|let|var)[[:space:]]+[A-Za-z_][A-Za-z0-9_]*[[:space:]]*=[[:space:]]*process\.env' app/ src/ lib/ --include='*.ts' --include='*.tsx' 2>/dev/null | head -50
```

## 2026-05-21T00:41:26.126Z — Vitali ran 1 command(s)
_Pre-SSH: warehouse pushed to GitHub as commit `601f809` so the server's `git pull` will pick it up._

### Command 1 on www.soloshopbox.com as reviewer (✓ exit 0, 2146ms)
```
cd ~/solo-shop-builder-private-e-commerce-for-micro-sellers && find . -name '*.ts' -o -name '*.tsx' | grep -vE 'node_modules|\.next|dist|build|\.spec\.' | xargs -n1 basename 2>/dev/null | sort | uniq -d | grep -vE '^(page|route|layout|loading|error|not-found|template|default|global-error|index|middleware|instrumentation)\.(ts|tsx)$' | head -20
```

## 2026-05-21T00:41:57.257Z — Vitali ran 1 command(s)
_Pre-SSH: warehouse pushed to GitHub as commit `5ac64bd` so the server's `git pull` will pick it up._

### Command 1 on www.soloshopbox.com as reviewer (✓ exit 0, 2280ms)
```
cd ~/solo-shop-builder-private-e-commerce-for-micro-sellers && grep -rn "^interface\|^type " app/ components/ src/ --include='*.ts' --include='*.tsx' 2>/dev/null | grep -v '@prisma' | head -30
```
STDOUT:
```
app/dashboard/products/import/page.tsx:6:interface ImportResult {
app/dashboard/billing/page.tsx:8:interface BillingData {
app/dashboard/orders/[id]/OrderDetailClient.tsx:12:type OrderWithItems = Order & {
app/dashboard/orders/[id]/OrderDetailClient.tsx:16:interface OrderDetailClientProps {
app/dashboard/orders/page.tsx:11:type Order = Omit<PrismaOrder, 'createdAt' | 'updatedAt'> & {
app/dashboard/orders/page.tsx:17:interface Analytics {
app/dashboard/orders/page.tsx:23:interface OrderCount {
app/dashboard/analytics/page.tsx:8:interface ProductAnalytics {
app/dashboard/analytics/page.tsx:15:interface DailyRevenue {
app/dashboard/analytics/page.tsx:20:interface Analytics {
app/track/[orderId]/page.tsx:11:type OrderWithDetails = Order & {
app/components/ui/Modal.tsx:7:interface ModalProps {
app/components/ui/Input.tsx:4:interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
app/components/ui/Card.tsx:4:interface CardProps extends HTMLAttributes<HTMLDivElement> {
app/components/ui/FormField.tsx:5:interface FormFieldProps extends InputHTMLAttributes<HTMLInputElement> {
app/components/ui/Button.tsx:4:interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
app/components/ui/EmptyState.tsx:4:interface EmptyStateProps {
app/components/ui/Header.tsx:5:interface HeaderProps {
app/components/ErrorBoundary.tsx:8:interface Props {
app/components/ErrorBoundary.tsx:13:interface State {
app/components/AnalyticsCards.tsx:9:interface ProductAnalytics {
app/components/AnalyticsCards.tsx:16:interface Analytics {
app/components/AddToCartButton.tsx:10:interface AddToCartButtonProps {
app/api/products/import/route.ts:11:interface CSVRow {
app/api/products/import/route.ts:19:interface ImportError {
app/api/analytics/route.ts:9:interface ProductAnalytics {
app/checkout/success/page.tsx:14:type OrderDetails = Order & {
app/shop/[slug]/CategoryFilter.tsx:8:interface CategoryFilterProps {
app/shop/[slug]/SortDropdown.tsx:8:interface SortDropdownProps {
src/lib/rate-limit.ts:5:type RateLimitStore = {
```
Full output: [`server-runs/2026-05-21T00-41-57-www.soloshopbox.com-cd-solo-shop-builder-private-e-commerce--1.log`](server-runs/2026-05-21T00-41-57-www.soloshopbox.com-cd-solo-shop-builder-private-e-commerce--1.log)

## 2026-05-21T00:42:32.785Z — Vitali ran 1 command(s)
_Pre-SSH: warehouse pushed to GitHub as commit `e832008` so the server's `git pull` will pick it up._

### Command 1 on www.soloshopbox.com as reviewer (✓ exit 0, 2009ms)
```
cd ~/solo-shop-builder-private-e-commerce-for-micro-sellers && grep -rn "\.total\.toFixed\|\.price\.toFixed\|\.amount\.toFixed" app/ src/ --include='*.ts' --include='*.tsx' 2>/dev/null | head -20
```

## 2026-05-21T00:43:04.275Z — Vitali ran 1 command(s)
_Pre-SSH: warehouse pushed to GitHub as commit `b582d13` so the server's `git pull` will pick it up._

### Command 1 on www.soloshopbox.com as reviewer (✓ exit 0, 2343ms)
```
cd ~/solo-shop-builder-private-e-commerce-for-micro-sellers && grep -rn "/ 100.*toFixed\|toFixed.*100" app/ src/ --include='*.ts' --include='*.tsx' 2>/dev/null | wc -l
```
STDOUT:
```
46
```
Full output: [`server-runs/2026-05-21T00-43-04-www.soloshopbox.com-cd-solo-shop-builder-private-e-commerce--1.log`](server-runs/2026-05-21T00-43-04-www.soloshopbox.com-cd-solo-shop-builder-private-e-commerce--1.log)

## 2026-05-21T00:43:38.275Z — Vitali ran 1 command(s)
_Pre-SSH: warehouse pushed to GitHub as commit `246127c` so the server's `git pull` will pick it up._

### Command 1 on www.soloshopbox.com as reviewer (✓ exit 0, 2046ms)
```
cd ~/solo-shop-builder-private-e-commerce-for-micro-sellers && grep -rn "cookies()" app/api/ src/ --include='*.ts' --include='*.tsx' 2>/dev/null | head -20
```
STDOUT:
```
src/lib/auth.ts:25:  return getIronSession<SessionData>(cookies(), sessionOptions)
```
Full output: [`server-runs/2026-05-21T00-43-38-www.soloshopbox.com-cd-solo-shop-builder-private-e-commerce--1.log`](server-runs/2026-05-21T00-43-38-www.soloshopbox.com-cd-solo-shop-builder-private-e-commerce--1.log)

## 2026-05-21T00:44:42.249Z — Vitali ran 1 command(s)
_Pre-SSH: warehouse pushed to GitHub as commit `43b9017` so the server's `git pull` will pick it up._

### Command 1 on www.soloshopbox.com as reviewer (✓ exit 0, 2043ms)
```
cd ~/solo-shop-builder-private-e-commerce-for-micro-sellers && schema-sync-check . --json 2>&1 | head -100
```
STDOUT:
```
{
  "summary": {
    "models": 10,
    "interfaces": 28,
    "matched": 4,
    "drift": 4
  },
  "models": {
    "Seller": [
      "id",
      "email",
      "passwordHash",
      "passwordResetToken",
      "passwordResetExpires",
      "createdAt",
      "updatedAt",
      "shops",
      "tokens"
    ],
    "Shop": [
      "id",
      "name",
      "slug",
      "sellerId",
      "displayName",
      "publicDescription",
      "description",
      "instagramUrl",
      "facebookUrl",
      "twitterUrl",
      "primaryColor",
      "accentColor",
      "logoUrl",
      "logoImageUrl",
      "tagline",
      "emailTemplateBody",
      "status",
      "currency",
      "createdAt",
      "updatedAt",
      "seller",
      "products",
      "orders"
    ],
    "Product": [
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
    "ProductImage": [
      "id",
      "productId",
      "imageUrl",
      "displayOrder",
      "createdAt",
      "product"
    ],
    "ProductVariant": [
      "id",
      "productId",
      "name",
      "value",
      "price",
      "stock",
      "sku",
      "createdAt",
      "updatedAt",
      "product"
    ],
    "AuthToken": [
      "id",
      "token",
      "sellerId",
      "expiresAt",
      "used",
      "createdAt",
      "seller"
    ],
    "Order": [
      "id",
      "shopId",
      "customerEmail",
      "customerName",
      "status",
      "total",
      "stripePaymentId",
      "trackingUrl",
      "trackingId",
      "metadata",
```
Full output: [`server-runs/2026-05-21T00-44-42-www.soloshopbox.com-cd-solo-shop-builder-private-e-commerce--1.log`](server-runs/2026-05-21T00-44-42-www.soloshopbox.com-cd-solo-shop-builder-private-e-commerce--1.log)

## 2026-05-21T00:45:06.313Z — Vitali ran 1 command(s)
_Pre-SSH: warehouse pushed to GitHub as commit `82c4e2c` so the server's `git pull` will pick it up._

### Command 1 on www.soloshopbox.com as reviewer (✓ exit 0, 2131ms) _(showing tail — full 3,843B stdout + 0B stderr)_
```
cd ~/solo-shop-builder-private-e-commerce-for-micro-sellers && schema-sync-check . --json 2>&1 | tail -200
```
STDOUT:
```
…      "matchedPrismaModel": "Product",
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
      "file": "dashboard/analytics/page.tsx",
      "line": 8,
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
      "interface": "OrderCount",
      "kind": "interface",
      "file": "dashboard/orders/page.tsx",
      "line": 23,
      "matchedPrismaModel": "Order",
      "interfaceFields": [
        "paid",
        "in_progress",
        "shipped",
        "delivered"
      ],
      "prismaFields": [
        "id",
        "shopId",
        "customerEmail",
        "customerName",
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
      "fieldsNotInPrisma": [
        "paid",
        "in_progress",
        "shipped",
        "delivered"
      ]
    }
  ]
}
```
Full output: [`server-runs/2026-05-21T00-45-06-www.soloshopbox.com-cd-solo-shop-builder-private-e-commerce--1.log`](server-runs/2026-05-21T00-45-06-www.soloshopbox.com-cd-solo-shop-builder-private-e-commerce--1.log)
