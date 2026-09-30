# Agent Guide

This file is the main discovery document for AI coding agents working on this repository.

## Project Overview

Student Help Desk is a full-stack ticketing application for student support requests.

- Backend: Django, Django REST Framework, token authentication
- Frontend: React, Vite, React Router
- Database: PostgreSQL in production through `DATABASE_URL`; SQLite fallback for local development
- Backend deployment style: Render-compatible Django app
- Frontend deployment style: Vercel-compatible SPA

## Important Docs

- Production review and next direction: `docs/REPO_PRODUCTION_REVIEW.md`
- Detailed project context: `docs/PROJECT_CONTEXT.md`
- Backend setup and deployment: `backend/README.md`
- Frontend app notes: `frontend/README.md`

## Backend Structure

```text
backend/
├── helpdesk_project/
│   ├── settings.py
│   ├── urls.py
│   ├── asgi.py
│   └── wsgi.py
├── tickets/
│   ├── auth_views.py
│   ├── health.py
│   ├── models.py
│   ├── permissions.py
│   ├── serializers.py
│   ├── tests.py
│   ├── urls.py
│   └── views.py
├── manage.py
├── requirements.txt
└── .env.example
```

## Frontend Structure

```text
frontend/src/
├── api/
│   ├── auth.js
│   ├── client.js
│   ├── comments.js
│   └── tickets.js
├── Components/
│   ├── AppLayout.jsx
│   ├── ErrorBoundary.jsx
│   ├── ProtectedRoute.jsx
│   └── sidebar.jsx
├── context/
│   └── AuthContext.jsx
├── pages/
├── test/
└── utils/
```

Note: the frontend currently uses `src/Components/` with capital `C`. Preserve this casing unless doing a dedicated casing migration.

## Backend Commands

```bash
cd backend
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

Verification:

```bash
cd backend
python manage.py makemigrations --check --dry-run
python manage.py test tickets
python manage.py check
```

## Frontend Commands

```bash
cd frontend
npm install
npm run dev
```

Verification:

```bash
cd frontend
npm run test
npm run build
```

## Key API Rules

- Regular users can only see and modify their own tickets/comments.
- Staff users can see all tickets/comments.
- Students cannot update ticket status.
- Comments should use `/api/tickets/<ticket_pk>/comments/` when tied to a ticket detail page.
- Login returns a DRF token.
- Logout deletes the current server-side token through `POST /api/logout/`.

## Configuration

Backend production env vars:

- `SECRET_KEY`
- `DEBUG=False`
- `DATABASE_URL`
- `ALLOWED_HOSTS`
- `CORS_ALLOWED_ORIGINS`
- `SECURE_SSL_REDIRECT`

Frontend env vars:

- `VITE_API_URL`

## Agent Working Notes

- Do not weaken backend authorization to make frontend calls easier.
- Keep ownership and staff override behavior in backend querysets, not only in UI.
- Update backend tests when changing permissions, serializers, routes, or auth behavior.
- Update frontend API normalization if backend pagination shape changes.
- Avoid storing secrets in committed files.
- Use `backend/.env.example` and `frontend/.env.example` as templates only.
