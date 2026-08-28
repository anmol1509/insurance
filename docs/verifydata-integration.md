# VerifyData (Virtuality) vehicle lookup integration

Implements the *VerifyData API* manual — a single endpoint that looks up a
vehicle's registry details by plate number. This replaces the guesswork
behind the "Find my car" step at the start of the motor quote flow.

## Where it was already half-built

`MotorStep1` (the plate-number entry screen) always had this shape: enter a
plate, get vehicle details pre-filled. It just faked the lookup — a
hardcoded table of three plates, plus a generic fallback for everything
else, behind an artificial 1.8s delay. That mock still exists and still
runs, but now only as the fallback when the real lookup can't be used.

## Configuration

| Variable | Required | Notes |
| --- | --- | --- |
| `VERIFYDATA_SECRET_KEY` | Yes | Issued by Virtuality for your VerifyData account. |

Without it, `/api/verifydata/lookup` answers `503`, and `MotorStep1` falls
straight through to the existing mock data — the quote flow keeps working
either way.

## Base URL & endpoint

`https://vd.virtuality.com/api/ValidateVehicle/Initiate` — `POST` with
`{ regNumber, secretKey }`. The guide documents no other endpoints.

## The one route this adds

`POST /api/verifydata/lookup` — body `{ regNumber }`. Injects the secret key
server-side, calls VerifyData, and returns both the raw response and the
same fields already mapped onto this platform's own vehicle vocabulary
(`src/lib/verifydata/mappers.ts`):

- **Make & model** — VerifyData returns them separately; joined into the one
  combined field the rest of the motor flow already uses.
- **Vehicle type** — VerifyData's `vehicleCategory` is free text; matched
  against this platform's fixed `VEHICLE_TYPES` list, falling back to
  "Other" rather than passing through an unrecognised value the rest of the
  UI (radio cards, badges) doesn't know how to render.
- **Colour** — same approach against `VEHICLE_COLOURS`, so the colour swatch
  UI still has a value it recognises.
- **Engine capacity** — VerifyData returns this as free text with no fixed
  format documented (e.g. "2000cc" or "2.0"); the mapper pulls the first
  number out, infers litres vs. cc from its magnitude, and buckets it into
  this platform's own cc ranges. This hasn't been checked against a real
  response, since the manual gives no concrete sample value here — only the
  placeholder text `"engine capacity"`.
- **Chassis number** — passed through directly.

Two fields this platform's KYC step also wants — fuel type and trim/variant
— aren't in VerifyData's response at all, so a successful lookup leaves
those for the customer to fill in manually, same as before.

## Error handling

The guide's four documented error codes are keyed by a `Code` field (`01`,
`02`, `05`, `06`) that sits alongside, not in place of, the HTTP status —
`src/lib/verifydata/types.ts` maps each to a plain-language message. None of
them mean "plate not found"; the guide doesn't document what a not-found
response looks like, so that case is inferred like any other failure: the
call throws, and `MotorStep1` falls back to demo data.

## Known constraints

- **No live test possible from this environment.** The sandbox this was
  built in blocks outbound access to `vd.virtuality.com`; the integration
  was verified structurally (request shape, error mapping, fallback
  behaviour) but never against a real response.
- **"Not found" is unconfirmed.** Whatever VerifyData actually returns for
  an unregistered plate hasn't been seen — it's just treated as a generic
  failure and handed to the same fallback path as a wallet or auth error.
- **Engine capacity bucketing is a best guess** at the response format, for
  the reason above — if VerifyData turns out to format it differently (e.g.
  a numeric ID instead of text), the regex-based parser in
  `bucketEngineCapacity()` will need adjusting once a real response is seen.

## Source layout

```
src/lib/verifydata/
  config.ts     base URL, secret key, timeout
  client.ts     HTTP call, error shaping
  mappers.ts    VerifyData fields -> this platform's vehicle vocabulary
  http.ts       route-handler response helper
  browser.ts    client-side caller for /api/verifydata/lookup
  types.ts      request/response types, documented error codes
```
