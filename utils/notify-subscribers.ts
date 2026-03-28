import { sendEmailsToUsers } from "@/utils/sendEmailsToUsers";
import { getFirebaseAdminMessaging } from "@/lib/firebase-admin";
import {
  createNotificationFeedEntry,
  listEmailSubscribers,
  listPushTokens,
  removePushTokens
} from "@/repositories/notification-repository";

type NotificationType = "project" | "blog" | "asset";

type NotificationPayload = {
  type: NotificationType;
  title: string;
  description: string;
  url: string;
};

function toPreferenceKey(type: NotificationType) {
  switch (type) {
    case "blog":
      return "blogs";
    case "asset":
      return "assets";
    default:
      return "projects";
  }
}

export async function notifySubscribers(payload: NotificationPayload) {
  try {
    const preferenceKey = toPreferenceKey(payload.type);

    try {
      await createNotificationFeedEntry({
        type: payload.type,
        title: payload.title,
        description: payload.description,
        url: payload.url
      });
    } catch (error) {
      console.error("Failed to log notification feed entry", error);
    }

    const [emailSubscribers, pushTokens] = await Promise.all([
      listEmailSubscribers(preferenceKey),
      listPushTokens(preferenceKey)
    ]);

    if (emailSubscribers.length > 0) {
      const unsubscribeUrlBase = process.env.NEXT_PUBLIC_APP_URL || "";
      const unsubscribeUrl = unsubscribeUrlBase
        ? `${unsubscribeUrlBase}/api/notifications/unsubscribe`
        : undefined;

      await sendEmailsToUsers(emailSubscribers, payload, {
        fireAndForget: true,
        delayMs: 200,
        retryAttempts: 2,
        retryDelayMs: 400,
        unsubscribeUrl
      });
    }

    if (pushTokens.length === 0) {
      return;
    }

    const messaging = getFirebaseAdminMessaging();
    const response = await messaging.sendEachForMulticast({
      tokens: pushTokens,
      notification: {
        title: payload.title,
        body: payload.description
      },
      data: {
        url: payload.url,
        type: payload.type
      }
    });

    const invalidTokens = response.responses
      .map((result, index) => ({ result, token: pushTokens[index] }))
      .filter(({ result }) => !result.success)
      .map(({ token }) => token);

    if (invalidTokens.length > 0) {
      await removePushTokens(invalidTokens);
    }
  } catch (error) {
    console.error("Notification delivery failed", error);
  }
}
