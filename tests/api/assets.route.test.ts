/**
 * @jest-environment node
 */

import { NextResponse } from "next/server";
import { GET, POST } from "@/app/api/assets/route";
import { createAsset, listPublicAssets } from "@/repositories/asset-repository";
import { removeTempAssetUploadsByPublicIds } from "@/repositories/temp-asset-upload-repository";
import { requireAdminApiSession } from "@/lib/auth";
import { notifySubscribers } from "@/utils/notify-subscribers";

jest.mock("@/repositories/asset-repository", () => ({
  createAsset: jest.fn(),
  listPublicAssets: jest.fn()
}));

jest.mock("@/repositories/temp-asset-upload-repository", () => ({
  removeTempAssetUploadsByPublicIds: jest.fn()
}));

jest.mock("@/lib/auth", () => ({
  requireAdminApiSession: jest.fn()
}));

jest.mock("@/utils/notify-subscribers", () => ({
  notifySubscribers: jest.fn()
}));

const mockedCreateAsset = jest.mocked(createAsset);
const mockedListPublicAssets = jest.mocked(listPublicAssets);
const mockedRemoveTempAssetUploadsByPublicIds = jest.mocked(removeTempAssetUploadsByPublicIds);
const mockedRequireAdminApiSession = jest.mocked(requireAdminApiSession);
const mockedNotifySubscribers = jest.mocked(notifySubscribers);

describe("/api/assets route", () => {
  const originalAppUrl = process.env.NEXT_PUBLIC_APP_URL;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    process.env.NEXT_PUBLIC_APP_URL = originalAppUrl;
  });

  it("returns public assets for GET requests", async () => {
    mockedListPublicAssets.mockResolvedValue([
      { id: "one", label: "Asset One" },
      { id: "two", label: "Asset Two" }
    ] as any);

    const response = await GET();
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.success).toBe(true);
    expect(body.data).toHaveLength(2);
    expect(mockedListPublicAssets).toHaveBeenCalled();
  });

  it("rejects POST requests when the admin session is missing", async () => {
    mockedRequireAdminApiSession.mockResolvedValue({
      session: null,
      response: NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
    } as any);

    const request = new Request("http://localhost/api/assets", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        label: "Blocked asset",
        category: "other",
        upload: { publicId: "asset-1", url: "https://example.com/asset.pdf", size: 123 }
      })
    });

    const response = await POST(request);
    const body = await response.json();

    expect(response.status).toBe(401);
    expect(body.error).toBe("Unauthorized");
  });

  it("creates an asset and notifies subscribers (json)", async () => {
    process.env.NEXT_PUBLIC_APP_URL = "https://example.com";

    mockedRequireAdminApiSession.mockResolvedValue({
      session: { user: { id: "admin-1" } },
      response: null
    } as any);

    mockedCreateAsset.mockResolvedValue({
      id: "a1",
      label: "Resume",
      category: "cv"
    } as any);
    mockedNotifySubscribers.mockResolvedValue(undefined as any);

    const request = new Request("http://localhost/api/assets", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        label: "Resume",
        category: "cv",
        upload: {
          publicId: "asset-1",
          url: "https://example.com/asset.pdf",
          originalName: "Resume.pdf",
          fileType: "application/pdf",
          size: 1024
        }
      })
    });

    const response = await POST(request);
    const body = await response.json();

    expect(response.status).toBe(201);
    expect(body.success).toBe(true);
    expect(mockedCreateAsset).toHaveBeenCalledWith(
      "admin-1",
      expect.objectContaining({
        label: "Resume",
        category: "cv"
      })
    );
    expect(mockedRemoveTempAssetUploadsByPublicIds).toHaveBeenCalledWith("admin-1", ["asset-1"]);
    expect(mockedNotifySubscribers).toHaveBeenCalledWith({
      type: "asset",
      title: "Resume",
      description: "New cv asset is now available.",
      url: "https://example.com/assets"
    });
  });
});
