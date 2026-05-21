# Day 118 — Tester · Playwright / Appetize: Solo Shop Builder — Private E-commerce for Micro-Sellers

- **By:** Priya (Tester)
- **Cycle:** 199
- **Saved:** 21/05/2026, 9:56:09 PM

---

## ✅ Done

Day 118 testing complete with FAIL verdict. Application is completely DOWN - no Docker containers running, site returns HTTP 404, health endpoint fails. Engineer deployed code changes but the deployment failed due to npm cache corruption, and contrary to engineer's claim that "app is running on previous working version," NO services are running at all. Critical blocker: app must be restarted before any user flows can be tested.

Status: DONE

Day 118 testing complete with FAIL verdict. Application is completely DOWN - no Docker containers running, site returns HTTP 404, health endpoint fails. Engineer deployed code changes but the deployment failed due to npm cache corruption, and contrary to engineer's claim that "app is running on previous working version," NO services are running at all. Critical blocker: app must be restarted before any user flows can be tested.

## Plan
[x] p1: Check server health and current app state
[x] p2: Verify the app is accessible at https://www.soloshopbox.com
[-] p3: Test critical user flows: homepage, shop page, dashboard
[x] p4: Check logs for any runtime errors or crashes
[x] p5: Write test report with PASS/FAIL/BLOCKED verdict

## Actions
- list `/` (3773 files)
- read `day-118/_plan.md` (3694B)
- read `day-118/engineering.md` (14175B)
- queued SSH on www.soloshopbox.com: `docker ps --format "{{.Names}}\t{{.Status}}" | grep solo`
- ran 1 SSH command(s) — 1 failure(s)
- SSH `docker ps --format "{{.Names}}\t{{.Status}}" | grep solo` → exit 1 ✗
- queued SSH on www.soloshopbox.com: `docker ps -a | head -10`
- ran 1 SSH command(s) — 0 failure(s)
- SSH `docker ps -a | head -10` → exit 0 ✓
- queued SSH on www.soloshopbox.com: `curl -I https://www.soloshopbox.com 2>&1 | head -5`
- ran 1 SSH command(s) — 0 failure(s)
- SSH `curl -I https://www.soloshopbox.com 2>&1 | head -5` → exit 0 ✓
- queued SSH on www.soloshopbox.com: `curl -sf https://www.soloshopbox.com/api/health && echo "OK" || echo "FAIL"`
- ran 1 SSH command(s) — 0 failure(s)
- SSH `curl -sf https://www.soloshopbox.com/api/health && echo "OK" || echo "FAIL"` → exit 0 ✓
- ✓ p1: Check server health and current app state
- ✓ p2: Verify the app is accessible at https://www.soloshopbox.com
- ○ skipped p3: Test critical user flows: homepage, shop page, dashboard
- queued SSH on www.soloshopbox.com: `cd ~/solo-shop-builder-private-e-commerce-for-micro-sellers && docker compose logs --tail 100`
- ran 1 SSH command(s) — 0 failure(s)
- SSH `cd ~/solo-shop-builder-private-e-commerce-for-micro-sellers && docker compose logs --tail 100` → exit 0 ✓
- queued SSH on www.soloshopbox.com: `cd ~/solo-shop-builder-private-e-commerce-for-micro-sellers && docker compose ps`
- ran 1 SSH command(s) — 0 failure(s)
- SSH `cd ~/solo-shop-builder-private-e-commerce-for-micro-sellers && docker compose ps` → exit 0 ✓
- ✓ p4: Check logs for any runtime errors or crashes
- **wrote** `test-results/day-118/report.md` (3581B)
- ✓ p5: Write test report with PASS/FAIL/BLOCKED verdict

## SSH commands executed
1. ✗ fail (exit 1) — docker ps --format "{{.Names}}\t{{.Status}}" | grep solo
ERROR: command exited 1

2. ✓ exit 0 — docker ps -a | head -10
STDOUT:
CONTAINER ID   IMAGE                COMMAND                  CREATED       STATUS                     PORTS     NAMES
af845a010fe4   postgres:16-alpine   "docker-entrypoint.s…"   6 hours ago   Exited (0) 5 minutes ago             solo-shop-builder-private-e-commerce-for-micro-sellers-postgres-1
2967d9e0bd67   traefik:latest       "/entrypoint.sh --ap…"   4 days ago    Up 4 days                            traefik-vwiz-traefik-1
Full log: server-runs/2026-05-21T18-53-40-www.soloshopbox.com-docker-ps--a-head--10-1.log

3. ✓ exit 0 — curl -I https://www.soloshopbox.com 2>&1 | head -5
STDOUT:
  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                 Dload  Upload   Total   Spent    Left  Speed
  0     0    0     0    0     0      0      0 --:--:-- --:--:-- --:--:--     0  0    19    0     0    0     0      0      0 --:--:-- --:--:-- --:--:--     0
HTTP/2 404 
content-type: text/plain; charset=utf-8
Full log: server-runs/2026-05-21T18-54-04-www.soloshopbox.com-curl--I-https-www.soloshopbox.com-2-1-he-1.log

4. ✓ exit 0 — curl -sf https://www.soloshopbox.com/api/health && echo "OK" || echo "FAIL"
STDOUT:
FAIL
Full log: server-runs/2026-05-21T18-54-29-www.soloshopbox.com-curl--sf-https-www.soloshopbox.com-api-h-1.log

5. ✓ exit 0 — cd ~/solo-shop-builder-private-e-commerce-for-micro-sellers && docker compose lo
STDOUT:
…8] LOG:  could not receive data from client: Connection reset by peer
postgres-1  | 2026-05-21 15:59:53.341 UTC [28] LOG:  checkpoint starting: time
postgres-1  | 2026-05-21 15:59:54.856 UTC [28] LOG:  checkpoint complete: wrote 16 buffers (0.1%); 0 WAL file(s) added, 0 removed, 0 recycled; write=1.509 s, sync=0.002 s, total=1.515 s; sync files=16, longest=0.001 s, average=0.001 s; distance=28 kB, estimate=28 kB; lsn=0/47180A8, redo lsn=0/4718070
postgres-1  | 2026-05-21 16:04:53.956 UTC [28] LOG:  checkpoint starting: time
postgres-1  | 2026-05-21 16:04:54.061 UTC [28] LOG:  checkpoint complete: wrote 2 buffers (0.0%); 0 WAL file(s) added, 0 removed, 0 recycled; write=0.101 s, sync=0.002 s, total=0.106 s; sync files=2, longest=0.001 s, average=0.001 s; distance=4 kB, estimate=26 kB; lsn=0/4719210, redo lsn=0/47191D8
postgres-1  | 2026-05-21 17:24:54.338 UTC [28] LOG:  checkpoint starting: time
postgres-1  | 2026-05-21 17:24:54.447 UTC [28] LOG:  checkpoint complete: wrote 2 buffers (0.0%); 0 WAL file(s) added, 0 removed, 0 recycled; write=0.104 s, sync=0.002 s, total=0.110 s; sync files=2, longest=0.001 s, average=0.001 s; distance=4 kB, estimate=23 kB; lsn=0/471A5F8, redo lsn=0/471A5C0
postgres-1  | 2026-05-21 18:48:40.215 UTC [1] LOG:  received fast shutdown request
postgres-1  | 2026-05-21 18:48:40.216 UTC [1] LOG:  aborting any active transactions
postgres-1  | 2026-05-21 18:48:40.219 UTC [1] LOG:  background worker "logical replication launcher" (PID 33) exited with exit code 1
postgres-1  | 2026-05-21 18:48:40.220 UTC [28] LOG:  shutting down
postgres-1  | 2026-05-21 18:48:40.221 UTC [28] LOG:  checkpoint starting: shutdown immediate
postgres-1  | 2026-05-21 18:48:40.227 UTC [28] LOG:  checkpoint complete: wrote 0 buffers (0.0%); 0 WAL file(s) added, 0 removed, 0 recycled; write=0.002 s, sync=0.001 s, total=0.007 s; sync files=0, longest=0.000 s, average=0.000 s; distance=0 kB, estimate=21 kB; lsn=0/471A6A8, redo lsn=0/471A6A8
postgres-1  | 2026-05-21 18:48:40.235 UTC [1] LOG:  database system is shut down
Full log: server-runs/2026-05-21T18-55-04-www.soloshopbox.com-cd-solo-shop-builder-private-e-commerce--1.log

6. ✓ exit 0 — cd ~/solo-shop-builder-private-e-commerce-for-micro-sellers && docker compose ps
STDOUT:
NAME      IMAGE     COMMAND   SERVICE   CREATED   STATUS    PORTS
Full log: server-runs/2026-05-21T18-55-30-www.soloshopbox.com-cd-solo-shop-builder-private-e-commerce--1.log
