# API Documentation

Base URL: `/api`

This project exposes authentication, portfolio content, admin management, messaging, and site settings endpoints.

## Authentication

Authentication in this project is currently split into two mechanisms:

- `NextAuth` session-based auth for protected admin/user routes
- Custom JWT login at `/api/login`

Protected routes commonly use:

- `requireAdminApiSession()`
- `requireVerifiedGoogleUserSession()`

## Response Conventions

Most endpoints return:

```json
{
  "success": true,
  "data": {}
}
```

Some routes currently return inconsistent shapes such as raw objects, `{ error }`, or `{ message }`.

## Endpoints

### Auth

#### `GET|POST /api/auth/[...nextauth]`
Handles NextAuth authentication.

Auth: Public

#### `POST /api/login`
Login with email and password.

Auth: Public

Request body:

```json
{
  "email": "user@example.com",
  "password": "your-password"
}
```

Success response:

```json
{
  "message": "Login successful",
  "token": "jwt-token"
}
```

Error responses:

- `401` Invalid credentials
- `401` Invalid password

#### `POST /api/register`
Create a user account.

Auth:

- Public for first admin bootstrap
- Admin session required after an admin already exists

Request body:

```json
{
  "name": "Rahul",
  "email": "user@example.com",
  "password": "strongpassword",
  "role": "admin"
}
```

Rules:

- `name`, `email`, `password` are required
- password must be at least 8 characters
- `role` must be `admin` or `user`
- if no admin exists, first registered user becomes `admin`

Success response:

```json
{
  "message": "User created",
  "user": {
    "id": "mongo-id",
    "name": "Rahul",
    "email": "user@example.com",
    "role": "admin"
  }
}
```

Error responses:

- `400` Missing required fields
- `400` Password too short
- `409` User already exists

### Settings

#### `GET /api/settings`
Get public site settings.

Auth: Public

Success response:

```json
{
  "success": true,
  "data": {}
}
```

#### `GET /api/admin/settings`
Get current admin user settings.

Auth: Admin session required

Success response:

```json
{
  "success": true,
  "data": {}
}
```

#### `PUT /api/admin/settings`
Update current admin user settings.

Auth: Admin session required

Request body:

```json
{
  "theme": "dark",
  "notifications": true
}
```

Success response:

```json
{
  "success": true,
  "data": {}
}
```

### Profile

#### `GET /api/profile`
Get admin dashboard/profile summary.

Auth: Admin session required

Success response:

```json
{
  "success": true,
  "data": {
    "profile": {
      "name": "Rahul",
      "email": "user@example.com",
      "image": "https://..."
    },
    "stats": {
      "totalProjects": 0,
      "featuredProjects": 0,
      "totalSkills": 0,
      "yearsExperience": 0,
      "testimonials": 0
    },
    "skills": {
      "total": 0,
      "byCategory": {},
      "averageProficiency": 0
    }
  },
  "meta": {
    "version": "1.0.0",
    "lastUpdated": "2026-03-07T00:00:00.000Z"
  }
}
```

### Projects

#### `GET /api/projects`
List all projects.

Auth: Public

Success response:

```json
{
  "success": true,
  "data": [],
  "meta": {
    "total": 0,
    "timestamp": "2026-03-07T00:00:00.000Z"
  }
}
```

#### `POST /api/projects`
Create a new project.

Auth: Admin session required

Required fields:

- `title`
- `description`
- `category`

Request body:

```json
{
  "title": "Portfolio",
  "description": "Personal portfolio site",
  "longDescription": "Detailed project description",
  "techStack": ["Next.js", "MongoDB"],
  "imageUrl": "/images/project.png",
  "galleryImages": [],
  "liveUrl": "https://example.com",
  "githubUrl": "https://github.com/example/repo",
  "featured": true,
  "category": "Web"
}
```

Success response:

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "title": "Portfolio"
  }
}
```

Error responses:

- `400` Missing required field
- `400` Invalid request body

#### `GET /api/projects/{id}`
Get project by ID.

Auth: Public

Success response:

```json
{
  "success": true,
  "data": {}
}
```

Error responses:

- `404` Project not found

#### `PUT /api/projects/{id}`
Update project by ID.

Auth: Admin session required

Success response:

```json
{
  "success": true,
  "data": {}
}
```

Error responses:

- `400` Invalid request body
- `404` Project not found

#### `DELETE /api/projects/{id}`
Delete project by ID.

Auth: Admin session required

Success response:

```json
{
  "success": true,
  "message": "Project {id} deleted successfully"
}
```

Error responses:

- `404` Project not found

### Skills

#### `GET /api/skills`
List skills. Supports category filtering.

Auth: Public

Query parameters:

- `category`

Success response:

```json
{
  "success": true,
  "data": [],
  "grouped": {
    "Frontend": []
  },
  "meta": {
    "total": 0,
    "categories": ["Frontend"]
  }
}
```

#### `POST /api/skills`
Create a new skill.

Auth: Admin session required

Request body:

```json
{
  "name": "TypeScript",
  "category": "Frontend",
  "proficiency": 90,
  "icon": "typescript"
}
```

Success response:

```json
{
  "success": true,
  "data": {}
}
```

Error responses:

- `400` Invalid request body

#### `GET /api/skills/{id}`
Get skill by ID.

Auth: Public

Error responses:

- `404` Skill not found

#### `PUT /api/skills/{id}`
Update skill by ID.

Auth: Admin session required

Error responses:

- `400` Invalid request body
- `404` Skill not found

#### `DELETE /api/skills/{id}`
Delete skill by ID.

Auth: Admin session required

Success response:

```json
{
  "success": true,
  "message": "Skill {id} deleted successfully"
}
```

### Experience

#### `GET /api/experience`
List experiences sorted by `startDate` descending.

Auth: Public

Success response:

```json
{
  "success": true,
  "data": [],
  "meta": {
    "total": 0,
    "currentPosition": {}
  }
}
```

#### `POST /api/experience`
Create a new experience entry.

Auth: Admin session required

Request body:

```json
{
  "title": "Software Engineer",
  "company": "Example Inc",
  "companyUrl": "https://example.com",
  "location": "Remote",
  "startDate": "2024-01-01",
  "endDate": "",
  "current": true,
  "description": "Worked on core platform",
  "achievements": [],
  "technologies": ["Next.js", "MongoDB"]
}
```

Success response:

```json
{
  "success": true,
  "data": {}
}
```

#### `GET /api/experience/{id}`
Get experience by ID.

Auth: Public

Success response:

```json
{
  "id": "uuid",
  "title": "Software Engineer"
}
```

Error responses:

- `404` Experience not found

#### `PUT /api/experience/{id}`
Update experience by ID.

Auth: Admin session required

Success response:

```json
{
  "id": "uuid",
  "title": "Updated title"
}
```

Error responses:

- `404` Experience not found

#### `DELETE /api/experience/{id}`
Delete experience by ID.

Auth: Admin session required

Success response:

```json
{
  "success": true
}
```

### Testimonials

#### `GET /api/testimonials`
List all testimonials.

Auth: Public

Success response:

```json
{
  "success": true,
  "data": [],
  "meta": {
    "total": 0,
    "timestamp": "2026-03-07T00:00:00.000Z"
  }
}
```

#### `POST /api/testimonials`
Submit a testimonial.

Auth: Verified Google user required

Required fields:

- `role`
- `company`
- `content`

Rules:

- one testimonial per authenticated email

Request body:

```json
{
  "role": "Manager",
  "company": "Example Inc",
  "content": "Great to work with",
  "rating": 5
}
```

Success response:

```json
{
  "success": true,
  "data": {}
}
```

Error responses:

- `400` Missing required field
- `409` Already submitted
- `400` Invalid request body

#### `GET /api/testimonials/{id}`
Get testimonial by ID.

Auth: Public

Error responses:

- `404` Testimonial not found

#### `PUT /api/testimonials/{id}`
Update testimonial by ID.

Auth: Admin session required

Error responses:

- `400` Invalid request body
- `404` Testimonial not found

#### `DELETE /api/testimonials/{id}`
Delete testimonial by ID.

Auth: Admin session required

Success response:

```json
{
  "success": true,
  "message": "Testimonial {id} deleted successfully"
}
```

### Messages

#### `GET /api/messages`
List non-archived messages for the current admin.

Auth: Admin session required

Success response:

```json
{
  "success": true,
  "data": [],
  "meta": {
    "total": 0,
    "unread": 0
  }
}
```

#### `POST /api/messages`
Create a contact message.

Auth: Public

Request body:

```json
{
  "name": "Visitor",
  "email": "visitor@example.com",
  "subject": "Hello",
  "message": "Interested in working together"
}
```

Success response:

```json
{
  "success": true,
  "data": {}
}
```

#### `GET /api/messages/{id}`
Get message by ID.

Auth: Admin session required

Error responses:

- `404` Message not found

#### `PUT /api/messages/{id}`
Update message by ID.

Auth: Admin session required

Error responses:

- `404` Message not found

#### `DELETE /api/messages/{id}`
Delete message by ID.

Auth: Admin session required

Success response:

```json
{
  "success": true
}
```

### Contact

#### `POST /api/contact`
Submit a contact message.

Auth: Verified Google user required

Required fields:

- `name`
- `email`
- `subject`
- `message`

Rules:

- one message per authenticated email

Request body:

```json
{
  "name": "Rahul",
  "email": "user@example.com",
  "subject": "Need collaboration",
  "message": "Let's work together"
}
```

Success response:

```json
{
  "success": true,
  "message": "Message received successfully! I will get back to you soon.",
  "data": {
    "id": "uuid",
    "receivedAt": "2026-03-07T00:00:00.000Z"
  }
}
```

Error responses:

- `400` Missing required field
- `409` Already sent
- `400` Invalid request body

## Current API Notes

### Inconsistencies

- `/api/login` uses JWT while most protected routes use session auth
- some item routes return raw objects instead of `{ success, data }`
- validation is inconsistent
- `/api/contact` and `/api/messages` overlap in purpose

### Recommended Improvements

- standardize all response shapes
- add Zod validation to every `POST` and `PUT` route
- unify auth strategy
- add rate limiting for public submission endpoints
- add OpenAPI or Swagger generation later if needed
