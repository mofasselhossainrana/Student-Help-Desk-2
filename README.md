# 🎓 Student Mini Help Desk — সমাধান

A full-stack student support and help desk application built from scratch to practice and demonstrate **PostgreSQL, Django REST Framework, React, authentication, REST APIs, and modern UI/UX**.

> **Project:** Student Mini Help Desk
> **Bangla Name:** সমাধান
> **Version:** 1.0 — Complete Project
> **Status:** ✅ MVP Completed

---

## 📌 About the Project

**Student Mini Help Desk** is a web-based support system designed to help students submit, track, and manage support tickets.

Students can create support tickets, check their ticket status, search and filter tickets, and communicate through comments.

The project was developed from scratch as a practical full-stack learning project, starting from database design and gradually connecting the backend API with the React frontend.

---

## ✨ Features

### 🔐 Authentication

* User registration
* User login
* Token-based authentication
* Protected API requests
* Persistent login using `localStorage`
* Logout functionality

### 🎫 Ticket Management

* Create support tickets
* View ticket list
* View ticket details
* Update ticket information
* Delete tickets
* Ticket priority
* Ticket status
* User-specific ticket ownership

### 💬 Comments

* Add comments to tickets
* View ticket comments
* Authenticated comment creation

### 🔎 Search & Filtering

* Search tickets by title
* Filter by status
* Filter by priority
* Backend-powered query filtering

### 📊 Dashboard

* Dashboard overview
* Ticket statistics
* Recent tickets
* Navigation through reusable sidebar

### 🎨 UI/UX

* Modern student-support interface
* Responsive layout
* Login & registration screens
* Dashboard
* My Tickets
* Create Ticket
* Ticket Detail
* Search Tickets
* Splash screen
* Reusable sidebar
* Responsive mobile-friendly design

---

# 🛠️ Tech Stack

## Frontend

* React
* Vite
* JavaScript
* React Router
* CSS

## Backend

* Python
* Django
* Django REST Framework
* Token Authentication
* django-cors-headers

## Database

* PostgreSQL
* pgAdmin

## Development Tools

* VS Code
* Bruno API Client
* Git
* GitHub

---

# 🏗️ Project Architecture

```text
Student Mini Help Desk/
│
├── Backend/
│   ├── helpdesk_project/
│   ├── tickets/
│   ├── manage.py
│   └── venv/
│
├── Frontend/
│   ├── public/
│   ├── src/
│   │   ├── Components/
│   │   ├── pages/
│   │   ├── App.jsx
│   │   ├── App.css
│   │   └── main.jsx
│   └── package.json
│
├── Bruno Collections/
│
└── .gitignore
```

---

# 🗄️ Database Design

The initial database was designed manually in PostgreSQL/pgAdmin before connecting it with Django.

### Main Entities

```text
Users
  │
  ├────────── Tickets
  │              │
  │              └──────── Comments
  │
  └────────── Comments
```

### Users

| Field      | Description           |
| ---------- | --------------------- |
| id         | Primary Key           |
| name       | User name             |
| email      | Unique email          |
| password   | User password         |
| role       | User role             |
| created_at | Account creation time |

### Tickets

| Field       | Description         |
| ----------- | ------------------- |
| id          | Primary Key         |
| title       | Ticket title        |
| description | Problem description |
| priority    | Ticket priority     |
| status      | Ticket status       |
| user_id     | Foreign Key → User  |
| created_at  | Creation time       |
| updated_at  | Last update time    |

### Comments

| Field      | Description          |
| ---------- | -------------------- |
| id         | Primary Key          |
| content    | Comment message      |
| ticket_id  | Foreign Key → Ticket |
| user_id    | Foreign Key → User   |
| created_at | Creation time        |

---

# 🔌 API Endpoints

## Authentication

### Register

```http
POST /api/register/
```

### Login

```http
POST /api/login/
```

---

## Tickets

### List / Create Tickets

```http
GET  /api/tickets/
POST /api/tickets/
```

### Ticket Details

```http
GET    /api/tickets/<id>/
PUT    /api/tickets/<id>/
PATCH  /api/tickets/<id>/
DELETE /api/tickets/<id>/
```

---

## Search & Filtering

Search:

```http
GET /api/tickets/?search=network
```

Status filter:

```http
GET /api/tickets/?status=OPEN
```

Priority filter:

```http
GET /api/tickets/?priority=HIGH
```

Search + filters can also be combined.

---

## Comments

```http
GET  /api/comments/
POST /api/comments/
```

Authenticated requests use token authentication:

```http
Authorization: Token <your-token>
```

---

# 🔄 Application Flow

```text
                 ┌──────────────┐
                 │    User      │
                 └──────┬───────┘
                        │
                        ▼
                ┌───────────────┐
                │ Login/Register│
                └───────┬───────┘
                        │
                        ▼
                 ┌────────────┐
                 │ Dashboard  │
                 └─────┬──────┘
                       │
          ┌────────────┼─────────────┐
          ▼            ▼             ▼
     My Tickets   Create Ticket   Search
          │            │             │
          └────────────┼─────────────┘
                       ▼
                ┌──────────────┐
                │Ticket Detail │
                └──────┬───────┘
                       │
                       ▼
                 ┌───────────┐
                 │ Comments  │
                 └───────────┘
```

---

# 🚀 Getting Started

## 1. Clone the Repository

```bash
git clone https://github.com/mofasselhossainrana/Student-Help-Desk-2.git
```

```bash
cd Student-Help-Desk-2
```

---

# ⚙️ Backend Setup

Go to the backend directory:

```bash
cd Backend
```

Create and activate the virtual environment if needed:

### Windows

```bash
python -m venv venv
```

```bash
venv\Scripts\activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Run migrations:

```bash
python manage.py migrate
```

Start the Django development server:

```bash
python manage.py runserver
```

Backend will normally run at:

```text
http://127.0.0.1:8000/
```

---

# 💻 Frontend Setup

Open another terminal and go to:

```bash
cd Frontend
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Vite will provide the local frontend URL in the terminal.

---

# 🧪 API Testing

API endpoints were tested during development using **Bruno**.

Testing included:

* Registration
* Login
* Token authentication
* Ticket creation
* Ticket listing
* Ticket details
* Ticket updates
* Ticket deletion
* Comments
* Search
* Status filtering
* Priority filtering
* Authentication error handling

---

# 🌿 Git Branch Strategy

The project uses separate branches for stable code and testing.

```text
main
 │
 │ Stable / Completed Version
 │
 ▼
Testing-by-Rana
 │
 │ Testing & Integration
 │
 ▼
feature branch
```

### Main

`main` contains the stable version of the project.

### Testing-by-Rana

Used for testing and integrating new changes before they are merged into `main`.

### Feature Branches

Future features can be developed separately and then merged into the testing branch.

Example:

```text
Testing-by-Rana
       │
       ▼
feature/admin-panel
       │
       ▼
Pull Request
       │
       ▼
Testing-by-Rana
       │
       ▼
Testing
       │
       ▼
main
```

---

# 📚 Development Phases

## Phase 1 — Database Design ✅

* PostgreSQL database created
* Users table
* Tickets table
* Comments table
* Primary Keys
* Foreign Keys
* NOT NULL
* UNIQUE
* DEFAULT
* Sample data
* Relationship testing

---

## Phase 2 — Django Backend & API ✅

* Django project setup
* Django REST Framework
* PostgreSQL connection
* Models
* Serializers
* API views
* API URLs
* Authentication
* Protected endpoints
* CORS configuration

---

## Phase 3 — React Frontend ✅

* React + Vite setup
* Routing
* Login
* Register
* Dashboard
* Ticket list
* Create ticket
* Ticket details
* Sidebar
* Logout

---

## Phase 4 — Comments, Search & Filters ✅

* Ticket comments
* Search
* Status filtering
* Priority filtering
* API integration
* Frontend integration

---

## Phase 5 — UI/UX & Final Integration ✅

* Dashboard redesign
* Responsive UI
* Modern visual design
* Splash screen
* Login/Register redesign
* Sidebar redesign
* Ticket UI polish
* Search UI
* Final integration
* Frontend/backend flow testing

---

# 🔮 Future Development

The current version is the **MVP / Version 1**.

Possible future phases include:

### Phase 6 — Admin Panel

* Admin authentication
* Role-based authorization
* Admin dashboard
* Manage all tickets
* Manage users
* Manage comments
* Change ticket status
* Change priority
* Admin search & filtering

### Future Improvements

* Email notifications
* Real-time notifications
* File attachments
* Ticket categories
* Analytics
* Advanced reporting
* Deployment
* Production database
* Better permission management

---

# 🎯 Learning Objectives

This project was built not only as an application but also as a practical learning journey.

The main goals were to understand:

* Relational database design
* PostgreSQL
* Primary & Foreign Keys
* Django architecture
* REST API concepts
* Authentication
* API integration
* React component architecture
* React Router
* Frontend state management
* CRUD operations
* Search and filtering
* Git & GitHub workflow
* Full-stack application architecture

---

# 🧠 What I Learned

Through this project, I practiced the complete flow:

```text
Database
   ↓
Django Models
   ↓
Django REST API
   ↓
Authentication
   ↓
React Frontend
   ↓
API Integration
   ↓
UI/UX
   ↓
Testing
   ↓
Git & GitHub
```

This project helped me understand how the **frontend, backend, database, authentication, and API layers work together as one complete system.**

---

# 📌 Current Status

| Area            | Status          |
| --------------- | --------------- |
| Database        | ✅ Complete      |
| Backend         | ✅ Complete      |
| Authentication  | ✅ Complete      |
| React Frontend  | ✅ Complete      |
| Ticket CRUD     | ✅ Complete      |
| Comments        | ✅ Complete      |
| Search          | ✅ Complete      |
| Filters         | ✅ Complete      |
| Dashboard       | ✅ Complete      |
| Responsive UI   | ✅ Complete      |
| Final UI Polish | ✅ Complete      |
| MVP             | ✅ Complete      |
| Admin Panel     | 🔜 Future Phase |

---

# 👨‍💻 Developer

**Mofassel Hossain Rana**

Built as a practical full-stack development project for learning, experimentation, and portfolio development.

---

## ⭐ Project Goal

> **Learn the fundamentals. Build from scratch. Understand the system. Improve through real projects.**

If you find this project useful, feel free to explore the repository and follow the development journey.
