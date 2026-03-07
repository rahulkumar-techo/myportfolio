import type { Metadata } from 'next';
import { headers } from 'next/headers';
import { notFound } from 'next/navigation';
import ProjectDetailClient from './project-detail-client';
import { normalizeProject } from '@/lib/project-utils';
import type { Project } from '@/lib/types';

export const dynamic = 'force-dynamic';

async function getBaseUrl() {
  const headerStore = await headers();
  const host = headerStore.get('x-forwarded-host') ?? headerStore.get('host');
  const protocol =
    headerStore.get('x-forwarded-proto') ?? (host?.includes('localhost') ? 'http' : 'https');

  if (host) {
    return `${protocol}://${host}`;
  }

  return process.env.NEXTAUTH_URL ?? 'http://localhost:3000';
}

async function getProject(id: string): Promise<Project | null> {
  const baseUrl = await getBaseUrl();
  const response = await fetch(`${baseUrl}/api/projects/${id}`, {
    cache: 'no-store',
  });

  if (!response.ok) {
    return null;
  }

  const payload = await response.json();

  if (!payload?.data) {
    return null;
  }

  return normalizeProject(payload.data);
}

export async function generateMetadata(
  { params }: { params: Promise<{ id: string }> }
): Promise<Metadata> {
  const { id } = await params;
  const project = await getProject(id);

  if (!project) {
    return {
      title: 'Project Not Found | Portfolio',
    };
  }

  return {
    title: `${project.title} | Portfolio`,
    description: project.description,
  };
}

export default async function ProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const project = await getProject(id);

  if (!project) {
    notFound();
  }

  return <ProjectDetailClient projectId={id} initialProject={project} />;
}
