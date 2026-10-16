# LEARNING

One section per phase: what was built, why, the concept it shows, and one interview sentence.

## Phase 0: Setup
- Built: separate `client/` (React 19 + Vite + Tailwind v4) and `server/` (Express 5), `render.yaml`, env examples.
- Why: secrets (LLM keys, MongoDB URI) live only in the server; the browser only gets the server URL.
- Concept: client/server split, environment variables, health check endpoint.
- Interview sentence: "I kept the speech UI and the AI brain in separate services so API keys never reach the browser."
