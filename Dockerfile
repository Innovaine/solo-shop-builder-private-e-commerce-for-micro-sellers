FROM node:20-slim AS base

# Install dependencies only when needed
FROM base AS deps
RUN apt-get update && apt-get install -y openssl ca-certificates && rm -rf /var/lib/apt/lists/*
WORKDIR /app

# Configure npm retry behavior BEFORE install to handle transient registry failures
RUN npm config set fetch-retries 5 && \
    npm config set fetch-retry-mintimeout 20000 && \
    npm config set fetch-retry-maxtimeout 120000

COPY package.json ./
RUN npm install --loglevel=verbose

# Rebuild the source code only when needed
FROM base AS builder
RUN apt-get update && apt-get install -y openssl ca-certificates && rm -rf /var/lib/apt/lists/*
WORKDIR /app

# Configure npm retry behavior BEFORE install to handle transient registry failures
RUN npm config set fetch-retries 5 && \
    npm config set fetch-retry-mintimeout 20000 && \
    npm config set fetch-retry-maxtimeout 120000

# Copy package.json first for dependency install
COPY package.json ./

# Clean npm cache to avoid corrupted cached packages, then install dependencies
RUN npm cache clean --force && npm install

# Copy source code
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Ensure public directory exists (Next.js may not create it if there are no static assets)
RUN mkdir -p public

# Build Next.js app (this will create .next/standalone and .next/static with output: 'standalone' config)
RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

# Install openssl, prisma CLI, and Playwright dependencies for running tests
RUN apt-get update && apt-get install -y \
    openssl \
    ca-certificates \
    libnss3 \
    libnspr4 \
    libatk1.0-0 \
    libatk-bridge2.0-0 \
    libcups2 \
    libdrm2 \
    libdbus-1-3 \
    libxkbcommon0 \
    libatspi2.0-0 \
    libxcomposite1 \
    libxdamage1 \
    libxfixes3 \
    libxrandr2 \
    libgbm1 \
    libpango-1.0-0 \
    libcairo2 \
    libasound2 \
    && rm -rf /var/lib/apt/lists/*
RUN npm install -g prisma@5.14.0

RUN groupadd --system --gid 1001 nodejs
RUN useradd --system --uid 1001 --home-dir /home/nextjs --create-home nextjs

# Copy public directory (will be empty if no static assets, but must exist)
COPY --from=builder /app/public ./public

# Set the correct permission for prerender cache
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Create test-results directory with correct permissions for Playwright
RUN mkdir -p test-results && chown -R nextjs:nodejs test-results

# Automatically leverage output traces to reduce image size
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/prisma ./prisma
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/.bin ./node_modules/.bin

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Start the app (migrations run via docker-compose command override or init script)
CMD ["node", "server.js"]
