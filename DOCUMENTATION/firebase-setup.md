# Firebase setup

1. Create a Firebase project and add a Web app.
2. Enable **Email/Password** under Authentication → Sign-in method.
3. Create a Firestore database in production mode.
4. Copy `.env.example` to `.env` and fill all `VITE_FIREBASE_*` values from Firebase Web app settings. Do not commit `.env`. Leave `VITE_FIREBASE_DATABASE_ID` blank for Firestore's standard `(default)` database. If the buyer intentionally uses a named database, set it to that exact ID.
5. Deploy `firestore.rules` in Firestore Rules. These rules allow public creation only for the exact form collections, while reads/updates/deletes require an admin document.
6. Create the property administrator in Authentication → Users. In Firestore, create `admins/<that-auth-UID>` with e.g. `{ "email": "admin@example.com" }`.

## Named databases

The included `firebase.json` targets Firestore's standard `(default)` database, which is the recommended setup for template buyers. If your project intentionally uses a named database, set `VITE_FIREBASE_DATABASE_ID` to that exact ID in `.env`, change the `database` value in `firebase.json` to the same ID, and deploy with `firebase deploy --only firestore:<database-id>`.

Collections: `bookings`, `restaurantReservations`, `roomServiceOrders`, `eventInquiries`, `messages`, `newsletterSubscribers`. Firebase web config is intentionally public; Firestore rules enforce access. Never add service-account credentials to this project.
