# Changelog

## 1.0.3 — 2026-09-07

- Added 17 optimized local WebP hotel, dining, room, and event image assets.
- Replaced public-site remote demo images with centralized local asset paths.
- Added a polished 1920×1080 marketplace thumbnail.
- Added Vercel SPA rewrites for direct route visits.

## 1.0.2 — 2026-09-01

- Split public pages into on-demand chunks to reduce initial JavaScript loading.
- Split Firebase runtime code into core, Authentication, and Firestore chunks.
- Removed the production-build chunk-size warning without raising the warning threshold.

## 1.0.1 — 2026-09-01

- Fixed split-page runtime imports in the admin and booking routes.
- Fixed the admin navigation race after successful role validation.
- Added named-database support through `VITE_FIREBASE_DATABASE_ID`.
- Added Firebase CLI configuration and named-database setup documentation.
- Added complete route-render regression coverage and undefined-identifier linting.

## 1.0.0 — 2026-08-31

- Rebuilt as a configurable hospitality template.
- Added Firebase Authentication, Firestore services/rules, protected operations desk, public persistence flows, documentation, SEO defaults, legal routes, and a 404 page.
