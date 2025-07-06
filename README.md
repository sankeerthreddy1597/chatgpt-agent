## Introduction
 ChatGPT agent is a clone of openAI's chatgpt site. The goal was to rebuild the basic functionalities of chatting with AI assistant and add additional features with builting function calling and integration with 3rd party services (google drive, github, slack etc).

### Features
- Built using NextJS, React, Typescript, Tailwind CSS, Chadcn components.
- Auth built using better auth.
- Using postgresql with prisma ORM in a neon DB
- Chats
  - Create new chats
  - Update chat title
  - Delete chat (WIP)
  - Save messages to DB
  - Update chat memory for more cost efficient efficient LLM interaction (TODO)
- LLM
  - Using google gemini flash 2.0
  - Use local models via Ollama (TODO)
 
## UI
<img width="1440" alt="Screenshot 2025-07-05 at 8 24 40 PM" src="https://github.com/user-attachments/assets/9ec59014-1987-45ea-869e-5f3207c50ca7" />

  

## Getting Started

- set env variables
```bash
BETTER_AUTH_SECRET="YOUR_SECRET"
BETTER_AUTH_URL="http://localhost:3000"
NEXT_PUBLIC_API_URL="http://localhost:3000"

DATABASE_URL="YOUR_DB_URL"

GOOGLE_CLIENT_ID="YOUR_CLIENT_ID"
GOOGLE_CLIENT_SECRET="YOUR_CLIENT_SECRET"

GITHUB_CLIENT_ID="YOUR_CLIENT_ID"
GITHUB_CLIENT_SECRET="YOUR_CLIENT_SECRET"

GOOGLE_GENAI_API_KEY="YOUR_GENAI_API_KEY"
```
- run the development server:
```bash
npm run dev
```
