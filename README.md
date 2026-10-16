# BolkeConnect (बोलके)

A voice-ordering assistant. A customer speaks an order in Hindi, Marathi, English or a mix; BolkeConnect turns it into a structured order request that the shop owner approves.

> BolkeConnect turns a spoken, code-mixed order into a structured cart. Browser speech-to-text, an LLM grounded only in the shop's catalog with server-side guardrails, and text-to-speech run a turn-by-turn conversation. A human always confirms, and every conversation is logged so prompt versions can be A/B tested on conversion rate. The engine is business-agnostic: a new shop is just a new catalog and rule set.

## Run locally
```bash
cd server && cp .env.example .env && npm run dev
cd client && cp .env.example .env && npm run dev
```
Server health check: http://localhost:8000/health
