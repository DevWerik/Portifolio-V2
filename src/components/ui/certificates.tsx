import {
  Award,
  BookOpen,
  CalendarDays,
  CircleDashed,
  Clock3,
  ExternalLink,
  GraduationCap,
} from "lucide-react";
import { useLayoutEffect, useMemo, useRef } from "react";

import { CERTIFICATES, type Certificate } from "@/data/certificates";
import { gsap } from "@/lib/gsap";
import { useLanguage, type Language } from "@/i18n/language-context";

export type { Certificate } from "@/data/certificates";

type CertificatesProps = {
  certificates?: Certificate[];
};

const CERTIFICATES_COPY = {
  pt: {
    eyebrow: "Formação contínua",
    title: "Certificados",
    description:
      "Cursos e formações que complementam minha experiência e mantêm meu conhecimento em constante evolução.",
    certificate: "certificado",
    certificates: "certificados",
    order: "Mais recentes primeiro",
    studied: "O que foi estudado",
    completion: "Conclusão",
    duration: "Carga horária",
    viewCertificate: "Ver certificado",
    validateCertificate: "Validar credencial",
    linkUpdating: "Link em atualização",
    viewCertificateAria: (name: string) =>
      `Ver certificado ${name} (abre em nova aba)`,
    validateCertificateAria: (name: string) =>
      `Validar credencial ${name} (abre em nova aba)`,
  },
  en: {
    eyebrow: "Continuous learning",
    title: "Certificates",
    description:
      "Courses and training programs that complement my experience and keep my knowledge continuously evolving.",
    certificate: "certificate",
    certificates: "certificates",
    order: "Most recent first",
    studied: "What I studied",
    completion: "Completion",
    duration: "Duration",
    viewCertificate: "View certificate",
    validateCertificate: "Verify credential",
    linkUpdating: "Link being updated",
    viewCertificateAria: (name: string) =>
      `View certificate: ${name} (opens in a new tab)`,
    validateCertificateAria: (name: string) =>
      `Verify credential: ${name} (opens in a new tab)`,
  },
} satisfies Record<Language, object>;

export function Certificates({ certificates }: CertificatesProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const { language } = useLanguage();
  const copy = CERTIFICATES_COPY[language];
  const dateFormatter = useMemo(
    () =>
      new Intl.DateTimeFormat(language === "pt" ? "pt-BR" : "en-US", {
        dateStyle: "medium",
        timeZone: "UTC",
      }),
    [language],
  );
  const displayedCertificates = useMemo(() => {
    const localizedCertificates = certificates ?? CERTIFICATES.map(
      ({ name, studied, ...certificate }) => ({
        ...certificate,
        name: name[language],
        studied: studied[language],
      }),
    );

    return [...localizedCertificates].sort(
      (first, second) =>
        second.year - first.year ||
        (second.completedAt ?? "").localeCompare(first.completedAt ?? ""),
    );
  }, [certificates, language]);
  const certificateGroups = useMemo(() => {
    const groups = new Map<number, Certificate[]>();

    displayedCertificates.forEach((certificate) => {
      const group = groups.get(certificate.year) ?? [];
      group.push(certificate);
      groups.set(certificate.year, group);
    });

    return Array.from(groups, ([year, items]) => ({ year, items }));
  }, [displayedCertificates]);

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
  }, [certificates]);

  return (
    <section
      ref={sectionRef}
      id="certificados"
      aria-labelledby="certificates-title"
      tabIndex={-1}
      className="scroll-mt-24 py-20 outline-none lg:py-32"
    >
      <header data-gsap-certificate-heading>
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

        <p className="mt-5 max-w-2xl text-base leading-7 text-zinc-400">
          {copy.description}
        </p>

        <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-zinc-400">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-zinc-300">
            <GraduationCap className="size-4" aria-hidden="true" />
            {displayedCertificates.length}{" "}
            {displayedCertificates.length === 1
              ? copy.certificate
              : copy.certificates}
          </span>
          <span>{copy.order}</span>
        </div>
      </header>

      <div className="mt-12 space-y-12">
        {certificateGroups.map(({ year, items }) => (
          <section key={year} aria-labelledby={`certificates-year-${year}`}>
            <div className="mb-6 flex items-center gap-4">
              <h3
                id={`certificates-year-${year}`}
                className="font-mono text-xl font-medium text-white"
              >
                {year}
              </h3>
              <span className="text-sm text-zinc-400">
                {items.length}{" "}
                {items.length === 1 ? copy.certificate : copy.certificates}
              </span>
              <span aria-hidden="true" className="h-px flex-1 bg-white/10" />
            </div>

            <ol className="grid gap-5 md:grid-cols-2">
              {items.map((certificate) => (
                <li key={certificate.id} className="flex min-w-0">
                  <article
                    aria-labelledby={`${certificate.id}-title`}
                    data-gsap-certificate-card
                    className="group flex w-full flex-col rounded-2xl border border-white/10 bg-white/[0.035] p-6 transition-colors hover:border-white/20 sm:p-8"
                  >
                    <div className="flex items-center gap-3 text-sm text-zinc-300">
                      <span className="flex size-9 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/5 text-zinc-400 transition-colors group-hover:text-white">
                        <Award className="size-4" aria-hidden="true" />
                      </span>
                      {certificate.platform}
                    </div>

                    <h4
                      id={`${certificate.id}-title`}
                      className="mt-5 text-2xl font-medium tracking-tight text-white"
                    >
                      {certificate.name}
                    </h4>

                    <div className="mt-5">
                      <div className="flex items-center gap-2 text-xs uppercase tracking-[0.16em] text-zinc-400">
                        <BookOpen className="size-3.5" aria-hidden="true" />
                        {copy.studied}
                      </div>
                      <p className="mt-3 text-sm leading-7 text-zinc-400">
                        {certificate.studied}
                      </p>
                    </div>

                    <div className="mt-auto pt-6">
                      <dl className="grid grid-cols-2 gap-4 border-t border-white/10 pt-5">
                        <div>
                          <dt className="flex items-center gap-2 text-xs uppercase tracking-[0.12em] text-zinc-400">
                            <CalendarDays className="size-3.5 shrink-0" aria-hidden="true" />
                            {copy.completion}
                          </dt>
                          <dd className="mt-2 text-sm text-zinc-200">
                            <time dateTime={certificate.completedAt ?? String(certificate.year)}>
                              {certificate.completedAt
                                ? dateFormatter.format(new Date(certificate.completedAt))
                                : certificate.year}
                            </time>
                          </dd>
                        </div>

                        {certificate.hours != null && (
                          <div className="border-l border-white/10 pl-4">
                            <dt className="flex items-center gap-2 text-xs uppercase tracking-[0.12em] text-zinc-400">
                              <Clock3 className="size-3.5 shrink-0" aria-hidden="true" />
                              {copy.duration}
                            </dt>
                            <dd className="mt-2 font-mono text-sm text-zinc-200">
                              {certificate.hours} h
                            </dd>
                          </div>
                        )}
                      </dl>

                      <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-3">
                        {certificate.certificateUrl ? (
                          <a
                            href={certificate.certificateUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={copy.viewCertificateAria(certificate.name)}
                            className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2.5 text-sm font-medium text-zinc-200 transition duration-300 hover:-translate-y-0.5 hover:border-white hover:bg-white hover:text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-4 focus-visible:ring-offset-black"
                          >
                            {copy.viewCertificate}
                            <ExternalLink className="size-4" aria-hidden="true" />
                          </a>
                        ) : (
                          <span className="inline-flex items-center gap-2 rounded-full border border-dashed border-white/15 px-4 py-2.5 text-sm text-zinc-400">
                            <CircleDashed className="size-4" aria-hidden="true" />
                            {copy.linkUpdating}
                          </span>
                        )}

                        {certificate.validationUrl && (
                          <a
                            href={certificate.validationUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={copy.validateCertificateAria(certificate.name)}
                            className="inline-flex items-center gap-2 rounded py-2 text-sm text-zinc-400 underline decoration-white/20 underline-offset-4 transition hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-4 focus-visible:ring-offset-black"
                          >
                            {copy.validateCertificate}
                            <ExternalLink className="size-3.5" aria-hidden="true" />
                          </a>
                        )}
                      </div>
                    </div>
                  </article>
                </li>
              ))}
            </ol>
          </section>
        ))}
      </div>
    </section>
  );
}
