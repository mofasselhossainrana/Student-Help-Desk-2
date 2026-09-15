# Student Mini Help Desk — Project Progress Log

A full-stack help desk application built from scratch (PostgreSQL + Django REST Framework + React), documented from database design through current progress.

---

## Phase 1: Database Design (PostgreSQL / pgAdmin)

Designed and built the initial schema manually in pgAdmin to learn relational database fundamentals.

**Tables designed:**

| Table | Fields |
|---|---|
| **Tickets** | id, title, description, priority, status, user_id, created_at, updated_at |
| **Users** | id, name, email, password, role, created_at |
| **Comments** | id, message, ticket_id, user_id, created_at |

**Concepts learned along the way:**
- Primary Key vs Foreign Key, and why a Foreign Key target column needs a unique constraint
- `NOT NULL` columns need a default value (e.g. `now()`) or inserts fail
- PostgreSQL is case-sensitive for quoted identifiers — mixed-case column names (`Id`, `Name`) require double-quoting in every query

---

## Phase 2: Backend — Django + REST API

**Environment setup:**
- Created a Python virtual environment (`venv`) in `helpdesk_backend/` on Desktop
- Installed `django`, `djangorestframework`, `psycopg2-binary`
- Created Django project `helpdesk_project`
- Connected Django to the PostgreSQL database `Student Mini help desk` via `settings.py`
- Ran initial `migrate` successfully — confirmed Django ↔ PostgreSQL connection works

**Models (`tickets/models.py`):**
```python
class Ticket(models.Model):
    title = models.CharField(max_length=150)
    description = models.TextField()
    priority = models.CharField(max_length=20, default="MEDIUM")
    status = models.CharField(max_length=20, default="OPEN")
    user = models.ForeignKey("auth.User", on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

class Comment(models.Model):
    content = models.TextField()
    ticket = models.ForeignKey(Ticket, on_delete=models.CASCADE)
    user = models.ForeignKey("auth.User", on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
```

**Design decision:** Used Django's built-in `auth.User` model rather than a custom user table (since migrations were already applied against it). A separate `role`-holding profile model was deferred to the Authentication phase rather than reworked immediately.

**Serializers, Views, URLs:**
- `TicketSerializer`, `CommentSerializer` (DRF `ModelSerializer`)
- `TicketListCreateView`, `TicketDetailView`, `CommentListCreateView` (DRF generic views)
- Routes: `/api/tickets/`, `/api/tickets/<pk>/`, `/api/comments/`
- Tested via DRF's browsable API — GET and POST both confirmed working

**Authentication:**
- `UserRegistrationView` — registers new users via `User.objects.create_user()` (ensures passwords are hashed, never stored in plain text)
- Login via DRF's built-in `obtain_auth_token` → returns a Token on successful login
- All Ticket/Comment endpoints protected with `permission_classes = [IsAuthenticated]`
- **Bug fixed:** Ticket/Comment creation initially required manually supplying a `user` id. Fixed by marking `user` as `read_only` in the serializers and overriding `perform_create()` in the views to auto-assign `user=self.request.user` — so the logged-in user is attached automatically and securely.

**Phase 2 status: ✅ Complete** — Models, Serializers, Views, Endpoints, Registration, Login/Token Auth, and Protected API all working.

---

## Phase 3 + 4: Frontend — React + API Integration (in progress)

**Setup:**
- Node.js installed, React project scaffolded with Vite (`npm create vite@latest helpdesk_frontend -- --template react`) in a sibling folder to the backend
- CORS configured on the Django side (`django-cors-headers`) to allow requests from `http://localhost:5173`

**Built so far (all in a single `App.jsx`, no routing yet):**
- **Login form** — calls `/api/login/`, saves the returned token to `localStorage`
- **Auto-login** — on page load, `useEffect` checks `localStorage` for an existing token and skips straight to the ticket list if found
- **Ticket List view** — fetches `/api/tickets/` with the token in the `Authorization` header, renders the list
- **Create Ticket form** — posts new tickets (title, description, priority) to `/api/tickets/`
- **Ticket Detail view** — clicking a ticket switches to a detail view showing full ticket info
- **Comments** — detail view fetches comments and filters client-side for the selected ticket; includes a form to add new comments

**Remaining Phase 3+4 work:**
- [ ] Register page (currently only testable via the Django browsable API)
- [ ] Logout button
- [ ] Proper navigation/routing (currently uses a simple `view` state toggle instead of real routes)

**Deferred to after Phase 3+4 is functionally complete:** CSS styling / visual polish (decision: styling comes after functionality, not before).

---

## Phase 5: Not yet started

Planned scope: Search, Filter, Testing, Polish (including CSS styling).

---

## Timeline note

Original plan was a single week (Mon–Fri). Deadline was deliberately extended to **the following Friday** to allow time to actually understand each concept rather than rush and copy-paste — the same 5 phases were kept, just spread over more days.