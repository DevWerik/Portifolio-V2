import { ArrowRight, Code2, Mail, MapPin } from "lucide-react";
import { useLayoutEffect, useRef } from "react";
import { FaGithub, FaLinkedinIn } from "react-icons/fa";

import { Experience01 } from "@/components/experience-01";
import { Certificates } from "@/components/ui/certificates";
import { ContactForm } from "@/components/ui/forms";
import { Projects } from "@/components/ui/projects";
import { useLanguage } from "@/i18n/language-context";
import { gsap } from "@/lib/gsap";

const PROFILE_LINKS = {
  github: "https://github.com/DevWerik",
  linkedin: "https://www.linkedin.com/in/werik-santos/",
} as const;

const homeContent = {
  pt: {
    eyebrow: "Desenvolvedor Full Stack",
    title:
      "Construo produtos web claros, acessíveis e preparados para evoluir.",
    introduction:
      "Sou Werik Santos, desenvolvedor com foco em React e Node.js. Transformo necessidades de produto em interfaces responsivas e APIs organizadas e testáveis.",
    details:
      "Valorizo código sustentável, boa experiência de uso e decisões técnicas que façam sentido para cada projeto.",
    location: "Salvador, Bahia — Brasil",
    visualAlt: "Monograma WS, identidade visual de Werik Santos",
    visualLabel: "Werik Santos",
    visualRole: "React · Node.js · TypeScript",
    projectsCta: "Ver projetos",
    contactCta: "Entrar em contato",
    githubAria: "Acessar GitHub de Werik Santos (abre em nova aba)",
    linkedinAria: "Acessar LinkedIn de Werik Santos (abre em nova aba)",
    skillsEyebrow: "Competências",
    skillsTitle: "Tecnologias aplicadas com propósito",
    skillsDescription:
      "Uma base full stack organizada entre interface, servidor, qualidade e ferramentas de entrega.",
    groups: {
      frontend: "Front-end",
      backend: "Back-end",
      quality: "Qualidade",
      tools: "Ferramentas",
    },
  },
  en: {
    eyebrow: "Full-Stack Developer",
    title: "I build clear, accessible web products designed to evolve.",
    introduction:
      "I’m Werik Santos, a developer focused on React and Node.js. I turn product needs into responsive interfaces and well-structured, testable APIs.",
    details:
      "I value maintainable code, thoughtful user experiences, and technical decisions that fit each project.",
    location: "Salvador, Bahia — Brazil",
    visualAlt: "WS monogram, Werik Santos’ visual identity",
    visualLabel: "Werik Santos",
    visualRole: "React · Node.js · TypeScript",
    projectsCta: "View projects",
    contactCta: "Get in touch",
    githubAria: "Open Werik Santos’ GitHub (opens in a new tab)",
    linkedinAria: "Open Werik Santos’ LinkedIn (opens in a new tab)",
    skillsEyebrow: "Expertise",
    skillsTitle: "Technology applied with purpose",
    skillsDescription:
      "A full-stack foundation organized across interfaces, servers, quality, and delivery tools.",
    groups: {
      frontend: "Front-end",
      backend: "Back-end",
      quality: "Quality",
      tools: "Tools",
    },
  },
} as const;

const skillGroups = [
  {
    key: "frontend",
    skills: [
      "React",
      "TypeScript",
      "JavaScript",
      "Tailwind CSS",
      "React Router",
      "React Hook Form",
      "Zod",
    ],
  },
  {
    key: "backend",
    skills: [
      "Node.js",
      "NestJS",
      "Fastify",
      "PostgreSQL",
      "Prisma",
      "REST APIs",
    ],
  },
  {
    key: "quality",
    skills: [
      "Vitest",
      { pt: "Testes unitários", en: "Unit testing" },
      { pt: "Testes E2E", en: "E2E testing" },
      { pt: "Acessibilidade", en: "Accessibility" },
    ],
  },
  {
    key: "tools",
    skills: ["Git", "GitHub", "Figma", "GSAP"],
  },
] as const;

export function Home() {
  const { language } = useLanguage();
  const content = homeContent[language];
  const mainRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const media = gsap.matchMedia();

    media.add("(prefers-reduced-motion: no-preference)", () => {
      const context = gsap.context(() => {
        const heroTimeline = gsap.timeline({
          defaults: { duration: 0.72, ease: "power3.out" },
        });

        heroTimeline
          .from(
            "[data-gsap-hero-item]",
            { opacity: 0, y: 20, stagger: 0.08 },
            0.08,
          )
          .from(
            "[data-gsap-hero-visual]",
            { opacity: 0, scale: 0.98, y: 20, duration: 0.85 },
            0.18,
          );

        gsap.from("[data-gsap-skill-group]", {
          opacity: 0,
          y: 18,
          duration: 0.65,
          stagger: 0.08,
          ease: "power3.out",
          scrollTrigger: {
            trigger: "[data-gsap-skills]",
            start: "top 84%",
            once: true,
          },
        });

        gsap.from("[data-gsap-experience]", {
          opacity: 0,
          y: 24,
          duration: 0.85,
          ease: "power3.out",
          scrollTrigger: {
            trigger: "[data-gsap-experience]",
            start: "top 84%",
            once: true,
          },
        });
      }, mainRef);

      return () => context.revert();
    });

    return () => media.revert();
  }, []);

  return (
    <main
      ref={mainRef}
      id="conteudo-principal"
      tabIndex={-1}
      className="relative min-h-screen overflow-x-clip px-5 pb-0 pt-28 text-white outline-none sm:px-8 sm:pt-32 lg:px-12"
    >
      <div className="relative mx-auto max-w-7xl">
        <section
          id="inicio"
          aria-labelledby="home-title"
          tabIndex={-1}
          className="scroll-mt-28 outline-none"
        >
          <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(290px,380px)] lg:gap-16 xl:gap-24">
            <div className="min-w-0">
              <div
                data-gsap-hero-item
                className="flex flex-wrap items-center gap-3 text-xs font-medium uppercase tracking-[0.22em] text-zinc-300 sm:text-sm sm:tracking-[0.25em]"
              >
                <Code2 className="size-4 shrink-0" aria-hidden="true" />
                <span>{content.eyebrow}</span>
              </div>

              <h1
                data-gsap-hero-item
                id="home-title"
                className="mt-6 max-w-4xl text-4xl font-medium leading-[1.02] tracking-[-0.045em] text-balance sm:text-6xl lg:text-7xl"
              >
                {content.title}
              </h1>

              <p
                data-gsap-hero-item
                className="mt-7 max-w-2xl text-base leading-7 text-zinc-300 sm:text-lg sm:leading-8"
              >
                {content.introduction}
              </p>

              <p
                data-gsap-hero-item
                className="mt-3 max-w-2xl text-sm leading-7 text-zinc-400 sm:text-base"
              >
                {content.details}
              </p>

              <div
                data-gsap-hero-item
                className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap"
              >
                <a
                  href="#projetos"
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-white px-6 text-sm font-semibold text-black transition hover:bg-zinc-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-4 focus-visible:ring-offset-black"
                >
                  {content.projectsCta}
                  <ArrowRight className="size-4" aria-hidden="true" />
                </a>

                <a
                  href="#contato"
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-white/20 px-6 text-sm font-semibold text-white transition hover:border-white/50 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-4 focus-visible:ring-offset-black"
                >
                  {content.contactCta}
                  <Mail className="size-4" aria-hidden="true" />
                </a>
              </div>

              <div
                data-gsap-hero-item
                className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-3 text-sm text-zinc-300"
              >
                <span className="flex items-center gap-2">
                  <MapPin className="size-4 shrink-0" aria-hidden="true" />
                  {content.location}
                </span>

                <span
                  aria-hidden="true"
                  className="hidden h-4 w-px bg-white/15 sm:block"
                />

                <a
                  href={PROFILE_LINKS.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={content.githubAria}
                  className="inline-flex items-center gap-1.5 transition hover:text-white focus-visible:rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                >
                  <FaGithub className="size-4" aria-hidden="true" />
                  GitHub
                </a>

                <a
                  href={PROFILE_LINKS.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={content.linkedinAria}
                  className="inline-flex items-center gap-1.5 transition hover:text-white focus-visible:rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                >
                  <FaLinkedinIn className="size-4" aria-hidden="true" />
                  LinkedIn
                </a>
              </div>
            </div>

            <figure
              data-gsap-hero-visual
              className="mx-auto w-full max-w-sm overflow-hidden rounded-[2rem] border border-white/12 bg-[#202020] lg:mx-0"
            >
              <img
                src="/WS.png"
                alt={content.visualAlt}
                width={2000}
                height={2000}
                fetchPriority="high"
                className="aspect-square w-full object-cover"
              />

              <figcaption className="flex flex-col gap-1 border-t border-white/10 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
                <span className="text-sm font-semibold text-white">
                  {content.visualLabel}
                </span>
                <span className="text-xs text-zinc-300">
                  {content.visualRole}
                </span>
              </figcaption>
            </figure>
          </div>

          <div data-gsap-skills className="mt-24 lg:mt-32">
            <div className="max-w-2xl">
              <p className="text-xs font-medium uppercase tracking-[0.25em] text-zinc-400">
                {content.skillsEyebrow}
              </p>
              <h2 className="mt-4 text-3xl font-medium tracking-tight text-white sm:text-4xl">
                {content.skillsTitle}
              </h2>
              <p className="mt-4 text-base leading-7 text-zinc-400">
                {content.skillsDescription}
              </p>
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {skillGroups.map((group) => (
                <article
                  data-gsap-skill-group
                  key={group.key}
                  className="rounded-2xl border border-white/10 bg-white/[0.035] p-5"
                >
                  <h3 className="text-sm font-semibold text-white">
                    {content.groups[group.key]}
                  </h3>
                  <ul
                    className="mt-4 flex flex-wrap gap-2"
                    aria-label={content.groups[group.key]}
                  >
                    {group.skills.map((skill) => (
                      <li
                        key={typeof skill === "string" ? skill : skill.en}
                        className="rounded-full border border-white/10 bg-black/30 px-3 py-1.5 text-xs text-zinc-300"
                      >
                        {typeof skill === "string" ? skill : skill[language]}
                      </li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section
          data-gsap-experience
          id="experiencia"
          aria-labelledby="experience-title"
          tabIndex={-1}
          className="w-full scroll-mt-28 py-20 outline-none lg:py-32"
        >
          <Experience01 />
        </section>

        <Projects />

        <Certificates />

        <ContactForm />
      </div>
    </main>
  );
}
