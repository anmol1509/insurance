# Fortis Global External Motor API integration

Implements the *Fortis Global External Motor API Documentation* — this is
the insurer behind the "Fortis Global" motor plans already on this platform
(`fortis-comp` / `fortis-tpo` in `src/lib/motorPlans.ts`). That integration
existed before this documentation did, reverse-engineered against the live
API; this pass checked it against the real spec and closed the gaps.

## What the docs confirmed was already right

The existing `/api/fortis/catalog` and `/api/fortis/submit` routes had the
auth flow, the catalog endpoint, and — field for field — the submit request
body exactly matching the documented shape. That's now formalized in
`src/lib/fortis/`, with the same request/response contract preserved so
nothing calling these two routes needed to change.

## What was missing or worth hardening

- **Three documented endpoints didn't exist**: `GET /external-api/me`
  (confirms the token and returns the client's catalog scope), and
  `GET /external-api/motor/requests` / `GET
  /external-api/motor/requests/{requestRecord}` (list and inspect this
  platform's own submitted requests). Added as `/api/fortis/me`,
  `/api/fortis/requests`, `/api/fortis/requests/{id}`.
- **The catalog-flattening logic was duplicated** between the catalog route,
  the submit route, and `MotorPlanSelect.tsx` (each with its own inline
  `catalog.data?.products ?? catalog.products ?? catalog.data ?? []`).
  Consolidated into `src/lib/fortis/catalog.ts`, used by all three.
- **The catalog shape assumption was too narrow.** The docs describe the
  response as "the motor root product, child motor products, and their
  covers/prices" — language that reads as a tree, not necessarily the flat
  array the old code assumed. `extractMotorProducts()` now walks the
  response recursively, checking a few plausible child-array key names
  (`products`, `children`, `child_products`), so it keeps working whether
  the real response is flat or nested. This hasn't been confirmed against a
  live response either way — see Known constraints.
- **No input validation on `/api/fortis/submit`** — added a Zod schema so a
  malformed request fails with a clear 400 instead of reaching Fortis (or
  throwing) with garbage data.
- **Errors leaked upstream detail** (`err.message` returned directly to the
  client, including raw Fortis response text). Sanitized to match this
  platform's other integrations: full detail logged server-side, a generic
  or Fortis-decline message returned to the caller.
- **Loosely typed throughout** (`any` on products, covers, catalog
  responses). Typed per the documented shapes in `src/lib/fortis/types.ts`.

## Configuration

| Variable | Required | Notes |
| --- | --- | --- |
| `FORTIS_CLIENT_ID` | Yes | The docs publish `FGI-MOTOR-CLIENT` as a literal sandbox test value. |
| `FORTIS_CLIENT_SECRET` | Yes | The docs publish `FGI-MOTOR-2026!` as a literal sandbox test value. |

Those test credentials are printed directly in Fortis's own documentation
and marked "intentionally for testing purposes only" — safe to put in
`.env.local` to exercise this integration; nothing submitted through them
enters Fortis's live policy workflow.

## Base URL & endpoints

`https://jjmgloballtd.com/coreinsurance/api`

| Route | Fortis endpoint | Purpose |
| --- | --- | --- |
| `GET /api/fortis/catalog` | `GET /external-api/motor/catalog` | Motor products & covers (used by `MotorPlanSelect`). |
| `POST /api/fortis/submit` | `POST /external-api/motor/requests` | Submit an application (used by checkout). |
| `GET /api/fortis/me` | `GET /external-api/me` | Confirms auth; returns this client's catalog scope. |
| `GET /api/fortis/requests` | `GET /external-api/motor/requests` | Lists requests this platform has submitted. |
| `GET /api/fortis/requests/{id}` | `GET /external-api/motor/requests/{requestRecord}` | One submitted request in detail. |

The last three have no UI yet — same posture as the other integrations on
this platform (NSIA's marine/personal-accident backend, Tangerine's TangAuto
and renewal): built for completeness, wired in once there's a page that
needs them. `/api/fortis/requests` in particular is a natural fit for the
admin policies dashboard's "live lookup" panel, which currently only
supports Tangerine — but it lists *this client's own submissions* to a
temporary review table, not "look up any real policy by number" the way
Tangerine's endpoint does, so it wouldn't behave the same way in that UI
without being framed differently.

## Known constraints

- **No live call has succeeded.** The sandbox this was built in blocks
  outbound access to `jjmgloballtd.com` — confirmed against both an
  unconfigured request and one using the real published test credentials,
  both correctly reaching the network boundary and failing only there.
  Nothing here has been confirmed against Fortis's actual JSON responses.
- **The catalog tree-vs-flat question is still open.** `extractMotorProducts()`
  handles both shapes defensively, but which one Fortis actually returns is
  unconfirmed.
- **This is explicitly a sandbox, per Fortis's own docs** — "does not affect
  production," submissions land in a temporary table pending manual review.
  Nothing here issues a real policy.

## Source layout

```
src/lib/fortis/
  config.ts    base URL, client credentials, timeouts
  client.ts    login, authenticated request wrapper, error shaping
  api.ts       one typed function per documented endpoint
  catalog.ts   flattens the catalog tree/list; used client- and server-side
  mappers.ts   quote-store data -> Fortis's motor request payload
  schemas.ts   Zod schema for the submit route's JSON body
  http.ts      route-handler response helper
  types.ts     request/response types
```
