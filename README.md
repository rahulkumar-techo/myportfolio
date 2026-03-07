# Portfolio

A modern full-stack developer portfolio built with Next.js, TypeScript, MongoDB, and NextAuth. It combines a public-facing portfolio website with an admin-managed content API for projects, skills, testimonials, messages, and settings.

## Overview

This project is more than a static portfolio. It includes:

- a public portfolio website
- project showcase pages
- contact and testimonial submission APIs
- admin-protected content management routes
- user registration and authentication
- settings and profile APIs for portfolio management

The application currently uses both static frontend data and database-backed API routes, which makes it suitable as a portfolio evolving toward a lightweight CMS.

## Tech Stack

### Frontend

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS v4
- Framer Motion
- Radix UI
- Lucide React
- React Hook Form
- SWR
- Recharts
- Three.js
- React Three Fiber
- Drei

### Backend

- Next.js App Router API routes
- NextAuth
- JSON Web Token (`jsonwebtoken`)
- MongoDB
- Mongoose
- bcryptjs
- Zod

### Tooling

- ESLint
- PostCSS
- TypeScript

## Features

- public portfolio pages
- project listing and project detail pages
- skills, experience, and testimonial APIs
- admin CRUD for portfolio resources
- public messages/contact submission
- protected admin settings endpoint
- authenticated profile overview endpoint
- Google-session gated submission flows for testimonials and contact

## Project Structure

```txt
app/
  api/
    admin/settings/
    auth/[...nextauth]/
    contact/
    experience/
    login/
    messages/
    profile/
    projects/
    register/
    settings/
    skills/
    testimonials/
  projects/
components/
hooks/
lib/
model/
repositories/
```

## API Modules

The main API groups are:

- `auth`: login, register, next-auth
- `projects`: list, create, update, delete projects
- `skills`: list, filter, create, update, delete skills
- `experience`: manage experience history
- `testimonials`: public listing and controlled submission
- `messages`: public message submission and admin inbox
- `settings`: public and admin settings
- `profile`: admin dashboard summary

For endpoint details, see [API.md](./API.md).

## Authentication

This project currently uses two auth approaches:

- `NextAuth` session-based auth for protected routes
- custom JWT login for `/api/login`

That split works technically only if both are intentionally supported, but in most cases it should be unified to reduce complexity.

## Data Layer

The app uses:

- `Mongoose` for database access
- repository helpers for portfolio items and users
- likely collections for:
  - users
  - projects
  - skills
  - experiences
  - testimonials
  - contact messages
  - settings

## UI and UX Libraries

The frontend uses a strong component and animation stack:

- Radix UI for accessible primitives
- Framer Motion for animation
- Tailwind CSS for styling
- Lucide React for icons
- Three.js ecosystem for 3D or motion-rich sections

## Scripts

```bash
npm run dev
npm run build
npm run start
npm run lint
```

## Installation

```bash
npm install
npm run dev
```

Open `http://localhost:3000`

## Environment Variables

This project likely needs environment variables for:

```env
MONGODB_URI=
NEXTAUTH_SECRET=
NEXTAUTH_URL=
JWT_SECRET=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
```

Add any other variables required by your auth and database setup.

## Current Architecture Notes

The code suggests two parallel content sources:

- frontend pages like `app/projects` read from static data in `lib/data`
- API routes use repository/database storage

This means admin API updates may not yet automatically appear in all frontend pages until the UI is fully switched to database-driven fetching.

## Known Improvement Areas

- unify authentication strategy
- standardize API responses
- add schema validation with Zod everywhere
- add automated tests
- add CI/CD workflows
- add Docker support
- connect frontend pages fully to API-backed content

## Why This Project Is Useful

This portfolio can serve as:

- a personal developer portfolio
- a lightweight portfolio CMS
- a starter for a creator/admin dashboard
- a base for adding CI/CD, Docker, and deployment workflows

## Next Recommended Additions

- `API.md` for route documentation
- test setup with unit and API tests
- GitHub Actions CI pipeline
- Dockerfile and Docker Compose
- Telegram notifications for workflow status or contact events
- deployment workflow to container registry

## License

Private project.
