/**
 * @jest-environment node
 */

import { processEmailJob } from "@/jobs/email.job";
import { sendNotificationMail } from "@/services/email.service";

jest.mock("@/services/email.service", () => ({
  sendNotificationMail: jest.fn(),
}));

const mockedSendNotificationMail = jest.mocked(sendNotificationMail);

describe("processEmailJob", () => {
  let logSpy: jest.SpyInstance
  let warnSpy: jest.SpyInstance

  beforeEach(() => {
    jest.clearAllMocks();
    logSpy = jest.spyOn(console, "log").mockImplementation(() => {});
    warnSpy = jest.spyOn(console, "warn").mockImplementation(() => {});
  });

  afterEach(() => {
    logSpy.mockRestore();
    warnSpy.mockRestore();
  });

  it("throws on invalid payload", async () => {
    await expect(processEmailJob(undefined as any)).rejects.toThrow(
      "Invalid email job payload"
    );
  });

  it("sends emails for valid users and skips invalid users", async () => {
    mockedSendNotificationMail.mockResolvedValue({} as any);

    const result = await processEmailJob({
      users: [
        { name: "A", email: "a@example.com" },
        { name: "MissingEmail", email: "" },
        { name: "B", email: "b@example.com" },
        { name: "", email: "c@example.com" },
      ],
      content: { type: "project", title: "Project", description: "Desc", url: "/projects/p1" },
      delayMs: 0,
      retryAttempts: 1,
      retryDelayMs: 0,
    });

    expect(mockedSendNotificationMail).toHaveBeenCalledTimes(2);
    expect(mockedSendNotificationMail).toHaveBeenCalledWith(
      expect.objectContaining({
        content: expect.objectContaining({ url: "/projects/p1" }),
      })
    );
    expect(result).toEqual({ sent: 2, total: 4 });
  });

  it("retries when sendNotificationMail fails", async () => {
    jest.useFakeTimers();
    mockedSendNotificationMail
      .mockRejectedValueOnce(new Error("temporary"))
      .mockResolvedValueOnce({} as any);

    const jobPromise = processEmailJob({
      users: [{ name: "A", email: "a@example.com" }],
      content: { type: "project", title: "Project", description: "Desc", url: "/projects/slug" },
      delayMs: 0,
      retryAttempts: 2,
      retryDelayMs: 1,
    });

    await jest.runAllTimersAsync();
    const result = await jobPromise;

    expect(mockedSendNotificationMail).toHaveBeenCalledTimes(2);
    expect(result).toEqual({ sent: 1, total: 1 });
    jest.useRealTimers();
  });

  it("stops gracefully when maxDurationMs is exceeded", async () => {
    const nowSpy = jest
      .spyOn(Date, "now")
      .mockReturnValueOnce(0)
      .mockReturnValueOnce(4)
      .mockReturnValueOnce(10)
      .mockReturnValue(10);

    mockedSendNotificationMail.mockResolvedValue({} as any);

    const result = await processEmailJob({
      users: [
        { name: "A", email: "a@example.com" },
        { name: "B", email: "b@example.com" },
      ],
      content: { type: "project", title: "Project", description: "Desc", url: "/projects/slug" },
      delayMs: 0,
      retryAttempts: 1,
      retryDelayMs: 0,
      maxDurationMs: 5,
    });

    expect(mockedSendNotificationMail).toHaveBeenCalledTimes(1);
    expect(result).toEqual({ sent: 1, total: 2 });
    nowSpy.mockRestore();
  });
});
