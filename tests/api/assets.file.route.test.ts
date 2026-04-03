/**
 * @jest-environment node
 */

import { GET } from "@/app/api/assets/file/[id]/route";
import { getPublicAssetById } from "@/repositories/asset-repository";

jest.mock("@/repositories/asset-repository", () => ({
  getPublicAssetById: jest.fn()
}));

jest.mock("@/lib/clodudinary", () => ({
  __esModule: true,
  default: {
    config: jest.fn()
  }
}));

jest.mock("cloudinary", () => ({
  v2: {
    utils: {
      private_download_url: jest.fn(() => "https://signed.example.com/resume.pdf")
    }
  }
}));

const mockedGetPublicAssetById = jest.mocked(getPublicAssetById);

describe("/api/assets/file/[id] route", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    global.fetch = jest.fn();
  });

  it("streams the stored PDF bytes with inline headers", async () => {
    const pdfBytes = Buffer.from("%PDF-1.4\nresume\n%%EOF", "utf8");

    mockedGetPublicAssetById.mockResolvedValue({
      id: "asset-1",
      label: "Resume",
      category: "cv",
      originalName: "resume.pdf",
      fileName: "resume.pdf",
      fileUrl: "https://example.com/resume.pdf",
      fileType: "application/pdf",
      size: pdfBytes.length,
      uploadedAt: new Date().toISOString()
    } as any);

    jest.mocked(global.fetch).mockResolvedValue(
      new Response(pdfBytes, {
        status: 200,
        headers: { "Content-Type": "application/pdf" }
      })
    );

    const response = await GET(new Request("http://localhost/api/assets/file/asset-1"), {
      params: Promise.resolve({ id: "asset-1" })
    });

    const body = Buffer.from(await response.arrayBuffer());

    expect(response.status).toBe(200);
    expect(body.equals(pdfBytes)).toBe(true);
    expect(response.headers.get("Content-Type")).toBe("application/pdf");
    expect(response.headers.get("Content-Disposition")).toContain('inline; filename="resume.pdf"');
    expect(response.headers.get("X-Asset-SHA256")).toMatch(/^[a-f0-9]{64}$/);
  });

  it("returns attachment headers when download is requested", async () => {
    const fileBytes = Buffer.from("resume");

    mockedGetPublicAssetById.mockResolvedValue({
      id: "asset-2",
      label: "Resume",
      category: "cv",
      originalName: "resume.pdf",
      fileName: "resume.pdf",
      fileUrl: "https://example.com/resume.pdf",
      fileType: "application/pdf",
      size: fileBytes.length,
      uploadedAt: new Date().toISOString()
    } as any);

    jest.mocked(global.fetch).mockResolvedValue(new Response(fileBytes, { status: 200 }));

    const response = await GET(new Request("http://localhost/api/assets/file/asset-2?download=1"), {
      params: Promise.resolve({ id: "asset-2" })
    });

    expect(response.status).toBe(200);
    expect(response.headers.get("Content-Disposition")).toContain("attachment;");
  });

  it("falls back to a signed Cloudinary download URL when the raw asset URL returns 401", async () => {
    const pdfBytes = Buffer.from("%PDF-1.4\nresume\n%%EOF", "utf8");

    mockedGetPublicAssetById.mockResolvedValue({
      id: "asset-3",
      label: "Resume",
      category: "cv",
      originalName: "resume.pdf",
      fileName: "resume.pdf",
      fileId: "portfolio/assets/resume.pdf",
      fileUrl: "https://example.com/resume.pdf",
      fileType: "application/pdf",
      size: pdfBytes.length,
      uploadedAt: new Date().toISOString()
    } as any);

    jest
      .mocked(global.fetch)
      .mockResolvedValueOnce(new Response("unauthorized", { status: 401 }))
      .mockResolvedValueOnce(
        new Response(pdfBytes, {
          status: 200,
          headers: { "Content-Type": "application/pdf" }
        })
      );

    const response = await GET(new Request("http://localhost/api/assets/file/asset-3"), {
      params: Promise.resolve({ id: "asset-3" })
    });

    const body = Buffer.from(await response.arrayBuffer());

    expect(response.status).toBe(200);
    expect(body.equals(pdfBytes)).toBe(true);
    expect(global.fetch).toHaveBeenCalledTimes(2);
  });
});
