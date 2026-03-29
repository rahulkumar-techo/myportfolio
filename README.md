# Portfolio Platform

A full-stack developer portfolio with a public site, admin-managed content, and a notifications system for email and web push. Built on the Next.js App Router with TypeScript, MongoDB, and NextAuth.

**Highlights**
- Public portfolio website with rich UI and animated sections
- Admin-managed content for projects, skills, experiences, testimonials, and assets
- Notifications system for email and browser push
- Authenticated admin dashboard and APIs
- Modern component stack with Tailwind, Framer Motion, and Radix UI

**Notification System Overview**
- Users can subscribe by email and confirm via tokenized link
- Users can enable browser push notifications (Firebase Messaging)
- Admin can manage subscribers and preferences
- A feed API provides the in-site notification center

![notification-diagram.png](/public/notification-diagram.png)

## Tech Stack

**Frontend**
- Next.js 16 (App Router)
- React 19
- TypeScript
- Tailwind CSS v4
- Framer Motion
- Radix UI
- Lucide React
- React Hook Form
- SWR
- Recharts
- Three.js, React Three Fiber, Drei

**Backend**
- Next.js API Routes (App Router)
- NextAuth
- MongoDB, Mongoose
- JSON Web Token (`jsonwebtoken`)
- bcryptjs
- Zod

**Tooling**
- ESLint
- PostCSS
- TypeScript

## Project Structure

```txt
app/
  api/
  admin/
  notifications/
  projects/
components/
hooks/
lib/
model/
repositories/
services/
styles/
utils/
```

## Core Features

- Public pages for projects, skills, assets, blog, and contact
- Admin CRUD for portfolio resources
- Notification Center UI with read/unread state
- Email subscription flow with confirmation
- Browser push notifications via Firebase Messaging
- Admin overview dashboard and metrics
- Profile and settings APIs

## Documentation

- Docs index: `docs/README.md`
- Routes and roles: `docs/ROUTES.md`
- Architecture overview: `docs/ARCHITECTURE.md`
- Notifications deep dive: `docs/NOTIFICATIONS.md`
- Roadmap and upcoming features: `docs/ROADMAP.md`
- API reference: `API.md`

## API Documentation

The API surface is documented in `API.md`.

## Authentication

Two mechanisms currently exist:
- NextAuth session-based auth for protected routes
- Custom JWT login for `/api/login`

If you plan to extend this project, consider unifying auth for simpler maintenance.

## Notifications Architecture

**Key paths**
- Feed: `GET /api/notifications/feed`
- Email subscribe: `POST /api/notifications/subscribe`
- Email confirm: `GET /notifications/confirm?token=...`
- Push token register: `POST /api/notifications/token`
- Preferences: `PUT /api/notifications/preferences`
- Unsubscribe: `POST /api/notifications/unsubscribe`

**Client UI**
- Notification prompt: `components/notifications/notification-prompt.tsx`
- Notification center: `components/notifications/notification-feed.tsx`
- Top nav unread badge: `components/navigation.tsx`

**Backend / Data**
- Notification repository: `repositories/notification-repository.ts`
- Notification models: `model/portfolio.model.ts`
- Email templating: `utils/email-template.ts`
- Email sender: `services/email.service.ts`
- Broadcast utilities: `utils/notify-subscribers.ts`
- Push Service Worker: `public/firebase-messaging-sw.js`

## Getting Started

1. Install dependencies.
2. Configure environment variables.
3. Run the dev server.

```bash
pnpm install
pnpm dev
```

## Environment Variables

Create a `.env` file at the project root.

```env
MONGODB_URI=
NEXTAUTH_SECRET=
NEXTAUTH_URL=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
NEXT_PUBLIC_APP_URL=

# Firebase (Client)
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=
NEXT_PUBLIC_FIREBASE_VAPID_KEY=

# Firebase (Server)
FIREBASE_PROJECT_ID=
FIREBASE_CLIENT_EMAIL=
FIREBASE_PRIVATE_KEY=
```

## Scripts

```bash
pnpm dev
pnpm build
pnpm start
pnpm lint
```

## Deployment Notes

- Ensure `NEXTAUTH_URL` matches the production domain.
- Ensure Firebase Web Push is configured for the production domain.
- Clear any old service workers when updating `firebase-messaging-sw.js`.

## Troubleshooting

**Notifications prompt shows errors**
- Check `NEXT_PUBLIC_FIREBASE_VAPID_KEY`.
- Confirm service worker is registered and active.

**Push notifications fail in production**
- Ensure `firebase-messaging-sw.js` is accessible at the root.
- Verify Firebase config keys are correct.

**Images missing in production**
- Verify `next.config.mjs` remote image domains.
- For SVGs hosted externally, consider `unoptimized` or self-hosting.

## License

Private project.
