# LEARNING

One section per phase: what was built, why, the concept it shows, and one interview sentence.

## Phase 0: Setup
- Built: separate `client/` (React 19 + Vite + Tailwind v4) and `server/` (Express 5), `render.yaml`, env examples.
- Why: secrets (LLM keys, MongoDB URI) live only in the server; the browser only gets the server URL.
- Concept: client/server split, environment variables, health check endpoint.
- Interview sentence: "I kept the speech UI and the AI brain in separate services so API keys never reach the browser."

## Phase 0b: Database connection
- Built: `server/src/db.js` connects Mongoose to MongoDB Atlas; the server only starts listening after the DB connects.
- Free tier facts (checked 17 Oct 2026): Atlas M0 is "free forever", 512 MB storage, up to 100 ops/sec, no card needed. Flex ($8-30/month) and Dedicated cost money, so always stay on M0.
- Concepts: connection string (`mongodb+srv://user:password@host/dbname`), database user vs account login (the Google email is NOT the DB username), IP access list (0.0.0.0/0 because Render free has no fixed IP), secrets only in `server/.env`.
- Lesson: "bad auth" means the server was reached but credentials were wrong; "Invalid connection string" means the text itself is malformed.
- Interview sentence: "The server refuses to start unless the database is reachable, and the connection string lives only in server environment variables."

## Phase 0b: Keys and Firebase
- Groq and Gemini keys verified with a list-models call (status 200). Gemini keys can have a newer format than the old `AIza` prefix.
- Firebase (Spark free plan): Google sign-in enabled; web config goes in `client/.env` (public by design); the service account JSON stays on the server only and is git-ignored.
- Concepts: public vs secret config, service account (server proves its identity to Firebase), why the server verifies Firebase ID tokens for owner routes.
- Render note: there is no file on Render, so in Phase 4 the service account JSON will go into an environment variable.
- Interview sentence: "Owner login uses Firebase Google sign-in; the browser gets a public config, and the server verifies the token with a private service account."
