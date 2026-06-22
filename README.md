# iDuck Cloud

Minimal Node/Express backend that proxies chat to Google Gemini.
The API key stays server-side (Railway env var), never in the app.

## Endpoints
- `GET /health` -> status
- `POST /chat` body `{ "text": "hello" }` -> `{ "reply": "..." }`

## Env vars
- `GEMINI_API_KEY` (required) - from aistudio.google.com
- `GEMINI_MODEL` (optional) - default `gemini-2.5-flash`

## Deploy (Railway)
1. Push this folder to a GitHub repo.
2. Railway -> New Project -> Deploy from GitHub repo.
3. Add variable `GEMINI_API_KEY`.
4. Railway runs `npm install` then `npm start`.
