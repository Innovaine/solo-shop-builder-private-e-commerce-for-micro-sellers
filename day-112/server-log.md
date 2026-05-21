# Server command log — day-112

Auto-recorded by the runner. Every approved SSH command + its output for this day goes here.
Historical entries (before per-day rotation) live in /server-log.md at repo root.

## 2026-05-21T13:38:10.347Z — Anil ran 2 command(s)
_Pre-SSH: warehouse pushed to GitHub as commit `915cfd9` so the server's `git pull` will pick it up._

### Command 1 on www.soloshopbox.com as engineer (✓ exit 0, 3458ms)
```
cd ~/solo-shop-builder-private-e-commerce-for-micro-sellers && git pull
```
STDOUT:
```
Updating b79e822..915cfd9
Fast-forward
 day-112/_plan.md                                  |  38 ++++
 day-112/connectivity-audit.md                     | 249 ++++++++++++++++++++++
 day-112/connectivity_qa.md                        |  43 ++++
 day-112/design-compliance.md                      | 163 ++++++++++++++
 day-112/design.md                                 |  36 ++++
 day-112/design_qa.md                              |  44 ++++
 design/pages/analytics-dashboard-back-button.html | 216 +++++++++++++++++++
 design/pages/dashboard-kwd-currency.html          | 234 ++++++++++++++++++++
 tsconfig.json                                     |   2 +-
 9 files changed, 1024 insertions(+), 1 deletion(-)
 create mode 100644 day-112/_plan.md
 create mode 100644 day-112/connectivity-audit.md
 create mode 100644 day-112/connectivity_qa.md
 create mode 100644 day-112/design-compliance.md
 create mode 100644 day-112/design.md
 create mode 100644 day-112/design_qa.md
 create mode 100644 design/pages/analytics-dashboard-back-button.html
 create mode 100644 design/pages/dashboard-kwd-currency.html
```
Full output: [`server-runs/2026-05-21T13-37-59-www.soloshopbox.com-cd-solo-shop-builder-private-e-commerce--1.log`](server-runs/2026-05-21T13-37-59-www.soloshopbox.com-cd-solo-shop-builder-private-e-commerce--1.log)

### Command 2 on www.soloshopbox.com as engineer (✗ exec-error: Connection timed out (mutating command — not auto-retried; queue it again if you want to try once more), 10596ms)
```
cd ~/solo-shop-builder-private-e-commerce-for-micro-sellers && nohup docker compose build > /tmp/build-day112.log 2>&1 &
echo $! > /tmp/build-day112.pid
echo "Started build, PID=$(cat /tmp/build-day112.pid)"
```
ERROR: Connection timed out (mutating command — not auto-retried; queue it again if you want to try once more)

## 2026-05-21T13:38:34.927Z — Anil ran 1 command(s)
_Pre-SSH: warehouse pushed to GitHub as commit `40889cd` so the server's `git pull` will pick it up._

### Command 1 on www.soloshopbox.com as engineer (✓ exit 0, 2173ms) _(showing tail — full 2,729B stdout + 0B stderr)_
```
kill -0 $(cat /tmp/build-day112.pid 2>/dev/null) 2>/dev/null && echo "RUNNING" || echo "DONE"
tail -80 /tmp/build-day112.log
```
STDOUT:
```
…es.
#15 1.932 You can learn more, including how to opt-out if you'd not like to participate in this anonymous program, by visiting the following URL:
#15 1.932 https://nextjs.org/telemetry
#15 1.932 
#15 1.982   ▲ Next.js 14.2.3
#15 1.982   - Environments: .env
#15 1.982 
#15 2.057    Creating an optimized production build ...
#15 10.38 Failed to compile.
#15 10.38 
#15 10.38 ./app/checkout/page.tsx
#15 10.38 Module not found: Can't resolve '@/lib/cart'
#15 10.38 
#15 10.38 https://nextjs.org/docs/messages/module-not-found
#15 10.38 
#15 10.38 ./app/checkout/page.tsx
#15 10.38 Module not found: Can't resolve '@/lib/currency'
#15 10.38 
#15 10.38 https://nextjs.org/docs/messages/module-not-found
#15 10.38 
#15 10.38 ./app/checkout/success/page.tsx
#15 10.38 Module not found: Can't resolve '@/lib/cart'
#15 10.38 
#15 10.38 https://nextjs.org/docs/messages/module-not-found
#15 10.38 
#15 10.38 ./app/components/AddToCartButton.tsx
#15 10.38 Module not found: Can't resolve '@/lib/cart'
#15 10.38 
#15 10.38 https://nextjs.org/docs/messages/module-not-found
#15 10.38 
#15 10.38 ./app/components/CartButton.tsx
#15 10.38 Module not found: Can't resolve '@/lib/cart'
#15 10.38 
#15 10.38 https://nextjs.org/docs/messages/module-not-found
#15 10.38 
#15 10.42 
#15 10.42 > Build failed because of webpack errors
#15 ERROR: process "/bin/sh -c npm run build" did not complete successfully: exit code: 1
------
 > [builder 7/7] RUN npm run build:
10.38 
10.38 https://nextjs.org/docs/messages/module-not-found
10.38 
10.38 ./app/components/CartButton.tsx
10.38 Module not found: Can't resolve '@/lib/cart'
10.38 
10.38 https://nextjs.org/docs/messages/module-not-found
10.38 
10.42 
10.42 > Build failed because of webpack errors
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
Full output: [`server-runs/2026-05-21T13-38-34-www.soloshopbox.com-kill--0-cat-tmp-build-day112.pid-2-dev-n-1.log`](server-runs/2026-05-21T13-38-34-www.soloshopbox.com-kill--0-cat-tmp-build-day112.pid-2-dev-n-1.log)

## 2026-05-21T13:39:00.449Z — Anil ran 1 command(s)
_Pre-SSH: warehouse pushed to GitHub as commit `ac0e53d` so the server's `git pull` will pick it up._

### Command 1 on www.soloshopbox.com as engineer (✓ exit 0, 2433ms)
```
cd ~/solo-shop-builder-private-e-commerce-for-micro-sellers && ls -la | head -20
echo "---"
ls -la src/ 2>/dev/null || echo "src/ does not exist"
echo "---"
ls -la lib/ 2>/dev/null || echo "lib/ does not exist"
```
STDOUT:
```
total 2364
drwxrwxr-x 127 engineer engineer    4096 May 21 13:37 .
drwxr-x---  15 engineer engineer    4096 May 15 16:12 ..
-rw-r--r--   1 root     root        2339 May 20 10:21 .build.log
-rw-------   1 engineer engineer    1833 May 21 13:39 .env
drwxrwxr-x   8 engineer engineer    4096 May 21 13:37 .git
-rw-rw-r--   1 engineer engineer    5838 May 15 23:23 DEPLOYMENT.md
-rw-rw-r--   1 engineer engineer    2389 May 16 19:10 Dockerfile
-rw-rw-r--   1 engineer engineer    1444 May 15 15:45 README.md
-rw-rw-r--   1 engineer engineer    1150 May 15 15:45 _meta.json
drwxrwxr-x   9 engineer engineer    4096 May 20 15:43 app
-rw-rw-r--   1 engineer engineer    1290 May 19 23:53 customer-messages.md
drwxrwxr-x   2 engineer engineer    4096 May 15 15:45 day-01
drwxrwxr-x   2 engineer engineer    4096 May 15 16:06 day-02
drwxrwxr-x   2 engineer engineer    4096 May 15 16:37 day-03
drwxrwxr-x   2 engineer engineer    4096 May 15 16:55 day-04
drwxrwxr-x   2 engineer engineer    4096 May 15 17:22 day-05
drwxrwxr-x   2 engineer engineer    4096 May 15 18:23 day-06
drwxrwxr-x   2 engineer engineer    4096 May 15 18:46 day-07
drwxrwxr-x   2 engineer engineer    4096 May 15 19:10 day-08
---
total 12
drwxrwxr-x   3 engineer engineer 4096 May 15 15:45 .
drwxrwxr-x 127 engineer engineer 4096 May 21 13:37 ..
drwxrwxr-x   2 engineer engineer 4096 May 21 13:15 lib
---
lib/ does not exist
```
Full output: [`server-runs/2026-05-21T13-39-00-www.soloshopbox.com-cd-solo-shop-builder-private-e-commerce--1.log`](server-runs/2026-05-21T13-39-00-www.soloshopbox.com-cd-solo-shop-builder-private-e-commerce--1.log)

## 2026-05-21T13:39:43.653Z — Anil ran 2 command(s)
_Pre-SSH: warehouse pushed to GitHub as commit `78e8af9` so the server's `git pull` will pick it up._

### Command 1 on www.soloshopbox.com as engineer (✓ exit 0, 3065ms)
```
cd ~/solo-shop-builder-private-e-commerce-for-micro-sellers && git pull
```
STDOUT:
```
Updating 915cfd9..78e8af9
Fast-forward
 day-112/server-log.md | 168 ++++++++++++++++++++++++++++++++++++++++++++++++++
 tsconfig.json         |   2 +-
 2 files changed, 169 insertions(+), 1 deletion(-)
 create mode 100644 day-112/server-log.md
```
Full output: [`server-runs/2026-05-21T13-39-32-www.soloshopbox.com-cd-solo-shop-builder-private-e-commerce--1.log`](server-runs/2026-05-21T13-39-32-www.soloshopbox.com-cd-solo-shop-builder-private-e-commerce--1.log)

### Command 2 on www.soloshopbox.com as engineer (✗ exec-error: Connection timed out (mutating command — not auto-retried; queue it again if you want to try once more), 10815ms)
```
cd ~/solo-shop-builder-private-e-commerce-for-micro-sellers && nohup docker compose build > /tmp/build-day112-v2.log 2>&1 &
echo $! > /tmp/build-day112-v2.pid
echo "Started build v2, PID=$(cat /tmp/build-day112-v2.pid)"
```
ERROR: Connection timed out (mutating command — not auto-retried; queue it again if you want to try once more)

## 2026-05-21T13:40:07.164Z — Anil ran 1 command(s)
_Pre-SSH: warehouse pushed to GitHub as commit `d0ae4c1` so the server's `git pull` will pick it up._

### Command 1 on www.soloshopbox.com as engineer (✓ exit 0, 2594ms) _(showing tail — full 6,529B stdout + 0B stderr)_
```
kill -0 $(cat /tmp/build-day112-v2.pid 2>/dev/null) 2>/dev/null && echo "RUNNING" || echo "DONE"
tail -100 /tmp/build-day112-v2.log
```
STDOUT:
```
…6.40     at ContextAPI.with (/app/node_modules/next/dist/compiled/@opentelemetry/api/index.js:1:518)
#15 26.40     at NoopTracer.startActiveSpan (/app/node_modules/next/dist/compiled/@opentelemetry/api/index.js:1:18093) {
#15 26.40   description: "Route /api/orders/export couldn't be rendered statically because it used cookies. See more info here: https://nextjs.org/docs/messages/dynamic-server-error",
#15 26.40   digest: 'DYNAMIC_SERVER_USAGE'
#15 26.40 }
#15 26.54 Analytics error: n [Error]: Dynamic server usage: Route /api/analytics couldn't be rendered statically because it used cookies. See more info here: https://nextjs.org/docs/messages/dynamic-server-error
#15 26.54     at l (/app/.next/server/chunks/8948.js:1:37249)
#15 26.54     at u (/app/.next/server/chunks/8402.js:6:4081)
#15 26.54     at a (/app/.next/server/app/api/shops/status/route.js:1:2180)
#15 26.54     at n (/app/.next/server/app/api/shops/status/route.js:1:2401)
#15 26.54     at p (/app/.next/server/app/api/analytics/route.js:1:949)
#15 26.54     at /app/node_modules/next/dist/compiled/next-server/app-route.runtime.prod.js:6:34672
#15 26.54     at /app/node_modules/next/dist/server/lib/trace/tracer.js:140:36
#15 26.54     at NoopContextManager.with (/app/node_modules/next/dist/compiled/@opentelemetry/api/index.js:1:7062)
#15 26.54     at ContextAPI.with (/app/node_modules/next/dist/compiled/@opentelemetry/api/index.js:1:518)
#15 26.54     at NoopTracer.startActiveSpan (/app/node_modules/next/dist/compiled/@opentelemetry/api/index.js:1:18093) {
#15 26.54   description: "Route /api/analytics couldn't be rendered statically because it used cookies. See more info here: https://nextjs.org/docs/messages/dynamic-server-error",
#15 26.54   digest: 'DYNAMIC_SERVER_USAGE'
#15 26.54 }
#15 26.56    Generating static pages (11/44) 
#15 26.82    Generating static pages (22/44) 
#15 26.92    Generating static pages (33/44) 
#15 27.03  ✓ Generating static pages (44/44)
#15 27.57    Finalizing page optimization ...
#15 27.57    Collecting build traces ...
```
Full output: [`server-runs/2026-05-21T13-40-07-www.soloshopbox.com-kill--0-cat-tmp-build-day112-v2.pid-2-de-1.log`](server-runs/2026-05-21T13-40-07-www.soloshopbox.com-kill--0-cat-tmp-build-day112-v2.pid-2-de-1.log)

## 2026-05-21T13:40:30.931Z — Anil ran 1 command(s)
_Pre-SSH: warehouse pushed to GitHub as commit `812e550` so the server's `git pull` will pick it up._

### Command 1 on www.soloshopbox.com as engineer (✗ exit 1, 2460ms)
```
kill -0 $(cat /tmp/build-day112-v2.pid 2>/dev/null) 2>/dev/null && echo "RUNNING" || echo "DONE"
tail -50 /tmp/build-day112-v2.log | grep -A 20 -E "(Successfully built|Build failed|error|ERROR)"
```
STDOUT:
```
DONE
```
ERROR: command exited 1
Full output: [`server-runs/2026-05-21T13-40-30-www.soloshopbox.com-kill--0-cat-tmp-build-day112-v2.pid-2-de-1.log`](server-runs/2026-05-21T13-40-30-www.soloshopbox.com-kill--0-cat-tmp-build-day112-v2.pid-2-de-1.log)

## 2026-05-21T13:40:53.279Z — Anil ran 1 command(s)
_Pre-SSH: warehouse pushed to GitHub as commit `a728055` so the server's `git pull` will pick it up._

### Command 1 on www.soloshopbox.com as engineer (✓ exit 0, 2551ms) _(showing tail — full 9,051B stdout + 0B stderr)_
```
tail -150 /tmp/build-day112-v2.log
```
STDOUT:
```
…N apt-get update && apt-get install -y     openssl     ca-certificates     libnss3     libnspr4     libatk1.0-0     libatk-bridge2.0-0     libcups2     libdrm2     libdbus-1-3     libxkbcommon0     libatspi2.0-0     libxcomposite1     libxdamage1     libxfixes3     libxrandr2     libgbm1     libpango-1.0-0     libcairo2     libasound2     && rm -rf /var/lib/apt/lists/*
#22 CACHED

#23 [runner  3/14] RUN npm install -g prisma@5.14.0
#23 CACHED

#24 [runner  9/14] RUN mkdir -p test-results && chown -R nextjs:nodejs test-results
#24 CACHED

#25 [runner 10/14] COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
#25 DONE 1.1s

#26 [runner 11/14] COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
#26 DONE 0.1s

#27 [runner 12/14] COPY --from=builder --chown=nextjs:nodejs /app/prisma ./prisma
#27 DONE 0.0s

#28 [runner 13/14] COPY --from=builder --chown=nextjs:nodejs /app/node_modules/.prisma ./node_modules/.prisma
#28 DONE 0.1s

#29 [runner 14/14] COPY --from=builder --chown=nextjs:nodejs /app/node_modules/.bin ./node_modules/.bin
#29 DONE 0.1s

#30 exporting to image
#30 exporting layers
#30 exporting layers 1.8s done
#30 exporting manifest sha256:241d9a836ca40733bd98ab518159e3d3cc1c6e92c2af470547f8e97ce556454c done
#30 exporting config sha256:1597671103271707d96c2dda02210e5d1e466c17de8157158a3a9170c0acd930 done
#30 exporting attestation manifest sha256:fe9227c3b17cc9204f6afee869e78dca546d5aebf2c406c247aec10c634b21dc 0.0s done
#30 exporting manifest list sha256:d9ce6539f2c018dab5f116078d464f532d82698958339cd58e5c01f9b09b3aa8 done
#30 naming to docker.io/library/solo-shop-builder-private-e-commerce-for-micro-sellers-app:latest done
#30 unpacking to docker.io/library/solo-shop-builder-private-e-commerce-for-micro-sellers-app:latest
#30 unpacking to docker.io/library/solo-shop-builder-private-e-commerce-for-micro-sellers-app:latest 1.0s done
#30 DONE 2.9s

#31 resolving provenance for metadata file
#31 DONE 0.0s
 Image solo-shop-builder-private-e-commerce-for-micro-sellers-app Built
```
Full output: [`server-runs/2026-05-21T13-40-53-www.soloshopbox.com-tail--150-tmp-build-day112-v2.log-1.log`](server-runs/2026-05-21T13-40-53-www.soloshopbox.com-tail--150-tmp-build-day112-v2.log-1.log)

## 2026-05-21T13:41:55.694Z — Anil ran 2 command(s)
_Pre-SSH: warehouse pushed to GitHub as commit `956c1c6` so the server's `git pull` will pick it up._

### Command 1 on www.soloshopbox.com as engineer (✗ exec-error: Connection timed out (mutating command — not auto-retried; queue it again if you want to try once more), 13029ms)
```
cd ~/solo-shop-builder-private-e-commerce-for-micro-sellers && docker compose up -d
```
ERROR: Connection timed out (mutating command — not auto-retried; queue it again if you want to try once more)

### Command 2 on www.soloshopbox.com as engineer (✓ exit 0, 7233ms)
```
sleep 5 && curl -f https://www.soloshopbox.com/health 2>&1 && echo "OK" || echo "FAIL"
```
STDOUT:
```
  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                 Dload  Upload   Total   Spent    Left  Speed
  0     0    0     0    0     0      0      0 --:--:-- --:--:-- --:--:--     0  0    19    0     0    0     0      0      0 --:--:-- --:--:-- --:--:--     0
curl: (22) The requested URL returned error: 404
FAIL
```
Full output: [`server-runs/2026-05-21T13-41-55-www.soloshopbox.com-sleep-5-curl--f-https-www.soloshopbox.co-2.log`](server-runs/2026-05-21T13-41-55-www.soloshopbox.com-sleep-5-curl--f-https-www.soloshopbox.co-2.log)

## 2026-05-21T13:42:31.454Z — Anil ran 2 command(s)
_Pre-SSH: warehouse pushed to GitHub as commit `56236e7` so the server's `git pull` will pick it up._

### Command 1 on www.soloshopbox.com as engineer (✓ exit 0, 2263ms)
```
cd ~/solo-shop-builder-private-e-commerce-for-micro-sellers && docker compose ps
```
STDOUT:
```
NAME                                                                IMAGE                COMMAND                  SERVICE    CREATED          STATUS                    PORTS
solo-shop-builder-private-e-commerce-for-micro-sellers-postgres-1   postgres:16-alpine   "docker-entrypoint.s…"   postgres   22 minutes ago   Up 22 minutes (healthy)   127.0.0.1:5432->5432/tcp
```
Full output: [`server-runs/2026-05-21T13-42-31-www.soloshopbox.com-cd-solo-shop-builder-private-e-commerce--1.log`](server-runs/2026-05-21T13-42-31-www.soloshopbox.com-cd-solo-shop-builder-private-e-commerce--1.log)

### Command 2 on www.soloshopbox.com as engineer (✓ exit 0, 426ms)
```
curl -sI https://www.soloshopbox.com/ | head -5
```
STDOUT:
```
HTTP/2 404 
content-type: text/plain; charset=utf-8
x-content-type-options: nosniff
content-length: 19
date: Thu, 21 May 2026 13:42:31 GMT
```
Full output: [`server-runs/2026-05-21T13-42-31-www.soloshopbox.com-curl--sI-https-www.soloshopbox.com-head--2.log`](server-runs/2026-05-21T13-42-31-www.soloshopbox.com-curl--sI-https-www.soloshopbox.com-head--2.log)

## 2026-05-21T13:43:13.625Z — Anil ran 2 command(s)
_Pre-SSH: warehouse pushed to GitHub as commit `324f5b0` so the server's `git pull` will pick it up._

### Command 1 on www.soloshopbox.com as engineer (✓ exit 0, 2188ms)
```
cd ~/solo-shop-builder-private-e-commerce-for-micro-sellers && docker compose logs app --tail=50 2>&1 || echo "No app container logs yet"
```
STDOUT:
```
time="2026-05-21T13:43:13Z" level=warning msg="/home/engineer/solo-shop-builder-private-e-commerce-for-micro-sellers/docker-compose.yml: the attribute `version` is obsolete, it will be ignored, please remove it to avoid potential confusion"
```
Full output: [`server-runs/2026-05-21T13-43-13-www.soloshopbox.com-cd-solo-shop-builder-private-e-commerce--1.log`](server-runs/2026-05-21T13-43-13-www.soloshopbox.com-cd-solo-shop-builder-private-e-commerce--1.log)

### Command 2 on www.soloshopbox.com as engineer (✓ exit 0, 382ms)
```
cd ~/solo-shop-builder-private-e-commerce-for-micro-sellers && nohup docker compose up -d app > /tmp/compose-up.log 2>&1 &
echo $! > /tmp/compose-up.pid
echo "Started compose up, PID=$(cat /tmp/compose-up.pid)"
```
STDOUT:
```
Started compose up, PID=2257353
```
Full output: [`server-runs/2026-05-21T13-43-13-www.soloshopbox.com-cd-solo-shop-builder-private-e-commerce--2.log`](server-runs/2026-05-21T13-43-13-www.soloshopbox.com-cd-solo-shop-builder-private-e-commerce--2.log)

## 2026-05-21T13:43:57.908Z — Anil ran 2 command(s)
_Pre-SSH: warehouse pushed to GitHub as commit `3fc437e` so the server's `git pull` will pick it up._

### Command 1 on www.soloshopbox.com as engineer (✓ exit 0, 5448ms)
```
sleep 3 && cd ~/solo-shop-builder-private-e-commerce-for-micro-sellers && docker compose ps
```
STDOUT:
```
NAME                                                                IMAGE                COMMAND                  SERVICE    CREATED          STATUS                    PORTS
solo-shop-builder-private-e-commerce-for-micro-sellers-postgres-1   postgres:16-alpine   "docker-entrypoint.s…"   postgres   24 minutes ago   Up 24 minutes (healthy)   127.0.0.1:5432->5432/tcp
```
Full output: [`server-runs/2026-05-21T13-43-52-www.soloshopbox.com-sleep-3-cd-solo-shop-builder-private-e-c-1.log`](server-runs/2026-05-21T13-43-52-www.soloshopbox.com-sleep-3-cd-solo-shop-builder-private-e-c-1.log)

### Command 2 on www.soloshopbox.com as engineer (✓ exit 0, 5440ms)
```
sleep 5 && curl -sI https://www.soloshopbox.com/ | head -3
```
STDOUT:
```
HTTP/2 404 
content-type: text/plain; charset=utf-8
x-content-type-options: nosniff
```
Full output: [`server-runs/2026-05-21T13-43-57-www.soloshopbox.com-sleep-5-curl--sI-https-www.soloshopbox.c-2.log`](server-runs/2026-05-21T13-43-57-www.soloshopbox.com-sleep-5-curl--sI-https-www.soloshopbox.c-2.log)

## 2026-05-21T13:44:22.590Z — Anil ran 2 command(s)
_Pre-SSH: warehouse pushed to GitHub as commit `1276e09` so the server's `git pull` will pick it up._

### Command 1 on www.soloshopbox.com as engineer (✓ exit 0, 3315ms) _(showing tail — full 5,196,322B stdout + 0B stderr)_
```
cat /tmp/compose-up.log
```
STDOUT:
```
time="2026-05-15T16:52:10Z" level=warning msg="/home/reviewer/solo-shop-builder-private-e-commerce-for-micro-sellers/docker-compose.yml: the attribute `version` is obsolete, it will be ignored, please remove it to avoid potential confusion"
 Container solo-shop-builder-private-e-commerce-for-micro-sellers-postgres-1 Running 
Attaching to app-1, postgres-1
 Container solo-shop-builder-private-e-commerce-for-micro-sellers-postgres-1 Waiting 
 Container solo-shop-builder-private-e-commerce-for-micro-sellers-postgres-1 Healthy 
 Container solo-shop-builder-private-e-commerce-for-micro-sellers-app-1 Starting 
 Container solo-shop-builder-private-e-commerce-for-micro-sellers-app-1 Started 
app-1  | npm warn exec The following package was not found and will be installed: prisma@7.8.0
app-1  | npm warn EBADENGINE Unsupported engine {
app-1  | npm warn EBADENGINE   package: '@prisma/streams-local@0.1.2',
app-1  | npm warn EBADENGINE   required: { bun: '>=1.3.6', node: '>=22.0.0' },
app-1  | npm warn EBADENGINE   current: { node: 'v20.20.2', npm: '10.8.2' }
app-1  | npm warn EBADENGINE }
app-1  | prisma:warn Prisma failed to detect the libssl/openssl version to use, and may not work as expected. Defaulting to "openssl-1.1.x".
app-1  | Please manually install OpenSSL via `apt-get update -y && apt-get install -y openssl` and try installing Prisma again. If you're running Prisma on Docker, add this command to your Dockerfile, or switch to an image that already has OpenSSL installed.
app-1  | Prisma schema loaded from prisma/schema.prisma.
app-1  | Error: Prisma schema validation - (get-config wasm)
app-1  | Error code: P1012
app-1  | error: The datasource property `url` is no longer supported in schema files. Move connection URLs for Migrate to `prisma.config.ts` and pass either `adapter` for a direct database connection or `accelerateUrl` for Accelerate to the `PrismaClient` constructor. See https://pris.ly/d/config-datasource and https://pris.ly/d/prisma7-client-config
app-1  |   -->  prisma/schema.prisma:10
app-1  |    | 
app-1  |  9 |   provider = "postgresql"
app-1  | 10 |   url      = env("DATABASE_URL")
app-1  |    | 
app-1  | 
app-1  | Validation Error Count: 1
app-1  | [Context: getConfig]
app-1  | 
app-1  | Prisma CLI Version : 7.8.0
app-1  | npm notice
app-1  | npm notice New major version of npm available! 10.8.2 -> 11.14.1
app-1  | npm notice Changelog: https://github.com/npm/cli/releases/tag/v11.14.1
app-1  | npm notice To update run: npm install -g npm@11.14.1
app-1  | npm notice
[Kapp-1 exited with code 1 (restarting)
app-1  | prisma:warn Prisma failed to detect the libssl/openssl version to use, and may not work as expected. Defaulting to "openssl-1.1.x".
app-1  | Please manually install OpenSSL via `apt-get update -y && apt-get install -y openssl` and try installing Prisma again. If you're running Prisma on Docker, add this command to your Dockerfile, or switch to an image that already has OpenSSL installed.
app-1  | Prisma schema loaded from prisma/schema.prisma.
app-1  | Error: Prisma schema validation - (get-config wasm)
app-1  | Error code: P1012
app-1  | error: The datasource property `url` is no longer supported in schema files. Move connection URLs for Migrate to `prisma.config.ts` and pass either `adapter` for a direct database connection or `accelerateUrl` for Accelerate to the `PrismaClient` constructor. See https://pris.ly/d/config-datasource and https://pris.ly/d/prisma7-client-config
app-1  |   -->  prisma/schema.prisma:10
app-1  |    | 
app-1  |  9 |   provider = "postgresql"
app-1  | 10 |   url      = env("DATABASE_URL")
app-1  |    | 
app-1  | 
app-1  | Validation Error Count: 1
app-1  | [Context: getConfig]
app-1  | 
app-1  | Prisma CLI Version : 7.8.0
[Kapp-1 exited with code 1 (restarting)
app-1  | prisma:warn Prisma failed to detect the libssl/openssl version to use, and may not work as expected. Defaulting to "openssl-1.1.x".
app-1  | Please manually install OpenSSL via `apt-get update -y && apt-get install -y openssl` and try installing Prisma again. If you're running Prisma on Docker, add 

…[5,191,202 bytes elided]…

1T13:29:18.009Z","userAgent":"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18."}
app-1                                                                        | {"requestId":"ql0FDUjC7OdcULQX","method":"GET","path":"/api/products","responseTime":"1ms","timestamp":"2026-05-21T13:29:18.139Z","userAgent":"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18."}
postgres-1                                                                   | 2026-05-21 13:29:50.759 UTC [28] LOG:  checkpoint starting: time
postgres-1                                                                   | 2026-05-21 13:29:50.966 UTC [28] LOG:  checkpoint complete: wrote 3 buffers (0.0%); 0 WAL file(s) added, 0 removed, 0 recycled; write=0.202 s, sync=0.002 s, total=0.208 s; sync files=3, longest=0.001 s, average=0.001 s; distance=1 kB, estimate=1 kB; lsn=0/470F210, redo lsn=0/470F1D8
[Kapp-1 has been recreated
[Kapp-1 exited with code 137
```
Full output: [`server-runs/2026-05-21T13-44-21-www.soloshopbox.com-cat-tmp-compose-up.log-1.log`](server-runs/2026-05-21T13-44-21-www.soloshopbox.com-cat-tmp-compose-up.log-1.log)

### Command 2 on www.soloshopbox.com as engineer (✓ exit 0, 1177ms)
```
cd ~/solo-shop-builder-private-e-commerce-for-micro-sellers && docker compose up -d 2>&1 | head -30
```
STDOUT:
```
time="2026-05-21T13:44:22Z" level=warning msg="/home/engineer/solo-shop-builder-private-e-commerce-for-micro-sellers/docker-compose.yml: the attribute `version` is obsolete, it will be ignored, please remove it to avoid potential confusion"
 Container solo-shop-builder-private-e-commerce-for-micro-sellers-postgres-1 Running 
 Container solo-shop-builder-private-e-commerce-for-micro-sellers-postgres-1 Waiting 
 Container solo-shop-builder-private-e-commerce-for-micro-sellers-postgres-1 Healthy 
 Container solo-shop-builder-private-e-commerce-for-micro-sellers-app-1 Starting 
 Container solo-shop-builder-private-e-commerce-for-micro-sellers-app-1 Started
```
Full output: [`server-runs/2026-05-21T13-44-22-www.soloshopbox.com-cd-solo-shop-builder-private-e-commerce--2.log`](server-runs/2026-05-21T13-44-22-www.soloshopbox.com-cd-solo-shop-builder-private-e-commerce--2.log)

## 2026-05-21T13:44:46.347Z — Anil ran 1 command(s)
_Pre-SSH: warehouse pushed to GitHub as commit `8f3d22a` so the server's `git pull` will pick it up._

### Command 1 on www.soloshopbox.com as engineer (✓ exit 0, 2300ms)
```
cd ~/solo-shop-builder-private-e-commerce-for-micro-sellers && docker compose ps && echo "---" && docker compose logs app --tail=30
```
STDOUT:
```
NAME                                                                IMAGE                                                        COMMAND                  SERVICE    CREATED          STATUS                    PORTS
solo-shop-builder-private-e-commerce-for-micro-sellers-app-1        solo-shop-builder-private-e-commerce-for-micro-sellers-app   "docker-entrypoint.s…"   app        3 minutes ago    Up 23 seconds             0.0.0.0:3000->3000/tcp, [::]:3000->3000/tcp
solo-shop-builder-private-e-commerce-for-micro-sellers-postgres-1   postgres:16-alpine                                           "docker-entrypoint.s…"   postgres   24 minutes ago   Up 24 minutes (healthy)   127.0.0.1:5432->5432/tcp
---
app-1  | Environment variables loaded from .env
app-1  | Prisma schema loaded from prisma/schema.prisma
app-1  | Datasource "db": PostgreSQL database "soloshop", schema "public" at "postgres:5432"
app-1  | 
app-1  | 11 migrations found in prisma/migrations
app-1  | 
app-1  | 
app-1  | No pending migrations to apply.
app-1  |   ▲ Next.js 14.2.3
app-1  |   - Local:        http://localhost:3000
app-1  |   - Network:      http://0.0.0.0:3000
app-1  | 
app-1  |  ✓ Starting...
app-1  |  ✓ Ready in 65ms
```
Full output: [`server-runs/2026-05-21T13-44-46-www.soloshopbox.com-cd-solo-shop-builder-private-e-commerce--1.log`](server-runs/2026-05-21T13-44-46-www.soloshopbox.com-cd-solo-shop-builder-private-e-commerce--1.log)

## 2026-05-21T13:45:08.771Z — Anil ran 1 command(s)
_Pre-SSH: warehouse pushed to GitHub as commit `62669b5` so the server's `git pull` will pick it up._

### Command 1 on www.soloshopbox.com as engineer (✓ exit 0, 2520ms)
```
curl -sI https://www.soloshopbox.com/ | head -5
```
STDOUT:
```
HTTP/2 200 
cache-control: s-maxage=31536000, stale-while-revalidate
content-type: text/html; charset=utf-8
date: Thu, 21 May 2026 13:45:09 GMT
etag: "dkl8vpflxw88h"
```
Full output: [`server-runs/2026-05-21T13-45-08-www.soloshopbox.com-curl--sI-https-www.soloshopbox.com-head--1.log`](server-runs/2026-05-21T13-45-08-www.soloshopbox.com-curl--sI-https-www.soloshopbox.com-head--1.log)

## 2026-05-21T13:48:03.183Z — Priya ran 1 command(s)
_Pre-SSH: warehouse pushed to GitHub as commit `fc30240` so the server's `git pull` will pick it up._

### Command 1 on www.soloshopbox.com as tester (✓ exit 0, 3330ms)
```
cd ~/solo-shop-builder-private-e-commerce-for-micro-sellers && docker ps --format "{{.Names}}\t{{.Status}}\t{{.Ports}}"
```
STDOUT:
```
solo-shop-builder-private-e-commerce-for-micro-sellers-app-1	Up 3 minutes	0.0.0.0:3000->3000/tcp, [::]:3000->3000/tcp
solo-shop-builder-private-e-commerce-for-micro-sellers-postgres-1	Up 28 minutes (healthy)	127.0.0.1:5432->5432/tcp
traefik-vwiz-traefik-1	Up 4 days
```
Full output: [`server-runs/2026-05-21T13-48-03-www.soloshopbox.com-cd-solo-shop-builder-private-e-commerce--1.log`](server-runs/2026-05-21T13-48-03-www.soloshopbox.com-cd-solo-shop-builder-private-e-commerce--1.log)
