# Troubleshooting

- **“This form is not connected yet”**: fill `.env`, restart Vite, and check Firebase web settings.
- **“Database `(default)` not found”**: either create Firestore's standard `(default)` database, or—if the project uses a named database—set `VITE_FIREBASE_DATABASE_ID` to its exact ID and restart Vite.
- **Login works but `/admin` redirects**: create `admins/<Authentication UID>` in Firestore, then sign out/in.
- **Permission denied**: deploy the included `firestore.rules`.
- **Direct deployed route is 404**: configure a static-host SPA fallback to `index.html`.
