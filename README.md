# Attack Capital - AI Intake Agent Project

This project is a domain-specific AI intake agent built using the OpenMic API, a Node.js/Express backend, and a React frontend.

**Loom Demo Video:** [Link to your Loom video will go here]

---

## Features

- **AI-Powered Voice Agent:** A receptionist bot that uses a 4-digit employee ID to retrieve location information.
- **Webhook Integration:** Demonstrates a complete webhook lifecycle:
    - **Pre-call:** Fetches initial data before a call.
    - **In-call Function:** Calls a custom API during the conversation to get live data.
    - **Post-call:** Receives and logs the final call transcript and summary.
- **Web UI:** A React application to manage bots and view detailed call logs.
    - **Bot Management:** Create, read, and delete bots.
    - **Call Log Viewer:** View a history of all calls and click to see detailed event payloads (pre-call, function, post-call).

## Tech Stack

- **Frontend:** React, Vite, Axios
- **Backend:** Node.js, Express, Mongoose
- **Database:** MongoDB Atlas
- **API:** OpenMic.ai
- **Tunnelling:** ngrok (for local development)

---

## How to Run Locally

### Prerequisites

- Node.js (v18+)
- npm
- MongoDB Atlas account

### Backend Setup

1.  Navigate to the `server` directory: `cd server`
2.  Install dependencies: `npm install`
3.  Create a `.env` file and add your `MONGO_URI`.
4.  Seed the database with sample employees: `npm run seed`
5.  Start the server: `npm start` (runs on `localhost:8080`)

### Frontend Setup

1.  Navigate to the `client` directory: `cd client`
2.  Install dependencies: `npm install`
3.  Start the client: `npm run dev` (runs on `localhost:5173`)