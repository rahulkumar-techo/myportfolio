import Link from "next/link";
import { Briefcase, Calendar, ExternalLink, MapPin } from "lucide-react";
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import { getPublicHomeData } from "@/lib/public-data";
import type { Experience } from "@/lib/types";

export const revalidate = 60;


function formatDate(value: string | undefined) {
  if (!value) return "Present";
  const [year, month] = value.split("-");
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec"
  ];
  const monthIndex = Math.max(0, Math.min(11, Number(month) - 1));
  return `${months[monthIndex]} ${year}`;
}

function sortExperiences(items: Experience[]) {
  return [...items].sort((left, right) => {
    if (left.current && !right.current) return -1;
    if (!left.current && right.current) return 1;
    const leftDate = new Date(left.startDate).getTime();
    const rightDate = new Date(right.startDate).getTime();
    return rightDate - leftDate;
  });
}

export default async function ExperiencePage() {
  const homeData = await getPublicHomeData();
  const experiences = sortExperiences(homeData.experiences ?? []);

  return (
    <main className="min-h-screen bg-background text-foreground">
      <Navigation />

      <section className="relative pt-24 pb-16 overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-20" />
        <div className="absolute top-12 right-0 h-72 w-72 rounded-full bg-cyan-200/40 blur-3xl dark:bg-cyan-500/10" />
        <div className="absolute bottom-0 left-0 h-80 w-80 rounded-full bg-indigo-200/30 blur-3xl dark:bg-indigo-500/10" />

        <div className="container mx-auto px-4 relative z-10">
          <div className="mx-auto max-w-3xl text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/70 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-slate-500 dark:border-slate-800 dark:bg-slate-900/70 dark:text-slate-400">
              <Briefcase className="h-4 w-4 text-primary" />
              Experience
            </span>
            <h1 className="mt-6 text-3xl font-semibold text-slate-900 sm:text-4xl dark:text-white">
              Full Stack Developer Experience
            </h1>
            <p className="mt-4 text-base leading-relaxed text-slate-600 dark:text-slate-300">
              A detailed overview of roles, responsibilities, achievements, and
              technologies used across my professional journey.
            </p>
          </div>

          <div className="mt-12 grid gap-6">
            {experiences.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-slate-200 bg-white/80 p-10 text-center text-slate-600 dark:border-slate-800 dark:bg-slate-900/70 dark:text-slate-300">
                No experiences are available yet.
              </div>
            ) : (
              experiences.map((experience) => (
                <article
                  key={experience.id}
                  className="rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-[0_18px_50px_rgba(15,23,42,0.08)] dark:border-slate-800 dark:bg-slate-900/70 dark:shadow-[0_18px_50px_rgba(0,0,0,0.35)]"
                >
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-3">
                        <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
                          {experience.title}
                        </h2>
                        {experience.current ? (
                          <span className="rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                            Current
                          </span>
                        ) : null}
                      </div>
                      <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                        {experience.companyUrl ? (
                          <Link
                            href={experience.companyUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-primary hover:underline"
                          >
                            {experience.company}
                            <ExternalLink className="h-3 w-3" />
                          </Link>
                        ) : (
                          <span className="text-primary">{experience.company}</span>
                        )}
                        <span className="inline-flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          {experience.location}
                        </span>
                      </div>
                    </div>

                    <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
                      <Calendar className="h-4 w-4" />
                      {formatDate(experience.startDate)} -{" "}
                      {experience.current
                        ? "Present"
                        : formatDate(experience.endDate)}
                    </div>
                  </div>

                  <p className="mt-4 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                    {experience.description}
                  </p>

                  {experience.achievements.length > 0 ? (
                    <div className="mt-4">
                      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">
                        Achievements
                      </p>
                      <ul className="mt-3 grid gap-2 text-sm text-slate-600 dark:text-slate-300">
                        {experience.achievements.map((achievement, index) => (
                          <li key={`${experience.id}-achievement-${index}`}>
                            {achievement}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : null}

                  {experience.technologies.length > 0 ? (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {experience.technologies.map((tech) => (
                        <span
                          key={`${experience.id}-tech-${tech}`}
                          className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  ) : null}
                </article>
              ))
            )}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
