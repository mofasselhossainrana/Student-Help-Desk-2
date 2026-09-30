# Project Context for Maintainers and AI Agents

## Product Purpose

Student Help Desk lets students create support tickets, track status, and discuss requests through comments. Staff users can view all tickets and comments for operational support.

## Core Domain Model

### Ticket

Location: `backend/tickets/models.py`

Fields:

- `title`
- `description`
- `priority`: `LOW`, `MEDIUM`, `HIGH`
- `status`: `OPEN`, `IN PROGRESS`, `CLOSED`
- `user`: owner
- `created_at`
- `updated_at`

### Comment

Location: `backend/tickets/models.py`

Fields:

- `content`
- `ticket`
- `user`
- `created_at`

## Authorization Model

The backend owns authorization decisions.

- Anonymous users cannot access protected API endpoints.
- Regular users can access only their own tickets and comments.
- Staff users can access all tickets and comments.
- Students cannot update ticket status.
- Users cannot comment on tickets they do not own.

Important files:

- `backend/tickets/views.py`
- `backend/tickets/permissions.py`
- `backend/tickets/tests.py`

## API Overview

Base path: `/api/`

```text
GET    /api/health/
POST   /api/register/
POST   /api/login/
POST   /api/logout/
GET    /api/tickets/
POST   /api/tickets/
GET    /api/tickets/<id>/
PATCH  /api/tickets/<id>/
DELETE /api/tickets/<id>/
GET    /api/comments/
POST   /api/comments/
GET    /api/tickets/<ticket_pk>/comments/
POST   /api/tickets/<ticket_pk>/comments/
```

List endpoints are paginated by DRF. Frontend API modules currently normalize paginated responses into arrays for existing UI components.

## Frontend Data Flow

```text
React pages
  -> frontend/src/api/*
  -> frontend/src/api/client.js
  -> Django REST API
```

Auth state lives in `frontend/src/context/AuthContext.jsx`.

API URL comes from `VITE_API_URL`, with a production fallback in `frontend/src/api/client.js`.

## Current Verification Baseline

Backend:

- `python manage.py makemigrations --check --dry-run`
- `python manage.py test tickets`
- `python manage.py check`

Frontend:

- `npm run test`
- `npm run build`

Most recent known result:

- Backend tests: 19 passed
- Frontend tests: 7 passed
- Frontend build: succeeded

## Known Tradeoffs

- DRF token auth is simple but tokens do not expire by default.
- Server-side logout deletes the current token, but stolen tokens remain valid until deleted.
- Pagination exists server-side, but frontend pagination controls are not implemented yet.
- Email backend is console-only.
- CI is not configured yet.

## Suggested Next Work

1. Add CI.
2. Add expiring authentication.
3. Add ticket assignment and staff workflows.
4. Add audit logs.
5. Add frontend pagination controls.
6. Add e2e tests.
7. Add production logging/error tracking.
