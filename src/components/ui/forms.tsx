import { zodResolver } from "@hookform/resolvers/zod";
import { LoaderCircle, Mail, Send, ShieldCheck } from "lucide-react";
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { FaGithub, FaLinkedinIn } from "react-icons/fa";
import { z } from "zod";

import { useLanguage, type Language } from "@/i18n/language-context";
import { gsap } from "@/lib/gsap";
import { cn } from "@/lib/utils";

import { Button } from "./button";

const CONTACT = {
  email: "werikanjos02@gmail.com",
  githubUrl: "https://github.com/DevWerik",
  linkedinUrl: "https://www.linkedin.com/in/werik-santos/",
};

const WEB3FORMS_ACCESS_KEY = "29a7722d-e098-4527-aec6-f856af018e30";
const CONTACT_SUBMISSION_TIMEOUT_MS = 15_000;

const CONTACT_COPY = {
  pt: {
    eyebrow: "Entre em contato",
    title: "Vamos conversar?",
    description:
      "Tem um projeto, uma oportunidade ou apenas quer trocar uma ideia? Preencha o formulário ou fale comigo pelas redes abaixo.",
    directEmail: "Ou envie diretamente para",
    emailLabel: "E-mail",
    sendEmailAria: "Enviar e-mail",
    openSocialAria: (label: string) => `Acessar ${label} (abre em nova aba)`,
    fields: {
      name: "Nome",
      email: "E-mail",
      subject: "Assunto",
      message: "Mensagem",
    },
    placeholders: {
      name: "Seu nome",
      email: "voce@exemplo.com",
      subject: "Sobre o que você quer conversar?",
      message: "Conte um pouco sobre sua ideia, projeto ou oportunidade...",
    },
    validation: {
      nameMin: "Informe seu nome com pelo menos 2 caracteres.",
      nameMax: "O nome deve ter no máximo 80 caracteres.",
      emailRequired: "Informe seu e-mail.",
      emailInvalid: "Informe um e-mail válido.",
      subjectMin: "O assunto deve ter pelo menos 3 caracteres.",
      subjectMax: "O assunto deve ter no máximo 120 caracteres.",
      messageMin: "A mensagem deve ter pelo menos 10 caracteres.",
      messageMax: "A mensagem deve ter no máximo 1000 caracteres.",
    },
    sending: "Enviando...",
    send: "Enviar mensagem",
    success: "Mensagem enviada com sucesso! Responderei assim que possível.",
    error:
      "Não foi possível enviar a mensagem. Tente novamente ou use o e-mail acima.",
    timeout:
      "O envio demorou mais que o esperado. Verifique sua conexão e tente novamente.",
    privacyNotice:
      "Ao enviar, seu nome, e-mail e mensagem serão encaminhados pelo Web3Forms para que eu possa responder ao seu contato.",
    web3FormsFromName: "Portfólio de Werik Santos",
    web3FormsSubjectPrefix: "[Portfólio]",
  },
  en: {
    eyebrow: "Get in touch",
    title: "Let’s talk?",
    description:
      "Have a project, an opportunity, or just want to chat? Fill out the form or reach me through the links below.",
    directEmail: "Or email me directly at",
    emailLabel: "Email",
    sendEmailAria: "Send an email",
    openSocialAria: (label: string) => `Open ${label} (opens in a new tab)`,
    fields: {
      name: "Name",
      email: "Email",
      subject: "Subject",
      message: "Message",
    },
    placeholders: {
      name: "Your name",
      email: "you@example.com",
      subject: "What would you like to talk about?",
      message: "Tell me a little about your idea, project, or opportunity...",
    },
    validation: {
      nameMin: "Enter your name using at least 2 characters.",
      nameMax: "Name must be at most 80 characters.",
      emailRequired: "Enter your email address.",
      emailInvalid: "Enter a valid email address.",
      subjectMin: "Subject must contain at least 3 characters.",
      subjectMax: "Subject must be at most 120 characters.",
      messageMin: "Message must contain at least 10 characters.",
      messageMax: "Message must be at most 1,000 characters.",
    },
    sending: "Sending...",
    send: "Send message",
    success:
      "Message sent successfully! I’ll get back to you as soon as possible.",
    error:
      "Your message could not be sent. Please try again or use the email address above.",
    timeout:
      "The request took longer than expected. Check your connection and try again.",
    privacyNotice:
      "When you submit, your name, email address, and message will be sent through Web3Forms so I can reply to your inquiry.",
    web3FormsFromName: "Werik Santos Portfolio",
    web3FormsSubjectPrefix: "[Portfolio]",
  },
} satisfies Record<Language, object>;

function createContactSchema(language: Language) {
  const validation = CONTACT_COPY[language].validation;

  return z.object({
    name: z
      .string()
      .trim()
      .min(2, validation.nameMin)
      .max(80, validation.nameMax),
    email: z
      .string()
      .trim()
      .min(1, validation.emailRequired)
      .email(validation.emailInvalid),
    subject: z
      .string()
      .trim()
      .min(3, validation.subjectMin)
      .max(120, validation.subjectMax),
    message: z
      .string()
      .trim()
      .min(10, validation.messageMin)
      .max(1000, validation.messageMax),
    botcheck: z.boolean().optional(),
  });
}

type ContactFormValues = z.infer<ReturnType<typeof createContactSchema>>;
type SubmissionStatus = "idle" | "success" | "error" | "timeout";

const CONTACT_FIELD_NAMES = ["name", "email", "subject", "message"] as const;

type Web3FormsResponse = {
  success?: boolean;
};

const fieldClassName =
  "mt-2 w-full rounded-xl border border-white/15 bg-black/40 px-4 py-3 text-sm text-white outline-none transition placeholder:text-zinc-500 hover:border-white/30 focus:border-white/50 focus:ring-4 focus:ring-white/10 disabled:cursor-not-allowed disabled:opacity-60 aria-invalid:border-red-400/70 aria-invalid:ring-4 aria-invalid:ring-red-400/15";

export function ContactForm() {
  const sectionRef = useRef<HTMLElement>(null);
  const { language } = useLanguage();
  const copy = CONTACT_COPY[language];
  const contactSchema = useMemo(
    () => createContactSchema(language),
    [language],
  );
  const [submissionStatus, setSubmissionStatus] =
    useState<SubmissionStatus>("idle");
  const {
    register,
    handleSubmit,
    reset,
    getFieldState,
    trigger,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    mode: "onBlur",
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
      botcheck: false,
    },
  });
  const previousLanguageRef = useRef(language);
  const submissionMessage =
    submissionStatus === "success"
      ? copy.success
      : submissionStatus === "error"
        ? copy.error
        : submissionStatus === "timeout"
          ? copy.timeout
          : "";
  const submissionHasError =
    submissionStatus === "error" || submissionStatus === "timeout";

  useEffect(() => {
    if (previousLanguageRef.current === language) return;

    previousLanguageRef.current = language;
    const fieldsToRevalidate = CONTACT_FIELD_NAMES.filter((fieldName) => {
      const fieldState = getFieldState(fieldName);
      return fieldState.invalid || fieldState.isTouched;
    });

    if (fieldsToRevalidate.length > 0) {
      void trigger(fieldsToRevalidate);
    }
  }, [getFieldState, language, trigger]);

  async function onSubmit(values: ContactFormValues) {
    setSubmissionStatus("idle");

    const controller = new AbortController();
    const timeoutId = window.setTimeout(
      () => controller.abort(),
      CONTACT_SUBMISSION_TIMEOUT_MS,
    );

    const formData = new FormData();
    formData.append("access_key", WEB3FORMS_ACCESS_KEY);
    formData.append("from_name", copy.web3FormsFromName);
    formData.append("name", values.name);
    formData.append("email", values.email);
    formData.append(
      "subject",
      `${copy.web3FormsSubjectPrefix} ${values.subject}`,
    );
    formData.append("message", values.message);

    if (values.botcheck) {
      formData.append("botcheck", "on");
    }

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          Accept: "application/json",
        },
        body: formData,
        signal: controller.signal,
      });
      const data = (await response.json()) as Web3FormsResponse;

      if (!response.ok || data.success !== true) {
        throw new Error("Web3Forms submission failed");
      }

      setSubmissionStatus("success");
      reset();
    } catch {
      setSubmissionStatus(controller.signal.aborted ? "timeout" : "error");
    } finally {
      window.clearTimeout(timeoutId);
    }
  }

  const socialLinks = [
    {
      label: "GitHub",
      ariaLabel: copy.openSocialAria("GitHub"),
      href: CONTACT.githubUrl,
      Icon: FaGithub,
      external: true,
    },
    {
      label: "LinkedIn",
      ariaLabel: copy.openSocialAria("LinkedIn"),
      href: CONTACT.linkedinUrl,
      Icon: FaLinkedinIn,
      external: true,
    },
    {
      label: copy.emailLabel,
      ariaLabel: copy.sendEmailAria,
      href: `mailto:${CONTACT.email}`,
      Icon: Mail,
      external: false,
    },
  ];

  useLayoutEffect(() => {
    const media = gsap.matchMedia();

    media.add("(prefers-reduced-motion: no-preference)", () => {
      const context = gsap.context(() => {
        const timeline = gsap.timeline({
          defaults: { ease: "power3.out" },
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 82%",
            once: true,
          },
        });

        timeline
          .from("[data-gsap-contact-heading]", {
            opacity: 0,
            y: 18,
            duration: 0.68,
            stagger: 0.08,
          })
          .from(
            "[data-gsap-social-item]",
            {
              opacity: 0,
              scale: 0.92,
              y: 10,
              duration: 0.42,
              stagger: 0.07,
            },
            "-=0.36",
          )
          .from(
            "[data-gsap-contact-email]",
            { opacity: 0, y: 10, duration: 0.45 },
            "-=0.25",
          )
          .from(
            "[data-gsap-contact-form]",
            { opacity: 0, y: 24, duration: 0.75 },
            "-=0.18",
          );
      }, sectionRef);

      return () => context.revert();
    });

    return () => media.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="contato"
      aria-labelledby="contact-title"
      tabIndex={-1}
      className="scroll-mt-24 py-20 outline-none lg:py-32"
    >
      <div className="mx-auto max-w-4xl">
        <header className="text-center">
          <div
            data-gsap-contact-heading
            className="flex items-center justify-center gap-4 text-xs uppercase tracking-[0.28em] text-zinc-300"
          >
            <span aria-hidden="true" className="h-px w-8 bg-zinc-600" />
            {copy.eyebrow}
            <span aria-hidden="true" className="h-px w-8 bg-zinc-600" />
          </div>

          <h2
            data-gsap-contact-heading
            id="contact-title"
            className="mt-5 text-4xl font-medium tracking-tight text-white sm:text-5xl"
          >
            {copy.title}
          </h2>

          <p
            data-gsap-contact-heading
            className="mx-auto mt-5 max-w-2xl text-base leading-7 text-zinc-300"
          >
            {copy.description}
          </p>

          <ul className="mt-8 flex items-center justify-center gap-3">
            {socialLinks.map(({ label, ariaLabel, href, Icon, external }) => (
              <li data-gsap-social-item key={label}>
                <a
                  href={href}
                  aria-label={ariaLabel}
                  title={label}
                  target={external ? "_blank" : undefined}
                  rel={external ? "noopener noreferrer" : undefined}
                  className="group flex size-12 items-center justify-center rounded-full border border-white/10 bg-white/5 text-zinc-400 transition duration-300 hover:-translate-y-1 hover:border-white/30 hover:bg-white hover:text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-4 focus-visible:ring-offset-black"
                >
                  <Icon className="size-5" aria-hidden="true" />
                </a>
              </li>
            ))}
          </ul>

          <p data-gsap-contact-email className="mt-4 text-sm text-zinc-400">
            {copy.directEmail}{" "}
            <a
              href={`mailto:${CONTACT.email}`}
              className="text-zinc-300 underline decoration-white/20 underline-offset-4 transition hover:text-white hover:decoration-white"
            >
              {CONTACT.email}
            </a>
          </p>
        </header>

        <form
          data-gsap-contact-form
          noValidate
          onSubmit={handleSubmit(onSubmit)}
          onChange={() => {
            setSubmissionStatus("idle");
          }}
          aria-busy={isSubmitting}
          className="mt-12 rounded-3xl border border-white/15 bg-white/[0.05] p-5 text-left backdrop-blur-sm sm:p-8 lg:p-10"
        >
          <input
            type="checkbox"
            tabIndex={-1}
            autoComplete="off"
            aria-hidden="true"
            className="hidden"
            {...register("botcheck")}
          />

          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <label htmlFor="contact-name" className="text-sm text-zinc-200">
                {copy.fields.name}
              </label>
              <input
                id="contact-name"
                type="text"
                required
                disabled={isSubmitting}
                autoComplete="name"
                placeholder={copy.placeholders.name}
                aria-invalid={Boolean(errors.name)}
                aria-describedby={
                  errors.name ? "contact-name-error" : undefined
                }
                className={cn(
                  fieldClassName,
                  errors.name && "border-red-400/60",
                )}
                {...register("name")}
              />
              {errors.name && (
                <p
                  id="contact-name-error"
                  role="alert"
                  className="mt-2 text-xs text-red-300"
                >
                  {errors.name.message}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="contact-email" className="text-sm text-zinc-200">
                {copy.fields.email}
              </label>
              <input
                id="contact-email"
                type="email"
                required
                disabled={isSubmitting}
                inputMode="email"
                autoComplete="email"
                placeholder={copy.placeholders.email}
                aria-invalid={Boolean(errors.email)}
                aria-describedby={
                  errors.email ? "contact-email-error" : undefined
                }
                className={cn(
                  fieldClassName,
                  errors.email && "border-red-400/60",
                )}
                {...register("email")}
              />
              {errors.email && (
                <p
                  id="contact-email-error"
                  role="alert"
                  className="mt-2 text-xs text-red-300"
                >
                  {errors.email.message}
                </p>
              )}
            </div>
          </div>

          <div className="mt-6">
            <label htmlFor="contact-subject" className="text-sm text-zinc-200">
              {copy.fields.subject}
            </label>
            <input
              id="contact-subject"
              type="text"
              required
              disabled={isSubmitting}
              placeholder={copy.placeholders.subject}
              aria-invalid={Boolean(errors.subject)}
              aria-describedby={
                errors.subject ? "contact-subject-error" : undefined
              }
              className={cn(
                fieldClassName,
                errors.subject && "border-red-400/60",
              )}
              {...register("subject")}
            />
            {errors.subject && (
              <p
                id="contact-subject-error"
                role="alert"
                className="mt-2 text-xs text-red-300"
              >
                {errors.subject.message}
              </p>
            )}
          </div>

          <div className="mt-6">
            <label htmlFor="contact-message" className="text-sm text-zinc-200">
              {copy.fields.message}
            </label>
            <textarea
              id="contact-message"
              required
              disabled={isSubmitting}
              rows={6}
              maxLength={1000}
              placeholder={copy.placeholders.message}
              aria-invalid={Boolean(errors.message)}
              aria-describedby={
                errors.message ? "contact-message-error" : undefined
              }
              className={cn(
                fieldClassName,
                "min-h-40 resize-y",
                errors.message && "border-red-400/60",
              )}
              {...register("message")}
            />
            {errors.message && (
              <p
                id="contact-message-error"
                role="alert"
                className="mt-2 text-xs text-red-300"
              >
                {errors.message.message}
              </p>
            )}
          </div>

          <p className="mt-6 flex items-start gap-2 rounded-xl border border-white/10 bg-black/25 px-4 py-3 text-xs leading-5 text-zinc-300">
            <ShieldCheck
              className="mt-0.5 size-4 shrink-0 text-zinc-200"
              aria-hidden="true"
            />
            <span>{copy.privacyNotice}</span>
          </p>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="mt-5 h-12 w-full rounded-xl bg-white px-6 text-sm font-semibold text-black hover:bg-zinc-200"
          >
            {isSubmitting ? (
              <>
                {copy.sending}
                <LoaderCircle
                  data-icon="inline-end"
                  className="size-4 animate-spin"
                  aria-hidden="true"
                />
              </>
            ) : (
              <>
                {copy.send}
                <Send
                  data-icon="inline-end"
                  className="size-4"
                  aria-hidden="true"
                />
              </>
            )}
          </Button>

          <p
            role={submissionHasError ? "alert" : "status"}
            aria-live="polite"
            className={cn(
              "mt-4 min-h-5 text-center text-sm",
              submissionHasError ? "text-red-300" : "text-emerald-300",
            )}
          >
            {submissionMessage}
          </p>
        </form>
      </div>
    </section>
  );
}
