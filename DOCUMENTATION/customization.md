# Customization

Edit only `src/config/site.js` for routine buyer customization:

- `site`: name, contact details, currency/locale, social URLs, hours, map and booking rates.
- `rooms`: room cards, prices, availability and amenities.
- `menu` and `roomServiceMenu`: restaurant and room-service catalog.
- `events`, `gallery`, `testimonials`, and `policies`: public content.

Replace every remote demo image with a licensed asset before release. Components consume this file, so a rebrand does not require searching pages.

## Source layout

- `src/pages/`: one focused route module per public/admin page.
- `src/pages/shared.jsx`: shared page-level UI primitives and presentation helpers.
- `src/components/`: application-wide layout, feedback, and error-boundary components.
- `src/services/`: Firebase/Firestore access boundary.
- `src/lib/`: pure reusable logic with unit tests.
