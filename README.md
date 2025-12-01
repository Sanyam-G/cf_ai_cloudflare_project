Here is the `README.md` file. It avoids emojis and dashes in the text while explaining the architecture and deployment steps.

```markdown
# Persistent Memory AI Assistant

## Project Overview

This project implements a context aware chatbot using Cloudflare services. The AI remembers conversation history by storing state in a key value store. The application uses a hybrid architecture with a serverless backend and a locally hosted frontend exposed via a secure tunnel.

## Architecture

*   **Backend (Cloudflare Worker):** The core logic runs on the Edge. It processes HTTP requests, communicates with the Llama 3 AI model, and manages data persistence.
*   **Storage (Cloudflare KV):** This database stores the chat history. The Worker retrieves past messages using a Session ID before generating a new response.
*   **Frontend (Local + Tunnel):** The user interface is a static HTML file hosted on your local machine. It connects to the backend over the internet.

## The Hybrid Setup

The frontend is hosted locally to simulate an internal tool or a secure environment. We use Cloudflare Tunnels to expose this local web server to a public URL. This allows the locally running interface to communicate securely with the deployed Cloudflare Worker without deploying the HTML file to a bucket or static site host.

## Prerequisites

*   Node.js and npm installed
*   Python 3 installed
*   Cloudflare account
*   Wrangler CLI installed
*   Cloudflared CLI installed

## Deployment Instructions

Follow these steps in order to run the application.

### 1. Database Creation

Open your terminal and create the Key Value namespace.

```bash
npx wrangler kv:namespace create MEMORY
```

Copy the ID string from the output. Open `wrangler.toml` and replace the placeholder text with this new ID.

### 2. Backend Deployment

Publish the Worker code to the Cloudflare network.

```bash
npx wrangler deploy
```

Copy the worker URL ending in `workers.dev` from the output.

### 3. Frontend Configuration

Open `index.html` in a text editor. Locate the `API_URL` variable inside the script tag. Replace the existing URL with the one you copied in the previous step.

### 4. Running the Application

You need two terminal windows open to serve the frontend.

**Terminal 1 (Local Server)**
Start a Python web server to host the HTML file.

```bash
python3 -m http.server 8000
```

**Terminal 2 (Tunnel)**
Create a tunnel to expose the local port 8000 to the internet.

```bash
cloudflared tunnel --url http://localhost:8000
```

Copy the unique `trycloudflare.com` URL provided in the output. Paste that URL into your web browser to use the AI assistant.
```
