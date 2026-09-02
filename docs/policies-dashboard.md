# Admin policies dashboard

`/admin/policies` — view, add, edit, and remove policy records, plus a live
lookup against an insurer's own system. Gated by the existing admin auth
(`src/app/admin/layout.tsx`, which already redirected non-admins before this
feature existed).

## Why two different things live on one page

None of NSIA, Tangerine, or Fortis expose an update or delete endpoint for a
policy — only create, verify/confirm, and (Tangerine 3rd-party only) renew.
There is no way to "edit" or "remove" a policy on the insurer's own system
through any of these partner APIs. So this page does two genuinely different
things:

1. **Manages our own records** — a Postgres table this platform owns.
   Add, edit, and remove all act on this table only. Editing or removing a
   row here never changes anything on the insurer's side.
2. **Looks up an insurer's live record** — read-only, no storage involved,
   queries Tangerine directly by policy or registration number. Only
   Tangerine documents a query-by-number endpoint (both `ConfirmRegNumber`
   and `ConfirmPolicyNumber`, on both its Comprehensive and 3rd Party lines);
   NSIA and Fortis don't, so they aren't offered as lookup options. A result
   can be saved into our own table with one click, tagged `source: 'lookup'`
   so it's clear later where that record came from.

## Configuration

| Variable | Required | Notes |
| --- | --- | --- |
| `POSTGRES_URL` | Yes | A Neon connection string. |

**This must be Neon, not just any Postgres.** The `@vercel/postgres` package
talks Neon's HTTP-based serverless protocol, not the raw Postgres wire
protocol — get `POSTGRES_URL` from a Neon project directly, or from Vercel's
Postgres integration (which provisions a Neon database and sets this
automatically). A self-hosted or generic Postgres instance will not work
without something in front of it that speaks Neon's protocol.

Without it, every `/api/admin/policies*` route answers `503`, and the
dashboard shows a plain "no database configured" message instead of an
empty or broken table.

## Schema

One table, `policies` — see `db/schema.sql` for the canonical definition.
There's no migration tool in this project; `src/lib/db/schema.ts` runs the
same `CREATE TABLE IF NOT EXISTS` idempotently on first use per server
instance, so a fresh database self-heals without a manual setup step. Run
`db/schema.sql` by hand only if you want the table to exist before first
traffic (e.g. to seed it, or to run migrations of your own later).

| Column | Notes |
| --- | --- |
| `id` | UUID primary key, server-generated. |
| `policy_number` | Free text — whatever the insurer or admin calls it. |
| `product_type` | `motor`, `medical`, `travel`, `business`, `marine`, `personal-accident`. |
| `status` | `active`, `expiring`, `expired`, `cancelled`. |
| `source` | `manual`, `checkout`, `lookup` — where the record came from. |

`source: 'checkout'` is reserved for a future change that would write a row
here automatically when a real purchase completes (NSIA/Tangerine/Fortis
submission via checkout, see `docs/nsia-integration.md`,
`docs/tangerine-integration.md`). That wiring doesn't exist yet — every row
today comes from `manual` or `lookup`.

## API routes

| Route | Purpose |
| --- | --- |
| `GET /api/admin/policies?productType=&status=&search=` | List, filtered. |
| `POST /api/admin/policies` | Create. |
| `GET /api/admin/policies/{id}` | Fetch one. |
| `PATCH /api/admin/policies/{id}` | Update. |
| `DELETE /api/admin/policies/{id}` | Remove. |
| `POST /api/admin/policies/lookup` | Live Tangerine lookup — `{ line, identifierType, value }`. |

None of these routes check admin auth server-side today — the page is
gated client-side by the existing `/admin` layout, consistent with how
`/admin/insurers`, `/admin/claims`, etc. already work in this codebase, but
worth knowing if these routes are ever called from outside that page.

## Known constraints

- **No server-side admin check on the API routes themselves** — see above.
- **Checkout doesn't write here yet.** A real purchase through
  `/quote/checkout` still doesn't create a row in this table; the two
  systems (this dashboard, and the live NSIA/Tangerine/Fortis submissions)
  are not yet connected.
- **Lookup is Tangerine-only**, because it's the only partner API among the
  three that documents one.

## Staff & Agents (`/admin/agents`)

Same Postgres database, a separate `agents` table (see `db/schema.sql`).
Added because the "Assign to" dropdown on `/admin/leads` (and the
department-based one on `/admin/claims`) used to be a hardcoded array of
sample names with no persistence — clicking a name only changed local
React state, saved nowhere, gone on refresh.

- `/admin/agents` — add, edit, deactivate, or remove staff (name, email,
  phone, role: sales/support/claims/admin).
- `GET/POST /api/admin/agents`, `GET/PATCH/DELETE /api/admin/agents/{id}` —
  same shape and same `503` fallback as the policies routes above when
  `POSTGRES_URL` isn't set.
- `/admin/leads`'s "Assign to" list fetches active agents from this table
  on load; if the database isn't configured (or the call fails) it falls
  back to the original sample names so the page still works in demo mode.
- `/admin/claims`'s assignment is by department (`Motor Claims Team`,
  `Legal Department`, etc.), not named staff, and stayed a fixed list —
  departments aren't people to manage in a staff directory.

## Leads & Claims (`/admin/leads`, `/admin/claims`)

Same Postgres database, two more tables: `leads` and `claims` (see
`db/schema.sql`). Both pages used to hold their entire dataset as a
hardcoded in-memory array — every status change, assignment, and note
lived only in that browser tab's React state and was gone on refresh, same
problem the `agents` table above fixed for the assignee list itself.

- `leads` — id, `code` (human id like `LD-3021`, auto-assigned from a
  sequence), name/phone/email, product type, summary, estimated premium,
  source, status, `assigned_to` (an agent's name, plain text — not a
  foreign key, since agents can be renamed or removed independently),
  and `notes` as a JSONB array of `{ at, text }`.
- `claims` — id, `code` (`CLM-2025-0921` style, also sequence-assigned),
  claimant name, policy number, claim type, amount, claim date, status,
  `assigned_to` (a department name), description, `timeline` (JSONB array
  of `{ date, event, done }`) and `documents` (JSONB array of filenames).
  A new claim starts with a single "Claim submitted" timeline entry;
  there's no UI yet to append further timeline steps or attach real
  documents — both display only what's already on the record.
- `GET/POST /api/admin/leads`, `GET/PATCH/DELETE /api/admin/leads/{id}`,
  `POST /api/admin/leads/{id}/notes` (appends one note); the equivalent
  `GET/POST /api/admin/claims` and `GET/PATCH/DELETE /api/admin/claims/{id}`
  — same shape and `503`-when-unconfigured convention as policies/agents.
- Each page now has an **Add lead** / **Add claim** button, since neither
  table has any other way to gain rows yet — nothing in the quote flow or
  a claims-submission form writes here (same gap `source: 'checkout'`
  notes above for policies).
- **Demo fallback, unlike Policies and Staff**: if `POSTGRES_URL` isn't
  set, both pages fall back to their original hardcoded sample rows
  instead of showing a "not configured" screen, so the dashboards still
  demo fully out of the box. In that mode every action (status change,
  assignment, notes, adding a lead/claim) only updates local React state
  and resets on refresh, exactly like before this change — a small yellow
  banner on each page says so. Once a database is configured, both pages
  switch to the real, persisted API automatically.
