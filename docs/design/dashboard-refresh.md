# Dashboard reference refresh

Pages: overview, policies, claims, documents and settings. The shared navigation also styles quote history consistently.

## Imagery

`public/dashboard/welcome.webp` was generated with the built-in imagegen tool: photorealistic Nigerian man in a dark green shirt and eyeglasses using a laptop in a bright modern living room, person on the far right, pale mint negative space on the left, no text or logos. Converted to WebP. Policy and claim images are reused category illustrations from existing marketing assets and are not exact customer vehicle or incident photographs.

## Data and actions

- Retains existing seeded policy, claim and document records, auth session and quote history.
- Overview totals and profile completion are derived from those records and the signed-in user; no invented trends, renewal countdowns or referral rewards.
- Policy search and status filters, policy detail dialogs and renewal navigation work locally. Seeded certificates have no source files; the UI explains this rather than claiming delivery.
- Claim expand/collapse and timelines use the original records. New claims route to support because no submission backend exists.
- Documents can be searched and filtered. PDF/JPG/PNG uploads up to 10 MB per file remain in current session memory; view/download/remove work for those actual files. Refresh clears them. Seeded documents have no source files.
- Profile name and phone edits update the existing persisted demo auth store. Password changes and live verification are not connected, and UI feedback explicitly says so.
- Global demo banner, shared site header and chat widgets are retained.
