# biral.shop MVP

Next.js (App Router) + TypeScript + Prisma (SQLite) guest checkout e-commerce.

## Environment variables

Required:
- `DATABASE_URL` (e.g. `file:./prisma/dev.db`)
- `ADMIN_PASSWORD`

Optional:
- `ADMIN_SESSION_SECRET` (recommended)
- `EPOINT_MERCHANT_ID`
- `EPOINT_SECRET`
- `EPOINT_CALLBACK_URL`
- `EPOINT_SUCCESS_URL`
- `EPOINT_FAIL_URL`

If `EPOINT_MERCHANT_ID` and `EPOINT_SECRET` are missing, ePoint payment is disabled.

## Setup

```bash
npm install
npx prisma generate
npx prisma migrate deploy
npm run dev
```

## Test

```bash
npm test
```

## Security notes

- Admin auth is cookie-based HMAC-signed session (`HttpOnly`, `SameSite=Lax`, `Secure` in production).
- If `ADMIN_SESSION_SECRET` is absent, session signing falls back to `ADMIN_PASSWORD` (works but less ideal); set a dedicated secret in production.
- Checkout totals are computed from DB prices server-side.
- User input is sanitized before WhatsApp template interpolation.

## Temporary ePoint adapter

`lib/epoint.ts` implements a deterministic HMAC signature flow for redirects/callback verification as a safe temporary adapter until official gateway spec parameters are wired.
