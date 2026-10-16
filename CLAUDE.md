# BolkeConnect: project rules for Claude

Read `PROGRESS.md` first, then continue with the next unchecked step.

## Who and why
Owner: Himanshu Khalatkar (VIT-AP, B.Tech CSE). BolkeConnect (बोलके) is a voice-ordering assistant: a customer speaks an order in Hindi, Marathi, English or a mix; it becomes a confirmed, structured **order request** the shop owner approves. He will demo it for a *Conversational AI Engineer* internship (video round 20 Oct 2026, final 27 Oct 2026) and **must be able to explain every line**.
- Explain each step in simple language before and after building it.
- Keep `LEARNING.md` updated: what was built, why, which concept (ASR, LLM, TTS, intent, entities, guardrails, hallucination, fallback, transcripts, A/B testing, feature flags), one interview sentence per phase.
- Small readable code, small commits with clear messages.
- Priority: Phases 0-3 before 20 Oct, Phases 4-5 before 27 Oct, Phase 6 only when Himanshu says so.

## Hard rules
1. **Everything free.** MongoDB Atlas M0, Render free, Firebase Spark, free LLM tiers (Groq / Gemini / OpenRouter), browser speech APIs. Ask before adding anything paid or needing a credit card. Check current free-tier limits and note them in `LEARNING.md`.
2. **Never touch BuildSupply's live project** (`github.com/HKCODERHK/BUILDSUPPLY`, real supplier data). BolkeConnect has its own MongoDB cluster. Only the public catalog seed `supabase/seed/002_master_catalog_seed.sql` may be read. Copy no customer, invoice or supplier data.
3. Claude cannot type passwords or create accounts. Himanshu creates the Atlas cluster, Firebase project, API keys and Render services; ask for what is needed step by step.
4. **Secrets never reach the browser or git.** LLM keys and the Mongo URI live only in `server/.env` (Render env vars in production). Commit only `.env.example`.
5. **A human always confirms.** Only `pending` order requests are created: no bills, no stock changes, no payments.
6. **Never trust LLM output.** The server validates every item against the catalog; prices only come from the database.
7. **Git: never add Claude as co-author or contributor.** No `Co-Authored-By` trailers, no "Generated with Claude Code" lines in commits or PRs. Plain commit messages only.

## Design principles
- **Multi-shop from day one:** a `shops` collection, every document keyed by `shopId`, prompts built from per-shop config. Nothing about cement or sand is hard-coded in the engine.
- **Language-agnostic:** no language is hard-coded. One `languages.js` config lists each language (code like `hi-IN`, `mr-IN`, `en-IN`, label, preferred voice). Each shop has `languages[]`; the picker shows only those. The prompt says "reply in the customer's language". Adding a language = one config line + catalog aliases. Tested properly: Hindi, Marathi, English, Hinglish. If no TTS voice exists on the device, show text only.
- Speech layer sits behind an interface so paid ASR/TTS can be swapped in later.

## Stack (JavaScript, same as his Smart AI Interview Agent and Nexora projects)
- Client (`client/`): React 19 + Vite + Tailwind v4 + Redux Toolkit + motion + react-icons + axios.
- ASR/TTS: Web Speech API (`SpeechRecognition` / `webkitSpeechRecognition`, `speechSynthesis`). `lang` from the picker. Always give a typed-input fallback. Call `speechSynthesis.cancel()` on barge-in.
- Server (`server/`): Node + Express 5 (one service), `cors`, `cookie-parser`, `dotenv`, per-IP rate limit, `zod` validation.
- LLM: LangChain `getModel()` switch, Groq (default) -> Gemini -> OpenRouter fallback; names from `LLM_PROVIDER`, `LLM_MODEL`. Structured output via `withStructuredOutput`.
- DB: MongoDB Atlas M0 + Mongoose. The browser never talks to MongoDB.
- Owner login: Firebase Auth (Google) on client + `firebase-admin` token check on server. Customers do not log in.
- Hosting: Render free (static client + web service), `render.yaml`. Free services sleep, so the client pings `/health` on page open.
- Not in v1: Razorpay, Redis, Qdrant, microservices gateway.

## Core loop (one turn)
Customer taps mic -> browser ASR text -> `POST /api/chat { shopSlug, conversationId, text, lang }` ->
1. load shop config, active catalog, conversation
2. build system prompt from shop config
3. call LLM for JSON matching the schema below
4. VALIDATE: map every item to a real `catalogItemId`, qty > 0 and sane, unit allowed; drop or flag unknowns
5. compute prices from DB (only if `showPrices`)
6. save user + bot messages (transcript)
7. return `{ reply, cart, missing, status }`

Then the UI shows bubbles + cart and speaks the reply. At `ready_to_confirm` it reads the order back with a Confirm button; confirm -> `POST /api/orders/confirm` saves a `pending` order request.

LLM output schema:
```json
{
  "reply": "short, in the customer's language",
  "intent": "place_order | modify_order | ask_question | callback | cancel | off_topic | unclear",
  "cart": [{ "catalogItemId": "id or null", "spokenName": "ret", "qty": 1, "unit": "trolley" }],
  "delivery": { "when": "kal subah", "where": "Shivaji Nagar site" },
  "missing": ["cement_variant", "address"],
  "status": "collecting | ready_to_confirm | confirmed_by_customer | handoff | ended"
}
```

## Data (Mongoose, every document has an indexed `shopId`)
- `shops`: slug (unique), name, businessType, languages[], showPrices, **voiceEnabled** (feature flag), rules (object: guardrails, persona, tone), createdAt
- `catalog_items`: shopId, name, aliases [String] (e.g. "ret", "gitti", "sariya"), category, unit, allowedUnits [String], price (nullable), active
- `conversations`: shopId, startedAt, lang, **promptVersion**, outcome (`order_placed | abandoned | handoff | error`), turnCount
- `messages`: conversationId, role (`user | bot`), text, asrConfidence, llmJson (object), createdAt  (the transcript)
- `order_requests`: shopId, conversationId, customerName, phone, items (validated), delivery, status (`pending | approved | rejected`), publicCode (random), createdAt

Access: public routes return minimal fields only (shop name, catalog names/units, prices only if `showPrices`, bot reply + cart, order status by public code). Never customer lists, other orders or transcripts. Owner routes (`/api/owner/*`) need a valid Firebase ID token and every query is filtered by the owner's own `shopId`. Validate every request body.

Seed: `server/seed/seedTestShop.js` converts the BuildSupply catalog seed into "Shree Balaji Building Materials (BolkeConnect test)" with Hindi/Marathi aliases, units (bag, ton, kg, brass, tractor-trolley) and dummy prices.

## System prompt (per shop, versioned in `server/src/prompts/v1.js`, `v2.js`...)
1. Role: persona from shop, warm, short sentences (~15 words), one question per turn, customer's language.
2. Goal: items + quantities + delivery time + place + name/phone, read back, explicit yes.
3. Facts: active catalog (id, name, aliases, units) + today's date in IST. Nothing else.
4. Rules: only catalog items; never state a price, discount, stock, delivery promise or approval not in Facts; if unsure say the shop will call back; no medical/legal/financial advice; refuse off-topic politely; never ask for OTP, card or bank details. Per-shop `rules` are appended here.
5. Examples: busy customer -> callback time; "rate zyada hai" -> acknowledge, offer owner call; ambiguous variant -> ask which; unclear number -> confirm ("15 ya 50?").
6. Ending: after 2 refusals thank and end; after confirmed order give the public code and end.

## Edge cases to handle (log in LEARNING.md)
Silence (~5s, then "can you hear me?", end after 2), ASR number mistakes (always read back), mid-order changes (`modify_order`), barge-in (stop TTS), mic denied / unsupported browser (typed input), LLM rate limit/error (friendly retry, never lose the cart, log `error`), invalid JSON (retry once stricter, then ask to type), max 20 turns (handoff).

## Phases and done-criteria
- **0 Setup:** repo, README, env examples, LEARNING.md. Done: client shows blank BolkeConnect page, `GET /health` ok.
- **1 Ears and mouth:** mic button, language picker, live transcript, bot echoes via TTS, typed fallback.
- **2 Brain:** `/api/chat`, getModel fallback, prompt v1, structured output, catalog validation, transcript saved. "50 bag cement aur ek tractor ret" -> cart with 2 valid items.
- **3 Cart + confirm (by 20 Oct):** live cart, read-back, Confirm, `pending` order + public code, status page. Full order by voice in about 6 turns; invalid items can never enter an order.
- **4 Dashboard:** Firebase Google sign-in, pending orders approve/reject, transcripts, conversations count, conversion rate, drop-off turn, `promptVersion` filter, `voiceEnabled` toggle, recharts.
- **5 Test kit + widget:** `docs/test-utterances.md` (25+ sentences) + runner script, validator unit tests, `<BolkeConnectWidget shopSlug onCartConfirmed />`, `docs/buildsupply-integration.md` (PLAN ONLY; do not implement in BuildSupply), works on phone over Render URL.
- **6 Any business (only on Himanshu's go):** shop signup, CSV/Excel catalog upload with alias column, per-shop rules editor, `/{slug}` link + QR, wa.me notification, second test shop with zero engine code changes.
- Later/paid (needs approval): phone calls, WhatsApp Business API, Sarvam/Deepgram/ElevenLabs.

## Model guidance
Sonnet for routine work (components, CSS, seed data, docs). Opus for Phase 2 logic, validator/guardrail design and tricky bugs. Start a new chat per phase; use `/clear` instead of compacting.
