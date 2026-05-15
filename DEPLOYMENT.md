# Solo Shop Builder - Deployment Checklist

## Environment Variables (Required)

All environment variables must be set in the production environment before deployment. Copy `.env.example` to `.env` and fill in the values.

### Database
```bash
DATABASE_URL=postgresql://user:password@host:5432/database_name
```

### SMTP (Email Service)
```bash
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=your-smtp-username
SMTP_PASS=your-smtp-password
SMTP_FROM=noreply@yourdomain.com
```

### Application
```bash
APP_URL=https://yourdomain.com
NODE_ENV=production
SESSION_SECRET=generate-a-long-random-string-here
```

## Pre-Deployment Checklist

- [ ] All environment variables set in production environment
- [ ] Database migrations applied (`npx prisma migrate deploy`)
- [ ] SMTP credentials tested (send test email)
- [ ] SSL/TLS certificate configured for HTTPS
- [ ] Docker images built and tagged
- [ ] Health check endpoint verified (`/api/health` returns 200)
- [ ] Rate limiting tested (5 signup attempts in 15 min)
- [ ] Session cookie security verified (HttpOnly, Secure, SameSite=Strict)

## Deployment Steps

### 1. Build Docker Image
```bash
cd ~/solo-shop-builder-private-e-commerce-for-micro-sellers
git pull
docker compose build
```

### 2. Run Database Migrations
```bash
docker compose run --rm app npx prisma migrate deploy
```

### 3. Start Services
```bash
docker compose up -d
```

### 4. Verify Deployment
```bash
# Check container status
docker compose ps

# Check logs
docker compose logs --tail=50

# Test health endpoint
curl -I http://localhost:3000/api/health

# Test homepage
curl -s http://localhost:3000 | grep -o '<title>.*</title>'
```

### 5. Monitor Logs
```bash
# Follow logs in real-time
docker compose logs -f

# Filter by service
docker compose logs -f app
docker compose logs -f db
```

## Post-Deployment Verification

Test all critical user flows:

1. **Signup flow**
   - Navigate to `/auth/login`
   - Enter email and submit
   - Check email inbox for magic link
   - Click link to verify authentication

2. **Shop creation**
   - Log in as seller
   - Navigate to `/dashboard/create-shop`
   - Enter shop name and slug
   - Submit and verify redirect to dashboard

3. **Public storefront**
   - Visit `/shop/[your-slug]` in incognito window
   - Verify shop name displays
   - Verify no auth required

4. **Session persistence**
   - Log in as seller
   - Refresh browser
   - Verify still logged in

5. **Logout**
   - Click logout button
   - Verify redirect to login page
   - Verify cannot access `/dashboard` without login

## Monitoring

### Health Check
The `/api/health` endpoint returns:
- `200 OK` if database and email service are connected
- `503 Service Unavailable` if any service is down

### Key Metrics to Monitor
- Response time (p95 < 500ms for API routes)
- Database connection pool usage
- Rate limit violations (check logs for 429 responses)
- Email delivery failures (check SMTP logs)
- Error rate (5xx responses)

### Log Locations
- Application logs: `docker compose logs app`
- Database logs: `docker compose logs db`
- Request logs: All API requests logged with request ID, path, method, response time

## Rollback Procedure

If deployment fails:

```bash
# Stop current containers
docker compose down

# Checkout previous working commit
git log --oneline
git checkout <previous-commit-hash>

# Rebuild and restart
docker compose build
docker compose up -d
```

## Troubleshooting

### Database Connection Failed
- Check `DATABASE_URL` environment variable
- Verify database container is running: `docker compose ps db`
- Check database logs: `docker compose logs db`

### Email Not Sending
- Verify SMTP credentials in `.env`
- Test SMTP connection: check `/api/health` endpoint
- Check email logs in application logs

### Rate Limiting Too Aggressive
- Adjust limits in `src/lib/rate-limit.ts`
- Rebuild and redeploy

### Session Cookie Not Persisting
- Verify `SESSION_SECRET` is set
- Check cookie settings in browser DevTools (should be HttpOnly, Secure, SameSite=Strict)
- Ensure HTTPS is configured in production

## Security Hardening

- [ ] HTTPS enforced (no HTTP in production)
- [ ] Session secret is cryptographically random (32+ characters)
- [ ] Database credentials use strong passwords
- [ ] SMTP credentials secured (not in source code)
- [ ] Rate limiting enabled on auth endpoints
- [ ] SQL injection prevented (using Prisma parameterized queries)
- [ ] XSS protection enabled (sanitize user input)
- [ ] CSRF protection (form tokens on state-changing requests)

## Performance Optimization

- [ ] Database indexes applied (AuthToken.token, Shop.sellerId, etc.)
- [ ] Connection pooling enabled (Prisma default)
- [ ] Static assets cached (browser cache headers)
- [ ] Image optimization (Next.js Image component)
- [ ] Compression enabled (gzip/brotli)

## Backup Strategy

### Database Backups
```bash
# Manual backup
docker compose exec db pg_dump -U postgres database_name > backup-$(date +%Y%m%d).sql

# Restore from backup
docker compose exec -T db psql -U postgres database_name < backup-20260515.sql
```

### Recommended Schedule
- Daily automated backups (retain 7 days)
- Weekly backups (retain 4 weeks)
- Monthly backups (retain 12 months)

## Scaling Considerations

### Current Limitations (Single-Server Setup)
- Rate limiting uses in-memory store (not shared across servers)
- Session storage uses cookies (no external session store)

### To Scale Horizontally
1. Replace in-memory rate limiting with Redis
2. Use Redis/PostgreSQL for session storage
3. Use managed database service (AWS RDS, Render Postgres)
4. Use CDN for static assets (Cloudflare, AWS CloudFront)
5. Add load balancer (nginx, AWS ALB)

## Support Contacts

- **Engineering:** anil@innovaine.com
- **DevOps:** devops@innovaine.com
- **On-call:** +1-XXX-XXX-XXXX
