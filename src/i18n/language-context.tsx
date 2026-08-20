import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type PropsWithChildren,
} from "react";

export type Language = "pt" | "en";

type LanguageContextValue = {
  language: Language;
  setLanguage: (language: Language) => void;
};

const STORAGE_KEY = "portfolio-language";

const SEO_CONTENT = {
  pt: {
    title: "Werik Santos | Desenvolvedor Full Stack",
    description:
      "Portfólio de Werik Santos, desenvolvedor Full Stack especializado em React, TypeScript, Node.js e APIs.",
    socialDescription:
      "Projetos, experiência e formação de Werik Santos em desenvolvimento Full Stack com React, TypeScript e Node.js.",
    socialImageAlt: "Portfólio de Werik Santos, Desenvolvedor Full Stack",
    locale: "pt_BR",
  },
  en: {
    title: "Werik Santos | Full-Stack Developer",
    description:
      "Werik Santos’ portfolio: a Full-Stack Developer focused on React, TypeScript, Node.js, and APIs.",
    socialDescription:
      "Werik Santos’ projects, experience, and education in Full-Stack development with React, TypeScript, and Node.js.",
    socialImageAlt: "Werik Santos’ portfolio, Full-Stack Developer",
    locale: "en_US",
  },
} satisfies Record<
  Language,
  {
    title: string;
    description: string;
    socialDescription: string;
    socialImageAlt: string;
    locale: string;
  }
>;

const LanguageContext = createContext<LanguageContextValue | null>(null);

function getInitialLanguage(): Language {
  if (typeof window === "undefined") return "pt";

  try {
    const storedLanguage = window.localStorage.getItem(STORAGE_KEY);
    if (storedLanguage === "en" || storedLanguage === "pt") {
      return storedLanguage;
    }
  } catch {
    // Browser language detection still works when storage is unavailable.
  }

  const preferredLanguage = navigator.languages
    .map((locale) => locale.toLowerCase())
    .find((locale) => locale.startsWith("pt") || locale.startsWith("en"));

  return preferredLanguage?.startsWith("en") ? "en" : "pt";
}

export function LanguageProvider({ children }: PropsWithChildren) {
  const [language, setLanguage] = useState<Language>(getInitialLanguage);

  useEffect(() => {
    const seo = SEO_CONTENT[language];

    document.documentElement.lang = language === "pt" ? "pt-BR" : "en";
    document.title = seo.title;

    let descriptionMeta = document.querySelector<HTMLMetaElement>(
      'meta[name="description"]',
    );

    if (!descriptionMeta) {
      descriptionMeta = document.createElement("meta");
      descriptionMeta.name = "description";
      document.head.append(descriptionMeta);
    }

    descriptionMeta.content = seo.description;

    updateMetaContent('meta[property="og:title"]', seo.title);
    updateMetaContent('meta[property="og:description"]', seo.socialDescription);
    updateMetaContent('meta[property="og:locale"]', seo.locale);
    updateMetaContent('meta[name="twitter:title"]', seo.title);
    updateMetaContent(
      'meta[name="twitter:description"]',
      seo.socialDescription,
    );
    updateMetaContent('meta[property="og:image:alt"]', seo.socialImageAlt);
    updateMetaContent('meta[name="twitter:image:alt"]', seo.socialImageAlt);

    try {
      window.localStorage.setItem(STORAGE_KEY, language);
    } catch {
      // The language still works when browser storage is unavailable.
    }
  }, [language]);

  const value = useMemo(() => ({ language, setLanguage }), [language]);

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

function updateMetaContent(selector: string, content: string) {
  document
    .querySelector<HTMLMetaElement>(selector)
    ?.setAttribute("content", content);
}

export function useLanguage(): LanguageContextValue {
  const context = useContext(LanguageContext);

  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }

  return context;
}
