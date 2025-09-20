# Receptionist AI Intake Agent — OpenMic Integration

Professional, concise README for the "Receptionist" intake-agent project built with OpenMic API.

## Project summary
- Purpose: a reference implementation that demonstrates pre-call, in-call function, and post-call webhook integrations with OpenMic. The project includes a small React UI to manage bots and view call logs, and a Node.js server that exposes the webhook endpoints used by OpenMic.
- Chosen domain: Receptionist — the agent greets callers, asks for employee name or ID, looks up employee location during the call via a function call, and logs arrival/visit details after the call.

## Repo layout (high level)
- `server/` — Node.js + Express backend
  - `index.js` — server entrypoint, mounts webhook handlers and REST APIs
  - `routes/` — routes for `/precall`, `/function`, `/postcall`
  - `controllers/` — handlers for precall, function, postcall, bots and call logs
  - `models/` — Mongoose models: `Bot`, `CallLog`, `Patient` (used for seeded employees)
  - `seed/seedPatients.js` — example seed data (employee records)
  - `config/db.js` — MongoDB connection helper
  - `utils/logger.js` — minimal logger wrapper
- `client/` — React (Vite) front-end
  - `src/pages` — `BotsPage`, `CallLogsPage`, `CallLogDetailPage`
  - `src/components` — `BotForm`, `BotList`, `CallLogList`, `Navbar`
  - `src/api/index.js` — axios helpers for backend API

## Contract / Data shapes (tiny)
- Pre-call request: OpenMic will POST JSON which may include `call_id`, `phone`, and `metadata` (e.g. `metadata.patient_id` or `metadata.bot_uid`). Server returns a JSON object with pre-call data (for Receptionist this is `patient` object reused to represent visitor/employee lookup).
- Function call request: OpenMic will POST with `call_id` and `arguments` containing domain-specific inputs (e.g. `employee_id`). Server returns `{ status: 'ok', data: { ... } }` and appends the event into `CallLog.events`.
- Post-call request: OpenMic will POST call transcript and summary. Server upserts the `CallLog` and stores `transcript`, `summary`, `events`, and `status`.

Example minimal CallLog document (Mongo):
```
{
  call_id: 'call_12345',
  bot_uid: 'bot_....',
  events: [ { type: 'precall', payload: {...} }, { type: 'function_call', payload: {...} }, { type: 'postcall', payload: {...} } ],
  transcript: {...},
  summary: 'Visitor arrived for meeting with X',
  status: 'postcall_done'
}
```

## How the OpenMic integration maps to code
- Pre-call webhook (`/precall`) — `server/controllers/precallController.js`
  - Purpose: return visitor/employee data to OpenMic before the call starts so the agent can personalise the greeting.
  - Implementation: looks up `metadata.patient_id` or `phone` against `Patient` collection. Creates a new `CallLog` entry with a `precall` event and returns a `patient` object (if not found, returns an "unknown" placeholder).
- In-call function (`/function`) — `server/controllers/functionController.js`
  - Purpose: during the call, OpenMic can invoke your custom function to fetch dynamic data (e.g., employee location) based on caller input.
  - Implementation: reads `arguments.employee_id`, queries `Patient` (employees) and returns `{ name, location }`. Also appends a `function_call` event into the existing `CallLog`.
- Post-call webhook (`/postcall`) — `server/controllers/postcallController.js`
  - Purpose: OpenMic posts final transcript and summary after the call. Server stores the transcript, summary, and marks the call log complete.

## Setup (local dev)
Prerequisites:
- Node 18+ and npm
- MongoDB (local or cloud); set `MONGO_URI` in `.env`
- ngrok or similar to expose local server for OpenMic webhooks

1. Clone repository, then install:

```
# server
cd server
npm install

# client
cd ../client
npm install
```

2. Configure environment (server/.env):

```
MONGO_URI=<your_mongo_uri>
PORT=8080
# Optional secret used by controllers to verify incoming webhooks
WEBHOOK_SECRET=some-secret-if-you-want
```

3. Seed example employee records (optional but recommended):

```
cd server
npm run seed
```

4. Run server and client concurrently (two terminals):

```
# Terminal A (server)
cd server
npm run dev

# Terminal B (client)
cd client
npm run dev
```

5. Expose server to the internet (for OpenMic):

```
# Start ngrok on the same port as server (8080)
ngrok http 8080
```

Copy the public ngrok URL (e.g. `https://xxxx.ngrok.io`) and use these endpoint URLs in the OpenMic dashboard:
- Pre-call webhook URL: https://<ngrok>/precall
- Function call URL: https://<ngrok>/function
- Post-call webhook URL: https://<ngrok>/postcall

If you configured `WEBHOOK_SECRET`, include it as a query param (e.g. `?secret=<value>`) or set `X-Webhook-Secret` header in OpenMic (dashboard provides header settings).

## How to use (quick)
1. Start server and client locally and expose server via ngrok.
2. In OpenMic dashboard (or API), create a bot for the Receptionist domain and set the bot UID into the agent config.
3. Configure the bot in OpenMic:
   - Pre-call webhook -> `https://<ngrok>/precall`
   - Custom function (name it e.g. `get_employee_location`) -> point to `https://<ngrok>/function`
   - Post-call webhook -> `https://<ngrok>/postcall`
4. Use OpenMic dashboard's "Test Call" to run a simulated call. During the call the agent will:
   - Use pre-call data to personalise the greeting.
   - Ask for employee name/ID; when provided, it will call your function endpoint and display the returned data in the conversation.
   - At call end, OpenMic will POST transcript/summary to `/postcall` where it is saved in the backend.
5. In the React UI (`http://localhost:5173` by default), visit:
   - Bots page: create/list/delete bots (bot UID field is visible in the list) — used for tracking but bots may also be created inside OpenMic dashboard.
   - Call Logs: view incoming `CallLog` entries created by the webhook flow. Click an entry to view events and payloads (precall, function_call, postcall).

## Developer notes & assumptions
- The `Patient` model is reused to store employee records for the Receptionist demo (fields: `employeeId`, `name`, `department`, `location`). The filename is `Patient.js` but semantically it represents employees/visitors.
- The server performs minimal verification via `WEBHOOK_SECRET` if set. If you want stricter verification, add signature verification per OpenMic docs.
- The client is intentionally minimal: it manages bots and displays call logs. OpenMic's dashboard is used to run the Test Call flow.

## Demo checklist (for submission)
Use this checklist for your loom demo recording and to validate functionality.

- [ ] Backend running and publicly reachable via ngrok
- [ ] Seeded employee records present (show `server/seed/seedPatients.js` run)
- [ ] OpenMic bot created for Receptionist and configured with:
  - Pre-call webhook -> `/precall`
  - Custom function -> `/function`
  - Post-call webhook -> `/postcall`
- [ ] Show creating a bot in the UI (Bots page) and list with UID
- [ ] Run a Test Call in OpenMic dashboard for the bot
  - Show that pre-call response personalised greeting (from `/precall`)
  - During call, provide employee ID/name so the agent triggers the function call and returns location (shown in conversation)
  - After call, confirm `/postcall` receives transcript and summary and the Call Log in the UI contains events (precall, function_call, postcall)

## Troubleshooting
- If call logs show empty or missing events: ensure OpenMic is pointed to your ngrok URL and that `WEBHOOK_SECRET` matches if you set it.
- If the front-end cannot reach the server: ensure CORS is allowed (server sets cors middleware) and client `src/api/index.js` baseURL is `http://localhost:8080/api` for local dev.


