# FlowOS AI

Investor-grade **AI Life Operating System** built on Next.js + TypeScript with a service-oriented backend architecture.

## Frontend
- Next.js App Router UI
- Tailwind CSS + premium component primitives
- Dashboard, command center, onboarding, subscriptions, refunds, purchase assistant, settings

## Backend Architecture (Production-Ready Scaffold)

### Core Stack
- Next.js API Routes (service-based backend)
- TypeScript
- PostgreSQL + Prisma ORM
- NextAuth (credentials + Prisma adapter)
- Stripe billing
- OpenAI command intelligence
- Zod validation + API guardrails

### Domain Services
- `ai-command.service.ts`: command parsing/classification + AI task lifecycle
- `subscription.service.ts`: spend analysis and cancellation suggestions
- `refund.service.ts`: claim creation + follow-up workflow
- `purchase.service.ts`: budget recommendation engine
- `report.service.ts`: weekly AI report generation
- `billing.service.ts`: Stripe checkout + portal
- `notification.service.ts`: persistent notifications + email abstraction
- `admin.service.ts`: admin analytics and monitoring metrics

### API Surface
- `POST /api/ai/command`
- `GET /api/subscriptions/analyze`
- `POST /api/refunds/claims`
- `POST /api/purchases/recommend`
- `POST /api/reports/weekly`
- `POST /api/billing/checkout`
- `POST /api/billing/portal`
- `POST /api/notifications/send`
- `GET /api/admin/analytics`
- `POST /api/webhooks/stripe`

### Security Controls
- Auth/session enforcement for all sensitive APIs
- Role-based access for admin/business operations
- In-memory rate limiter (replaceable with Redis in prod)
- Input validation with Zod
- Security headers via Next middleware
- Stripe webhook signature verification

## Database
Prisma schema includes all requested high-scale entities:
- users, profile, settings, connected accounts
- plans, billing history, payment methods
- subscriptions
- refunds + claim logs
- bookings
- purchase recommendations
- AI tasks + AI task history
- permission policies
- notifications
- weekly reports

## Local Setup
1. Create `.env` with:
   - `DATABASE_URL`
   - `NEXTAUTH_SECRET`
   - `NEXTAUTH_URL`
   - `OPENAI_API_KEY`
   - `STRIPE_SECRET_KEY`
   - `STRIPE_WEBHOOK_SECRET`
   - `APP_URL`
2. Install dependencies
3. Run Prisma migration/generate
4. Start app

```bash
npm install
npm run prisma:generate
npm run prisma:migrate
npm run dev
```
