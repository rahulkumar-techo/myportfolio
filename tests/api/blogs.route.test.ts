/**
 * @jest-environment node
 */

import { NextResponse } from "next/server";
import { GET, POST } from "@/app/api/blogs/route";
import { createPortfolioItem, listPortfolioItems } from "@/repositories/portfolio-repository";
import { requireAdminApiSession } from "@/lib/auth";
import { notifySubscribers } from "@/utils/notify-subscribers";

jest.mock("@/repositories/portfolio-repository", () => ({
  createPortfolioItem: jest.fn(),
  listPortfolioItems: jest.fn()
}));

jest.mock("@/lib/auth", () => ({
  requireAdminApiSession: jest.fn()
}));

jest.mock("@/utils/notify-subscribers", () => ({
  notifySubscribers: jest.fn()
}));

const mockedCreatePortfolioItem = jest.mocked(createPortfolioItem);
const mockedListPortfolioItems = jest.mocked(listPortfolioItems);
const mockedRequireAdminApiSession = jest.mocked(requireAdminApiSession);
const mockedNotifySubscribers = jest.mocked(notifySubscribers);

describe("/api/blogs route", () => {
  const originalAppUrl = process.env.NEXT_PUBLIC_APP_URL;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    process.env.NEXT_PUBLIC_APP_URL = originalAppUrl;
  });

  it("returns all blogs for GET requests", async () => {
    mockedListPortfolioItems.mockResolvedValue([
      { id: "one", title: "Post One" },
      { id: "two", title: "Post Two" }
    ] as any);

    const response = await GET();
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.success).toBe(true);
    expect(body.meta.total).toBe(2);
    expect(body.data[0].title).toBe("Post One");
    expect(mockedListPortfolioItems).toHaveBeenCalledWith("blogs");
  });

  it("rejects POST requests when the admin session is missing", async () => {
    mockedRequireAdminApiSession.mockResolvedValue({
      session: null,
      response: NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
    } as any);

    const request = new Request("http://localhost/api/blogs", {
      method: "POST",
      body: JSON.stringify({
        title: "Blocked post",
        description: "No auth",
        content: "Content"
      })
    });

    const response = await POST(request);
    const body = await response.json();

    expect(response.status).toBe(401);
    expect(body.error).toBe("Unauthorized");
  });

  it("creates a blog post and notifies subscribers", async () => {
    process.env.NEXT_PUBLIC_APP_URL = "https://example.com";

    mockedRequireAdminApiSession.mockResolvedValue({
      session: { user: { id: "admin-1" } },
      response: null
    } as any);

    mockedCreatePortfolioItem.mockResolvedValue({
      id: "b1",
      title: "Hello World"
    } as any);
    mockedNotifySubscribers.mockResolvedValue(undefined as any);

    const request = new Request("http://localhost/api/blogs", {
      method: "POST",
      body: JSON.stringify({
        title: "Hello World",
        description: "My first post",
        content: "Some content",
        readingTime: "2 min"
      })
    });

    const response = await POST(request);
    const body = await response.json();

    expect(response.status).toBe(201);
    expect(body.success).toBe(true);
    expect(mockedCreatePortfolioItem).toHaveBeenCalledWith(
      "blogs",
      expect.objectContaining({
        title: "Hello World",
        description: "My first post"
      }),
      "admin-1"
    );
    expect(mockedNotifySubscribers).toHaveBeenCalledWith({
      type: "blog",
      title: "Hello World",
      description: "My first post",
      url: "https://example.com/blog/hello-world"
    });
  });
});
