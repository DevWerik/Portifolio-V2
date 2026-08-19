import { CalendarDays, Clock3, Code2, ExternalLink } from "lucide-react";
import { useLayoutEffect, useRef } from "react";
import { FaGithub } from "react-icons/fa";

import { gsap } from "@/lib/gsap";
import { useLanguage, type Language } from "@/i18n/language-context";

type ProjectStatus = "completed" | "inProgress";

type LocalizedProject = {
  id: string;
  title: Record<Language, string>;
  description: Record<Language, string>;
  technologies: string[];
  repositoryUrl: string;
  startDate: string;
  endDate?: string;
  duration: Record<Language, string>;
  status: ProjectStatus;
  visual: "pizzaShop" | "financialApi";
  imageAlt?: Record<Language, string>;
};

type ProjectsCopy = {
  eyebrow: string;
  title: string;
  description: string;
  technologies: string;
  period: string;
  developmentTime: string;
  since: string;
  status: Record<ProjectStatus, string>;
  viewOnGithub: string;
  viewOnGithubAria: (projectName: string) => string;
};

const PROJECTS_COPY = {
  pt: {
    eyebrow: "Projetos selecionados",
    title: "Projetos",
    description:
      "Aplicações em que transformei problemas reais em experiências rápidas, acessíveis e bem estruturadas.",
    technologies: "Tecnologias utilizadas",
    period: "Período",
    developmentTime: "Tempo de desenvolvimento",
    since: "Desde",
    status: {
      completed: "Concluído",
      inProgress: "Em desenvolvimento",
    },
    viewOnGithub: "Ver no GitHub",
    viewOnGithubAria: (projectName: string) =>
      `Ver o projeto ${projectName} no GitHub (abre em nova aba)`,
  },
  en: {
    eyebrow: "Selected work",
    title: "Projects",
    description:
      "Applications where I turned real problems into fast, accessible, and well-structured experiences.",
    technologies: "Technologies used",
    period: "Period",
    developmentTime: "Development time",
    since: "Since",
    status: {
      completed: "Completed",
      inProgress: "In development",
    },
    viewOnGithub: "View on GitHub",
    viewOnGithubAria: (projectName: string) =>
      `View ${projectName} on GitHub (opens in a new tab)`,
  },
} satisfies Record<Language, ProjectsCopy>;

const PROJECTS = [
  {
    id: "pizza-shop",
    title: {
      pt: "Pizza Shop",
      en: "Pizza Shop",
    },
    description: {
      pt: "Dashboard para gestão de restaurantes, com métricas de receita, acompanhamento de pedidos, gráficos e tabelas. A interface consome uma API e inclui cache, atualizações otimistas, estados de carregamento e testes automatizados.",
      en: "A restaurant management dashboard with revenue metrics, order tracking, charts, and tables. The interface consumes an API and includes caching, optimistic updates, loading states, and automated tests.",
    },
    technologies: [
      "React",
      "TypeScript",
      "Tailwind CSS",
      "shadcn/ui",
      "React Query",
      "React Router",
      "React Hook Form",
      "Zod",
      "Vitest",
    ],
    repositoryUrl: "https://github.com/DevWerik/pizzashop-web",
    startDate: "2026-01",
    endDate: "2026-05",
    duration: {
      pt: "5 meses",
      en: "5 months",
    },
    status: "completed",
    visual: "pizzaShop",
    imageAlt: {
      pt: "Dashboard do Pizza Shop com métricas, gráfico de receita e produtos populares",
      en: "Pizza Shop dashboard with metrics, a revenue chart, and popular products",
    },
  },
  {
    id: "financial-api",
    title: {
      pt: "API de controle financeiro",
      en: "Financial Management API",
    },
    description: {
      pt: "Back-end para uma plataforma de gestão financeira, criado para organizar transações, orçamentos e despesas. A API prioriza separação de responsabilidades, validação de dados, testes e uma arquitetura preparada para crescer.",
      en: "A back-end for a financial management platform built to organize transactions, budgets, and expenses. The API prioritizes separation of concerns, data validation, testing, and an architecture designed to scale.",
    },
    technologies: [
      "Node.js",
      "TypeScript",
      "Fastify",
      "PostgreSQL",
      "Zod",
      "Cookies",
      "Vitest",
    ],
    repositoryUrl: "https://github.com/DevWerik/Api-Node",
    startDate: "2026-05",
    duration: {
      pt: "Em andamento",
      en: "Ongoing",
    },
    status: "inProgress",
    visual: "financialApi",
  },
] satisfies LocalizedProject[];

function formatProjectDate(value: string, language: Language) {
  const [year, month] = value.split("-").map(Number);
  const locale = language === "pt" ? "pt-BR" : "en-US";

  return new Intl.DateTimeFormat(locale, {
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(Date.UTC(year, month - 1, 1)));
}

function ProjectVisual({
  project,
  language,
}: {
  project: LocalizedProject;
  language: Language;
}) {
  if (project.visual === "pizzaShop" && project.imageAlt) {
    return (
      <div className="aspect-1911/888 overflow-hidden border-b border-white/10 bg-zinc-950">
        <img
          src="/Projeto.png"
          alt={project.imageAlt[language]}
          width={1911}
          height={888}
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.015]"
        />
      </div>
    );
  }

  return (
    <div
      aria-hidden="true"
      className="flex aspect-1911/888 items-center justify-center border-b border-white/10 bg-zinc-950 p-5 sm:p-8"
    >
      <div className="w-full max-w-lg overflow-hidden rounded-2xl border border-white/10 bg-black">
        <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
          <div className="flex gap-1.5">
            <span className="size-2 rounded-full bg-zinc-700" />
            <span className="size-2 rounded-full bg-zinc-700" />
            <span className="size-2 rounded-full bg-zinc-700" />
          </div>
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-500 sm:text-xs">
            finance.api
          </span>
        </div>

        <div className="space-y-3 p-4 font-mono text-[10px] sm:p-5 sm:text-xs">
          <div className="flex items-center gap-3 border-b border-white/5 pb-3">
            <span className="w-11 text-emerald-400">POST</span>
            <span className="text-zinc-300">/transactions</span>
          </div>
          <div className="flex items-center gap-3 border-b border-white/5 pb-3">
            <span className="w-11 text-sky-400">GET</span>
            <span className="text-zinc-300">/budgets</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="w-11 text-amber-300">PATCH</span>
            <span className="text-zinc-300">/expenses/:id</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export function Projects() {
  const sectionRef = useRef<HTMLElement>(null);
  const { language } = useLanguage();
  const copy = PROJECTS_COPY[language];

  useLayoutEffect(() => {
    const media = gsap.matchMedia();

    media.add("(prefers-reduced-motion: no-preference)", () => {
      const context = gsap.context(() => {
        const heading = sectionRef.current?.querySelector<HTMLElement>(
          "[data-gsap-project-heading]",
        );
        const cards = sectionRef.current?.querySelectorAll<HTMLElement>(
          "[data-gsap-project-card]",
        );

        if (heading) {
          gsap.from(heading, {
            opacity: 0,
            y: 20,
            duration: 0.75,
            ease: "power3.out",
            scrollTrigger: {
              trigger: heading,
              start: "top 84%",
              once: true,
            },
          });
        }

        cards?.forEach((card) => {
          gsap.from(card, {
            opacity: 0,
            y: 28,
            duration: 0.78,
            ease: "power3.out",
            scrollTrigger: {
              trigger: card,
              start: "top 86%",
              once: true,
            },
          });
        });
      }, sectionRef);

      return () => context.revert();
    });

    return () => media.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="projetos"
      aria-labelledby="projects-title"
      className="scroll-mt-24 py-20 lg:py-32"
    >
      <header data-gsap-project-heading className="max-w-3xl">
        <div className="flex items-center gap-4 text-xs uppercase tracking-[0.28em] text-zinc-400">
          <span aria-hidden="true" className="h-px w-8 bg-zinc-600" />
          {copy.eyebrow}
        </div>

        <h2
          id="projects-title"
          className="mt-5 text-4xl font-medium tracking-tight text-white sm:text-5xl"
        >
          {copy.title}
        </h2>

        <p className="mt-5 max-w-2xl text-base leading-7 text-zinc-400">
          {copy.description}
        </p>
      </header>

      <ol className="mt-12 grid gap-6 lg:grid-cols-2">
        {PROJECTS.map((project, index) => (
          <li key={project.id} className="flex">
            <article
              data-gsap-project-card
              className="group flex w-full flex-col overflow-hidden rounded-3xl border border-white/10 bg-white/[0.035] transition-colors duration-300 hover:border-white/20"
            >
              <ProjectVisual project={project} language={language} />

              <div className="flex flex-1 flex-col p-6 sm:p-8">
                <div className="flex items-center justify-between gap-4">
                  <span
                    aria-hidden="true"
                    className="font-mono text-xs text-zinc-500"
                  >
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-zinc-300">
                    <span
                      aria-hidden="true"
                      className={`size-1.5 rounded-full ${
                        project.status === "completed"
                          ? "bg-emerald-400"
                          : "bg-amber-300"
                      }`}
                    />
                    {copy.status[project.status]}
                  </span>
                </div>

                <h3 className="mt-6 text-2xl font-medium tracking-tight text-white sm:text-3xl">
                  {project.title[language]}
                </h3>

                <p className="mt-4 leading-7 text-zinc-400">
                  {project.description[language]}
                </p>

                <div className="mt-7">
                  <h4 className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-zinc-400">
                    <Code2 className="size-3.5" aria-hidden="true" />
                    {copy.technologies}
                  </h4>

                  <ul className="mt-3 flex flex-wrap gap-2">
                    {project.technologies.map((technology) => (
                      <li
                        key={technology}
                        className="rounded-md border border-white/10 bg-white/5 px-2.5 py-1.5 font-mono text-xs text-zinc-300"
                      >
                        {technology}
                      </li>
                    ))}
                  </ul>
                </div>

                <dl className="mt-8 grid grid-cols-1 gap-5 border-t border-white/10 pt-6 sm:grid-cols-2">
                  <div>
                    <dt className="flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-zinc-400">
                      <CalendarDays className="size-3.5" aria-hidden="true" />
                      {copy.period}
                    </dt>
                    <dd className="mt-2 flex flex-wrap items-center gap-1.5 font-mono text-sm text-zinc-200">
                      {!project.endDate && <span>{copy.since}</span>}
                      <time dateTime={project.startDate}>
                        {formatProjectDate(project.startDate, language)}
                      </time>
                      {project.endDate && (
                        <>
                          <span aria-hidden="true">—</span>
                          <time dateTime={project.endDate}>
                            {formatProjectDate(project.endDate, language)}
                          </time>
                        </>
                      )}
                    </dd>
                  </div>

                  <div className="sm:border-l sm:border-white/10 sm:pl-5">
                    <dt className="flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-zinc-400">
                      <Clock3 className="size-3.5" aria-hidden="true" />
                      {copy.developmentTime}
                    </dt>
                    <dd className="mt-2 font-mono text-sm text-zinc-200">
                      {project.duration[language]}
                    </dd>
                  </div>
                </dl>

                <a
                  href={project.repositoryUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={copy.viewOnGithubAria(project.title[language])}
                  className="mt-8 inline-flex w-fit items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2.5 text-sm font-medium text-zinc-200 transition duration-300 hover:-translate-y-0.5 hover:border-white hover:bg-white hover:text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-4 focus-visible:ring-offset-black"
                >
                  <FaGithub className="size-4" aria-hidden="true" />
                  {copy.viewOnGithub}
                  <ExternalLink className="size-3.5" aria-hidden="true" />
                </a>
              </div>
            </article>
          </li>
        ))}
      </ol>
    </section>
  );
}
