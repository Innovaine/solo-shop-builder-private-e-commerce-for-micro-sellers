# Server command log — day-108

Auto-recorded by the runner. Every approved SSH command + its output for this day goes here.
Historical entries (before per-day rotation) live in /server-log.md at repo root.

## 2026-05-21T00:18:13.926Z — Anil ran 1 command(s)
_Pre-SSH: warehouse pushed to GitHub as commit `0451aee` so the server's `git pull` will pick it up._

### Command 1 on www.soloshopbox.com as engineer (✓ exit 0, 2450ms)
```
cd ~/solo-shop-builder-private-e-commerce-for-micro-sellers && docker compose logs app --tail=100 | grep -i "error\|crash\|exception" || echo "No errors found in last 100 lines"
```
STDOUT:
```
app-1  |     at In.handleRequestError (/app/node_modules/@prisma/client/runtime/library.js:122:6877)
app-1  |     at In.handleAndLogRequestError (/app/node_modules/@prisma/client/runtime/library.js:122:6211)
app-1  | prisma:error 
app-1  | PrismaClientKnownRequestError: 
app-1  |     at In.handleRequestError (/app/node_modules/@prisma/client/runtime/library.js:122:6877)
app-1  |     at In.handleAndLogRequestError (/app/node_modules/@prisma/client/runtime/library.js:122:6211)
app-1  | prisma:error 
app-1  | PrismaClientKnownRequestError: 
app-1  |     at In.handleRequestError (/app/node_modules/@prisma/client/runtime/library.js:122:6877)
app-1  |     at In.handleAndLogRequestError (/app/node_modules/@prisma/client/runtime/library.js:122:6211)
app-1  | prisma:error 
app-1  | PrismaClientKnownRequestError: 
app-1  |     at In.handleRequestError (/app/node_modules/@prisma/client/runtime/library.js:122:6877)
app-1  |     at In.handleAndLogRequestError (/app/node_modules/@prisma/client/runtime/library.js:122:6211)
```
Full output: [`server-runs/2026-05-21T00-18-13-www.soloshopbox.com-cd-solo-shop-builder-private-e-commerce--1.log`](server-runs/2026-05-21T00-18-13-www.soloshopbox.com-cd-solo-shop-builder-private-e-commerce--1.log)

## 2026-05-21T00:18:51.352Z — Anil ran 1 command(s)
_Pre-SSH: warehouse pushed to GitHub as commit `c84454e` so the server's `git pull` will pick it up._

### Command 1 on www.soloshopbox.com as engineer (✓ exit 0, 2266ms) _(showing tail — full 2,848B stdout + 0B stderr)_
```
cd ~/solo-shop-builder-private-e-commerce-for-micro-sellers && docker compose logs app --tail=200 | grep -A10 "PrismaClientKnownRequestError" | head -50
```
STDOUT:
```
… invocation:
app-1  | 
app-1  | 
app-1  | The table `public.ProductImage` does not exist in the current database.
app-1  |     at In.handleRequestError (/app/node_modules/@prisma/client/runtime/library.js:122:6877)
app-1  |     at In.handleAndLogRequestError (/app/node_modules/@prisma/client/runtime/library.js:122:6211)
app-1  |     at In.request (/app/node_modules/@prisma/client/runtime/library.js:122:5919)
app-1  |     at async l (/app/node_modules/@prisma/client/runtime/library.js:127:11167)
app-1  |     at async u (/app/.next/server/app/shop/[slug]/product/[productId]/page.js:1:3480) {
app-1  |   code: 'P2021',
--
app-1  | PrismaClientKnownRequestError: 
app-1  | Invalid `prisma.product.findUnique()` invocation:
app-1  | 
app-1  | 
app-1  | The table `public.ProductImage` does not exist in the current database.
app-1  |     at In.handleRequestError (/app/node_modules/@prisma/client/runtime/library.js:122:6877)
app-1  |     at In.handleAndLogRequestError (/app/node_modules/@prisma/client/runtime/library.js:122:6211)
app-1  |     at In.request (/app/node_modules/@prisma/client/runtime/library.js:122:5919)
app-1  |     at async l (/app/node_modules/@prisma/client/runtime/library.js:127:11167)
app-1  |     at async u (/app/.next/server/app/shop/[slug]/product/[productId]/page.js:1:3480) {
app-1  |   code: 'P2021',
--
app-1  | PrismaClientKnownRequestError: 
app-1  | Invalid `prisma.product.findUnique()` invocation:
app-1  | 
app-1  | 
app-1  | The table `public.ProductImage` does not exist in the current database.
app-1  |     at In.handleRequestError (/app/node_modules/@prisma/client/runtime/library.js:122:6877)
app-1  |     at In.handleAndLogRequestError (/app/node_modules/@prisma/client/runtime/library.js:122:6211)
app-1  |     at In.request (/app/node_modules/@prisma/client/runtime/library.js:122:5919)
app-1  |     at async l (/app/node_modules/@prisma/client/runtime/library.js:127:11167)
app-1  |     at async u (/app/.next/server/app/shop/[slug]/product/[productId]/page.js:1:3480) {
app-1  |   code: 'P2021',
```
Full output: [`server-runs/2026-05-21T00-18-51-www.soloshopbox.com-cd-solo-shop-builder-private-e-commerce--1.log`](server-runs/2026-05-21T00-18-51-www.soloshopbox.com-cd-solo-shop-builder-private-e-commerce--1.log)
