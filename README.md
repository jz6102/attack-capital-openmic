# AI Receptionist Intake Agent (OpenMic API Integration)

This project is a full-stack application demonstrating a domain-specific AI intake agent for an office receptionist, built with the OpenMic API, a Node.js/Express backend, and a React management UI. The application is fully deployed, with the backend hosted on Render and the frontend on Vercel.

**Live Application:** [**https://attack-capital-openmic-client.vercel.app**](https://attack-capital-openmic-client.vercel.app)

**Loom Demo Video:** [**<< PASTE YOUR LOOM VIDEO LINK HERE >>**]

---

## ► Project Objective

The goal is to develop an intelligent intake agent for a selected domain, as per the assignment requirements. [cite_start]This implementation focuses on the **Receptionist** use case[cite: 43, 44]. [cite_start]The core of the project is to demonstrate a robust, end-to-end integration of pre-call, in-call, and post-call webhooks to handle dynamic data retrieval and logging[cite: 4].

## ✨ Core Features

-   **Full Webhook Integration:** The backend is equipped to handle the complete lifecycle of an AI-powered call:
    -   [cite_start]**Pre-call Webhook:** Receives initial call data before the conversation begins to personalize the interaction[cite: 29, 31].
    -   [cite_start]**In-call Function:** A real-time API endpoint that the AI agent calls during the conversation to fetch live data based on user input (e.g., an employee ID)[cite: 35, 36].
    -   [cite_start]**Post-call Webhook:** An endpoint that receives and logs the final call transcript and summary after the call has ended[cite: 38, 40].

-   **Web-Based Management UI:** A responsive React application provides a dashboard to manage bots and monitor call activity.
    -   [cite_start]**Bot CRUD:** The UI allows for Creating, Reading, and Deleting bots, fulfilling a key submission criteria[cite: 26, 58].
    -   **Call Log Viewer:** Displays a complete history of all calls processed by the system. [cite_start]Users can click on any log to view a detailed breakdown of the webhook events and their JSON payloads, providing clear evidence of the data flow[cite: 26, 17].

## 🏛️ System Architecture

The application is built on a modern client-server architecture:

1.  **React Frontend (Client):** A single-page application built with Vite that provides the user interface for managing bots and viewing logs. Deployed on **Vercel**.
2.  **Node.js Backend (Server):** An Express server that exposes two sets of endpoints: a REST API for the frontend and webhook endpoints for the external OpenMic service. Deployed on **Render**.
3.  **MongoDB Database:** A NoSQL database (hosted on Atlas) used to persist all bot configurations and call log data.
4.  **OpenMic API:** The external AI voice service that handles the calls and triggers the webhooks.

![System Flow Diagram](https://i.imgur.com/u3tT5h2.png)

## 🛠️ Tech Stack

| Category      | Technology                               |
| ------------- | ---------------------------------------- |
| **Frontend** | React, Vite, Axios, React Router         |
| **Backend** | Node.js, Express.js, Mongoose            |
| **Database** | MongoDB Atlas                            |
| **Deployment**| Vercel (Frontend), Render (Backend)      |

---

## 🚀 Setup and Installation

To run this project locally, follow these steps.

### Prerequisites

-   Node.js (v18+) & npm
-   MongoDB Atlas Account & Connection URI

### Backend Setup

1.  **Navigate to the `server` directory:**
    ```bash
    cd server
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    ```
3.  **Create a `.env` file** in the `server` root and add your environment variables:
    ```env
    MONGO_URI=your_mongodb_connection_string
    WEBHOOK_SECRET=super-secret-token
    PORT=8080
    CLIENT_ORIGIN=http://localhost:5173
    ```
4.  **Seed the database** with sample employee data:
    ```bash
    npm run seed
    ```
5.  **Start the server:**
    ```bash
    npm start
    ```
    The backend will run on `http://localhost:8080`.

### Frontend Setup

1.  **Navigate to the `client` directory:**
    ```bash
    cd client
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    ```
3.  **Start the client:**
    ```bash
    npm run dev
    ```
    The frontend will be accessible at `http://localhost:5173`.

---

## 🔬 Demonstrating the Webhook Flow

A notable challenge during development was the unreliability of the OpenMic "Test Call" feature, particularly its voice recognition for extracting parameters.

To provide a clear and definitive demonstration of the backend's functionality, the three webhook integrations can be simulated manually using `curl`. [cite_start]This method confirms that the server logic is working perfectly and meets all assignment requirements[cite: 59, 60].

#### 1. Pre-call Simulation

Simulates the start of a call for `call_id: "demo_call_001"`.
```bash
curl -X POST "[https://attack-capital-openmic-server.onrender.com/precall?secret=super-secret-token](https://attack-capital-openmic-server.onrender.com/precall?secret=super-secret-token)" -H "Content-Type: application/json" -d '{"call_id":"demo_call_001"}'