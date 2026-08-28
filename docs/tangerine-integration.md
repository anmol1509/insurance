# Tangerine Motor Insurance API integration

Implements the *Tangerine Comprehensive Motor Insurance API* and *Tangerine
3rd Party Insurance API* manuals against this platform. Tangerine runs these
as two entirely separate product lines — different base URLs, different
endpoint names for the same master data, one shared auth scheme.

The partner credentials are server-side only. The browser calls our own
`/api/tangerine/*` route handlers, which authenticate, resolve Tangerine's
own numeric codes, and forward the request.

## Configuration

| Variable | Required | Notes |
| --- | --- | --- |
| `TANGERINE_USER_ID` | Yes | Same UserID for both product lines. |
| `TANGERINE_API_KEY` | Yes | Combined with UserID into `base64(userid:APIKEY)` for the `Authorization` header — no "Bearer" prefix, per the manual. |
| `CLOUDINARY_CLOUD_NAME` | Yes, to submit policies | Tangerine's `ImageUrlList` takes hosted URLs, not file bytes — see below. |
| `CLOUDINARY_UPLOAD_PRESET` | Yes, to submit policies | Must be an **unsigned** upload preset. |

Without credentials, `/api/tangerine/*` answers `503` with a clear message;
without Cloudinary configured, submission answers `503` specifically about
photo hosting rather than failing partway through.

## Base URLs

- Comprehensive — `https://motor.tangerine.africa/API/ComprehensiveAPI`
- 3rd Party — `https://motor.tangerine.africa/API/API`

Both must be reachable from the deployment's outbound network policy.

## Endpoints exposed by this platform

| Route | Purpose |
| --- | --- |
| `GET /api/tangerine/dropdowns?line=&name=` | Master data: `colours`, `engine-capacity`, `states`, `lgas`, `makes`, `models`. Comma-separated `name`, cached in memory for an hour. |
| `POST /api/tangerine/submit/{product}` | `comprehensive` or `thirdparty` — submits a policy application. |

## The code-resolution problem

Our platform stores vehicle data as free text (a combined "make and model"
field, a colour name, a state name); Tangerine's `GeneratePolicy` endpoints
require its own numeric codes for all of these, plus a Local Government Area
that this platform didn't previously collect at all. Rather than build a
dependent-dropdown UI wired to Tangerine specifically, the submit route
resolves our text against Tangerine's own master-data lists **by name**,
server-side, in `src/lib/tangerine/resolve.ts`:

- **Vehicle make & model** — the longest matching make name is found first
  (so "Land Rover Discovery" isn't cut at "Land"), then the remainder is
  matched against that make's models.
- **Colour** — matched by name, with a small synonym table for
  British/American spelling (`gray` → `grey`) since our constants use one and
  Tangerine's list uses the other.
- **State** — matched by name directly.
- **LGA** — matched by name, scoped to the already-resolved state code (LGA
  names repeat across states).
- **Engine capacity** — this one **isn't** a name match. Our platform buckets
  by cc ("1500–1999cc"); Tangerine buckets by litres ("1.6 - 2.0"). Each cc
  bucket is mapped to a representative litre value and matched against
  whichever of Tangerine's live ranges contains it, clamping to the nearest
  end if a value falls outside every published range.

A match failure returns a clear `400` naming the field and the text that
couldn't be resolved, rather than a cryptic downstream Tangerine rejection.

## Vehicle photos: files in, URLs out

Both manuals require `ImageUrlList` — an array of **hosted URLs**, not
uploaded bytes, unlike NSIA's multipart file uploads. This platform still
collects photos as ordinary file uploads (same `DocumentUploadZone` as
every other insurer), and the submit route uploads each one to Cloudinary
via an unsigned upload before building the request Tangerine expects
(`src/lib/tangerine/images.ts`). Front and chassis photos are mandatory
(guide: minimum 2 of 4); back and side are optional.

## Where it is wired in

Two new motor plans — `Tangerine Comprehensive` and `Tangerine Third
Party` — in `src/lib/motorPlans.ts`, flagged `tangerine: 'comprehensive' |
'thirdparty'`. Selecting one:

- switches the documents step to Tangerine's own photo slots
  (`src/lib/tangerine/documents.ts`),
- shows a small extra-fields block (`TangerineMotorDetails.tsx`) for LGA,
  vehicle registration date, mileage (comprehensive only), and TIN
  (corporate only) — fields no other insurer on this platform asks for,
- submits through `/api/tangerine/submit/{product}` on checkout, showing the
  returned policy number on the receipt.

`generateTangAutoPolicy` (the 3rd party manual's three fixed-premium tiers)
and `renewThirdPartyPolicy` are implemented in `src/lib/tangerine/api.ts` but
have no route or UI yet — this platform has no renewals flow and no flat-rate
product card to attach TangAuto to.

## Known constraints

- **The manual's own JSON is inconsistent.** Several endpoints show their
  example response double-quoted (i.e., a JSON string containing JSON); the
  client (`src/lib/tangerine/client.ts`) unwraps one extra layer of string
  encoding if that's what comes back, but this hasn't been verified against
  the live API from this environment.
- **The 3rd party manual advertises 12 endpoints but documents 11** — nothing
  further to add here; flagging it in case the missing one turns out to
  matter later.
- **Valuation limits are checked before submission** for comprehensive cover
  (guide §9: `ReturnValuationLimits`), but only as a client-side-triggered
  server check at submit time — there's no live "your value is out of range"
  warning earlier in the flow.

## Source layout

```
src/lib/tangerine/
  config.ts            base URLs, auth header, Cloudinary env
  client.ts            HTTP wrapper: auth, response unwrapping, error shaping
  api.ts                one typed function per documented endpoint
  resolve.ts            our free text -> Tangerine's numeric codes
  images.ts             Cloudinary unsigned upload
  documents.ts           vehicle photo slots
  mappers.ts             date formatting
  schemas.ts             Zod schemas for the submit route's JSON payload
  fromQuoteStore.ts       quote store -> Tangerine payload
  browser.ts             client-side callers for /api/tangerine/*
  types.ts               request/response types
```
