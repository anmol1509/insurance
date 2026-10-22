# Homepage refresh

The homepage follows the supplied full-page reference, using the larger hero reference for composition and the four-panel image for category themes. Existing quote routes, prefills, authentication, APIs and checkout behavior are retained. The latest demo banner and quote authentication changes from main are included.

## Content boundaries

Only the five partners already present in the application are shown. Unverified customer totals, premiums, ratings, regulatory claims and testimonial identities were not copied from the reference. These areas use factual product features and an honest review empty state. The mobile app remains marked coming soon, with a working dashboard link.

## Image provenance

The following locally hosted WebP assets were generated with OpenAI ImageGen, then compressed with Sharp. They are illustrative photographic-style scenes, not customer portraits or evidence of actual customers. No customer endorsement is implied.

Generation specifications (all requested realistic photographic lighting, no text, logos, UI or watermarks):

- `public/home/photos/motor.webp`: White luxury SUV in the lower right, facing right, tropical modern city skyline, Lagos-style cable-stayed bridge and palms, mint sky and circular glow, hazy empty left area for HTML copy.
- `public/home/photos/medical.webp`: Smiling Nigerian family of three on the right, blue and cream clothing, softly blurred modern hospital and greenery, pale blue empty left area.
- `public/home/photos/travel.webp`: Nigerian woman seen from behind in a straw hat with a tan backpack, Santorini white buildings and blue domes, cliffs and turquoise sea on the right, warm cream empty left area.
- `public/home/photos/business.webp`: Nigerian business owner in a navy suit and glasses working at a laptop in a glass city office on the right, pale lavender empty left area.
- `public/home/photos/claims.webp`: Nigerian woman with curly hair, green blouse and beige cardigan, using a phone on a sofa in a bright ivory room with houseplants, space for a floating assistance badge.

Partner images in `public/home/partners/` are compressed local copies of the original five Cloudinary logo URLs retained in `InsurerPartnersStrip.tsx`; no new partner relationships were added.

## Validation

- Production Next.js build and TypeScript checks pass.
- ESLint passes for changed TypeScript/TSX files.
- Repository-wide lint still reports pre-existing errors and warnings in unrelated pages and components.
- Browser inspection at 1440px desktop and 390px mobile; mobile document width equals viewport width with no horizontal overflow.
- Motor, Medical, Travel and Business hand off to their existing quote routes and contact verification gates. No OTP was sent and no policy/payment was submitted.
- Mobile navigation and FAQ expansion checked in-browser.
- Homepage-only chrome leaves other pages' navigation, authentication and business behavior in place.
