# Architecture

```text
Browser
  -> Next.js App Router
  -> Supabase Auth
  -> PostgreSQL
  -> Row Level Security
```

## Roles
- student: reads only enrolled courses
- teacher: creates and manages own courses
- admin: reads users and changes roles through a protected server route

## Security
The UI is not the security boundary. Database RLS enforces access. The service-role key is used only in the server-side admin role endpoint.

## Production upgrades
Add Zod validation, audit logs, rate limiting, Sentry, automated tests, file storage, invitations, and billing as needed.
