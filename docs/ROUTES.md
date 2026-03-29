# Routes Reference

This document lists every route in the project, along with its role and how it works at a high level.

## Public Pages

All public pages are App Router routes under `app/`. Pages render server components by default and can include client components for interactive sections.

- `/` - `app/page.tsx` - Home page with hero, skills, projects, assets, and testimonials sections.
- `/about` - `app/about/page.tsx` - About page with personal background and highlights.
- `/assets` - `app/assets/page.tsx` - Public assets showcase.
- `/blog` - `app/blog/page.tsx` - Blog index/listing.
- `/blog/[slug]` - `app/blog/[slug]/page.tsx` - Blog detail page using a dynamic slug.
- `/case-studies` - `app/case-studies/page.tsx` - Case studies listing.
- `/contact` - `app/contact/page.tsx` - Contact page with public message submission.
- `/experience` - `app/experience/page.tsx` - Experience timeline.
- `/github` - `app/github/page.tsx` - GitHub highlight page.
- `/notifications` - `app/notifications/page.tsx` - Notification Center UI using the feed.
- `/notifications/confirm` - `app/notifications/confirm/page.tsx` - Email confirm landing page for subscriptions.
- `/projects` - `app/projects/page.tsx` - Projects listing.
- `/projects/[id]` - `app/projects/[id]/page.tsx` - Project detail page using a dynamic id.

## Admin Pages

Admin pages live under `app/admin/` and are typically gated by auth. These pages provide CRUD UIs for the portfolio.

- `/admin` - `app/admin/page.tsx` - Admin dashboard summary.
- `/admin/assets` - `app/admin/assets/page.tsx` - Manage assets.
- `/admin/blogs` - `app/admin/blogs/page.tsx` - Manage blog posts.
- `/admin/experience` - `app/admin/experience/page.tsx` - Manage experience entries.
- `/admin/login` - `app/admin/login/page.tsx` - Admin login.
- `/admin/messages` - `app/admin/messages/page.tsx` - Contact inbox.
- `/admin/notifications` - `app/admin/notifications/page.tsx` - Manage notifications and subscribers.
- `/admin/projects` - `app/admin/projects/page.tsx` - Manage projects.
- `/admin/register` - `app/admin/register/page.tsx` - Admin registration.
- `/admin/settings` - `app/admin/settings/page.tsx` - Site settings.
- `/admin/skills` - `app/admin/skills/page.tsx` - Manage skills.
- `/admin/storage` - `app/admin/storage/page.tsx` - Storage and uploads.
- `/admin/testimonials` - `app/admin/testimonials/page.tsx` - Manage testimonials.

## API Routes

API routes are implemented with App Router handlers under `app/api/**/route.ts`. Responses are JSON and typically backed by repositories and Mongoose models.

### Auth and Identity

- `/api/auth/[...nextauth]` - NextAuth handler.
- `/api/login` - Custom login flow (JWT).
- `/api/register` - User registration.

### Portfolio Content

- `/api/projects` - Projects collection (listing and write actions depending on method).
- `/api/projects/[id]` - Project detail (single-item read/write actions).
- `/api/projects/upload` - Project media upload.
- `/api/projects/cleanup-temp` - Cleanup temporary uploads.
- `/api/blogs` - Blog collection (listing and write actions depending on method).
- `/api/blogs/[id]` - Blog detail (single-item read/write actions).
- `/api/blogs/upload` - Blog media upload.
- `/api/case-studies` - Case studies collection.
- `/api/assets` - Assets collection (listing and write actions depending on method).
- `/api/assets/[id]` - Asset detail (single-item read/write actions).
- `/api/assets/signature` - Signed upload helper.
- `/api/assets/temp` - Temporary asset storage.
- `/api/assets/cleanup-temp` - Cleanup temporary asset storage.
- `/api/skills` - Skills collection (listing and write actions depending on method).
- `/api/skills/[id]` - Skill detail (single-item read/write actions).
- `/api/experience` - Experience collection (listing and write actions depending on method).
- `/api/experience/[id]` - Experience detail (single-item read/write actions).
- `/api/testimonials` - Testimonials collection (listing and write actions depending on method).
- `/api/testimonials/[id]` - Testimonial detail (single-item read/write actions).

### Public and Settings

- `/api/public/profile` - Public profile payload for the homepage.
- `/api/profile` - Admin dashboard summary payload.
- `/api/settings` - Public settings.
- `/api/admin/settings` - Admin settings update.

### Contact and Messages

- `/api/contact` - Public contact form submission.
- `/api/messages` - Admin inbox listing.
- `/api/messages/[id]` - Individual message actions.

### Notifications

- `/api/notifications/feed` - Notification feed entries for the site.
- `/api/notifications/subscribe` - Email subscription request.
- `/api/notifications/confirm` - Verify email subscription token.
- `/api/notifications/unsubscribe` - Remove email subscription.
- `/api/notifications/preferences` - Update subscription preferences.
- `/api/notifications/token` - Register push notification token.
- `/api/notifications/admin` - Admin view of subscribers and tokens.

### Admin Utilities

- `/api/admin/analytics` - Admin analytics summary.
- `/api/admin/users` - Admin user list.
- `/api/admin/users/[id]` - Manage a single user.

### Other

- `/api/activity` - Activity feed or event logging.
- `/api/collections` - Collection metadata helper.
- `/api/storage` - Storage utilities.

## Notes

For exact request/response payloads, refer to `API.md` and the `route.ts` implementations in `app/api/`.
