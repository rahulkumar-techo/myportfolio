/**
 * @jest-environment node
 */

let capturedProcessor: ((job: any) => Promise<any>) | null = null;
const onMock = jest.fn();
const workerMock = jest.fn().mockImplementation((_name: string, processor: any, _opts: any) => {
  capturedProcessor = processor;
  return { on: onMock };
});

const sendEmailsToUsersMock = jest.fn().mockResolvedValue(undefined);
const sendProjectMailMock = jest.fn().mockResolvedValue(undefined);
const findNonAdminUsersMock = jest.fn().mockResolvedValue([]);

jest.mock("bullmq", () => ({
  Worker: workerMock,
}));

jest.mock("@/lib/redis", () => ({
  redisConnection: {},
}));

jest.mock("@/utils/sendEmailsToUsers", () => ({
  sendEmailsToUsers: sendEmailsToUsersMock,
}));

jest.mock("@/services/email.service", () => ({
  sendProjectMail: sendProjectMailMock,
}));

jest.mock("@/repositories/user-repository", () => ({
  findNonAdminUsers: findNonAdminUsersMock,
}));

describe("lib/worker", () => {
  beforeEach(() => {
    jest.resetModules();
    jest.clearAllMocks();
    capturedProcessor = null;
  });

  it("processes a job and sends email to a single user", async () => {
    await import("@/lib/worker");

    expect(workerMock).toHaveBeenCalledWith(
      "email-queue",
      expect.any(Function),
      expect.any(Object)
    );

    expect(capturedProcessor).toBeTruthy();

    const job = {
      data: {
        user: { name: "A", email: "a@example.com", image: "img" },
        project: { title: "P", description: "D", slug: "p1" },
      },
    };

    await capturedProcessor!(job);

    expect(sendProjectMailMock).toHaveBeenCalledWith({
      user: job.data.user,
      project: job.data.project
    });
  });

  it("processes a project-only job and sends to all users", async () => {
    findNonAdminUsersMock.mockResolvedValueOnce([
      { name: "A", email: "a@example.com" },
      { name: "B", email: "b@example.com" }
    ]);

    await import("@/lib/worker");

    const job = {
      data: {
        project: { title: "P", description: "D", slug: "p1" },
      },
    };

    await capturedProcessor!(job);

    expect(findNonAdminUsersMock).toHaveBeenCalled();
    expect(sendEmailsToUsersMock).toHaveBeenCalledWith(
      [
        { name: "A", email: "a@example.com" },
        { name: "B", email: "b@example.com" }
      ],
      job.data.project
    );
  });

  it("registers worker event handlers", async () => {
    await import("@/lib/worker");

    expect(onMock).toHaveBeenCalledWith("failed", expect.any(Function));
    expect(onMock).toHaveBeenCalledWith("completed", expect.any(Function));
  });
});
