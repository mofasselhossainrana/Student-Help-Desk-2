# Repository Production Review

Last updated: 2026-09-30

## Summary

Student Help Desk is a full-stack help desk application with:

- Backend: Django, Django REST Framework, token authentication, PostgreSQL via `DATABASE_URL`
- Frontend: React, Vite, React Router
- Deployment targets: Render-style Django API and Vercel-style frontend

The original review found the app was functional but not production-ready. The highest-risk gaps were backend authorization, hard-coded configuration, missing dependency manifests, missing tests, and frontend API duplication.

## Current Production Status

The critical backend issues from the audit have been addressed:

- Users can only access their own tickets and comments.
- Staff users can access all tickets and comments.
- Ticket detail access is scoped server-side.
- Comments are filtered server-side and also available through a nested ticket comments endpoint.
- Users cannot comment on another user's ticket.
- Ticket priority/status values are constrained and validated.
- Registration passwords are write-only and validated.
- Default DRF permissions, throttling, logout, pagination, health check, static serving, and deploy docs have been added.

Frontend production structure has also improved:

- API calls are centralized under `frontend/src/api/`.
- API URL is environment-driven through `VITE_API_URL`.
- Auth/session state is centralized in `AuthContext`.
- Protected routes and an error boundary exist.
- Ticket search, priority casing, comments, and error handling were cleaned up.

## Changes Made

### Backend

- Added scoped query helpers in `backend/tickets/views.py`.
- Added and wired permissions in `backend/tickets/permissions.py`.
- Added `TextChoices`, ordering, `related_name`, and useful string methods in `backend/tickets/models.py`.
- Added safer serializers in `backend/tickets/serializers.py`.
- Added `POST /api/logout/` in `backend/tickets/auth_views.py`.
- Added `GET /api/health/` in `backend/tickets/health.py`.
- Added nested route `GET/POST /api/tickets/<ticket_pk>/comments/`.
- Added pagination through DRF settings.
- Added production security config and WhiteNoise static serving.
- Added `backend/requirements.txt`, `backend/.env.example`, and `backend/README.md`.
- Registered models in `backend/tickets/admin.py`.
- Added migration `backend/tickets/migrations/0003_alter_comment_options_alter_ticket_options_and_more.py`.
- Expanded backend tests from empty to 19 tests.

### Frontend

- Replaced hard-coded API URLs with environment-driven API modules.
- Added `frontend/.env.example`.
- Added API modules for auth, tickets, comments, and common fetch handling.
- Added auth context, protected route, and error boundary.
- Updated pages to use the API layer.
- Fixed high-priority casing from `high` to `HIGH`.
- Added debounce and filter reset behavior for ticket search.
- Updated comments to use nested server endpoint.
- Added Vercel security headers.
- Added public logo asset and fixed the app title.
- Added frontend tests and test setup.

## Verification

The latest verification run passed:

```bash
cd backend
python manage.py makemigrations --check --dry-run
python manage.py test tickets
python manage.py check
```

Result:

- Backend tests: 19 passed
- Django system check: no issues
- Migration check: no changes detected

```bash
cd frontend
npm run test
npm run build
```

Result:

- Frontend tests: 7 passed
- Production build: succeeded

## Remaining Risks

- DRF token authentication still uses non-expiring bearer tokens. Server-side logout exists, but true expiration requires JWT or a custom expiring token authentication class.
- Email remains console-only. This is acceptable for development but not for production notifications.
- There is no ticket assignment workflow yet.
- There is no CI pipeline yet.
- There is no observability stack beyond health checks and default logging.

## Recommended Next Direction

1. Add CI that runs backend tests, frontend tests, lint, build, and migration checks on every PR.
2. Replace plain DRF tokens with expiring JWT or custom expiring token auth.
3. Add roles and workflows for support staff: assignment, status transitions, and internal notes.
4. Add audit trails for ticket status changes and staff actions.
5. Add production logging and error tracking.
6. Add deployment-specific docs for Render and Vercel with exact environment variables.
7. Add end-to-end tests for login, ticket creation, search, detail view, and comments.
8. Add pagination UI controls in the frontend instead of only normalizing the first paginated response.
