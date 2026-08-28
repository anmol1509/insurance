# Payloft Sandbox payment gateway integration

Implements the *Payloft Sandbox API Guide v1.1* against this platform.
Payloft is the real payment processor behind checkout — before this, "Pay"
ran a fake timer and always showed success. It now moves through Payloft's
actual sandbox order lifecycle for every product this platform sells.

The secret key is server-side only. The browser calls our own
`/api/payloft/*` route handlers, which inject it and forward to Payloft.

## Configuration

| Variable | Required | Notes |
| --- | --- | --- |
| `PAYLOFT_SECRET_KEY` | Yes | Must start with `sk_test_` — the guide's sandbox only accepts test keys. |

Without it, `/api/payloft/initiate` answers `503` with a clear message.

## Base URL

`https://pay.mypayloft.com`, endpoints under `/api/sandbox/checkout`. The
guide documents only a sandbox host — there is no production URL here.

## Endpoints exposed by this platform

| Route | Payloft step | Purpose |
| --- | --- | --- |
| `POST /api/payloft/initiate` | 1 | Create an order — returns `orderId`. |
| `POST /api/payloft/{orderId}/pay` | 3 | Submit payment: card, PayAttitude, or transfer. |
| `POST /api/payloft/{orderId}/transfer/confirm` | 3b | Confirm a pending bank transfer. |
| `GET /api/payloft/{orderId}/result` | 4 | Poll for the final transaction status. |

Step 2 (`GET /api/sandbox/checkout/{orderId}`, fetching data to render
Payloft's own hosted checkout page) is implemented in
`src/lib/payloft/api.ts` but has no route — this platform uses its own
checkout UI rather than Payloft's hosted page, so nothing calls it.

## How checkout uses this

Money moves before insurance is issued. On "Pay", checkout:

1. Initiates a Payloft order for the total due.
2. Submits payment for the selected method.
3. Polls `/result` (a few retries, since the guide's own transfer test
   scenarios include a simulated timeout) until it leaves `PENDING`.
4. Only on `APPROVED` does it submit the insurance application — to NSIA,
   Tangerine, or Fortis, whichever the chosen plan uses. A payment that
   doesn't approve stops there with a clear reason; nothing is insured for
   money that wasn't actually collected.
5. If payment succeeds but the *insurer* submission then fails, that is
   surfaced as its own distinct error (naming the payment reference) rather
   than a generic failure — the customer has been charged and needs to know
   that, separately from "your payment didn't go through."

### The three payment methods, mapped to this platform's existing UI

- **Card** — the existing card form (network, number, expiry, CVV) now calls
  Payloft directly; `scheme` is the selected network lower-cased.
- **Bank transfer** — genuinely two steps, because Payloft's sandbox mimics
  real bank transfers: the first "Pay" click requests a **virtual account**
  from Payloft (step 3a) and displays its real account number and bank name;
  a second click, after the customer says they've sent the money, calls
  `transfer/confirm` (step 3b) and only then proceeds. This replaced a
  previous UI that showed a fake static account number.
- **USSD → Mobile (PayAttitude)** — the old "USSD" tab showed a bank-specific
  dial code with no real API behind it. Payloft has no USSD-code concept;
  its phone-based method is PayAttitude, which needs a mobile number. The
  tab was changed to collect one and call that method instead, since there
  was no way to preserve the old "select a bank, get a dial code" UI against
  an API that doesn't offer it.

## Known constraints

- **No idempotency on retried payments.** An order can only be submitted
  once (guide: resubmitting a non-`Initiated` order is a `400`); if a
  network blip causes a client-side retry after Payloft already received the
  first attempt, the user could see a spurious failure. Nothing currently
  guards against this beyond normal button-disable-while-pending.
- **`callbackUrl` (webhook) isn't used.** Confirmation relies entirely on
  polling `/result` from the browser. A production integration would likely
  also register a webhook so payment state updates even if the customer
  closes the tab mid-flow.
- **Hosted checkout redirect isn't used.** The guide's primary flow assumes
  redirecting the customer to `https://pay.mypayloft.com/sandbox-pay/{orderId}`.
  This platform already has its own full checkout UI, so it calls the API
  endpoints directly instead — `checkoutUrl` from the initiate response is
  returned by our API but nothing currently uses it.

## Source layout

```
src/lib/payloft/
  config.ts     base URL, secret key, sandbox checkout page URL
  client.ts     HTTP wrapper: auth injection, error shaping
  api.ts        one typed function per documented endpoint
  schemas.ts    Zod schemas for initiate/pay request bodies
  http.ts       route-handler response helpers
  browser.ts    client-side orchestration: initiate -> pay -> poll
  types.ts      request/response types
```
