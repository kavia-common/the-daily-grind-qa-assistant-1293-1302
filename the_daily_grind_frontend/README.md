# The Daily Grind - Q&A Frontend

Customer-facing web interface for submitting questions and viewing answers from The Daily Grind's friendly barista bot.

## Features

- Input form to submit customer questions
- Display area for responses (from backend API)
- Coffee shop–themed, friendly UI
- Light/Dark theme toggle
- React 18

## Getting Started

In the project directory:

- `npm install`
- Configure environment (optional):
  - Copy `.env.example` to `.env` and set `REACT_APP_API_BASE` if your API is hosted on a different origin (e.g. `https://api.example.com`).
  - If left empty, requests will be made to same-origin `/api/ask`.
  - For local development, ensure the React dev server proxies API calls to your backend:
    - We configure `"proxy": "http://localhost:5000"` in `package.json` by default. Adjust this to your backend dev URL or remove if not needed.
    - With the proxy in place and no `REACT_APP_API_BASE`, requests to `/api/ask` will be forwarded to your backend (e.g., `http://localhost:5000/api/ask`).
- `npm start`

Then open http://localhost:3000 to view it in the browser.

## API

- Endpoint: `POST /api/ask`
- Request body: `{ "question": "string" }`
- Response body: `{ "answer": "string" }`

Set `REACT_APP_API_BASE` to prefix the API, e.g., `https://api.example.com` so the final URL becomes `https://api.example.com/api/ask`.

## Testing

- `npm test`

The test verifies:
- Greeting renders
- Submitting “What are your hours?” eventually shows a bot response (dependent on backend behavior)

## Notes

- You can toggle the light/dark theme using the header button.
