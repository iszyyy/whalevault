<!-- PROJECT BANNER -->
<!-- ![WhaleVault Banner](public/banner.png) -->

# 🐋 WhaleVault

[![Build Status](https://img.shields.io/github/actions/workflow/status/your-org/whalevault/ci.yml?branch=main&label=build)](https://github.com/your-org/whalevault/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)](package.json)
[![Next.js](https://img.shields.io/badge/Next.js-15-black.svg)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue.svg)](https://typescriptlang.org)

**WhaleVault** is a professional-grade crypto portfolio tracker and whale-watching platform. Monitor large on-chain movements, track your multi-exchange portfolio in real time, and get instant alerts when market-moving wallets act.

---

## 📸 Screenshots

<!-- ![Dashboard](public/screenshots/dashboard.png) -->
<!-- ![Portfolio](public/screenshots/portfolio.png) -->
<!-- ![Whale Alerts](public/screenshots/whale-alerts.png) -->

---

## ✨ Features

- **Portfolio Tracking** — Aggregate balances across Binance, Bybit, and self-custody wallets
- **Whale Alert Feed** — Real-time feed of large on-chain transactions
- **Wallet Analysis** — Deep-dive into any Ethereum or Solana address
- **Custom Alerts** — Price, volume, and whale-movement notifications via Telegram / email
- **Multi-chain Support** — Ethereum, Solana (extensible to other chains)
- **Authentication** — Google & GitHub OAuth via NextAuth.js
- **Subscription Tiers** — Free, Pro, and Enterprise plans powered by Stripe
- **Demo Mode** — Safe sandbox for exploring without real keys
- **Responsive UI** — Dark-mode-first design built with Tailwind CSS

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript 5 |
| Database | PostgreSQL + Prisma ORM |
| Cache | Redis |
| Auth | NextAuth.js v5 |
| Payments | Stripe |
| Styling | Tailwind CSS |
| Email | SendGrid |
| Notifications | Telegram Bot API |
| Deployment | Vercel (frontend) + Railway (DB/Redis) |

---

## 🚀 Getting Started

### Prerequisites

- Node.js 20+
- PostgreSQL 15+
- Redis 7+
- A [Stripe](https://stripe.com) account
- Google / GitHub OAuth apps

### Installation

```bash
git clone https://github.com/your-org/whalevault.git
cd whalevault
npm install
```

### Environment Setup

```bash
cp .env.example .env
# Edit .env with your real values
```

See [`.env.example`](.env.example) for all required variables.

### Database Setup

```bash
npx prisma migrate dev --name init
npx prisma generate
```

### Running Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## 📡 API Documentation

All API routes live under `/api`.

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/portfolio` | Fetch aggregated portfolio |
| POST | `/api/portfolio/sync` | Force-sync exchange balances |
| GET | `/api/wallets` | List tracked wallets |
| POST | `/api/wallets` | Add a wallet address |
| DELETE | `/api/wallets/:id` | Remove a wallet |
| GET | `/api/whale-alerts` | Paginated whale transactions |
| POST | `/api/alerts` | Create a custom alert rule |
| GET | `/api/alerts` | List alert rules |
| DELETE | `/api/alerts/:id` | Delete an alert rule |
| POST | `/api/stripe/webhook` | Stripe webhook receiver |
| GET | `/api/subscription` | Current user subscription |

> All endpoints require a valid session cookie except the Stripe webhook.

---

## ☁️ Deployment

### Vercel (Frontend + API)

1. Push to GitHub and import the repo in [Vercel](https://vercel.com).
2. Set all environment variables from `.env.example` in the Vercel dashboard.
3. Vercel will auto-deploy on every push to `main`.

### Railway (PostgreSQL + Redis)

1. Create a new project on [Railway](https://railway.app).
2. Add a **PostgreSQL** plugin and a **Redis** plugin.
3. Copy the connection strings into your Vercel environment variables:
   - `DATABASE_URL` ← PostgreSQL connection string
   - `REDIS_URL` ← Redis connection string
4. Run migrations: `npx prisma migrate deploy`

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feat/my-feature`
3. Commit your changes: `git commit -m "feat: add my feature"`
4. Push to the branch: `git push origin feat/my-feature`
5. Open a Pull Request

Please follow the [Conventional Commits](https://www.conventionalcommits.org/) standard.

---

## 💰 Business / Revenue Model

| Plan | Price | Highlights |
|------|-------|-----------|
| Free | $0/mo | 2 wallets, 1 exchange, delayed alerts |
| Pro | $19/mo | Unlimited wallets, real-time alerts, Telegram notifications |
| Enterprise | $99/mo | Team seats, API access, priority support, custom integrations |

Revenue is processed through Stripe Subscriptions. Webhook events update subscription status in the database in real time.

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

```
MIT License

Copyright (c) 2024 WhaleVault

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
```
