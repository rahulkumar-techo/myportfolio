# Notifications System

This project supports two notification channels: email and browser push. It also includes a notification feed shown inside the site.

## Core Flows

### Email Subscribe + Confirm

1. User submits email from the notification prompt.
2. `/api/notifications/subscribe` creates or updates a pending subscriber.
3. A confirmation email is sent with a tokenized link.
4. User clicks `/notifications/confirm?token=...` to verify.
5. Subscriber status is set to `subscribed`.

### Push Notifications

1. User enables notifications in the prompt.
2. Service worker `public/firebase-messaging-sw.js` registers.
3. Client requests a Firebase token via `getToken`.
4. Token is stored through `/api/notifications/token`.

### Notification Feed

1. Server logs entries via `repositories/notification-repository.ts`.
2. `/api/notifications/feed` returns the latest entries.
3. UI renders `components/notifications/notification-feed.tsx`.
4. Read/unread state is stored in `localStorage` via `lib/notifications.ts`.

## Key Files and Roles

- `components/notifications/notification-prompt.tsx` - UI for email/push opt-in.
- `components/notifications/notification-feed.tsx` - Notification Center UI with tabs and read state.
- `components/notifications/manage-notifications.tsx` - Admin-facing preference management.
- `components/navigation.tsx` - Shows unread badge in the top nav.
- `public/firebase-messaging-sw.js` - Firebase messaging service worker.
- `lib/firebase.ts` - Client Firebase init and messaging helpers.
- `lib/notifications.ts` - Read/unread state helpers.
- `repositories/notification-repository.ts` - DB access for subscribers, tokens, and feed.
- `utils/email-template.ts` - HTML template for outgoing emails.
- `services/email.service.ts` - Email transport abstraction.
- `utils/notify-subscribers.ts` - Broadcast utility for notifying subscribers.

## Data Stored

- Email subscribers: address, status, preferences, verification token/expiry.
- Push tokens: token, preferences, user agent.
- Feed entries: type, title, description, URL, created date.

## Failure Handling

- Missing notification support results in client-side errors shown in the prompt.
- Service worker registration errors prevent push token creation.
- Feed failures are ignored in the nav to avoid blocking page load.
