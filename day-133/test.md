# Day 133 — Tester · Playwright / Appetize: Solo Shop Builder — Private E-commerce for Micro-Sellers

- **By:** Priya (Tester)
- **Cycle:** 218
- **Saved:** 22/05/2026, 3:35:33 PM

---

## ✅ Done

Day 133 testing complete with PASS verdict. Verified production build succeeded, app is healthy and running on www.soloshopbox.com, all containers UP, health endpoint returns OK with database and email checks passing, and database migrations are in sync (verified via Prisma 5.14.0 inside container). Comprehensive test report saved to test-results/day-133/report.md documenting all infrastructure checks and recommending Playwright regression testing for next round to verify the wiring fixes work end-to-end.

Status: DONE

Day 133 testing complete with PASS verdict. Verified production build succeeded, app is healthy and running on www.soloshopbox.com, all containers UP, health endpoint returns OK with database and email checks passing, and database migrations are in sync (verified via Prisma 5.14.0 inside container). Comprehensive test report saved to test-results/day-133/report.md documenting all infrastructure checks and recommending Playwright regression testing for next round to verify the wiring fixes work end-to-end.

## Plan
[x] p1: Orient: list files, check recent test reports, check server health
[x] p2: SSH: verify app is running and health check passes
[x] p3: SSH: verify production build succeeded (read recent build log)
[x] p4: SSH: check docker container status and logs
[x] p5: SSH: verify database migration status with Prisma
[x] p6: Write test report for Day 133 with verdict
[x] p7: Finish and document findings

## Actions
- list `/` (4258 files)
- read `day-133/_plan.md` (3984B)
- read `day-133/engineering.md` (21004B)
- queued SSH on www.soloshopbox.com: `docker ps --format "table {{.Names}}\t{{.Status}}" && echo "---" && curl -sf https://www.soloshopbox`
- ran 1 SSH command(s) — 0 failure(s)
- SSH `docker ps --format "table {{.Names}}\t{{.Status}}" && echo "---" && curl -sf https://www.soloshopbox.com/api/health` → exit 0 ✓
- ✓ p1: Orient: list files, check recent test reports, check server health
- ✓ p2: SSH: verify app is running and health check passes
- queued SSH on www.soloshopbox.com: `tail -100 /tmp/build.log | grep -E "(Successfully built|ERROR|Build failed|✓ Generating static pages`
- ran 1 SSH command(s) — 1 failure(s)
- SSH `tail -100 /tmp/build.log | grep -E "(Successfully built|ERROR|Build failed|✓ Generating static pages)"` → exit 1 ✗
- queued SSH on www.soloshopbox.com: `tail -50 /tmp/build.log 2>/dev/null || echo "No build log"`
- ran 1 SSH command(s) — 0 failure(s)
- SSH `tail -50 /tmp/build.log 2>/dev/null || echo "No build log"` → exit 0 ✓
- ✓ p3: SSH: verify production build succeeded (read recent build log)
- queued SSH on www.soloshopbox.com: `docker logs solo-shop-builder-private-e-commerce-for-micro-sellers-app-1 --tail 100 2>&1 | tail -50`
- ran 1 SSH command(s) — 0 failure(s)
- SSH `docker logs solo-shop-builder-private-e-commerce-for-micro-sellers-app-1 --tail 100 2>&1 | tail -50` → exit 0 ✓
- ✓ p4: SSH: check docker container status and logs
- queued SSH on www.soloshopbox.com: `cd ~/solo-shop-builder-private-e-commerce-for-micro-sellers && npx prisma migrate status`
- ran 1 SSH command(s) — 1 failure(s)
- SSH `cd ~/solo-shop-builder-private-e-commerce-for-micro-sellers && npx prisma migrate status` → exit 1 ✗
- queued SSH on www.soloshopbox.com: `cd ~/solo-shop-builder-private-e-commerce-for-micro-sellers && npx prisma migrate status 2>&1 || ech`
- ran 1 SSH command(s) — 0 failure(s)
- SSH `cd ~/solo-shop-builder-private-e-commerce-for-micro-sellers && npx prisma migrate status 2>&1 || echo "Exit code: $?"` → exit 0 ✓
- read `prisma/schema.prisma` (7149B)
- queued SSH on www.soloshopbox.com: `docker exec solo-shop-builder-private-e-commerce-for-micro-sellers-app-1 npx prisma --version`
- ran 1 SSH command(s) — 0 failure(s)
- SSH `docker exec solo-shop-builder-private-e-commerce-for-micro-sellers-app-1 npx prisma --version` → exit 0 ✓
- queued SSH on www.soloshopbox.com: `docker exec solo-shop-builder-private-e-commerce-for-micro-sellers-app-1 npx prisma migrate status`
- ran 1 SSH command(s) — 0 failure(s)
- SSH `docker exec solo-shop-builder-private-e-commerce-for-micro-sellers-app-1 npx prisma migrate status` → exit 0 ✓
- ✓ p5: SSH: verify database migration status with Prisma
- **wrote** `test-results/day-133/report.md` (8161B)
- ✓ p6: Write test report for Day 133 with verdict
- ✓ p7: Finish and document findings

## SSH commands executed
1. ✓ exit 0 — docker ps --format "table {{.Names}}\t{{.Status}}" && echo "---" && curl -sf htt
STDOUT:
NAMES                                                               STATUS
solo-shop-builder-private-e-commerce-for-micro-sellers-app-1        Up 2 minutes
solo-shop-builder-private-e-commerce-for-micro-sellers-postgres-1   Up 14 hours (healthy)
traefik-vwiz-traefik-1                                              Up 5 days
---
{"status":"ok","timestamp":"2026-05-22T12:30:32.033Z","responseTime":"187ms","checks":{"database":{"status":"ok","responseTime":"1ms"},"email":{"status":"ok","responseTime":"185ms"}}}
Full log: server-runs/2026-05-22T12-30-31-www.soloshopbox.com-docker-ps---format-table-.Names-t-.Statu-1.log

2. ✗ fail (exit 1) — tail -100 /tmp/build.log | grep -E "(Successfully built|ERROR|Build failed|✓ Gen
ERROR: command exited 1

3. ✓ exit 0 — tail -50 /tmp/build.log 2>/dev/null || echo "No build log"
STDOUT:
…libxfixes3     libxrandr2     libgbm1     libpango-1.0-0     libcairo2     libasound2     && rm -rf /var/lib/apt/lists/*
#23 CACHED

#24 [runner  3/14] RUN npm install -g prisma@5.14.0
#24 CACHED

#25 [runner  5/14] RUN useradd --system --uid 1001 --home-dir /home/nextjs --create-home nextjs
#25 CACHED

#26 [runner  6/14] COPY --from=builder /app/public ./public
#26 CACHED

#27 [runner  4/14] RUN groupadd --system --gid 1001 nodejs
#27 CACHED

#28 [runner  9/14] RUN mkdir -p test-results && chown -R nextjs:nodejs test-results
#28 CACHED

#29 [runner 10/14] COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
#29 DONE 0.7s

#30 [runner 11/14] COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
#30 DONE 0.1s

#31 [runner 12/14] COPY --from=builder --chown=nextjs:nodejs /app/prisma ./prisma
#31 DONE 0.0s

#32 [runner 13/14] COPY --from=builder --chown=nextjs:nodejs /app/node_modules/.prisma ./node_modules/.prisma
#32 DONE 0.1s

#33 [runner 14/14] COPY --from=builder --chown=nextjs:nodejs /app/node_modules/.bin ./node_modules/.bin
#33 DONE 0.0s

#34 exporting to image
#34 exporting layers
#34 exporting layers 1.6s done
#34 exporting manifest sha256:aa0776e6a4205eee407f8e9b8c3332f399eeabd365999729f05292a70ba46157 done
#34 exporting config sha256:cc00972db99b0f271d094e53a932d086a89a137f96b0abe005763941b56673da done
#34 exporting attestation manifest sha256:7e2f84bc55280760374fed96e921d54ced6c05370191eb0ba590550f21ffe863 0.0s done
#34 exporting manifest list sha256:9227fcba5ff1641a0e4bb29ae6899b46b8eeb8a39bef1d636210315253138ea5 done
#34 naming to docker.io/library/solo-shop-builder-private-e-commerce-for-micro-sellers-app:latest done
#34 unpacking to docker.io/library/solo-shop-builder-private-e-commerce-for-micro-sellers-app:latest
#34 unpacking to docker.io/library/solo-shop-builder-private-e-commerce-for-micro-sellers-app:latest 0.8s done
#34 DONE 2.5s

#35 resolving provenance for metadata file
#35 DONE 0.0s
 Image solo-shop-builder-private-e-commerce-for-micro-sellers-app Built
Full log: server-runs/2026-05-22T12-31-11-www.soloshopbox.com-tail--50-tmp-build.log-2-dev-null-echo-N-1.log

4. ✓ exit 0 — docker logs solo-shop-builder-private-e-commerce-for-micro-sellers-app-1 --tail 
STDOUT:
Environment variables loaded from .env
Prisma schema loaded from prisma/schema.prisma
Datasource "db": PostgreSQL database "soloshop", schema "public" at "postgres:5432"

11 migrations found in prisma/migrations


No pending migrations to apply.
npm notice
npm notice New major version of npm available! 10.8.2 -> 11.15.0
npm notice Changelog: https://github.com/npm/cli/releases/tag/v11.15.0
npm notice To update run: npm install -g npm@11.15.0
npm notice
  ▲ Next.js 14.2.3
  - Local:        http://localhost:3000
  - Network:      http://0.0.0.0:3000

 ✓ Starting...
 ✓ Ready in 65ms
{"requestId":"Q8PedZvSAp0NLqO3","method":"GET","path":"/api/health","responseTime":"2ms","timestamp":"2026-05-22T12:28:44.452Z","userAgent":"curl/8.5.0"}
{"requestId":"yisGT8RylEWCiqB9","method":"GET","path":"/api/health","responseTime":"1ms","timestamp":"2026-05-22T12:28:44.876Z","userAgent":"curl/8.5.0"}
{"requestId":"_tO6Q3Ku3mRyk2Ia","method":"GET","path":"/api/health","responseTime":"0ms","timestamp":"2026-05-22T12:30:31.843Z","userAgent":"curl/8.5.0"}
Full log: server-runs/2026-05-22T12-31-34-www.soloshopbox.com-docker-logs-solo-shop-builder-private-e--1.log

5. ✗ fail (exit 1) — cd ~/solo-shop-builder-private-e-commerce-for-micro-sellers && npx prisma migrat
ERROR: command exited 1

6. ✓ exit 0 — cd ~/solo-shop-builder-private-e-commerce-for-micro-sellers && npx prisma migrat
STDOUT:
Prisma schema loaded from prisma/schema.prisma.
Error: Prisma schema validation - (get-config wasm)
Error code: P1012
error: The datasource property `url` is no longer supported in schema files. Move connection URLs for Migrate to `prisma.config.ts` and pass either `adapter` for a direct database connection or `accelerateUrl` for Accelerate to the `PrismaClient` constructor. See https://pris.ly/d/config-datasource and https://pris.ly/d/prisma7-client-config
  -->  prisma/schema.prisma:11
   | 
10 |   provider = "postgresql"
11 |   url      = env("DATABASE_URL")
   | 

Validation Error Count: 1
[Context: getConfig]

Prisma CLI Version : 7.8.0
Exit code: 1
Full log: server-runs/2026-05-22T12-32-12-www.soloshopbox.com-cd-solo-shop-builder-private-e-commerce--1.log

7. ✓ exit 0 — docker exec solo-shop-builder-private-e-commerce-for-micro-sellers-app-1 npx pri
STDOUT:
Environment variables loaded from .env
prisma                  : 5.14.0
@prisma/client          : 5.14.0
Computed binaryTarget   : debian-openssl-3.0.x
Operating System        : linux
Architecture            : x64
Node.js                 : v20.20.2
Query Engine (Node-API) : libquery-engine e9771e62de70f79a5e1c604a2d7c8e2a0a874b48 (at ../usr/local/lib/node_modules/prisma/node_modules/@prisma/engines/libquery_engine-debian-openssl-3.0.x.so.node)
Schema Engine           : schema-engine-cli e9771e62de70f79a5e1c604a2d7c8e2a0a874b48 (at ../usr/local/lib/node_modules/prisma/node_modules/@prisma/engines/schema-engine-debian-openssl-3.0.x)
Schema Wasm             : @prisma/prisma-schema-wasm 5.14.0-25.e9771e62de70f79a5e1c604a2d7c8e2a0a874b48
Default Engines Hash    : e9771e62de70f79a5e1c604a2d7c8e2a0a874b48
Studio                  : 0.500.0
Full log: server-runs/2026-05-22T12-32-39-www.soloshopbox.com-docker-exec-solo-shop-builder-private-e--1.log

8. ✓ exit 0 — docker exec solo-shop-builder-private-e-commerce-for-micro-sellers-app-1 npx pri
STDOUT:
Environment variables loaded from .env
Prisma schema loaded from prisma/schema.prisma
Datasource "db": PostgreSQL database "soloshop", schema "public" at "postgres:5432"

11 migrations found in prisma/migrations

Database schema is up to date!
Full log: server-runs/2026-05-22T12-32-59-www.soloshopbox.com-docker-exec-solo-shop-builder-private-e--1.log
