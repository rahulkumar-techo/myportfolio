/**
 * @jest-environment node
 */

import { sendEmailsToUsers } from "@/utils/sendEmailsToUsers";
import { processEmailJob } from "@/jobs/email.job";

jest.mock("@/jobs/email.job", () => ({
  processEmailJob: jest.fn(),
}));

const mockedProcessEmailJob = jest.mocked(processEmailJob);

describe("sendEmailsToUsers", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns early when no users are provided", async () => {
    await sendEmailsToUsers([], {
      type: "project",
      title: "Project",
      description: "Description",
      url: "/projects/slug"
    });

    expect(mockedProcessEmailJob).not.toHaveBeenCalled();
  });

  it("calls processEmailJob immediately with defaults", async () => {
    mockedProcessEmailJob.mockResolvedValue({ sent: 1, total: 1 });

    const users = [{ name: "Ada", email: "ada@example.com" }];
    const content = {
      type: "project" as const,
      title: "Project",
      description: "Description",
      url: "/projects/slug"
    };

    await sendEmailsToUsers(users, content);

    expect(mockedProcessEmailJob).toHaveBeenCalledWith({
      users,
      content,
      delayMs: 250,
      retryAttempts: 3,
      retryDelayMs: 500,
      maxDurationMs: undefined,
      unsubscribeUrl: undefined
    });
  });

  it("schedules a background job when fireAndForget is true", async () => {
    jest.useFakeTimers();
    mockedProcessEmailJob.mockResolvedValue({ sent: 1, total: 1 });

    const users = [{ name: "Linus", email: "linus@example.com" }];
    const content = {
      type: "blog" as const,
      title: "Blog",
      description: "Post",
      url: "/blog/new"
    };

    await sendEmailsToUsers(users, content, {
      fireAndForget: true,
      delayMs: 10,
      retryAttempts: 1,
      retryDelayMs: 5,
      maxDurationMs: 1000,
      unsubscribeUrl: "https://example.com/unsubscribe"
    });

    expect(mockedProcessEmailJob).not.toHaveBeenCalled();

    await jest.runAllTimersAsync();

    expect(mockedProcessEmailJob).toHaveBeenCalledWith({
      users,
      content,
      delayMs: 10,
      retryAttempts: 1,
      retryDelayMs: 5,
      maxDurationMs: 1000,
      unsubscribeUrl: "https://example.com/unsubscribe"
    });

    jest.useRealTimers();
  });
});
