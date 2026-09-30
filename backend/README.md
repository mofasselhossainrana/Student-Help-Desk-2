# Backend Setup and Deployment

## Local Development

```bash
cd backend
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

If `DATABASE_URL` is not set, the backend uses local SQLite at `backend/db.sqlite3`.

## Required Production Environment Variables

- `SECRET_KEY`: required when `DATABASE_URL` is set and `DEBUG=False`
- `DEBUG`: set to `False`
- `DATABASE_URL`: PostgreSQL connection string
- `ALLOWED_HOSTS`: comma-separated hostnames, for example `student-help-desk-2.onrender.com`
- `CORS_ALLOWED_ORIGINS`: comma-separated frontend origins, for example `https://somadhan-nine.vercel.app`
- `SECURE_SSL_REDIRECT`: defaults to `True` in production

## Render Deployment

Build command:

```bash
pip install -r requirements.txt && python manage.py collectstatic --noinput && python manage.py migrate
```

Start command:

```bash
gunicorn helpdesk_project.wsgi:application
```

Health check path:

```text
/api/health/
```

## Authentication Notes

The API uses DRF token authentication. Clients should call `POST /api/logout/`
to delete the active token on logout. Tokens are still bearer tokens, so keep
them out of logs and avoid storing them anywhere except the active client session.
