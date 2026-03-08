# 🐋 WhaleVault — Deployment Guide

This guide covers everything you need to deploy WhaleVault to production using the recommended stack: **Vercel** (app) + **Railway** (PostgreSQL + Redis).  
A self-hosting option (Docker / VPS) is also documented at the end.

---

## Table of Contents

1. [Prerequisites](#1-prerequisites)
2. [Set Up Database & Redis on Railway](#2-set-up-database--redis-on-railway)
3. [Configure OAuth Providers](#3-configure-oauth-providers)
4. [Configure Stripe](#4-configure-stripe)
5. [Configure External API Keys](#5-configure-external-api-keys)
6. [Deploy to Vercel](#6-deploy-to-vercel)
7. [Set Environment Variables on Vercel](#7-set-environment-variables-on-vercel)
8. [Run Database Migrations](#8-run-database-migrations)
9. [Verify the Deployment](#9-verify-the-deployment)
10. [Self-Hosting with Docker](#10-self-hosting-with-docker)
11. [Environment Variable Reference](#11-environment-variable-reference)

---

## 1. Prerequisites

| Requirement | Notes |
|-------------|-------|
| Node.js 20+ | For local builds / migrations |
| Git + GitHub account | Vercel deploys from GitHub |
| [Vercel account](https://vercel.com) | Free tier is sufficient to start |
| [Railway account](https://railway.app) | Free trial covers a small production workload |
| [Stripe account](https://stripe.com) | Needed for subscription billing |
| Google & GitHub OAuth apps | For social login |

---

## 2. Set Up Database & Redis on Railway

### 2a. Create a Railway project

1. Go to [railway.app](https://railway.app) → **New Project**.
2. Click **Deploy from GitHub repo** — or simply start an empty project.

### 2b. Add PostgreSQL

1. Inside your project, click **+ New** → **Database** → **PostgreSQL**.
2. Wait for it to provision (< 30 s).
3. Click the PostgreSQL service → **Variables** tab.
4. Copy the value of **`DATABASE_URL`** — you will need it in Step 7.

### 2c. Add Redis

1. Click **+ New** → **Database** → **Redis**.
2. Once provisioned, click the Redis service → **Variables** tab.
3. Copy the value of **`REDIS_URL`**.

---

## 3. Configure OAuth Providers

### Google OAuth

1. Open [Google Cloud Console](https://console.cloud.google.com) → **APIs & Services** → **Credentials**.
2. Click **Create Credentials** → **OAuth client ID** → Application type: **Web application**.
3. Under **Authorised redirect URIs** add:
   ```
   https://<your-vercel-domain>/api/auth/callback/google
   ```
4. Copy the **Client ID** and **Client Secret**.

### GitHub OAuth

1. Go to GitHub → **Settings** → **Developer settings** → **OAuth Apps** → **New OAuth App**.
2. Set:
   - **Homepage URL**: `https://<your-vercel-domain>`
   - **Authorization callback URL**: `https://<your-vercel-domain>/api/auth/callback/github`
3. Copy the **Client ID** and generate a **Client Secret**.

---

## 4. Configure Stripe

### 4a. Create products & prices

1. Log in to [Stripe Dashboard](https://dashboard.stripe.com).
2. Go to **Products** → **Add product**.
3. Create **Pro** plan:
   - Name: `WhaleVault Pro`
   - Price: `$49.00 / month` (recurring)
   - Copy the **Price ID** (starts with `price_`).
4. Create **Enterprise** plan:
   - Name: `WhaleVault Enterprise`
   - Price: `$199.00 / month` (recurring)
   - Copy the **Price ID**.

### 4b. Set up webhook

1. Go to **Developers** → **Webhooks** → **Add endpoint**.
2. Endpoint URL:
   ```
   https://<your-vercel-domain>/api/stripe/webhook
   ```
3. Select events to listen to:
   - `checkout.session.completed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_failed`
4. Copy the **Signing secret** (starts with `whsec_`).

### 4c. (Local testing) Stripe CLI

```bash
# Install: https://stripe.com/docs/stripe-cli
stripe login
stripe listen --forward-to localhost:3000/api/stripe/webhook
# Copy the webhook signing secret printed in the terminal
```

---

## 5. Configure External API Keys

These are **optional** — the app runs in demo mode without them.

| Service | Where to get the key |
|---------|----------------------|
| Etherscan | [etherscan.io/apis](https://etherscan.io/apis) |
| Solscan | [public-api.solscan.io](https://public-api.solscan.io) |
| Whale Alert | [docs.whale-alert.io](https://docs.whale-alert.io) |
| Telegram Bot | [@BotFather](https://t.me/BotFather) on Telegram |
| SendGrid | [app.sendgrid.com](https://app.sendgrid.com) → API Keys |

Set `DEMO_MODE=true` if you want to skip all external calls and use realistic mock data instead.

---

## 6. Deploy to Vercel

### 6a. Import the repository

1. Go to [vercel.com/new](https://vercel.com/new).
2. Click **Import Git Repository** and select `whalevault`.
3. Vercel auto-detects Next.js — leave **Framework Preset** as **Next.js**.
4. Leave **Build Command** and **Output Directory** as defaults.
5. **Do not deploy yet** — add environment variables first (Step 7).

### 6b. (Optional) Custom domain

In the Vercel project → **Settings** → **Domains**, add your custom domain and follow the DNS instructions.

---

## 7. Set Environment Variables on Vercel

In your Vercel project → **Settings** → **Environment Variables**, add every variable from the table below.

> **Tip**: You can bulk-import by pasting a `.env`-formatted block into the Vercel UI.

```env
# ── Database ──────────────────────────────────────────────────────
DATABASE_URL=postgresql://...          # from Railway PostgreSQL

# ── Cache ─────────────────────────────────────────────────────────
REDIS_URL=redis://...                  # from Railway Redis

# ── NextAuth ──────────────────────────────────────────────────────
NEXTAUTH_SECRET=<random-32-char-string>   # openssl rand -base64 32
NEXTAUTH_URL=https://<your-vercel-domain>

# ── OAuth ─────────────────────────────────────────────────────────
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
GITHUB_CLIENT_ID=...
GITHUB_CLIENT_SECRET=...

# ── Stripe ────────────────────────────────────────────────────────
STRIPE_SECRET_KEY=sk_live_...
STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PRO_PRICE_ID=price_...
STRIPE_ENTERPRISE_PRICE_ID=price_...

# ── Blockchain APIs (optional — set DEMO_MODE=true to skip) ───────
ETHERSCAN_API_KEY=...
SOLSCAN_API_KEY=...
WHALE_ALERT_API_KEY=...

# ── Notifications (optional) ──────────────────────────────────────
TELEGRAM_BOT_TOKEN=...
SENDGRID_API_KEY=...
SENDGRID_FROM_EMAIL=noreply@yourdomain.com

# ── Exchange APIs (optional) ──────────────────────────────────────
BINANCE_API_KEY=...
BINANCE_API_SECRET=...
BYBIT_API_KEY=...
BYBIT_API_SECRET=...

# ── Security ──────────────────────────────────────────────────────
ENCRYPTION_KEY=<random-32-char-string>    # openssl rand -hex 16

# ── Feature Flags ─────────────────────────────────────────────────
DEMO_MODE=false    # set to true to use mock data without real API keys
```

Generate secrets quickly:
```bash
openssl rand -base64 32   # for NEXTAUTH_SECRET
openssl rand -hex 16      # for ENCRYPTION_KEY
```

After adding all variables, click **Deploy** (or trigger a redeploy from the **Deployments** tab).

---

## 8. Run Database Migrations

Migrations must be run once after the first deploy, and again whenever the Prisma schema changes.

### Option A — From your local machine (recommended)

```bash
# Make sure DATABASE_URL points to your Railway Postgres instance
export DATABASE_URL="postgresql://..."   # paste Railway URL

npx prisma migrate deploy    # apply all pending migrations
npx prisma generate          # regenerate Prisma client
```

### Option B — Railway shell

1. Railway project → PostgreSQL service → **Shell** tab.
2. You can't run Prisma directly here; use Option A or a CI job instead.

### Option C — Vercel build command (CI/CD)

In Vercel → **Settings** → **General** → **Build & Development Settings**, set the **Build Command** to:

```bash
npx prisma migrate deploy && next build
```

This runs migrations automatically on every deploy. Requires `DATABASE_URL` to be set as a build-time variable.

---

## 9. Verify the Deployment

1. Visit `https://<your-vercel-domain>` — you should see the WhaleVault landing page.
2. Try signing in via Google or GitHub.
3. Navigate to `/dashboard` — the overview page should load with demo data (or real data if API keys are set).
4. Check `/dashboard/settings` → **Billing** to verify Stripe plan info is visible.
5. Send a test Stripe webhook:
   ```bash
   stripe trigger checkout.session.completed
   ```
6. Check Vercel → **Functions** logs for any runtime errors.

---

## 10. Self-Hosting with Docker

If you prefer to host on a VPS (e.g., DigitalOcean, Hetzner, AWS EC2), use the Dockerfile approach.

### 10a. Create a Dockerfile

Create `/Dockerfile` in the project root:

```dockerfile
FROM node:20-alpine AS base
WORKDIR /app

FROM base AS deps
COPY package.json package-lock.json ./
RUN npm ci

FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npx prisma generate
RUN npm run build

FROM base AS runner
ENV NODE_ENV=production
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
EXPOSE 3000
CMD ["node", "server.js"]
```

Enable standalone output in `next.config.ts`:

```ts
const nextConfig = {
  output: 'standalone',
};
export default nextConfig;
```

### 10b. Docker Compose (app + Postgres + Redis)

Create `docker-compose.yml`:

```yaml
version: '3.9'
services:
  app:
    build: .
    ports:
      - '3000:3000'
    environment:
      DATABASE_URL: postgresql://whalevault:secret@db:5432/whalevault
      REDIS_URL: redis://cache:6379
      # … add all other env vars
    depends_on:
      - db
      - cache

  db:
    image: postgres:15-alpine
    environment:
      POSTGRES_USER: whalevault
      POSTGRES_PASSWORD: secret
      POSTGRES_DB: whalevault
    volumes:
      - pgdata:/var/lib/postgresql/data

  cache:
    image: redis:7-alpine
    volumes:
      - redisdata:/data

volumes:
  pgdata:
  redisdata:
```

### 10c. Run it

```bash
docker compose up -d
docker compose exec app npx prisma migrate deploy
```

---

## 11. Environment Variable Reference

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | ✅ | PostgreSQL connection string |
| `REDIS_URL` | ✅ | Redis connection string |
| `NEXTAUTH_SECRET` | ✅ | Random secret for NextAuth JWT signing |
| `NEXTAUTH_URL` | ✅ | Full URL of your deployment (e.g. `https://app.whalevault.io`) |
| `GOOGLE_CLIENT_ID` | ⚠️ | Required for Google OAuth |
| `GOOGLE_CLIENT_SECRET` | ⚠️ | Required for Google OAuth |
| `GITHUB_CLIENT_ID` | ⚠️ | Required for GitHub OAuth |
| `GITHUB_CLIENT_SECRET` | ⚠️ | Required for GitHub OAuth |
| `STRIPE_SECRET_KEY` | ⚠️ | Required for billing (`sk_live_…`) |
| `STRIPE_PUBLISHABLE_KEY` | ⚠️ | Required for billing (`pk_live_…`) |
| `STRIPE_WEBHOOK_SECRET` | ⚠️ | Required for webhook verification |
| `STRIPE_PRO_PRICE_ID` | ⚠️ | Stripe Price ID for the Pro plan |
| `STRIPE_ENTERPRISE_PRICE_ID` | ⚠️ | Stripe Price ID for the Enterprise plan |
| `ETHERSCAN_API_KEY` | ➖ | Ethereum on-chain data (optional) |
| `SOLSCAN_API_KEY` | ➖ | Solana on-chain data (optional) |
| `WHALE_ALERT_API_KEY` | ➖ | Whale Alert feed (optional) |
| `TELEGRAM_BOT_TOKEN` | ➖ | Telegram alert notifications (optional) |
| `SENDGRID_API_KEY` | ➖ | Email notifications (optional) |
| `SENDGRID_FROM_EMAIL` | ➖ | Sender address for emails (optional) |
| `BINANCE_API_KEY` | ➖ | Trade execution via Binance (optional) |
| `BINANCE_API_SECRET` | ➖ | Trade execution via Binance (optional) |
| `BYBIT_API_KEY` | ➖ | Trade execution via Bybit (optional) |
| `BYBIT_API_SECRET` | ➖ | Trade execution via Bybit (optional) |
| `ENCRYPTION_KEY` | ✅ | 32-char key for encrypting exchange API secrets at rest |
| `DEMO_MODE` | ➖ | Set `true` to bypass all external APIs and use mock data |

**Legend**: ✅ Always required · ⚠️ Required for that feature · ➖ Optional

---

> **Need help?** Open an issue on GitHub or check the [project README](README.md).
