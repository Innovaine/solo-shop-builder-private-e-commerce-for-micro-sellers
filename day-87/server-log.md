# Server command log — day-87

Auto-recorded by the runner. Every approved SSH command + its output for this day goes here.
Historical entries (before per-day rotation) live in /server-log.md at repo root.

## 2026-05-20T01:04:23.396Z — Anil ran 1 command(s)
_Pre-SSH: warehouse pushed to GitHub as commit `fdf893a` so the server's `git pull` will pick it up._

### Command 1 on www.soloshopbox.com as engineer (✓ exit 0, 2456ms)
```
cd ~/solo-shop-builder-private-e-commerce-for-micro-sellers 2>/dev/null && echo "REPO EXISTS" || echo "REPO NOT FOUND"
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
df -h / | tail -1
```
STDOUT:
```
REPO EXISTS
NAMES                                                               STATUS                    PORTS
solo-shop-builder-private-e-commerce-for-micro-sellers-app-1        Up 28 minutes             0.0.0.0:3000->3000/tcp, [::]:3000->3000/tcp
solo-shop-builder-private-e-commerce-for-micro-sellers-postgres-1   Up 28 minutes (healthy)   127.0.0.1:5432->5432/tcp
traefik-vwiz-traefik-1                                              Up 2 days                 
/dev/sda1       387G   92G  295G  24% /
```
Full output: [`server-runs/2026-05-20T01-04-23-www.soloshopbox.com-cd-solo-shop-builder-private-e-commerce--1.log`](server-runs/2026-05-20T01-04-23-www.soloshopbox.com-cd-solo-shop-builder-private-e-commerce--1.log)

## 2026-05-20T01:04:43.275Z — Anil ran 1 command(s)
_Pre-SSH: warehouse pushed to GitHub as commit `c3089f7` so the server's `git pull` will pick it up._

### Command 1 on www.soloshopbox.com as engineer (✓ exit 0, 2286ms)
```
cd ~/solo-shop-builder-private-e-commerce-for-micro-sellers && docker compose logs --tail=100 app | grep -i "s3\|upload\|error" | tail -50
```
STDOUT:
```
app-1  | {"requestId":"xeloi5a0KMZ5z3vi","method":"POST","path":"/api/products/upload","responseTime":"1ms","timestamp":"2026-05-20T00:36:31.709Z","userAgent":"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18."}
app-1  | S3 upload failed, falling back to local storage: PermanentRedirect: The bucket you are attempting to access must be addressed using the specified endpoint. Please send all future requests to this endpoint.
app-1  |     at ProtocolLib.getErrorSchemaOrThrowBaseException (/app/node_modules/@aws-sdk/core/dist-cjs/submodules/protocols/index.js:70:67)
app-1  |     at S3RestXmlProtocol.handleError (/app/node_modules/@aws-sdk/core/dist-cjs/submodules/protocols/index.js:1856:65)
app-1  |     at S3RestXmlProtocol.deserializeResponse (/app/node_modules/@smithy/core/dist-cjs/submodules/protocols/index.js:424:24)
app-1  |     at async /app/node_modules/@aws-sdk/middleware-sdk-s3/dist-cjs/index.js:350:20
app-1  |     at async /app/node_modules/@aws-sdk/middleware-sdk-s3/dist-cjs/index.js:64:28
app-1  |     at async /app/node_modules/@aws-sdk/middleware-sdk-s3/dist-cjs/index.js:91:20 {
app-1  |   Endpoint: 's3.amazonaws.com',
```
Full output: [`server-runs/2026-05-20T01-04-43-www.soloshopbox.com-cd-solo-shop-builder-private-e-commerce--1.log`](server-runs/2026-05-20T01-04-43-www.soloshopbox.com-cd-solo-shop-builder-private-e-commerce--1.log)
