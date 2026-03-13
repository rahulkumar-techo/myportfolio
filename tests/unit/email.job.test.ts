/**
 * @jest-environment node
 */

import { processEmailJob } from "@/jobs/email.job";
import { sendProjectMail } from "@/services/email.service";

jest.mock("@/services/email.service", () => ({
  sendProjectMail: jest.fn(),
}));

const mockedSendProjectMail = jest.mocked(sendProjectMail);

describe("processEmailJob", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("throws on invalid payload", async () => {
    await expect(processEmailJob(undefined as any)).rejects.toThrow(
      "Invalid email job payload"
    );
  });

  it("sends emails for valid users and skips invalid users", async () => {
    mockedSendProjectMail.mockResolvedValue({} as any);

    const result = await processEmailJob({
      users: [
        { name: "A", email: "a@example.com" },
        { name: "MissingEmail", email: "" },
        { name: "B", email: "b@example.com" },
        { name: "", email: "c@example.com" },
      ],
      project: { title: "Project", description: "Desc", id: "p1" },
      delayMs: 0,
      retryAttempts: 1,
      retryDelayMs: 0,
    });

    expect(mockedSendProjectMail).toHaveBeenCalledTimes(2);
    expect(mockedSendProjectMail).toHaveBeenCalledWith(
      expect.objectContaining({
        project: expect.objectContaining({ slug: "p1" }),
      })
    );
    expect(result).toEqual({ sent: 2, total: 4 });
  });

  it("retries when sendProjectMail fails", async () => {
    jest.useFakeTimers();
    mockedSendProjectMail
      .mockRejectedValueOnce(new Error("temporary"))
      .mockResolvedValueOnce({} as any);

    const jobPromise = processEmailJob({
      users: [{ name: "A", email: "a@example.com" }],
      project: { title: "Project", description: "Desc", slug: "slug" },
      delayMs: 0,
      retryAttempts: 2,
      retryDelayMs: 1,
    });

    await jest.runAllTimersAsync();
    const result = await jobPromise;

    expect(mockedSendProjectMail).toHaveBeenCalledTimes(2);
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

    mockedSendProjectMail.mockResolvedValue({} as any);

    const result = await processEmailJob({
      users: [
        { name: "A", email: "a@example.com" },
        { name: "B", email: "b@example.com" },
      ],
      project: { title: "Project", description: "Desc", slug: "slug" },
      delayMs: 0,
      retryAttempts: 1,
      retryDelayMs: 0,
      maxDurationMs: 5,
    });

    expect(mockedSendProjectMail).toHaveBeenCalledTimes(1);
    expect(result).toEqual({ sent: 1, total: 2 });
    nowSpy.mockRestore();
  });
});
