// Refreshes src/lib/tangerine/data/vehicle-models.json from Tangerine's live API.
//
// Tangerine's model list is large and slow (about a minute) and the manual's
// own advice is to fetch it once and store it, so the app serves the stored
// copy. Run this when Tangerine adds models and a customer's vehicle no
// longer matches:
//
//   node --env-file=.env.local scripts/refresh-tangerine-models.mjs
//
// Needs TANGERINE_USER_ID and TANGERINE_API_KEY, and outbound access to
// motor.tangerine.africa. Both product lines return the identical list, so
// only the 3rd Party endpoint is queried.
import { writeFileSync } from 'node:fs'

const userId = process.env.TANGERINE_USER_ID?.trim()
const apiKey = process.env.TANGERINE_API_KEY?.trim()
if (!userId || !apiKey) {
  console.error('Set TANGERINE_USER_ID and TANGERINE_API_KEY (e.g. node --env-file=.env.local ...).')
  process.exit(1)
}

const url = 'https://motor.tangerine.africa/API/API/ReturnVehicleModelCodes.aspx'
console.log('Fetching the model list — this takes about a minute…')

const res = await fetch(url, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    Authorization: Buffer.from(`${userId}:${apiKey}`).toString('base64'),
  },
  body: JSON.stringify({ UserID: userId }),
  signal: AbortSignal.timeout(300_000),
})

let data = JSON.parse(await res.text())
if (typeof data === 'string') data = JSON.parse(data) // some Tangerine responses are double-encoded
if (!res.ok || data.Status !== 'Successful' || !Array.isArray(data.VehicleMakeList)) {
  console.error('Tangerine did not return a model list:', data.Message ?? res.status)
  process.exit(1)
}

const models = data.VehicleMakeList.map((m) => ({
  VehicleModelCode: m.VehicleModelCode,
  VehicleModelName: m.VehicleModelName,
  VehicleMakeCode: m.VehicleMakeCode,
}))
if (models.length < 1000) {
  console.error(`Only ${models.length} models came back — refusing to overwrite the stored list.`)
  process.exit(1)
}

const out = new URL('../src/lib/tangerine/data/vehicle-models.json', import.meta.url)
writeFileSync(
  out,
  JSON.stringify({
    fetchedAt: new Date().toISOString().slice(0, 10),
    source: `POST ${url} (identical to ComprehensiveAPI/GetVehicleModelCodes.aspx)`,
    models,
  })
)
console.log(`Wrote ${models.length} models to src/lib/tangerine/data/vehicle-models.json`)
