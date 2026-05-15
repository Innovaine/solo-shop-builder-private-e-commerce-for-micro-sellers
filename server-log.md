# Server command log

Auto-recorded by the runner. Every approved SSH command + its output goes here.

## 2026-05-15T15:44:42.310Z — Anil ran 1 command(s)
_Pre-SSH: warehouse pushed to GitHub as commit `d5715a2` so the server's `git pull` will pick it up._

### Command 1 on app as engineer (✓ exit 0, 2241ms)
```
cd ~/solo-shop-builder-private-e-commerce-for-micro-sellers 2>/dev/null && echo "REPO EXISTS" || echo "REPO NOT FOUND"
```
STDOUT:
```
REPO NOT FOUND
```
Full output: [`server-runs/2026-05-15T15-44-42-app-cd-solo-shop-builder-private-e-commerce--1.log`](server-runs/2026-05-15T15-44-42-app-cd-solo-shop-builder-private-e-commerce--1.log)

## 2026-05-15T15:45:06.274Z — Anil ran 1 command(s)
_Pre-SSH: warehouse pushed to GitHub as commit `99e74b6` so the server's `git pull` will pick it up._

### Command 1 on app as engineer (✓ exit 0, 2461ms)
```
git clone https://github.com/Innovaine/solo-shop-builder-private-e-commerce-for-micro-sellers.git ~/solo-shop-builder-private-e-commerce-for-micro-sellers && cd ~/solo-shop-builder-private-e-commerce-for-micro-sellers && git log --oneline -3
```
STDOUT:
```
99e74b6 Anil (engineer, day 2) — pre-SSH sync
d5715a2 Anil (engineer, day 2) — pre-SSH sync
ab3ef43 Manual sync from Qadar (49 files)
```
Full output: [`server-runs/2026-05-15T15-45-06-app-git-clone-https-github.com-Innovaine-sol-1.log`](server-runs/2026-05-15T15-45-06-app-git-clone-https-github.com-Innovaine-sol-1.log)

## 2026-05-15T15:45:36.422Z — Anil ran 1 command(s)
_Pre-SSH: warehouse pushed to GitHub as commit `233ec3f` so the server's `git pull` will pick it up._

### Command 1 on app as engineer (✓ exit 0, 4359ms)
```
cd ~/solo-shop-builder-private-e-commerce-for-micro-sellers && nohup docker compose build > /tmp/soloshop-build.log 2>&1 &
echo $! > /tmp/soloshop-build.pid
echo "Started build, PID=$(cat /tmp/soloshop-build.pid)"
```
STDOUT:
```
Started build, PID=700190
```
Full output: [`server-runs/2026-05-15T15-45-36-app-cd-solo-shop-builder-private-e-commerce--1.log`](server-runs/2026-05-15T15-45-36-app-cd-solo-shop-builder-private-e-commerce--1.log)

## 2026-05-15T15:46:00.051Z — Anil ran 1 command(s)
_Pre-SSH: warehouse pushed to GitHub as commit `83bcb62` so the server's `git pull` will pick it up._

### Command 1 on app as engineer (✓ exit 0, 2165ms) _(showing tail — full 3,366B stdout + 0B stderr)_
```
kill -0 $(cat /tmp/soloshop-build.pid) 2>/dev/null && echo "BUILD RUNNING" || echo "BUILD DONE"
tail -80 /tmp/soloshop-build.log
```
STDOUT:
```
…error
#10 0.793 npm error Options:
#10 0.793 npm error [--install-strategy <hoisted|nested|shallow|linked>] [--legacy-bundling]
#10 0.793 npm error [--global-style] [--omit <dev|optional|peer> [--omit <dev|optional|peer> ...]]
#10 0.793 npm error [--include <prod|dev|optional|peer> [--include <prod|dev|optional|peer> ...]]
#10 0.793 npm error [--strict-peer-deps] [--foreground-scripts] [--ignore-scripts] [--no-audit]
#10 0.793 npm error [--no-bin-links] [--no-fund] [--dry-run]
#10 0.793 npm error [-w|--workspace <workspace-name> [-w|--workspace <workspace-name> ...]]
#10 0.793 npm error [-ws|--workspaces] [--include-workspace-root] [--install-links]
#10 0.793 npm error
#10 0.793 npm error aliases: clean-install, ic, install-clean, isntall-clean
#10 0.793 npm error
#10 0.793 npm error Run "npm help ci" for more info
#10 0.794 npm error A complete log of this run can be found in: /root/.npm/_logs/2026-05-15T15_45_35_820Z-debug-0.log
#10 ERROR: process "/bin/sh -c npm ci" did not complete successfully: exit code: 1
------
 > [deps 4/4] RUN npm ci:
0.793 npm error [--include <prod|dev|optional|peer> [--include <prod|dev|optional|peer> ...]]
0.793 npm error [--strict-peer-deps] [--foreground-scripts] [--ignore-scripts] [--no-audit]
0.793 npm error [--no-bin-links] [--no-fund] [--dry-run]
0.793 npm error [-w|--workspace <workspace-name> [-w|--workspace <workspace-name> ...]]
0.793 npm error [-ws|--workspaces] [--include-workspace-root] [--install-links]
0.793 npm error
0.793 npm error aliases: clean-install, ic, install-clean, isntall-clean
0.793 npm error
0.793 npm error Run "npm help ci" for more info
0.794 npm error A complete log of this run can be found in: /root/.npm/_logs/2026-05-15T15_45_35_820Z-debug-0.log
------
Dockerfile:9

--------------------

   7 |     

   8 |     COPY package.json package-lock.json* ./

   9 | >>> RUN npm ci

  10 |     

  11 |     # Rebuild the source code only when needed

--------------------

failed to solve: process "/bin/sh -c npm ci" did not complete successfully: exit code: 1
```
Full output: [`server-runs/2026-05-15T15-46-00-app-kill--0-cat-tmp-soloshop-build.pid-2-dev-1.log`](server-runs/2026-05-15T15-46-00-app-kill--0-cat-tmp-soloshop-build.pid-2-dev-1.log)

## 2026-05-15T15:46:27.173Z — Anil ran 1 command(s)
_Pre-SSH: warehouse pushed to GitHub as commit `4efce07` so the server's `git pull` will pick it up._

### Command 1 on app as engineer (✓ exit 0, 2391ms)
```
cd ~/solo-shop-builder-private-e-commerce-for-micro-sellers && git pull
```
STDOUT:
```
Updating 99e74b6..4efce07
Fast-forward
 Dockerfile    |  2 +-
 server-log.md | 88 +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
 2 files changed, 89 insertions(+), 1 deletion(-)
```
Full output: [`server-runs/2026-05-15T15-46-27-app-cd-solo-shop-builder-private-e-commerce--1.log`](server-runs/2026-05-15T15-46-27-app-cd-solo-shop-builder-private-e-commerce--1.log)

## 2026-05-15T15:46:55.482Z — Anil ran 1 command(s)
_Pre-SSH: warehouse pushed to GitHub as commit `759d286` so the server's `git pull` will pick it up._

### Command 1 on app as engineer (✗ exec-error: Connection timed out (mutating command — not auto-retried; queue it again if you want to try once more), 12312ms)
```
cd ~/solo-shop-builder-private-e-commerce-for-micro-sellers && nohup docker compose build > /tmp/soloshop-build2.log 2>&1 &
echo $! > /tmp/soloshop-build2.pid
echo "Started build, PID=$(cat /tmp/soloshop-build2.pid)"
```
ERROR: Connection timed out (mutating command — not auto-retried; queue it again if you want to try once more)

## 2026-05-15T15:47:12.402Z — Anil ran 1 command(s)
_Pre-SSH: warehouse pushed to GitHub as commit `4b7c9ee` so the server's `git pull` will pick it up._

### Command 1 on app as engineer (✓ exit 0, 2253ms)
```
ls -lh /tmp/soloshop-build2.* 2>/dev/null || echo "Build files not found"
ps aux | grep docker | grep -v grep | head -5
```
STDOUT:
```
-rw-rw-r-- 1 engineer engineer 3.1K May 15 15:47 /tmp/soloshop-build2.log
-rw-rw-r-- 1 engineer engineer    7 May 15 15:46 /tmp/soloshop-build2.pid
root        2194  0.3  1.1 3233040 385204 ?      Ssl  May12  12:33 /usr/bin/dockerd -H fd:// --containerd=/run/containerd/containerd.sock
root      541816  0.0  0.0 1747108 5176 ?        Sl   May14   0:00 /usr/bin/docker-proxy -proto tcp -host-ip 0.0.0.0 -host-port 5432 -container-ip 172.18.0.2 -container-port 5432 -use-listen-fd
root      541823  0.0  0.0 1747108 5440 ?        Sl   May14   0:00 /usr/bin/docker-proxy -proto tcp -host-ip :: -host-port 5432 -container-ip 172.18.0.2 -container-port 5432 -use-listen-fd
root      562386  0.0  0.0 1747108 5284 ?        Sl   May14   0:00 /usr/bin/docker-proxy -proto tcp -host-ip 0.0.0.0 -host-port 3000 -container-ip 172.18.0.3 -container-port 3000 -use-listen-fd
root      562392  0.0  0.0 2116536 6728 ?        Sl   May14   0:00 /usr/bin/docker-proxy -proto tcp -host-ip :: -host-port 3000 -container-ip 172.18.0.3 -container-port 3000 -use-listen-fd
```
Full output: [`server-runs/2026-05-15T15-47-12-app-ls--lh-tmp-soloshop-build2.-2-dev-null-e-1.log`](server-runs/2026-05-15T15-47-12-app-ls--lh-tmp-soloshop-build2.-2-dev-null-e-1.log)

## 2026-05-15T15:47:35.574Z — Anil ran 1 command(s)
_Pre-SSH: warehouse pushed to GitHub as commit `ddaee7c` so the server's `git pull` will pick it up._

### Command 1 on app as engineer (✓ exit 0, 1798ms) _(showing tail — full 3,096B stdout + 0B stderr)_
```
cat /tmp/soloshop-build2.pid
kill -0 $(cat /tmp/soloshop-build2.pid) 2>/dev/null && echo "BUILD RUNNING" || echo "BUILD DONE"
tail -100 /tmp/soloshop-build2.log
```
STDOUT:
```
…rom Dockerfile
#2 transferring dockerfile: 1.32kB done
#2 DONE 0.0s

#3 [internal] load metadata for docker.io/library/node:20-alpine
#3 DONE 0.4s

#4 [internal] load .dockerignore
#4 transferring context: 2B done
#4 DONE 0.0s

#5 [base 1/1] FROM docker.io/library/node:20-alpine@sha256:fb4cd12c85ee03686f6af5362a0b0d56d50c58a04632e6c0fb8363f609372293
#5 resolve docker.io/library/node:20-alpine@sha256:fb4cd12c85ee03686f6af5362a0b0d56d50c58a04632e6c0fb8363f609372293 0.0s done
#5 DONE 0.0s

#6 [internal] load build context
#6 transferring context: 25.02kB done
#6 DONE 0.0s

#7 [deps 2/4] WORKDIR /app
#7 CACHED

#8 [deps 1/4] RUN apk add --no-cache libc6-compat openssl
#8 CACHED

#9 [deps 3/4] COPY package.json package-lock.json* ./
#9 CACHED

#10 [deps 4/4] RUN npm install
#10 17.77 npm warn deprecated inflight@1.0.6: This module is not supported, and leaks memory. Do not use it. Check out lru-cache if you want a good and tested way to coalesce async requests by a key value, which is much more comprehensive and powerful.
#10 18.47 npm warn deprecated rimraf@3.0.2: Rimraf versions prior to v4 are no longer supported
#10 19.13 npm warn deprecated @humanwhocodes/object-schema@2.0.3: Use @eslint/object-schema instead
#10 19.22 npm warn deprecated @humanwhocodes/config-array@0.13.0: Use @eslint/config-array instead
#10 19.36 npm warn deprecated glob@7.2.3: Old versions of glob are not supported, and contain widely publicized security vulnerabilities, which have been fixed in the current version. Please update. Support for old versions may be purchased (at exorbitant rates) by contacting i@izs.me
#10 19.65 npm warn deprecated glob@10.3.10: Old versions of glob are not supported, and contain widely publicized security vulnerabilities, which have been fixed in the current version. Please update. Support for old versions may be purchased (at exorbitant rates) by contacting i@izs.me
#10 20.25 npm warn deprecated eslint@8.57.1: This version is no longer supported. Please see https://eslint.org/version-support for other options.
```
Full output: [`server-runs/2026-05-15T15-47-35-app-cat-tmp-soloshop-build2.pid-1.log`](server-runs/2026-05-15T15-47-35-app-cat-tmp-soloshop-build2.pid-1.log)

## 2026-05-15T15:47:56.452Z — Anil ran 1 command(s)
_Pre-SSH: warehouse pushed to GitHub as commit `f91a272` so the server's `git pull` will pick it up._

### Command 1 on app as engineer (✓ exit 0, 1788ms)
```
kill -0 $(cat /tmp/soloshop-build2.pid) 2>/dev/null && echo "BUILD RUNNING" || echo "BUILD DONE"
tail -50 /tmp/soloshop-build2.log | grep -E "(Successfully|ERROR|error|failed|DONE)" | tail -20
```
STDOUT:
```
BUILD RUNNING
#10 DONE 59.9s
#12 DONE 3.9s
#13 DONE 0.2s
#14 1.075 prisma:warn Prisma failed to detect the libssl/openssl version to use, and may not work as expected. Defaulting to "openssl-1.1.x".
#14 1.626 prisma:warn Prisma failed to detect the libssl/openssl version to use, and may not work as expected. Defaulting to "openssl-1.1.x".
#14 DONE 2.5s
#15 0.808 prisma:warn Prisma failed to detect the libssl/openssl version to use, and may not work as expected. Defaulting to "openssl-1.1.x".
#15 0.948 prisma:warn Prisma failed to detect the libssl/openssl version to use, and may not work as expected. Defaulting to "openssl-1.1.x".
```
Full output: [`server-runs/2026-05-15T15-47-56-app-kill--0-cat-tmp-soloshop-build2.pid-2-de-1.log`](server-runs/2026-05-15T15-47-56-app-kill--0-cat-tmp-soloshop-build2.pid-2-de-1.log)

## 2026-05-15T15:48:16.554Z — Anil ran 1 command(s)
_Pre-SSH: warehouse pushed to GitHub as commit `c10cecc` so the server's `git pull` will pick it up._

### Command 1 on app as engineer (✓ exit 0, 2260ms)
```
kill -0 $(cat /tmp/soloshop-build2.pid) 2>/dev/null && echo "BUILD RUNNING" || echo "BUILD DONE"
tail -30 /tmp/soloshop-build2.log
```
STDOUT:
```
BUILD DONE
 > [builder 5/5] RUN npm run build:
3.435  ⨯ page.tsx doesn't have a root layout. To fix this error, make sure every page has a root layout.
3.474 
3.474 > Build error occurred
3.475 Error: Jest worker encountered 1 child process exceptions, exceeding retry limit
3.475     at ChildProcessWorker.initialize (/app/node_modules/next/dist/compiled/jest-worker/index.js:1:11580)
3.475     at ChildProcessWorker._onExit (/app/node_modules/next/dist/compiled/jest-worker/index.js:1:12545)
3.475     at ChildProcess.emit (node:events:536:35)
3.475     at ChildProcess._handle.onexit (node:internal/child_process:293:12) {
3.475   type: 'WorkerError'
3.475 }
------
Dockerfile:21

--------------------

  19 |     

  20 |     # Build Next.js app

  21 | >>> RUN npm run build

  22 |     

  23 |     # Production image, copy all the files and run next

--------------------

failed to solve: process "/bin/sh -c npm run build" did not complete successfully: exit code: 1
```
Full output: [`server-runs/2026-05-15T15-48-16-app-kill--0-cat-tmp-soloshop-build2.pid-2-de-1.log`](server-runs/2026-05-15T15-48-16-app-kill--0-cat-tmp-soloshop-build2.pid-2-de-1.log)

## 2026-05-15T15:48:57.055Z — Anil ran 1 command(s)
_Pre-SSH: warehouse pushed to GitHub as commit `ebe3089` so the server's `git pull` will pick it up._

### Command 1 on app as engineer (✓ exit 0, 2423ms)
```
cd ~/solo-shop-builder-private-e-commerce-for-micro-sellers && git pull
```
STDOUT:
```
Updating 4efce07..ebe3089
Fast-forward
 app/globals.css | 132 +++++++++++++++++++++++++++++++++++++++++++++
 app/layout.tsx  |  19 +++++++
 server-log.md   | 163 ++++++++++++++++++++++++++++++++++++++++++++++++++++++++
 3 files changed, 314 insertions(+)
 create mode 100644 app/globals.css
 create mode 100644 app/layout.tsx
```
Full output: [`server-runs/2026-05-15T15-48-57-app-cd-solo-shop-builder-private-e-commerce--1.log`](server-runs/2026-05-15T15-48-57-app-cd-solo-shop-builder-private-e-commerce--1.log)

## 2026-05-15T15:49:23.797Z — Anil ran 1 command(s)
_Pre-SSH: warehouse pushed to GitHub as commit `6f8158c` so the server's `git pull` will pick it up._

### Command 1 on app as engineer (✓ exit 0, 11427ms)
```
cd ~/solo-shop-builder-private-e-commerce-for-micro-sellers && nohup docker compose build > /tmp/soloshop-build3.log 2>&1 &
echo $! > /tmp/soloshop-build3.pid
echo "Started build, PID=$(cat /tmp/soloshop-build3.pid)"
```
STDOUT:
```
Started build, PID=702474
```
Full output: [`server-runs/2026-05-15T15-49-23-app-cd-solo-shop-builder-private-e-commerce--1.log`](server-runs/2026-05-15T15-49-23-app-cd-solo-shop-builder-private-e-commerce--1.log)

## 2026-05-15T15:52:50.783Z — Anil ran 1 command(s)
_Pre-SSH: warehouse pushed to GitHub as commit `a22a656` so the server's `git pull` will pick it up._

### Command 1 on app as engineer (✗ exec-error: Connection timed out (after 3 attempts on this idempotent command), 189372ms)
```
sleep 60 && kill -0 $(cat /tmp/soloshop-build3.pid) 2>/dev/null && echo "BUILD RUNNING" || echo "BUILD DONE"
tail -40 /tmp/soloshop-build3.log
```
ERROR: Connection timed out (after 3 attempts on this idempotent command)

## 2026-05-15T15:54:45.491Z — Anil ran 1 command(s)
_Pre-SSH: warehouse pushed to GitHub as commit `53a59d6` so the server's `git pull` will pick it up._

### Command 1 on app as engineer (✓ exit 0, 2406ms)
```
kill -0 $(cat /tmp/soloshop-build3.pid) 2>/dev/null && echo "BUILD RUNNING" || echo "BUILD DONE"
tail -50 /tmp/soloshop-build3.log | grep -E "(Successfully|ERROR|error|failed|DONE|Creating|✓)" | tail -25
```
STDOUT:
```
BUILD DONE
#15 6.278 > Build failed because of webpack errors
#15 ERROR: process "/bin/sh -c npm run build" did not complete successfully: exit code: 1
6.278 > Build failed because of webpack errors
failed to solve: process "/bin/sh -c npm run build" did not complete successfully: exit code: 1
```
Full output: [`server-runs/2026-05-15T15-54-45-app-kill--0-cat-tmp-soloshop-build3.pid-2-de-1.log`](server-runs/2026-05-15T15-54-45-app-kill--0-cat-tmp-soloshop-build3.pid-2-de-1.log)

## 2026-05-15T15:55:11.795Z — Anil ran 1 command(s)
_Pre-SSH: warehouse pushed to GitHub as commit `c44242f` so the server's `git pull` will pick it up._

### Command 1 on app as engineer (✓ exit 0, 1944ms) _(showing tail — full 3,681B stdout + 0B stderr)_
```
tail -150 /tmp/soloshop-build3.log | grep -A 20 -B 5 "error\|Error\|failed\|Failed" | head -80
```
STDOUT:
```
…nssl version to use, and may not work as expected. Defaulting to "openssl-1.1.x".
#15 0.893 Please manually install OpenSSL and try installing Prisma again.
#15 1.335 
#15 1.335 ✔ Generated Prisma Client (v5.22.0) to ./node_modules/@prisma/client in 91ms
#15 1.335 
#15 1.335 Start by importing your Prisma Client (See: https://pris.ly/d/importing-client)
#15 1.335 
#15 1.335 Tip: Want to react to database changes in your app as they happen? Discover how with Pulse: https://pris.ly/tip-1-pulse
#15 1.335 
#15 2.171 Attention: Next.js now collects completely anonymous telemetry regarding usage.
#15 2.172 This information is used to shape Next.js' roadmap and prioritize features.
#15 2.172 You can learn more, including how to opt-out if you'd not like to participate in this anonymous program, by visiting the following URL:
#15 2.172 https://nextjs.org/telemetry
#15 2.172 
#15 2.237   ▲ Next.js 14.2.3
#15 2.237 
#15 2.337    Creating an optimized production build ...
#15 6.230 Failed to compile.
#15 6.230 
#15 6.231 ./app/api/auth/logout/route.ts
#15 6.231 Module not found: Can't resolve '@/lib/auth'
#15 6.231 
#15 6.231 https://nextjs.org/docs/messages/module-not-found
#15 6.231 
#15 6.231 ./app/api/auth/signup/route.ts
#15 6.231 Module not found: Can't resolve '@/lib/db'
#15 6.231 
#15 6.231 https://nextjs.org/docs/messages/module-not-found
#15 6.231 
#15 6.231 ./app/api/auth/signup/route.ts
#15 6.231 Module not found: Can't resolve '@/lib/email'
#15 6.231 
#15 6.231 https://nextjs.org/docs/messages/module-not-found
#15 6.231 
#15 6.231 ./app/api/auth/verify/route.ts
#15 6.231 Module not found: Can't resolve '@/lib/db'
#15 6.231 
#15 6.231 https://nextjs.org/docs/messages/module-not-found
--
#15 6.231 Module not found: Can't resolve '@/lib/auth'
#15 6.231 
#15 6.231 https://nextjs.org/docs/messages/module-not-found
#15 6.231 
#15 6.278 
#15 6.278 > Build failed because of webpack errors
#15 ERROR: process "/bin/sh -c npm run build" did not complete successfully: exit code: 1
------
 > [builder 5/5] RUN npm run build:
```
Full output: [`server-runs/2026-05-15T15-55-11-app-tail--150-tmp-soloshop-build3.log-grep---1.log`](server-runs/2026-05-15T15-55-11-app-tail--150-tmp-soloshop-build3.log-grep---1.log)

## 2026-05-15T15:55:41.182Z — Anil ran 1 command(s)
_Pre-SSH: warehouse pushed to GitHub as commit `e623c73` so the server's `git pull` will pick it up._

### Command 1 on app as engineer (✓ exit 0, 2403ms)
```
cd ~/solo-shop-builder-private-e-commerce-for-micro-sellers && git pull
```
STDOUT:
```
Updating ebe3089..e623c73
Fast-forward
 server-log.md | 123 ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
 tsconfig.json |  27 +++++++++++++
 2 files changed, 150 insertions(+)
 create mode 100644 tsconfig.json
```
Full output: [`server-runs/2026-05-15T15-55-41-app-cd-solo-shop-builder-private-e-commerce--1.log`](server-runs/2026-05-15T15-55-41-app-cd-solo-shop-builder-private-e-commerce--1.log)

## 2026-05-15T15:56:25.929Z — Anil ran 1 command(s)
_Pre-SSH: warehouse pushed to GitHub as commit `4c2b1ff` so the server's `git pull` will pick it up._

### Command 1 on app as engineer (✓ exit 0, 11648ms)
```
cd ~/solo-shop-builder-private-e-commerce-for-micro-sellers && nohup docker compose build > /tmp/soloshop-build4.log 2>&1 &
echo $! > /tmp/soloshop-build4.pid
echo "Started build, PID=$(cat /tmp/soloshop-build4.pid)"
```
STDOUT:
```
Started build, PID=704387
```
Full output: [`server-runs/2026-05-15T15-56-25-app-cd-solo-shop-builder-private-e-commerce--1.log`](server-runs/2026-05-15T15-56-25-app-cd-solo-shop-builder-private-e-commerce--1.log)

## 2026-05-15T15:56:58.198Z — Anil ran 1 command(s)
_Pre-SSH: warehouse pushed to GitHub as commit `0389d73` so the server's `git pull` will pick it up._

### Command 1 on app as engineer (✓ exit 0, 1947ms)
```
kill -0 $(cat /tmp/soloshop-build4.pid) 2>/dev/null && echo "BUILD RUNNING" || echo "BUILD DONE"
tail -30 /tmp/soloshop-build4.log | grep -E "(Creating|Successfully|ERROR|error|failed|DONE|✓)" | tail -15
```
STDOUT:
```
BUILD DONE
6.208 > Build failed because of webpack errors
failed to solve: process "/bin/sh -c npm run build" did not complete successfully: exit code: 1
```
Full output: [`server-runs/2026-05-15T15-56-58-app-kill--0-cat-tmp-soloshop-build4.pid-2-de-1.log`](server-runs/2026-05-15T15-56-58-app-kill--0-cat-tmp-soloshop-build4.pid-2-de-1.log)
