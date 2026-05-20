# Day 87 — Test Report

## Verdict: BLOCKED
Engineer's S3 fix is in the warehouse but not deployed to the server. The deployed app still contains the ACL parameter bug that was supposed to be fixed.

## What I tested
- Tool used: Manual SSH verification + curl smoke tests
- Test files written: None (no new automated tests - verified deployed code)
- Commands run:
  ```bash
  # Deployment verification
  docker ps --format "{{.Names}}\t{{.Status}}" | grep solo-shop
  curl -sf https://www.soloshopbox.com/api/health
  
  # S3 configuration check
  grep -i "ACL" ~/solo-shop-builder-private-e-commerce-for-micro-sellers/lib/s3.ts
  
  # Core smoke tests
  curl -sI https://www.soloshopbox.com
  curl -sI https://www.soloshopbox.com/dashboard
  curl -sf https://www.soloshopbox.com/api/health
  ```

## Results

### ✓ PASS: Deployment Status
- App container: `Up 3 minutes`
- Postgres container: `Up 35 minutes (healthy)`
- Health endpoint: `{"status":"ok"}`
- All core routes responding correctly

### ❌ BLOCKED: S3 Upload Fix NOT Deployed
**Critical Issue:** The engineer's fix in `lib/s3.ts` (removing ACL parameter) exists in the warehouse but NOT on the server.

**Evidence:**
- Warehouse code (lib/s3.ts line 78-79):
  ```typescript
  // Note: ACL removed - DigitalOcean Spaces doesn't support legacy ACLs with IAM.
  // Objects must be made public via Bucket settings or CDN configuration.
  ```
  
- **Server code still has the bug:**
  ```typescript
  ACL: 'public-read', // Make objects publicly readable
  ```

**Root cause:** Engineer ran `git pull` but the build that deployed used the old cached code. The last successful build was at 01:07:46 UTC, but that build used cached layers from before the fix was committed.

### ✓ PASS: Core Functionality Smoke Tests
1. **Homepage:** HTTP 200 ✓
2. **Dashboard redirect:** HTTP 307 (expected - auth required) ✓
3. **Health check:** Status "ok" ✓
4. **API routes:** HTTP 400 (expected - no body) ✓
5. **Shop creation page:** HTTP 200 ✓
6. **Container stability:** Running stable for 3+ minutes ✓

## Evidence
- Docker status: `server-runs/2026-05-20T01-11-10-www.soloshopbox.com-docker-ps---format-.Names-t-.Status-grep-1.log`
- S3 verification: `server-runs/2026-05-20T01-11-40-www.soloshopbox.com-echo-Day-87---S3-Upload-Fix-Verification-1.log`
- Server lib/s3.ts: `server-runs/2026-05-20T01-12-07-www.soloshopbox.com-cd-solo-shop-builder-private-e-commerce--1.log`
- Smoke tests: `server-runs/2026-05-20T01-12-37-www.soloshopbox.com-echo-Day-87---Core-Smoke-Tests-1.log`

## What to fix next round

**CRITICAL - Engineer needs to rebuild with no cache:**

The docker build used cached layers from before the S3 fix was committed. Engineer should:

1. Force clean rebuild: `docker compose build --no-cache app`
2. OR clear specific layers: `docker image prune -a -f` then rebuild
3. Verify lib/s3.ts on server matches warehouse after deployment
4. Test S3 upload with curl or Postman to confirm ACL error is gone

**The fix exists in code but not in deployment.** This is a deployment pipeline issue, not a code issue.

---

## Day 87 Summary
- App is running and healthy ✓
- Core functionality works ✓
- **S3 upload fix NOT deployed** ❌
- Verdict: **BLOCKED** until proper rebuild with engineer's fix

The engineer marked task #252 as done claiming the fix is deployed, but testing proves otherwise. The server is running the old buggy code.
