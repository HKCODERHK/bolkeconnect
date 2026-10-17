# PROGRESS

Read this first in every new chat, then continue with the next unchecked step.

## Phases
- [x] Phase 0: Setup (repo, client, server, /health)
- [x] Phase 0b: MongoDB, Groq, Gemini and Firebase set up and tested (secrets in server/.env, client/.env, server/firebase-service-account.json; all git-ignored)
- [x] Phase 1: Ears and mouth done. Mic tested in Chrome in Hindi and English (Marathi voice not yet checked)
- [ ] Phase 2: Brain (POST /api/chat, getModel() fallback, prompt v1, validator)
- [ ] Phase 3: Cart, read-back, confirm, order request  (deadline 20 Oct)
- [ ] Phase 4: Shop dashboard (deadline 27 Oct)
- [ ] Phase 5: Test kit + embeddable widget
- [ ] Phase 6: Any business (ONLY when Himanshu says go)

## Known issues
- client/src/App.css and client/src/assets/* are unused Vite leftovers; delete them by hand.

## Next: Phase 2 (Brain), use Opus in a fresh chat
Start the new chat with: "Read CLAUDE.md and PROGRESS.md, then start Phase 2."
Order of work: Mongoose models (shops, catalog_items, conversations, messages) -> seed test shop (read BuildSupply's public catalog seed file only) -> prompt v1 -> getModel() Groq/Gemini/OpenRouter fallback -> POST /api/chat with zod -> catalog validator -> connect client to /api/chat.
Notes from setup: Groq's model list (17 Oct 2026) had openai/gpt-oss-20b, openai/gpt-oss-120b and qwen/qwen3.8-27b as chat models; Gemini has gemini-2.5-flash. Pick the Groq model by testing Hindi/Marathi quality. Firebase is only needed in Phase 4.
