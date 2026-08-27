# NSIA Insurance API integration

Implements the *NSIA Insurance API — External Integration Guide v1.0* against
this platform.

The partner access token is server-side only. The browser never talks to NSIA
directly; it calls our own `/api/nsia/*` route handlers, which authenticate,
validate, map field names and forward the request.

## Configuration

| Variable | Required | Default | Notes |
| --- | --- | --- | --- |
| `NSIA_ACCESS_TOKEN` | Yes | — | Bearer token issued to your partner account. |
| `NSIA_ENV` | No | `test` | `live` or `production` switches to the live base URL. |
| `NSIA_BASE_URL` | No | — | Overrides the base URL entirely; useful for a sandbox. |
| `FIXIE_URL` | No | — | Existing outbound proxy, reused by this integration. |

Base URLs (guide §2):

- Test — `https://test-api.nsiainsurance.com/v1/api`
- Live — `https://live-api.nsiainsurance.com/v1/api`

Both hosts must be reachable from the deployment's outbound network policy.

Without `NSIA_ACCESS_TOKEN` the authenticated endpoints answer `503` with a
clear message rather than failing obscurely; the two anonymous endpoints
(customer lookup and profile creation) keep working.

## Endpoints exposed by this platform

| Route | Method | NSIA endpoint | Purpose |
| --- | --- | --- | --- |
| `/api/nsia/check-user?email=` | GET | `/insured-client/check-userdetails` | §5.1 — does a profile exist? |
| `/api/nsia/profile` | POST | `/account/profiling-insured-client` | §5.2 — create profile (checks first) |
| `/api/nsia/dropdowns?name=` | GET | `/DropDown/*`, `/mobile/marine-cargo-rating` | §6, 7.1, 8.1, 10.1 — master data |
| `/api/nsia/marine-pricing` | POST | `/mobile/marine-pricing-implementation` | §8.2 — marine premium |
| `/api/nsia/submit/{product}` | POST | `/mobile/non-life-*` | §7.2, 8.3, 9.2, 10.2, 11.2 — submit |

`{product}` is one of `motor`, `marine`, `personal-accident`,
`public-liability`, `professional-indemnity`.

`?name=` accepts a comma-separated list, so a form can load every dropdown it
needs in one round trip. Responses are cached in memory for an hour.

## Submitting an application

`POST /api/nsia/submit/{product}` takes `multipart/form-data`:

- `payload` — a JSON string of `{ customer, details }`
- one file per NSIA document slot, e.g. `MeansOfIdentification`,
  `VehicleFrontDocument`

The route then:

1. validates `customer` and the product-specific `details` (Zod),
2. validates each file against the §15 rules (max 5 MB; PDF/JPG/PNG),
3. checks that every required document slot for this applicant is present —
   the required set varies by cover type and by personal vs. corporate,
4. resolves `insuredId` via check-then-create, so a double submission cannot
   create two profiles for one email,
5. maps our fields onto NSIA's names and forwards one multipart request,
6. returns `{ policyNumber, certOrDocNo, insuredId, profileCreated }`.

From the browser, `submitNsiaApplication()` in `src/lib/nsia/browser.ts` wraps
all of this.

## Where it is wired in

Motor is the product with a complete flow on this platform, so it is wired end
to end:

- **Plans** — `NSIA Comprehensive` and `NSIA Third Party` in
  `src/lib/motorPlans.ts`, flagged `nsia: true`.
- **Vehicle make** — `MotorStep2` merges NSIA's `vehicle-brand` list ahead of
  our local constants, so submissions carry names NSIA recognises. It falls
  back silently to local constants if the API is unavailable.
- **Documents** — when an NSIA plan is selected, the upload step switches to
  NSIA's own slots (`src/lib/motorDocuments.ts`). Comprehensive cover adds the
  four vehicle photos and the purchase receipt; corporate applicants add the
  CAC certificate. Files are validated in the browser before upload.
- **Checkout** — on pay, the application is submitted and the returned NSIA
  policy number is shown on the receipt. A failed submission surfaces an error
  and does *not* show a success screen, since no policy exists.

The other four products have full API, mapping and validation support but no
customer-facing flow yet — this platform has no marine, personal-accident,
public-liability or professional-indemnity quote journey to attach them to.
Adding one means building the form and calling `submitNsiaApplication()` with
that product's `details` block; the schema in `src/lib/nsia/schemas.ts` defines
exactly which fields it needs.

## Known constraints

- **Uploads are held in memory.** The quote store persists to `sessionStorage`,
  which cannot hold file bytes, so files live in `src/store/documentFiles.ts`
  for the lifetime of the page. A full reload clears them; the documents step
  reconciles its metadata so the UI never claims to hold a file it has lost,
  and checkout asks for a re-upload rather than submitting an incomplete
  application. Persisting uploads across reloads needs blob storage.
- **NIN lookup is not integrated.** Guide §5.2 strongly recommends fetching
  verified customer details from a NIMC/NIN provider before creating a profile.
  Partners are responsible for that integration and its costs. The profile
  payload is built in `toProfilePayload()` — that is where NIN-sourced fields
  would be mapped in.
- **Motor premiums are computed locally.** NSIA publishes a premium calculator
  for marine only, so motor pricing still comes from
  `src/lib/premiumCalculator.ts` and the figure is sent as `Premium`.
- **Payment is not yet real.** Guide §12.1 mentions Paystack for premiums under
  5,000,000 naira (`NSIA_ONLINE_PAYMENT_CEILING`). Checkout still simulates
  payment; the NSIA submission runs, but no money moves.
- **Submissions are never retried.** Network retries (3, with backoff) apply to
  reads and to pricing. A multipart submission goes out exactly once, because a
  partially-delivered retry could issue a duplicate policy.

## Source layout

```
src/lib/nsia/
  config.ts            environment, base URLs, timeouts
  client.ts            HTTP wrapper: auth, timeouts, retries, error shaping
  api.ts               one typed function per documented endpoint
  schemas.ts           Zod schemas for every product payload
  mappers.ts           our field names -> NSIA's field names
  documents.ts         document slots required per product
  files.ts             upload rules from guide section 15 (shared client/server)
  fromQuoteStore.ts    quote store -> NSIA payload
  browser.ts           client-side callers for /api/nsia/*
  useNsiaDropdowns.ts  React hook for master data
  types.ts             request/response types
```
