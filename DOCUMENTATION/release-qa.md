# Release QA checklist

Run these checks against a production build after configuring a disposable Firebase project.

## Automated

```bash
npm test
npm run lint
npm run build
```

The unit suite covers night calculation, selected booking extras, generated booking references, and server-rendering of every public/admin/404 route. The route suite prevents undefined split-page imports from reaching a release.

## Browser checks

Test every route and unknown route; keyboard navigation, skip link, mobile menu, required-field feedback, date validation, empty cart, duplicate-submit protection, error feedback with Firebase disabled, email/password admin login, password reset, status updates, record detail panel, and delete confirmation.

Check at 320, 375, 390, 414, 768, 1024, 1280, 1440, and 1920 pixels. Capture the marketplace screenshots only after these checks pass with buyer-owned, licensed images and a populated non-production Firebase project.

## Recorded release checks

- `npm run lint` — passed with undefined-identifier checking enabled.
- `npm test` — passed (19 tests).
- `npm run build` — passed.
- `npm audit --omit=dev` — passed with zero reported vulnerabilities.
- Production preview returned the SPA entry point for `/`, `/rooms`, `/rooms/garden-king`, `/book`, `/restaurant`, `/restaurant/reservation`, `/room-service`, `/events`, `/gallery`, `/about`, `/contact`, `/privacy`, `/terms`, `/admin/login`, `/admin`, and an unknown route.
- Firebase live-operation checks remain buyer-specific because they require a buyer-owned Firebase project and credentials.
