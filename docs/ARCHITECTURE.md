# Architecture Overview

This document explains the major layers of the system and how requests move through the app.

## High-Level Layers

- **UI Layer**: App Router pages in `app/` render the public site and admin dashboards.
- **Client Logic**: Hooks in `hooks/` and client components in `components/` manage interactions, forms, and UI state.
- **API Layer**: Next.js route handlers in `app/api/**/route.ts` provide JSON endpoints.
- **Repositories**: Data access helpers in `repositories/` keep database logic centralized.
- **Models**: Mongoose schemas and models live in `model/`.
- **Services & Utils**: Shared business logic in `services/` and `utils/`.

## Request Flow (Public Pages)

1. A user visits a page under `app/`.
2. The page renders server components and may include client components.
3. Client components fetch data from `/api/*` using Axios or SWR.
4. API routes call repositories which query MongoDB via Mongoose.
5. The UI updates with the fetched content.

## Request Flow (Admin)

1. An admin visits `/admin/*` pages.
2. Auth is checked via NextAuth or JWT-based endpoints.
3. Admin UI calls admin APIs to list/update content.
4. Changes are persisted through repository functions.

## Notifications Subsystem

- Email subscriptions are stored in `NotificationSubscriberModel`.
- Push tokens are stored in `PushSubscriberModel`.
- Notification feed entries are stored in `NotificationLogModel`.
- Client UI reads the feed and stores read/unread state locally in `localStorage`.

Details are documented in `docs/NOTIFICATIONS.md`.

## Data & Storage

- Primary database: MongoDB via Mongoose.
- Asset storage: Cloudinary (based on assets routes and config).
- Notifications: Firebase for web push, email service for outbound mail.

## Environment Configuration

The app uses `.env` for secrets and public keys. Required values are listed in the root `README.md`.
