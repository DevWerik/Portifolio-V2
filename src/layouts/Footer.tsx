import { ArrowUp } from "lucide-react";

import { useLanguage } from "@/i18n/language-context";

const footerContent = {
  pt: {
    role: "Desenvolvedor Full Stack",
    rights: "Todos os direitos reservados.",
    backToTop: "Voltar ao início",
  },
  en: {
    role: "Full-Stack Developer",
    rights: "All rights reserved.",
    backToTop: "Back to top",
  },
} as const;

export function Footer() {
  const { language } = useLanguage();
  const content = footerContent[language];
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-white/10 px-5 py-8 text-white sm:px-8 lg:px-12">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold">Werik Santos</p>
          <p className="mt-1 text-sm text-zinc-400">{content.role}</p>
          <p className="mt-3 text-xs text-zinc-400">
            © {currentYear} Werik Santos. {content.rights}
          </p>
        </div>

        <a
          href="#inicio"
          className="inline-flex w-fit items-center gap-2 rounded-full border border-white/15 px-4 py-2.5 text-sm text-zinc-300 transition hover:border-white/40 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
        >
          {content.backToTop}
          <ArrowUp className="size-4" aria-hidden="true" />
        </a>
      </div>
    </footer>
  );
}
