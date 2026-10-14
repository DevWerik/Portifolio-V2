import { Code2, ExternalLink, ChevronDown } from "lucide-react";
import { useLayoutEffect, useRef } from "react";
import { FaGithub } from "react-icons/fa";

import { PROJECTS, type Project } from "@/data/projects";
import { useLanguage, type Language } from "@/i18n/language-context";
import { gsap } from "@/lib/gsap";
import { publicAsset } from "@/lib/public-asset";

const COPY = {
  pt: {
    eyebrow: "Projetos selecionados",
    title: "Da interface à entrega",
    description: "Produtos próprios, experiência profissional e estudos práticos. Conheça o problema, minha contribuição e o que foi implementado em cada projeto.",
    challenge: "Desafio",
    solution: "Solução",
    outcome: "Entrega",
    technologies: "Tecnologias utilizadas",
    contribution: "Minha participação",
    details: "Detalhes da entrega",
    source: "Ver código",
    status: { completed: "Concluído", inProgress: "Em evolução", delivered: "Implementado" },
    external: "abre em nova aba",
  },
  en: {
    eyebrow: "Selected work",
    title: "From interface to delivery",
    description: "Personal products, professional work, and practice projects. Explore the problem, my contribution, and what was implemented in each project.",
    challenge: "Challenge",
    solution: "Solution",
    outcome: "Delivery",
    technologies: "Technologies used",
    contribution: "My contribution",
    details: "Delivery details",
    source: "View source",
    status: { completed: "Completed", inProgress: "Evolving", delivered: "Implemented" },
    external: "opens in a new tab",
  },
} as const;

function ProjectVisual({ project, language }: { project: Project; language: Language }) {
  const visual = project.visual;

  if ("image" in visual) {
    return (
      <div className="aspect-1911/888 overflow-hidden border-b border-white/10 bg-zinc-950">
        <img
          src={publicAsset(visual.image)}
          alt={visual.alt[language]}
          width={visual.width}
          height={visual.height}
          loading="lazy"
          decoding="async"
          className="h-full w-full object-contain transition-transform duration-700 group-hover:scale-[1.015]"
        />
      </div>
    );
  }

  return (
    <div aria-hidden="true" className="flex aspect-1911/888 items-center justify-center border-b border-white/10 bg-zinc-950 p-5 sm:p-8">
      <div className="w-full max-w-lg overflow-hidden rounded-2xl border border-white/10 bg-black">
        <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
          <div className="flex gap-1.5">
            {[0, 1, 2].map((dot) => <span key={dot} className="size-2 rounded-full bg-zinc-700" />)}
          </div>
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-400 sm:text-xs">{visual.label}</span>
        </div>
        <div className="space-y-3 p-4 font-mono text-[10px] sm:p-5 sm:text-xs">
          {visual.layers.map((layer) => (
            <div key={layer.technology} className="flex items-center justify-between gap-3 border-b border-white/5 pb-3 last:border-0 last:pb-0">
              <span className="text-zinc-200">{layer.technology}</span>
              <span className="text-right text-zinc-400">{layer.role[language]}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const linkClassName = "inline-flex w-fit items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2.5 text-sm font-medium text-zinc-200 transition hover:border-white hover:bg-white hover:text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-4 focus-visible:ring-offset-black";

export function Projects() {
  const sectionRef = useRef<HTMLElement>(null);
  const { language } = useLanguage();
  const copy = COPY[language];

  useLayoutEffect(() => {
    const media = gsap.matchMedia();
    media.add("(prefers-reduced-motion: no-preference)", () => {
      const context = gsap.context(() => {
        const elements = sectionRef.current?.querySelectorAll<HTMLElement>("[data-gsap-project]");
        elements?.forEach((element) => {
          gsap.from(element, {
            opacity: 0, y: 24, duration: 0.75, ease: "power3.out",
            scrollTrigger: { trigger: element, start: "top 86%", once: true },
          });
        });
      }, sectionRef);
      return () => context.revert();
    });
    return () => media.revert();
  }, []);

  return (
    <section ref={sectionRef} id="projetos" aria-labelledby="projects-title" tabIndex={-1} className="scroll-mt-24 py-20 outline-none lg:py-32">
      <header data-gsap-project className="max-w-3xl">
        <div className="flex items-center gap-4 text-xs uppercase tracking-[0.28em] text-zinc-400">
          <span aria-hidden="true" className="h-px w-8 bg-zinc-600" />
          {copy.eyebrow}
        </div>
        <h2 id="projects-title" className="mt-5 text-4xl font-medium tracking-tight text-white sm:text-5xl">{copy.title}</h2>
        <p className="mt-5 max-w-2xl text-base leading-7 text-zinc-400">{copy.description}</p>
      </header>

      <ol className="mt-12 grid gap-6 lg:grid-cols-2">
        {PROJECTS.map((project) => (
          <li key={project.id} className="flex">
            <article id={project.id} aria-labelledby={`${project.id}-title`} data-gsap-project className="group flex w-full scroll-mt-28 flex-col overflow-hidden rounded-3xl border border-white/10 bg-white/[0.035] transition-colors hover:border-white/20">
              <ProjectVisual project={project} language={language} />
              <div className="flex flex-1 flex-col p-6 sm:p-8">
                <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-zinc-400">
                  <p>{project.category[language]}</p>
                  <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 font-medium text-zinc-300">
                    <span aria-hidden="true" className={`size-1.5 rounded-full ${project.status === "inProgress" ? "bg-amber-300" : "bg-emerald-400"}`} />
                    {copy.status[project.status]}
                  </span>
                </div>
                <h3 id={`${project.id}-title`} className="mt-6 text-2xl font-medium tracking-tight text-white sm:text-3xl">{project.title[language]}</h3>
                <p className="mt-4 text-lg leading-8 text-zinc-300">{project.summary[language]}</p>

                <dl className="mt-7 space-y-5 border-y border-white/10 py-6">
                  {[[copy.challenge, project.challenge[language]], [copy.solution, project.solution[language]], [copy.outcome, project.outcome[language]]].map(([label, value]) => (
                    <div key={label} className="grid gap-2 sm:grid-cols-[6.5rem_1fr] sm:gap-4">
                      <dt className="font-mono text-xs uppercase tracking-[0.18em] text-zinc-400">{label}</dt>
                      <dd className="text-sm leading-6 text-zinc-300">{value}</dd>
                    </div>
                  ))}
                </dl>
                <details className="group/details mt-6 rounded-xl border border-white/10 bg-black/20 p-4">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-3 rounded text-sm font-medium text-zinc-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white [&::-webkit-details-marker]:hidden">
                    {copy.details}
                    <ChevronDown aria-hidden="true" className="size-4 shrink-0 transition-transform group-open/details:rotate-180" />
                  </summary>
                  <p className="mt-4 text-sm leading-6 text-zinc-300"><strong className="font-medium text-white">{copy.contribution}: </strong>{project.role[language]}</p>
                  <ul className="mt-3 list-disc space-y-2 pl-4 text-sm leading-6 text-zinc-300">
                    {project.deliveries[language].map((delivery) => <li key={delivery}>{delivery}</li>)}
                  </ul>
                </details>

                <div className="mt-7">
                  <h4 className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-zinc-400">
                    <Code2 className="size-3.5" aria-hidden="true" />{copy.technologies}
                  </h4>
                  <ul className="mt-3 flex flex-wrap gap-2">
                    {project.technologies.map((technology) => <li key={technology} className="rounded-md border border-white/10 bg-white/5 px-2.5 py-1.5 font-mono text-xs text-zinc-300">{technology}</li>)}
                  </ul>
                </div>
                <div className="mt-auto flex flex-wrap gap-3 pt-8">
                  {project.sourceUrl && (
                    <a href={project.sourceUrl} target="_blank" rel="noopener noreferrer" aria-label={`${copy.source}: ${project.title[language]} (${copy.external})`} className={linkClassName}>
                      <FaGithub className="size-4" aria-hidden="true" />{copy.source}
                    </a>
                  )}
                  {project.references.map((reference) => (
                    <a key={reference.url} href={reference.url} target="_blank" rel="noopener noreferrer" aria-label={`${reference.label[language]}: ${project.title[language]} (${copy.external})`} className={linkClassName}>
                      {reference.label[language]}<ExternalLink className="size-4 shrink-0" aria-hidden="true" />
                    </a>
                  ))}
                </div>
              </div>
            </article>
          </li>
        ))}
      </ol>
    </section>
  );
}
