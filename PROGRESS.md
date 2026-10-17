# PROGRESS

Read this first in every new chat, then continue with the next unchecked step.

## Phases
- [x] Phase 0: Setup (repo, client, server, /health)
- [x] Phase 0b: MongoDB, Groq, Gemini and Firebase set up and tested (secrets in server/.env, client/.env, server/firebase-service-account.json; all git-ignored)
- [~] Phase 1: Ears and mouth built (mic, language picker, live transcript, TTS echo, typed fallback). Typed path tested; Himanshu still to test mic in Chrome with hi-IN and mr-IN
- [ ] Phase 2: Brain (POST /api/chat, getModel() fallback, prompt v1, validator)
- [ ] Phase 3: Cart, read-back, confirm, order request  (deadline 20 Oct)
- [ ] Phase 4: Shop dashboard (deadline 27 Oct)
- [ ] Phase 5: Test kit + embeddable widget
- [ ] Phase 6: Any business (ONLY when Himanshu says go)

## Known issues
- client/src/App.css and client/src/assets/* are unused Vite leftovers; delete them by hand.
