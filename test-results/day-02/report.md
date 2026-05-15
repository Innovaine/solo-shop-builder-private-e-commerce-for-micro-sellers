# Day 2 — Test Report

## Verdict: BLOCKED
Docker build fails with webpack module resolution errors. Application cannot start, tests cannot run.

## What I tested
- **Tool planned**: Playwright (for web app testing)
- **Test files written**: None — build prerequisite failed
- **Commands attempted**: Checked build logs from engineer's day 2 attempts

## Results
**BUILD FAILURE (BLOCKING ALL TESTING):**

Engineer spent day 2 attempting to fix build issues but hit the 80-step budget with builds still failing. Latest attempt (build5, completed 16:00:34) shows webpack cannot resolve `@/lib/*` path aliases:

```
./app/api/auth/logout/route.ts
Module not found: Can't resolve '@/lib/auth'

./app/api/auth/signup/route.ts
Module not found: Can't resolve '@/lib/db'

./app/api/auth/signup/route.ts
Module not found: Can't resolve '@/lib/email'

./app/api/auth/verify/route.ts
Module not found: Can't resolve '@/lib/db'

./app/api/auth/verify/route.ts
Module not found: Can't resolve '@/lib/auth'
```

Build command: `docker compose build --no-cache app`
Exit code: 1
Dockerfile line 21: `RUN npm run build`

**ROOT CAUSE ANALYSIS:**

The repository has files at:
- `src/lib/auth.ts` (1088B)
- `src/lib/db.ts` (467B)  
- `src/lib/email.ts` (1629B)

But the Next.js API routes are importing them as:
- `import { ... } from '@/lib/auth'`
- `import { ... } from '@/lib/db'`
- `import { ... } from '@/lib/email'`

The `@/` path alias in Next.js typically maps to the project root OR the `src/` directory, depending on `tsconfig.json` configuration. The engineer created `tsconfig.json` in commit e623c73 (15:55:41) attempting to fix this, but the build still fails.

**POSSIBLE ISSUES:**
1. Path alias `@/` may be configured incorrectly in `tsconfig.json` or `next.config.js`
2. Dockerfile may not be copying `src/` directory into the build context
3. Module resolution order issue between TypeScript (tsconfig paths) and webpack (Next.js internal config)

## Evidence
- Build log: `/tmp/soloshop-build5.log` on app server (engineer user)
- Server run logs: `server-runs/2026-05-15T16-00-34-app-kill--0-cat-tmp-soloshop-build5.pid-2-de-1.log`
- Engineer's day 2 notes: `day-02/engineering.md` (hit 80-step limit, 4 pending plan items)

## What the engineer needs to fix next round

**HIGH PRIORITY (blocks all testing):**

1. **Fix path alias mapping** — Verify `tsconfig.json` `paths` config matches actual directory structure:
   - If files live in `src/lib/`, then `@/lib/*` should map to `src/lib/*`
   - OR move files from `src/lib/` to `lib/` at project root
   - OR change all imports to relative paths: `import { ... } from '../../../lib/auth'`

2. **Verify Dockerfile copies src/ directory** — Check `COPY` commands in Dockerfile include `src/` folder

3. **Test the path resolution locally before Docker build** — Run `npm run build` in the repo root (outside Docker) to isolate whether this is a Next.js config issue or a Docker layer issue

**AFTER BUILD PASSES:**

4. Run database migrations: `npx prisma migrate deploy` or `npx prisma db push`
5. Start services: `docker compose up -d`
6. Verify app responds: `curl -sf http://localhost:3000/` 

Once the app is running, I can write and execute Playwright tests covering:
- **FR-1 & FR-2**: Email signup flow (magic link generation + verify)
- **FR-3 & FR-4**: Shop creation form + API
- **FR-5 & FR-6**: Public storefront rendering
- **FR-7**: Session management (cookie persistence)

## Test plan ready for day 3 (when build is fixed)

I've reviewed the 7 functional requirements from `requirements.md`. Once the build succeeds and the app starts, I will write:

**tests/web/auth.spec.ts** — covering FR-1, FR-2, FR-7:
- Seller signs up with email
- Magic link token generated (check DB or logs)
- Verify endpoint validates token and sets session cookie
- Session persists across page reload
- Logout clears cookie

**tests/web/shop-creation.spec.ts** — covering FR-3, FR-4, FR-6:
- Authenticated seller accesses /dashboard/create-shop
- Form auto-generates slug from shop name
- Valid submission creates shop in DB
- Duplicate slug returns 400 error
- Invalid slug (special chars, too short) returns 400

**tests/web/storefront.spec.ts** — covering FR-5:
- Public user (no auth) visits /shop/[valid-slug]
- Page renders shop name and "This shop is empty" message
- Non-existent slug returns 404
- Page is mobile-responsive (test at 320px viewport)

All tests will use Playwright with `PLAYWRIGHT_BROWSERS_PATH=/usr/local/share/playwright-browsers` prefix as documented in the testing toolbox.

## Current blocking issue status

**Task #44** ("Re-fix all FRs: Fix tsconfig path alias mapping") is assigned to Anil (engineer) and remains OPEN. This is the correct task for the current blocker.

Cannot proceed with testing until build succeeds and app starts.

---

**Priya (Tester)**  
15/05/2026, 16:03 UTC
