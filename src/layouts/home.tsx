import { Laptop, MapPin } from "lucide-react";
import { useLayoutEffect, useRef } from "react";
import { LogosCarousel } from "../../@/components/ui/logos-carousel";
import { Experience01 } from "../../@/components/experience-01";
import { Certificates } from "../../@/components/ui/certificates";
import { ContactForm } from "../../@/components/ui/forms";
import { Projects } from "../../@/components/ui/projects";
import { useLanguage } from "@/i18n/language-context";
import { cn } from "../lib/utils";
import { gsap } from "../lib/gsap";

const homeContent = {
  pt: {
    profileAlt: "Foto de perfil de Werik Santos",
    status: "Online",
    location: "Salvador, Bahia — Brasil",
    eyebrow: "Portfólio",
    title: "Werik Santos — Desenvolvedor Full Stack",
    introduction:
      "Desenvolvedor Full Stack focado na construção de aplicações modernas, escaláveis e com boa experiência de uso.",
    details:
      "Trabalho principalmente com React, TypeScript, Node.js e desenvolvimento de APIs, buscando sempre escrever software organizado, acessível e sustentável.",
    specialty: "Especialidade",
    role: "DESENVOLVEDOR FULL STACK",
  },
  en: {
    profileAlt: "Portrait of Werik Santos",
    status: "Online",
    location: "Salvador, Bahia — Brazil",
    eyebrow: "Portfolio",
    title: "Werik Santos — Full-Stack Developer",
    introduction:
      "Full-stack developer focused on building modern, scalable applications with thoughtful user experiences.",
    details:
      "I primarily work with React, TypeScript, Node.js, and API development, always aiming to write well-structured, accessible, and maintainable software.",
    specialty: "Specialty",
    role: "FULL-STACK DEVELOPER",
  },
} as const;

export function Home() {
  const { language } = useLanguage();
  const content = homeContent[language];
  const mainRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const media = gsap.matchMedia();

    media.add("(prefers-reduced-motion: no-preference)", () => {
      const context = gsap.context(() => {
        const heroTimeline = gsap.timeline({
          defaults: { duration: 0.75, ease: "power3.out" },
        });

        heroTimeline
          .from(
            "[data-gsap-hero-visual]",
            { opacity: 0, scale: 0.98, y: 24, duration: 0.9 },
            0.05,
          )
          .from(
            "[data-gsap-hero-item]",
            { opacity: 0, y: 20, stagger: 0.09 },
            0.16,
          );

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
      className={cn(
        "relative min-h-screen overflow-x-clip px-5 pb-20 pt-32 text-white sm:px-8 lg:px-12",
      )}
    >
      <div className="relative mx-auto max-w-7xl">
        <section
          id="inicio"
          aria-labelledby="home-title"
          className="scroll-mt-24"
        >
          {/* HERO */}
          <div className=" grid  grid-cols-1 gap-10 lg:grid-cols-[minmax(260px,360px)_1fr] lg:gap-16">
            {/* FOTO */}
            <div data-gsap-hero-visual className="flex flex-col">
              <div className=" group relative aspect-square w-full overflow-hidden rounded-[2rem] border border-white/10 bg-zinc-900 ">
                {/* Substitua por sua imagem */}
                <img
                  src="/foto-perfil.jpg"
                  alt={content.profileAlt}
                  className=" h-full w-full object-cover grayscale transition-all duration-700 group-hover:scale-105 group-hover:grayscale-0"
                />

                {/* Overlay */}
                <div
                  aria-hidden="true"
                  className=" absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-transparent"
                />

                {/* Indicador */}
                <div className=" absolute bottom-4 left-4 flex items-center gap-2 rounded-full border border-white/10 bg-black/50 px-3 py-2 text-xs text-zinc-300 backdrop-blur-md">
                  <span className=" h-1.5 w-1.5 rounded-full bg-emerald-400" />

                  <span>{content.status}</span>
                </div>
              </div>

              {/* LOCALIZAÇÃO */}
              <div className=" mt-5 flex items-center gap-2 text-sm text-zinc-400 ">
                <MapPin className="h-4 w-4" aria-hidden="true" />

                <span>{content.location}</span>
              </div>
            </div>

            {/* CONTEÚDO */}
            <div className="flex flex-col justify-between">
              {/* TOPO */}
              <div>
                <div
                  data-gsap-hero-item
                  className=" flex items-center gap-4 text-sm uppercase tracking-[0.25em] text-zinc-500"
                >
                  <span aria-hidden="true" className="h-px w-8 bg-zinc-600" />
                  {content.eyebrow}
                </div>

                {/* SOBRE */}
                <h1
                  data-gsap-hero-item
                  id="home-title"
                  className=" mt-6 max-w-4xl text-5xl font-medium leading-[0.95] tracking-tight sm:text-6xl lg:text-8xl"
                >
                  {content.title}
                </h1>

                <p
                  data-gsap-hero-item
                  className=" mt-8 max-w-2xl text-base leading-7 text-zinc-400 sm:text-lg sm:leading-8"
                >
                  {content.introduction}
                </p>

                <p
                  data-gsap-hero-item
                  className=" mt-4 max-w-2xl text-base leading-7 text-zinc-500 sm:text-lg sm:leading-8"
                >
                  {content.details}
                </p>
              </div>

              {/* DEV FULLSTACK */}
              <div data-gsap-hero-item className="mt-16 lg:mt-20">
                <div className=" flex items-end justify-between gap-6 border-b border-white/10 pb-5">
                  <span className=" text-xs uppercase tracking-[0.3em] text-zinc-500">
                    {content.specialty}
                  </span>
                  <div className="flex items-center gap-2">
                    <Laptop
                      className="h-4 w-4 shrink-0 text-zinc-400"
                      aria-hidden="true"
                    />

                    <span className="text-sm uppercase tracking-[0.2em] text-zinc-300">
                      {content.role}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-20 w-full lg:mt-32">
            <div className="mx-auto w-full max-w-7xl overflow-hidden px-0 sm:px-6 lg:px-8">
              <LogosCarousel className="gap-1 [--column-count:4] sm:gap-6">
                {[
                  "React",
                  "Node.js",
                  "TypeScript",
                  "GSAP",
                  "Tailwind CSS",
                  "JavaScript",
                  "PostgreSQL",
                  "NestJS",
                  "Prisma",
                  "Framer Motion",
                  "REST APIs",
                  "Figma",
                  "Git",
                  "Styled-Components",
                  "API Restful",
                  "React Hook Form",
                  "React Router",
                  "Context API",
                  "Zod",
                ].map((technology) => (
                  <span
                    key={technology}
                    className="whitespace-nowrap rounded-full border border-white/10 bg-white/5 px-[clamp(0.375rem,1.75vw,1rem)] py-2 text-[clamp(0.625rem,3vw,0.875rem)] font-medium text-white/80 backdrop-blur-sm transition-colors hover:bg-white/10 hover:text-white sm:px-5 sm:py-2.5 sm:text-base"
                  >
                    {technology}
                  </span>
                ))}
              </LogosCarousel>
            </div>
          </div>
        </section>

        <section
          data-gsap-experience
          id="experiencia"
          aria-labelledby="experience-title"
          className="w-full py-20 lg:py-32"
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
