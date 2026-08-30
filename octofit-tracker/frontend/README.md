# OctoFit Tracker frontend

## Required environment variable

Create a local Vite environment file named `.env.local` and define:

```bash
VITE_CODESPACE_NAME=<your-codespace-name>
```

This is required for the app to build the correct backend URL in GitHub Codespaces, for example:

```text
https://${VITE_CODESPACE_NAME}-8000.app.github.dev/api/users/
```

When `VITE_CODESPACE_NAME` is unset, the app falls back to `http://localhost:8000`.

## Local development

- Frontend: `npm run dev --prefix octofit-tracker/frontend`
- Backend: `npm run dev --prefix octofit-tracker/backend`

Ports:

- Frontend: 5173
- Backend API: 8000
- MongoDB: 27017 (private/internal only)
