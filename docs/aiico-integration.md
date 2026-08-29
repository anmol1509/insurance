# AIICO Insurance API integration

Backend integration for AIICO's partner API. AIICO's own docs cover six
products (Motor, Travel, Personal Accident, Home Content, Domestic Travel,
Life Payments); only **Motor** — Private Motor Third Party, Private Motor
Comprehensive, and Motor Renewal — has been documented and integrated so
far. This file will grow as the remaining products are shared.

## Status: backend only, not yet wired into the quote flow

This integration currently exists as a standalone, testable backend layer
(`src/lib/aiico/*` + `/api/aiico/*` routes) but is **not** wired into the
customer-facing Motor quote flow (`MotorPlanSelect`, checkout) yet. AIICO's
Motor API expects a meaningfully different data shape than what the flow
collects today:

- A `Title` and structured `Gender` selection (the flow doesn't currently
  ask for a title).
- Vehicle make/model chosen from AIICO's own controlled vocabulary via
  cascading `GetVehicleMake` → `GetVehicleMakeModel` lookups, rather than
  the flow's current freeform `vehicleMakeModel` text field.
- Three uploaded images (vehicle license, means of identification, proof
  of ownership) as base64 or hosted URLs — the flow's existing document
  slots don't map onto these one-to-one.

Wiring this in is a real UX decision (new form fields, cascading dropdowns)
rather than a drop-in mapping, so it's being left for a deliberate follow-up
pass rather than reshaping Motor Step 1/3 silently.

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
| `getAutoRenewalDetails` | GET `MotorProductService/GetAutoRenewalDetails?policyNo=` | Renewal quote for an existing policy. |
| `postMotorRenewalSchedule` | POST `MotorProductService/PostMotorRenewalSchedule` | Renewal equivalent of `PostMotorSchedule`. |

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
- `GET /renewal?policyNo=`
- `POST /submit/motor` — `{ line: 'third-party'|'comprehensive', wefDt, wetDt, customer, vehicle, images, payment }`. Runs `PostMotorSchedule` then `FinalizePartnerPayment` in one call — **call only after payment has been collected**, since `payment.amountPaid` must match what was actually charged.
- `POST /submit/motor-renewal` — same two-call pattern for renewals.

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
