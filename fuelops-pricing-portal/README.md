# FuelOps Pricing Portal

A production-style fuel pricing operations portal built with Next.js, TypeScript, Tailwind CSS, Supabase/PostgreSQL, and designed for Vercel deployment.

## What is included

### Public website

- Home
- Solutions
- Company
- Contact
- Sign-in / account request flows

### Pricing portal

- Operational overview dashboard
- Live fuel pricing
- Sites
- Suppliers and feed health
- Price history
- Approval workflow
- Alerts and exceptions
- Supplier imports
- Reports
- Notifications
- Search
- Settings
- Admin-only users & access
- Admin-only audit log

## Roles

- `viewer`: reads prices, sites, suppliers, history, alerts, and reports
- `pricing_manager`: viewer access plus approvals and imports
- `admin`: full access plus users and audit records

The existing James Smith account is configured as `pricing_manager` in the connected Supabase project.

## Supabase data model

The live project includes:

- `fuel_sites`
- `fuel_products`
- `fuel_suppliers`
- `current_fuel_prices`
- `fuel_price_history`
- `price_change_requests`
- `fuel_alerts`
- `fuel_imports`
- `fuel_audit_events`
- `portal_notifications`

RLS is enabled and role helpers live in the private schema.

## Run locally

```bash
npm install
npm run dev
```

For a realistic performance test:

```bash
npm run build
npm start
```

## Deployment

Deploy to Vercel and add the Supabase environment variables from `.env.local` / `.env.example`.

## Notes

This is an original reference implementation built to mirror the kind of existing website + fuel pricing portal described in the Story Studio posting. It does not copy Story Studio code or designs.

The connected Supabase project still contains the earlier learning-portal tables; this application no longer uses them. They were intentionally left untouched to avoid destructive data removal without explicit approval.
