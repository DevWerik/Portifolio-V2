import {
  Award,
  BookOpen,
  CalendarDays,
  CircleDashed,
  ExternalLink,
  GraduationCap,
} from "lucide-react";
import { useLayoutEffect, useMemo, useRef } from "react";

import { gsap } from "@/lib/gsap";
import { useLanguage, type Language } from "@/i18n/language-context";

export type Certificate = {
  id: string;
  name: string;
  studied: string;
  platform: string;
  year: number;
  certificateUrl?: string;
};

type CertificatesProps = {
  certificates?: Certificate[];
};

type LocalizedCertificate = Omit<Certificate, "name" | "studied"> & {
  name: Record<Language, string>;
  studied: Record<Language, string>;
};

const CERTIFICATES_COPY = {
  pt: {
    eyebrow: "Formação contínua",
    title: "Certificados",
    description:
      "Cursos e formações que complementam minha experiência e mantêm meu conhecimento em constante evolução.",
    certificate: "certificado",
    certificates: "certificados",
    studied: "O que foi estudado",
    platform: "Plataforma",
    completion: "Conclusão",
    viewCertificate: "Ver certificado",
    linkUpdating: "Link em atualização",
    viewCertificateAria: (name: string) =>
      `Ver certificado ${name} (abre em nova aba)`,
  },
  en: {
    eyebrow: "Continuous learning",
    title: "Certificates",
    description:
      "Courses and training programs that complement my experience and keep my knowledge continuously evolving.",
    certificate: "certificate",
    certificates: "certificates",
    studied: "What I studied",
    platform: "Platform",
    completion: "Completion",
    viewCertificate: "View certificate",
    linkUpdating: "Link being updated",
    viewCertificateAria: (name: string) =>
      `View certificate: ${name} (opens in a new tab)`,
  },
} satisfies Record<Language, object>;

const CERTIFICATES: LocalizedCertificate[] = [
  {
    id: "devclub-react-front-end",
    name: {
      pt: "Front-end com React",
      en: "Front-End with React",
    },
    studied: {
      pt: "Componentização, hooks, gerenciamento de estado, responsividade e acessibilidade.",
      en: "Component architecture, hooks, state management, responsive design, and accessibility.",
    },
    platform: "DevClub",
    year: 2025,
  },
  {
    id: "rocketseat-react-front-end",
    name: {
      pt: "Front-end com React",
      en: "Front-End with React",
    },
    studied: {
      pt: "Componentização, hooks, gerenciamento de estado, responsividade, acessibilidade e TypeScript.",
      en: "Component architecture, hooks, state management, responsive design, accessibility, and TypeScript.",
    },
    platform: "Rocketseat",
    year: 2025,
    certificateUrl:
      "https://app.rocketseat.com.br/certificates/81f16ba3-0210-4487-9691-3e3ebc2b08ee",
  },
  {
    id: "rocketseat-full-stack",
    name: {
      pt: "Desenvolvimento Full Stack",
      en: "Full-Stack Development",
    },
    studied: {
      pt: "Integração entre front-end e back-end, APIs REST, autenticação, banco de dados e entrega de aplicações completas.",
      en: "Front-end and back-end integration, REST APIs, authentication, databases, and end-to-end application delivery.",
    },
    platform: "Rocketseat",
    year: 2025,
    certificateUrl:
      "https://app.rocketseat.com.br/certificates/2a60cae3-4976-4318-88a8-38e185497b2e",
  },
  {
    id: "rocketseat-node-back-end",
    name: {
      pt: "Back-end com Node.js",
      en: "Back-End with Node.js",
    },
    studied: {
      pt: "Arquitetura de APIs, autenticação, persistência de dados, validação e testes no ecossistema Node.js.",
      en: "API architecture, authentication, data persistence, validation, and testing in the Node.js ecosystem.",
    },
    platform: "Rocketseat",
    year: 2026,
    certificateUrl:
      "https://app.rocketseat.com.br/certificates/e161d21b-4d50-42b5-8907-e74a3fb0dba5",
  },
];

export function Certificates({ certificates }: CertificatesProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const { language } = useLanguage();
  const copy = CERTIFICATES_COPY[language];
  const defaultCertificates = useMemo(
    () =>
      CERTIFICATES.map(({ name, studied, ...certificate }) => ({
        ...certificate,
        name: name[language],
        studied: studied[language],
      })),
    [language],
  );
  const displayedCertificates = certificates ?? defaultCertificates;

  useLayoutEffect(() => {
    const media = gsap.matchMedia();

    media.add("(prefers-reduced-motion: no-preference)", () => {
      const context = gsap.context(() => {
        const heading = sectionRef.current?.querySelector<HTMLElement>(
          "[data-gsap-certificate-heading]",
        );
        const cards = sectionRef.current?.querySelectorAll<HTMLElement>(
          "[data-gsap-certificate-card]",
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
            y: 24,
            duration: 0.72,
            ease: "power3.out",
            scrollTrigger: {
              trigger: card,
              start: "top 88%",
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
      id="certificados"
      aria-labelledby="certificates-title"
      tabIndex={-1}
      className="scroll-mt-24 py-20 outline-none lg:py-32"
    >
      <div className="grid gap-12 lg:grid-cols-[minmax(240px,0.7fr)_1.3fr] lg:gap-20">
        <header className="lg:sticky lg:top-28 lg:self-start">
          <div data-gsap-certificate-heading>
            <div className="flex items-center gap-4 text-xs uppercase tracking-[0.28em] text-zinc-400">
              <span aria-hidden="true" className="h-px w-8 bg-zinc-600" />
              {copy.eyebrow}
            </div>

            <h2
              id="certificates-title"
              className="mt-5 text-4xl font-medium tracking-tight text-white sm:text-5xl"
            >
              {copy.title}
            </h2>

            <p className="mt-5 max-w-md text-base leading-7 text-zinc-400">
              {copy.description}
            </p>

            <div className="mt-8 flex items-center gap-3 text-sm text-zinc-400">
              <GraduationCap className="size-5" aria-hidden="true" />
              <span>
                {displayedCertificates.length}{" "}
                {displayedCertificates.length === 1
                  ? copy.certificate
                  : copy.certificates}
              </span>
            </div>
          </div>
        </header>

        <ol className="border-t border-white/10">
          {displayedCertificates.map((certificate, index) => (
            <li key={certificate.id}>
              <article
                data-gsap-certificate-card
                className="group border-b border-white/10 py-8 transition-colors sm:px-6 sm:py-10 sm:hover:bg-white/[0.025]"
              >
                <div className="flex items-start justify-between gap-6">
                  <span
                    aria-hidden="true"
                    className="font-mono text-xs text-zinc-400"
                  >
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  <span className="flex size-10 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/5 text-zinc-400 transition-colors group-hover:border-white/20 group-hover:text-white">
                    <Award className="size-4.5" aria-hidden="true" />
                  </span>
                </div>

                <h3 className="mt-7 max-w-xl text-2xl font-medium tracking-tight text-white sm:text-3xl">
                  {certificate.name}
                </h3>

                <div className="mt-6 max-w-2xl">
                  <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-zinc-400">
                    <BookOpen className="size-3.5" aria-hidden="true" />
                    {copy.studied}
                  </div>
                  <p className="mt-3 leading-7 text-zinc-400">
                    {certificate.studied}
                  </p>
                </div>

                <dl className="mt-8 grid grid-cols-2 gap-4 border-t border-white/10 pt-5">
                  <div>
                    <dt className="text-xs uppercase tracking-[0.18em] text-zinc-400">
                      {copy.platform}
                    </dt>
                    <dd className="mt-2 text-sm font-medium text-zinc-200">
                      {certificate.platform}
                    </dd>
                  </div>

                  <div className="border-l border-white/10 pl-4 sm:pl-6">
                    <dt className="flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-zinc-400">
                      <CalendarDays className="size-3.5" aria-hidden="true" />
                      {copy.completion}
                    </dt>
                    <dd className="mt-2 font-mono text-sm text-zinc-200">
                      <time dateTime={String(certificate.year)}>
                        {certificate.year}
                      </time>
                    </dd>
                  </div>
                </dl>

                {certificate.certificateUrl ? (
                  <a
                    href={certificate.certificateUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={copy.viewCertificateAria(certificate.name)}
                    className="mt-7 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2.5 text-sm font-medium text-zinc-200 transition duration-300 hover:-translate-y-0.5 hover:border-white hover:bg-white hover:text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-4 focus-visible:ring-offset-black"
                  >
                    {copy.viewCertificate}
                    <ExternalLink className="size-4" aria-hidden="true" />
                  </a>
                ) : (
                  <span className="mt-7 inline-flex items-center gap-2 rounded-full border border-dashed border-white/15 px-4 py-2.5 text-sm text-zinc-400">
                    <CircleDashed className="size-4" aria-hidden="true" />
                    {copy.linkUpdating}
                  </span>
                )}
              </article>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
