/**
 * @jest-environment node
 */

import { notifySubscribers } from "@/utils/notify-subscribers";
import { sendEmailsToUsers } from "@/utils/sendEmailsToUsers";
import { getFirebaseAdminMessaging } from "@/lib/firebase-admin";
import {
  createNotificationFeedEntry,
  listEmailSubscribers,
  listPushTokens,
  removePushTokens
} from "@/repositories/notification-repository";

jest.mock("@/utils/sendEmailsToUsers", () => ({
  sendEmailsToUsers: jest.fn(),
}));

jest.mock("@/lib/firebase-admin", () => ({
  getFirebaseAdminMessaging: jest.fn(),
}));

jest.mock("@/repositories/notification-repository", () => ({
  createNotificationFeedEntry: jest.fn(),
  listEmailSubscribers: jest.fn(),
  listPushTokens: jest.fn(),
  removePushTokens: jest.fn(),
}));

const mockedSendEmailsToUsers = jest.mocked(sendEmailsToUsers);
const mockedGetFirebaseAdminMessaging = jest.mocked(getFirebaseAdminMessaging);
const mockedCreateNotificationFeedEntry = jest.mocked(createNotificationFeedEntry);
const mockedListEmailSubscribers = jest.mocked(listEmailSubscribers);
const mockedListPushTokens = jest.mocked(listPushTokens);
const mockedRemovePushTokens = jest.mocked(removePushTokens);

describe("notifySubscribers", () => {
  const originalAppUrl = process.env.NEXT_PUBLIC_APP_URL;

  beforeEach(() => {
    jest.clearAllMocks();
    mockedCreateNotificationFeedEntry.mockResolvedValue({} as any);
  });

  afterEach(() => {
    process.env.NEXT_PUBLIC_APP_URL = originalAppUrl;
  });

  it("sends email notifications and web push, removing invalid tokens", async () => {
    process.env.NEXT_PUBLIC_APP_URL = "https://example.com";

    const subscribers = [
      { name: "Ada", email: "ada@example.com" },
      { name: "Linus", email: "linus@example.com" }
    ];
    const tokens = ["token-1", "token-2", "token-3"];

    mockedListEmailSubscribers.mockResolvedValue(subscribers as any);
    mockedListPushTokens.mockResolvedValue(tokens as any);
    mockedCreateNotificationFeedEntry.mockResolvedValue({} as any);

    const sendEachForMulticast = jest.fn().mockResolvedValue({
      responses: [
        { success: true },
        { success: false },
        { success: false }
      ]
    });
    mockedGetFirebaseAdminMessaging.mockReturnValue({
      sendEachForMulticast
    } as any);

    const payload = {
      type: "project" as const,
      title: "New Project",
      description: "Shipped something cool.",
      url: "/projects/new"
    };

    await notifySubscribers(payload);

    expect(mockedListEmailSubscribers).toHaveBeenCalledWith("projects");
    expect(mockedListPushTokens).toHaveBeenCalledWith("projects");
    expect(mockedCreateNotificationFeedEntry).toHaveBeenCalledWith({
      type: "project",
      title: payload.title,
      description: payload.description,
      url: payload.url
    });
    expect(mockedSendEmailsToUsers).toHaveBeenCalledWith(
      subscribers,
      payload,
      expect.objectContaining({
        fireAndForget: true,
        delayMs: 200,
        retryAttempts: 2,
        retryDelayMs: 400,
        unsubscribeUrl: "https://example.com/api/notifications/unsubscribe"
      })
    );
    expect(sendEachForMulticast).toHaveBeenCalledWith({
      tokens,
      notification: {
        title: payload.title,
        body: payload.description
      },
      data: {
        url: payload.url,
        type: payload.type
      }
    });
    expect(mockedRemovePushTokens).toHaveBeenCalledWith(["token-2", "token-3"]);
  });

  it("skips messaging when there are no subscribers or tokens", async () => {
    mockedListEmailSubscribers.mockResolvedValue([]);
    mockedListPushTokens.mockResolvedValue([]);

    await notifySubscribers({
      type: "blog",
      title: "New Blog",
      description: "Fresh thoughts.",
      url: "/blog/new"
    });

    expect(mockedSendEmailsToUsers).not.toHaveBeenCalled();
    expect(mockedGetFirebaseAdminMessaging).not.toHaveBeenCalled();
    expect(mockedRemovePushTokens).not.toHaveBeenCalled();
  });
});
