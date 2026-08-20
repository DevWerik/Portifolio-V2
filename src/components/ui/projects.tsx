import { CalendarDays, Clock3, Code2, ExternalLink } from "lucide-react";
import { useLayoutEffect, useRef } from "react";
import { FaGithub } from "react-icons/fa";

import { gsap } from "@/lib/gsap";
import { useLanguage, type Language } from "@/i18n/language-context";
import { publicAsset } from "@/lib/public-asset";

type ProjectStatus = "completed" | "inProgress";

type LocalizedProjectBase = {
  id: string;
  title: Record<Language, string>;
  summary: Record<Language, string>;
  challenge: Record<Language, string>;
  solution: Record<Language, string>;
  outcome: Record<Language, string>;
  technologies: readonly string[];
  sourceUrl?: string;
  demoUrl?: string;
  startDate: string;
  endDate?: string;
  status: ProjectStatus;
};

type LocalizedProject = LocalizedProjectBase &
  (
    | {
        visual: "pizzaShop";
        imageAlt: Record<Language, string>;
      }
    | {
        visual: "financialApi";
        imageAlt?: never;
      }
  );

type ProjectsCopy = {
  eyebrow: string;
  title: string;
  description: string;
  technologies: string;
  challenge: string;
  solution: string;
  outcome: string;
  period: string;
  developmentTime: string;
  since: string;
  status: Record<ProjectStatus, string>;
  viewSource: string;
  viewDemo: string;
  viewSourceAria: (projectName: string) => string;
  viewDemoAria: (projectName: string) => string;
};

const PROJECTS_COPY = {
  pt: {
    eyebrow: "Projetos selecionados",
    title: "Projetos",
    description:
      "Cases que apresentam o contexto, as decisões técnicas e o resultado de cada projeto, do front-end à arquitetura de back-end.",
    technologies: "Tecnologias utilizadas",
    challenge: "Desafio",
    solution: "Solução",
    outcome: "Resultado",
    period: "Período",
    developmentTime: "Tempo de desenvolvimento",
    since: "Desde",
    status: {
      completed: "Concluído",
      inProgress: "Em desenvolvimento",
    },
    viewSource: "Ver código",
    viewDemo: "Ver demonstração",
    viewSourceAria: (projectName: string) =>
      `Ver o código-fonte de ${projectName} (abre em nova aba)`,
    viewDemoAria: (projectName: string) =>
      `Ver a demonstração de ${projectName} (abre em nova aba)`,
  },
  en: {
    eyebrow: "Selected work",
    title: "Projects",
    description:
      "Case studies covering the context, technical decisions, and outcome of each project, from front-end implementation to back-end architecture.",
    technologies: "Technologies used",
    challenge: "Challenge",
    solution: "Solution",
    outcome: "Outcome",
    period: "Period",
    developmentTime: "Development time",
    since: "Since",
    status: {
      completed: "Completed",
      inProgress: "In development",
    },
    viewSource: "View source",
    viewDemo: "View demo",
    viewSourceAria: (projectName: string) =>
      `View the source code for ${projectName} (opens in a new tab)`,
    viewDemoAria: (projectName: string) =>
      `View the ${projectName} demo (opens in a new tab)`,
  },
} satisfies Record<Language, ProjectsCopy>;

const PROJECTS: LocalizedProject[] = [
  {
    id: "pizza-shop",
    title: {
      pt: "Pizza Shop",
      en: "Pizza Shop",
    },
    summary: {
      pt: "Dashboard web para acompanhar indicadores e o fluxo de pedidos de um restaurante.",
      en: "A web dashboard for monitoring restaurant indicators and order flow.",
    },
    challenge: {
      pt: "Reunir indicadores de vendas e pedidos em uma interface clara, inclusive durante carregamentos e atualizações de dados.",
      en: "Bring sales indicators and orders into a clear interface, including while data is loading or being updated.",
    },
    solution: {
      pt: "Desenvolvi páginas responsivas de dashboard e pedidos, com rotas organizadas, formulários validados, tabelas filtráveis e gráficos construídos com Recharts.",
      en: "I developed responsive dashboard and order pages with organized routes, validated forms, filterable tables, and charts built with Recharts.",
    },
    outcome: {
      pt: "O resultado centraliza métricas, visualizações de receita e gestão de pedidos em uma experiência consistente para o restaurante.",
      en: "The result brings metrics, revenue visualizations, and order management together in a consistent restaurant experience.",
    },
    technologies: [
      "React",
      "TypeScript",
      "Tailwind CSS",
      "Radix UI",
      "React Router",
      "Recharts",
      "React Hook Form",
      "Zod",
    ],
    sourceUrl: "https://github.com/DevWerik/pizzashop-web",
    startDate: "2026-01",
    endDate: "2026-05",
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
    summary: {
      pt: "API para organizar as regras e os dados de uma plataforma de controle financeiro.",
      en: "An API that organizes the rules and data for a financial management platform.",
    },
    challenge: {
      pt: "Estruturar transações, orçamentos e despesas sem acoplar as regras de negócio à infraestrutura da aplicação.",
      en: "Structure transactions, budgets, and expenses without coupling business rules to the application's infrastructure.",
    },
    solution: {
      pt: "Organizei o back-end em responsabilidades bem definidas, com Fastify, persistência em PostgreSQL, validação por schemas Zod e testes com Vitest.",
      en: "I organized the back end into clear responsibilities using Fastify, PostgreSQL persistence, Zod schema validation, and Vitest tests.",
    },
    outcome: {
      pt: "A base resultante favorece evolução incremental, contratos de dados previsíveis e componentes que podem ser testados de forma isolada.",
      en: "The resulting foundation supports incremental evolution, predictable data contracts, and components that can be tested in isolation.",
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
    startDate: "2026-05",
    status: "inProgress",
    visual: "financialApi",
  },
];

function formatProjectDate(value: string, language: Language) {
  const [year, month] = value.split("-").map(Number);
  const locale = language === "pt" ? "pt-BR" : "en-US";

  return new Intl.DateTimeFormat(locale, {
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(Date.UTC(year, month - 1, 1)));
}

function formatProjectDuration(
  startDate: string,
  endDate: string | undefined,
  language: Language,
) {
  const [startYear, startMonth] = startDate.split("-").map(Number);
  const now = new Date();
  const [endYear, endMonth] = endDate
    ? endDate.split("-").map(Number)
    : [now.getFullYear(), now.getMonth() + 1];
  const totalMonths = Math.max(
    1,
    (endYear - startYear) * 12 + (endMonth - startMonth) + 1,
  );
  const years = Math.floor(totalMonths / 12);
  const months = totalMonths % 12;
  const labels =
    language === "pt"
      ? { year: ["ano", "anos"], month: ["mês", "meses"] }
      : { year: ["year", "years"], month: ["month", "months"] };
  const parts: string[] = [];

  if (years > 0) {
    parts.push(`${years} ${labels.year[years === 1 ? 0 : 1]}`);
  }

  if (months > 0) {
    parts.push(`${months} ${labels.month[months === 1 ? 0 : 1]}`);
  }

  return parts.join(" ");
}

function ProjectVisual({
  project,
  language,
}: {
  project: LocalizedProject;
  language: Language;
}) {
  if (project.visual === "pizzaShop") {
    return (
      <div className="aspect-1911/888 overflow-hidden border-b border-white/10 bg-zinc-950">
        <img
          src={publicAsset("Projeto.png")}
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

  const architectureLayers =
    language === "pt"
      ? [
          { technology: "Fastify", role: "Camada HTTP" },
          { technology: "Zod", role: "Validação" },
          { technology: "PostgreSQL", role: "Persistência" },
        ]
      : [
          { technology: "Fastify", role: "HTTP layer" },
          { technology: "Zod", role: "Validation" },
          { technology: "PostgreSQL", role: "Persistence" },
        ];

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
          {architectureLayers.map((layer, index) => (
            <div
              key={layer.technology}
              className={`flex items-center justify-between gap-3 pb-3 ${
                index < architectureLayers.length - 1
                  ? "border-b border-white/5"
                  : "pb-0"
              }`}
            >
              <span className="text-zinc-200">{layer.technology}</span>
              <span className="text-zinc-500">{layer.role}</span>
            </div>
          ))}
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
      tabIndex={-1}
      className="scroll-mt-24 py-20 outline-none lg:py-32"
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

                <p className="mt-4 text-lg leading-8 text-zinc-300">
                  {project.summary[language]}
                </p>

                <dl className="mt-7 space-y-5 border-y border-white/10 py-6">
                  {(
                    [
                      [copy.challenge, project.challenge[language]],
                      [copy.solution, project.solution[language]],
                      [copy.outcome, project.outcome[language]],
                    ] as const
                  ).map(([label, value], caseIndex) => (
                    <div
                      key={label}
                      className="grid gap-2 sm:grid-cols-[6.5rem_1fr] sm:gap-4"
                    >
                      <dt className="font-mono text-xs uppercase tracking-[0.18em] text-zinc-500">
                        {String(caseIndex + 1).padStart(2, "0")} · {label}
                      </dt>
                      <dd className="text-sm leading-6 text-zinc-400">
                        {value}
                      </dd>
                    </div>
                  ))}
                </dl>

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
                      {formatProjectDuration(
                        project.startDate,
                        project.endDate,
                        language,
                      )}
                    </dd>
                  </div>
                </dl>

                {(project.sourceUrl || project.demoUrl) && (
                  <div className="mt-auto flex flex-wrap gap-3 pt-8">
                    {project.sourceUrl && (
                      <a
                        href={project.sourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={copy.viewSourceAria(
                          project.title[language],
                        )}
                        className="inline-flex w-fit items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2.5 text-sm font-medium text-zinc-200 transition duration-300 hover:-translate-y-0.5 hover:border-white hover:bg-white hover:text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-4 focus-visible:ring-offset-black"
                      >
                        <FaGithub className="size-4" aria-hidden="true" />
                        {copy.viewSource}
                      </a>
                    )}

                    {project.demoUrl && (
                      <a
                        href={project.demoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={copy.viewDemoAria(project.title[language])}
                        className="inline-flex w-fit items-center gap-2 rounded-full border border-white/15 bg-white px-4 py-2.5 text-sm font-medium text-black transition duration-300 hover:-translate-y-0.5 hover:bg-zinc-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-4 focus-visible:ring-offset-black"
                      >
                        {copy.viewDemo}
                        <ExternalLink className="size-4" aria-hidden="true" />
                      </a>
                    )}
                  </div>
                )}
              </div>
            </article>
          </li>
        ))}
      </ol>
    </section>
  );
}
