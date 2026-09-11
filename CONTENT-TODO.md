# OilerBilt Content TODO

Do not publish until the contact facts below are verified character for character against the live business listings.

- [ ] Confirm the exact public business name on Yelp and MapQuest.
- [x] Add the exact phone number and preserve its public formatting everywhere: `(469) 249-2563`.
- [x] Add the customer-facing email address: `oilerbilt@gmail.com`.
- [ ] Add the canonical Yelp and MapQuest listing URLs.
- [ ] Add verified business hours, Yelp URL and MapQuest URL to homepage `GeneralContractor` schema. Phone and email are complete.
- [ ] Confirm the Instagram URL and account ownership for `@oilerbilt`.
- [ ] Confirm public business hours; hours are currently omitted from schema.
- [ ] Confirm the final production domain and replace the placeholder Netlify domain if different.
- [ ] Export full-resolution OilerBilt project photos from original files or the Instagram archive.
- [ ] Confirm the service category and honest location context for every project photo.
- [x] Strip metadata, including EXIF/GPS, from the six supplied project photos before publishing.
- [x] Convert the six supplied project photos to responsive 640px/1200px WebP and JPEG files.
- [ ] Replace gallery and service-page photo placeholders with approved work.
- [ ] Confirm any review text directly with the client before adding a review section.
      No `Review` or `AggregateRating` markup is published, and `scripts/seo-audit.mjs`
      now fails the build if any is added.
- [ ] Confirm whether Spanish-language service is offered before listing it in
      the schema `availableLanguage` (currently English only).
- [ ] Confirm warranty language before publishing it.

Never add a street address. OilerBilt is a service-area business operating from a private residence.
The `PostalAddress` in the homepage organization schema intentionally carries
locality, region and country only.
