# AIICO Insurance API integration

Backend integration for AIICO's partner API. AIICO's own docs cover six
products (Motor, Travel, Personal Accident, Home Content, Domestic Travel,
Life Payments); **Motor** (Private Motor Third Party, Private Motor
Comprehensive, and Motor Renewal) and **Life Payments Renewal** have been
documented and integrated so far. This file will grow as the remaining
products are shared.

## Status: wired into the Motor quote flow

AIICO is now a selectable insurer in the Motor comparison (`aiico-motor` /
`aiico-tpo` in `src/lib/motorPlans.ts`), alongside Fortis, NSIA, and
Tangerine. Rather than rebuilding Motor Step 1/3 with new cascading
dropdowns, the mismatch between AIICO's controlled vocabulary and the
flow's freeform fields is resolved **server-side, at submission time**
(`src/lib/aiico/resolve.ts`) — the same approach already used for
Tangerine's make/model/colour codes:

- `title` is a new plain-text field on `MotorData` (Step "Your details"),
  collected via a small AIICO-only panel (`AiicoMotorDetails.tsx`, shown
  the same way `TangerineMotorDetails.tsx` is) and matched against
  `GetTitles` by name.
- `gender`, `vehicleType` (→ AIICO's 4-item body-type enum), and
  `vehicleColour` are matched by name/keyword against `GetGenders` /
  `GetBodyTypes` / `GetColorList` — no new UI.
- `vehicleMakeModel` (existing combined free-text field) is split against
  AIICO's year-scoped `GetVehicleMake` → `GetVehicleMakeModel` lists the
  same way Tangerine's resolver splits combined make/model text.
- The three required images (vehicle license, means of ID, proof of
  ownership) plus an optional utility bill are a new AIICO-specific
  document slot set (`src/lib/aiico/documents.ts`), uploaded the same way
  as every other insurer's documents, then base64-encoded server-side in
  the submit route (`fileToBase64`) — AIICO takes base64 or a hosted URL,
  so no image-hosting step is needed (unlike Tangerine's Cloudinary step).
- The quote flow doesn't collect a separate engine number; chassis/VIN is
  reused for `engineNo` as the closest available field.
- `PostMotorSchedule` then `FinalizePartnerPayment` both run inside
  `/api/aiico/submit/motor`, called from checkout only after Payloft
  approves payment (`submitMotorToAiico` in `quote/checkout/page.tsx`),
  mirroring how NSIA/Tangerine submissions are dispatched there.

One known gap: `payment.accountNumber` sent to `FinalizePartnerPayment` is
a best-effort masked value built from whatever the customer entered for
their chosen payment method (masked card, transfer account, or mobile
number) — it's for AIICO's own reconciliation and isn't otherwise
validated by this platform.

## Authentication

A single pre-issued JWT bearer token — AIICO's docs don't describe a
login/token-refresh endpoint, just "you will be provided with a JWT bearer
token." Every request sends `Authorization: Bearer <token>` and
`Content-Type: application/json`; every response is wrapped in the same
ABP-framework envelope (`{ result, success, error, ... }`).

### Environment variables

| Variable | Required | Notes |
| --- | --- | --- |
| `AIICO_BASE_URL` | Yes (or `AIICO_ENV`) | e.g. `https://portal-staging.aiicoplc.com`. Falls back to the staging host inferred from a sample response if `AIICO_ENV` is unset or `staging`; **UAT and production hosts are not in the docs and must be set explicitly.** |
| `AIICO_ENV` | No | `staging` (default) / `uat` / `production` — only affects the built-in default for `staging`. |
| `AIICO_BEARER_TOKEN` | Yes | The JWT AIICO issues you. |

Without these, `/api/aiico/*` routes return `503` with a clear message —
same graceful-fallback convention as every other integration.

## Endpoints implemented (`src/lib/aiico/api.ts`)

All under `{BaseUrl}/api/services/app/...`:

| Function | Method & path | Notes |
| --- | --- | --- |
| `getProducts` | GET `ProductService/GetProducts` | All AIICO products, not just motor. |
| `getProductSubClassCoverTypes` | GET `ProductService/GetProductSubClassCoverTypes?productId=` | Cover types + benefits for a product. |
| `getTitles` / `getGenders` / `getBodyTypes` / `getColorList` / `getManufactureYears` | GET `UtilitiyService`/`UtilityService/*` | Static lookup lists (note: the docs themselves misspell `UtilitiyService` for some and use `UtilityService` for others — preserved exactly as documented). |
| `getVehicleDetails` | GET `MotorProductService/GetVehicleDetails?numberPlate=` | AutoReg plate lookup. |
| `getVehicleMakes` | GET `UtilityService/GetVehicleMake?makeYear=` | Cascading: makes available for a manufacture year. |
| `getVehicleMakeModels` | GET `UtilityService/GetVehicleMakeModel?VehicleMake=&VehicleYear=` | Cascading: models for a make + year. |
| `computeThirdPartyMotorPremium` | POST `MotorProductService/ComputeThirdPartyMotorPremium?bodyType=` | Third Party's fixed rate by body type. |
| `postMotorSchedule` | POST `MotorProductService/PostMotorSchedule` | Registers the risk; returns `transactionRef` + authoritative `premiumAmount`. Third Party requires `premiumAmount` as input; Comprehensive computes it server-side from `vehicleAmount`. |
| `finalizePartnerPayment` | POST `PartnerService/FinalizePartnerPayment` | Confirms payment against a `transactionRef`; returns the issued `policies[]` and certificate URL. Shared across Third Party, Comprehensive, and Renewal. |
| `getAutoRenewalDetails` | GET `MotorProductService/GetAutoRenewalDetails?policyNo=` | Renewal quote for an existing motor policy. |
| `postMotorRenewalSchedule` | POST `MotorProductService/PostMotorRenewalSchedule` | Renewal equivalent of `PostMotorSchedule`. |
| `getLifePolicyRenewalDetails` | GET `LifeRenewalService/GetLifePolicyRenewalDetails?policyNo=` | Renewal quote for an existing life policy (premium, savings, next installment, etc). |
| `postLifeRenewalSchedule` | POST `LifeRenewalService/PostLifeRenewalSchedule` | Registers the life renewal; returns a `transactionRef` for `FinalizePartnerPayment`. |

### Fixed IDs

`productId` and the Third Party/Comprehensive `subclassSectCovtypeId` are
constants from the docs (`src/lib/aiico/config.ts`), not looked up per
request — Comprehensive has more than one cover type available via
`GetProductSubClassCoverTypes` (only "Auto Royale" was shown in the docs),
so that constant should be revisited once the full cover list is confirmed.

## Our routes (`/api/aiico/*`)

- `GET /dropdowns?name=titles,genders,body-types,colors,years` — cached master data, 1 hour TTL.
- `GET /dropdowns?name=makes&year=` / `?name=models&make=&year=` — cascading vehicle lookups.
- `GET /dropdowns?name=subclass-covers&productId=`
- `GET /vehicle-lookup?plate=`
- `GET /premium?bodyType=` — Third Party fixed rate.
- `GET /renewal?policyNo=` — motor renewal quote.
- `GET /life-renewal?policyNo=` — life policy renewal quote.
- `POST /submit/motor` — multipart/form-data: a `payload` field of `{ line: 'third-party'|'comprehensive', wefDt, wetDt, customer, vehicle, payment }` (plain text — resolved against AIICO's vocabulary server-side) plus files under `vehicle_license`, `identification`, `proof_of_ownership`, and optionally `utility_bill`. Runs `PostMotorSchedule` then `FinalizePartnerPayment` in one call — **call only after payment has been collected**, since `payment.amountPaid` must match what was actually charged.
- `POST /submit/motor-renewal` — same two-call pattern for motor renewals (plain JSON body, no documents involved).
- `POST /submit/life-renewal` — same two-call pattern for life renewals: JSON body `{ policyNo, transactionDate, customerName, email, phone, amount, payment }`, running `PostLifeRenewalSchedule` then `FinalizePartnerPayment` — **call only after payment has been collected**.

## Life Renewal UI

`/renewals/life` is a standalone, self-service page (linked from `/renewals`)
— unlike Motor Renewal, which has no UI yet:

1. Customer enters a policy number → `GET /life-renewal` renders the policy's
   name, status, dates, premiums, and the next installment due.
2. "Proceed to pay" collects a card and pays the amount through the existing
   Payloft sandbox flow (`initiatePayloftOrder` → `submitPayloftPayment` →
   `pollPayloftResult`, the same helpers `quote/checkout` uses).
3. Once Payloft reports `APPROVED`, the page calls
   `POST /submit/life-renewal` with the collected details and a masked card
   reference, then shows the transaction ref and certificate link (if any).

## Verification

No live credentials were available to test end-to-end. Verified instead
that:

1. `npx tsc --noEmit`, `npx eslint`, and `npm run build` are clean.
2. Every validation branch (missing config, bad body type, malformed
   submit payload) returns the expected `400`/`503` from a local dev
   server.
3. With fake credentials pointed at the inferred staging host
   (`portal-staging.aiicoplc.com`), the request reaches the real host and
   fails only at the sandbox's own network egress boundary (`CONNECT
   tunnel failed, response 403`) — confirmed identical via a raw `curl` to
   the same host, ruling out a bug in the integration code itself.
4. In a real browser: seeded the quote store to land directly on Motor's
   plan-select and documents steps, confirmed both AIICO plans render,
   selecting one advances the flow and stores `selectedUnderwriter`
   correctly, the AIICO-only Title panel and all four AIICO document
   slots render (replacing the generic ones), and the Title dropdown
   writes back to the store. Also drove `/api/aiico/submit/motor`
   directly with a full multipart payload (customer/vehicle/payment +
   fake image blobs) — it validates and resolves everything correctly,
   returning `503` with no credentials configured and `403` (AIICO's own
   real rejection) once fake credentials point it at the real host,
   confirming the full submit chain is wired correctly end to end.
