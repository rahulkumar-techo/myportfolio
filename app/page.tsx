import type { Metadata } from 'next';
import Navigation from '@/components/navigation';
import Footer from '@/components/footer';
import dynamic from 'next/dynamic';
import HomeClient from '@/components/home-client';
import HeroSection from '@/components/sections/hero-section';
import AboutSection from '@/components/sections/about-section';
import PublicSWRProvider from '@/components/public-swr-provider';
import { getPublicHomeData, serializeForClient } from '@/lib/public-data';
import PageLoader from '@/components/page-loader';
import { siteUrl } from '@/utils/meta-data';

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const homeData = await getPublicHomeData();
  const siteTitle = homeData?.profile?.profile?.name || homeData?.profile?.settings?.siteTitle || 'Rahul Kumar';
  const bio = homeData?.profile?.settings?.bio || 'Full Stack Developer specializing in Next.js, Node.js, AI, and microservices.';
  const description = bio.length > 155 ? `${bio.slice(0, 152).trim()}...` : bio;

  return {
    title: 'Full Stack Developer | Next.js, Node.js, AI, Microservices',
    description,
    alternates: {
      canonical: siteUrl,
    },
    openGraph: {
      title: 'Full Stack Developer | Next.js, Node.js, AI, Microservices',
      description,
      url: siteUrl,
      type: 'website',
      images: [
        {
          url: `${siteUrl}/og_image.png`,
          width: 1200,
          height: 630,
          alt: `${siteTitle} Portfolio`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Full Stack Developer | Next.js, Node.js, AI, Microservices',
      description,
      images: [`${siteUrl}/og_image.png`],
    },
  };
}

const SkillsSection = dynamic(() => import('@/components/sections/skills-section'), { loading: () => null });
const ProjectsSection = dynamic(() => import('@/components/sections/projects-section'), { loading: () => null });
const AssetsSection = dynamic(() => import('@/components/sections/assets-section'), { loading: () => null });
const ExperienceSection = dynamic(() => import('@/components/sections/experience-section'), { loading: () => null });
const TestimonialsSection = dynamic(() => import('@/components/sections/testimonials-section'), { loading: () => null });

export default async function Home() {
  const homeData = await getPublicHomeData();
  const fallback = serializeForClient({
    "/public/profile": { success: true, data: homeData.profile },
    "/skills": { success: true, data: homeData.skills },
    "/projects": { success: true, data: homeData.projects },
    "/assets": { success: true, data: homeData.assets },
    "/experience": { success: true, data: homeData.experiences },
    "/testimonials": { success: true, data: homeData.testimonials }
  });

  return (
    <PublicSWRProvider fallback={fallback}>
      <PageLoader />
      <main className="relative">
        {/* Navigation */}
        <Navigation />
        
        {/* AI Guide */}
        <HomeClient />
        
        {/* Hero Section */}
        <HeroSection />
        
        {/* About Section */}
        <AboutSection />
        
        {/* Skills Section */}
        <div className="content-visibility-auto">
          <SkillsSection />
        </div>

        {/* Projects Showcase */}
        <div className="content-visibility-auto">
          <ProjectsSection />
        </div>

        {/* Public Assets */}
        <div className="content-visibility-auto">
          <AssetsSection />
        </div>
        
        {/* Experience Section */}
        <div className="content-visibility-auto">
          <ExperienceSection />
        </div>
        
        {/* Testimonials Section */}
        <div className="content-visibility-auto">
          <TestimonialsSection />
        </div>
        
        {/* Footer */}
        <Footer />
      </main>
    </PublicSWRProvider>
  );
}
