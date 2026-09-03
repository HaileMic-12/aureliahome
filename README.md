# Aurelia House — Hospitality Website Template

A responsive React/Vite template for boutique hotels, resorts, restaurants, lodges, and event venues. It includes public booking, table-reservation, event-inquiry, room-service, contact, newsletter, authentication, and a Firebase-backed operations desk.

## Quick start

Requires Node.js 20.19+ or 22.12+ and npm.

```bash
npm install
copy .env.example .env
npm run dev
npm test
npm run build
npm run preview
```

The public demo renders without Firebase. It deliberately does **not** claim to save public submissions until Firebase is configured.

## Configuration

Edit `src/config/site.js` to replace all demo branding, contact details, currency, rooms, restaurant content, room-service items, events, gallery, testimonials, policies, and map. `money()` provides a single formatting path for prices.

## Firebase

See [DOCUMENTATION/firebase-setup.md](DOCUMENTATION/firebase-setup.md) for the required environment variables, Firebase Authentication setup, Firestore deployment, and admin creation. Deploy `firestore.rules` before accepting public data.

## Important

All current images are remote demonstration imagery. Replace them with assets you are licensed to use before commercial release. The included legal pages are starter copy only and require review for the purchaser’s jurisdiction.

## Documentation

- [Installation](DOCUMENTATION/installation.md)
- [Customization](DOCUMENTATION/customization.md)
- [Firebase](DOCUMENTATION/firebase-setup.md)
- [Deployment](DOCUMENTATION/deployment.md)
- [Troubleshooting](DOCUMENTATION/troubleshooting.md)
- [Release QA](DOCUMENTATION/release-qa.md)
