import { NextResponse } from "next/server";
import { listPortfolioItems } from "@/repositories/portfolio-repository";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const limitParam = searchParams.get("limit");
  const limit = limitParam ? Math.max(1, Number(limitParam)) : null;

  const projects = await listPortfolioItems("projects");
  const featured = projects.filter((project: any) => project?.featured);
  const data = limit ? featured.slice(0, limit) : featured;

  return NextResponse.json({
    success: true,
    data,
    meta: {
      total: data.length,
      timestamp: new Date().toISOString()
    }
  });
}
