# Multi-Tenant Client Portal API

A RESTful backend API for managing clients, projects, and tasks — built with Express.js and PostgreSQL (via Supabase). Designed as a lightweight CRM/project management tool with a clean MVC architecture and plans for multi-tenant support.

## Key Features

- Full CRUD operations for clients, projects, and tasks
- Relational data model with foreign key constraints and cascading deletes
- Query filtering by status, client, project, and completion
- Input validation with foreign key existence checks
- Custom middleware for request logging, error handling, and 404 responses
- Modular MVC architecture (routes, controllers, config, utils)
- Unit testing with Node.js built-in test runner (`node:test`)

## Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** PostgreSQL (Supabase)
- **Testing:** node:test, supertest
- **Dev Tools:** nodemon, dotenv

## Project Structure

```
client-portal-api/
├── src/
│   ├── index.js                # Server entry point
│   ├── app.js                  # Express app setup & middleware
│   ├── config/
│   │   └── supabase.js         # Supabase client initialization
│   ├── controllers/
│   │   ├── clientController.js
│   │   ├── projectsController.js
│   │   └── taskController.js
│   ├── routes/
│   │   ├── clients.js
│   │   ├── projects.js
│   │   └── tasks.js
│   ├── utils/
│   │   ├── logger.js           # Custom logging utility
│   │   └── middleware.js        # Request logger & unknown endpoint handler
│   └── tests/
│       └── logger.test.js      # Logger unit tests
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/clients` | List all clients |
| `POST` | `/api/clients` | Create a new client |
| `GET` | `/api/clients/:id` | Get a single client |
| `PATCH` | `/api/clients/:id` | Update a client |
| `DELETE` | `/api/clients/:id` | Delete a client |
| `GET` | `/api/projects` | List projects (filter by `?client_id=` `&status=`) |
| `POST` | `/api/projects` | Create a new project |
| `GET` | `/api/projects/:id` | Get a single project |
| `PATCH` | `/api/projects/:id` | Update a project |
| `DELETE` | `/api/projects/:id` | Delete a project |
| `GET` | `/api/tasks` | List tasks (filter by `?project_id=` `&done=`) |
| `POST` | `/api/tasks` | Create a new task |
| `GET` | `/api/tasks/:id` | Get a single task |
| `PATCH` | `/api/tasks/:id` | Update a task |
| `DELETE` | `/api/tasks/:id` | Delete a task |

## Database Schema

Three tables with UUID primary keys, timestamps, and indexed foreign keys:

- **clients** — `name`, `email`, `phone`
- **projects** — `name`, `description`, `status` (active / on_hold / completed / cancelled), FK to `clients`
- **tasks** — `title`, `description`, `done`, `due_date`, FK to `projects` (cascade on delete)

## Setup & Usage

1. Clone the repository and install dependencies:

```bash
git clone https://github.com/Amena2026/Multi-tenant-client-portal-API.git
cd Multi-tenant-client-portal-API
npm install
```

2. Create a `.env` file from the example and add your Supabase credentials:

```bash
cp .env.example .env
```

3. Run the development server:

```bash
npm run dev
```

4. Run tests:

```bash
npm test
```

The API will be available at `http://localhost:3001`.

## Roadmap

- [x] Express server with middleware pipeline
- [x] Supabase/PostgreSQL integration
- [x] Full CRUD for clients, projects, and tasks
- [x] Query filtering and relational data fetching
- [x] Custom request logging and error handling
- [x] Unit testing setup
- [ ] JWT authentication via Supabase Auth
- [ ] Multi-tenancy with org_id filtering and Row Level Security
- [ ] Pagination and search
- [ ] Deployment (Railway / Render)

**Author:** Developed by Amena2026, a Computer Science student at the University of Delaware.
