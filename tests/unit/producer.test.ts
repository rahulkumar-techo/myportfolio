/**
 * @jest-environment node
 */

let addBulkMock: jest.Mock;
let queueMock: jest.Mock;

jest.mock("bullmq", () => {
  addBulkMock = jest.fn();
  queueMock = jest.fn().mockImplementation(() => ({
    addBulk: addBulkMock,
  }));

  return { Queue: queueMock };
});

jest.mock("@/lib/redis", () => ({
  getRedisConnection: jest.fn(() => ({})),
}));

describe("lib/producer addJobs", () => {
  async function load() {
    const mod = await import("@/lib/producer");
    return mod.addEmailJobs;
  }

  beforeEach(() => {
    jest.resetModules();
    jest.clearAllMocks();
  });

  it("returns empty array when users are missing", async () => {
    const addJobs = await load();
    const result = await addJobs([], { title: "t", description: "d", id: "1" });

    expect(result).toEqual([]);
    expect(addBulkMock).not.toHaveBeenCalled();
  });

  it("adds one job per valid user", async () => {
    const users = [
      { name: "Valid", email: "valid@example.com", image: "img" },
      { name: "NoEmail" },
    ];

    const project = { title: "P", description: "D", id: "p1" };

    const addJobs = await load();
    addBulkMock.mockResolvedValueOnce([{ id: "job-1" }]);
    const result = await addJobs(users as any[], project as any);

    expect(queueMock).toHaveBeenCalledWith("email-queue", expect.any(Object));
    expect(addBulkMock).toHaveBeenCalledTimes(1);
    expect(addBulkMock).toHaveBeenCalledWith([
      {
        name: "send-email",
        data: {
          user: { name: "Valid", email: "valid@example.com", image: "img" },
          project: { title: "P", description: "D", id: "p1" },
        },
      },
      {
        name: "send-email",
        data: {
          user: { name: "NoEmail" },
          project: { title: "P", description: "D", id: "p1" },
        },
      },
    ]);
    expect(result).toEqual([{ id: "job-1" }]);
  });
});
