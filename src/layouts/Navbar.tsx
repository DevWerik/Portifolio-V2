import {
  useEffect,
  useRef,
  useState,
  type FocusEvent as ReactFocusEvent,
  type KeyboardEvent as ReactKeyboardEvent,
} from "react";
import { ChevronDown, Languages, Menu, X } from "lucide-react";
import { useLanguage, type Language } from "@/i18n/language-context";
import { cn } from "@/lib/utils";

const navigationItems = [
  { key: "home", href: "#inicio" },
  { key: "experience", href: "#experiencia" },
  { key: "projects", href: "#projetos" },
  { key: "certificates", href: "#certificados" },
] as const;

const observedSectionHrefs = [
  ...navigationItems.map(({ href }) => href),
  "#contato",
] as const;

const languageOptions: Array<{ value: Language; label: string }> = [
  { value: "pt", label: "Português (Brasil)" },
  { value: "en", label: "English" },
];

const navbarContent = {
  pt: {
    navigationLabel: "Navegação principal",
    navigation: {
      home: "Início",
      experience: "Experiência",
      projects: "Projetos",
      certificates: "Certificados",
    },
    selectLanguage: "Selecionar idioma. Idioma atual: Português.",
    languageMenuLabel: "Idiomas disponíveis",
    currentLanguage: "Português",
    shortLanguage: "PT",
    contact: "Entrar em contato",
    openMenu: "Abrir menu",
    closeMenu: "Fechar menu",
  },
  en: {
    navigationLabel: "Main navigation",
    navigation: {
      home: "Home",
      experience: "Experience",
      projects: "Projects",
      certificates: "Certificates",
    },
    selectLanguage: "Select language. Current language: English.",
    languageMenuLabel: "Available languages",
    currentLanguage: "English",
    shortLanguage: "EN",
    contact: "Get in touch",
    openMenu: "Open menu",
    closeMenu: "Close menu",
  },
} as const;

type LanguageMenu = "desktop" | "mobile" | null;

export function Navbar() {
  const { language, setLanguage } = useLanguage();
  const content = navbarContent[language];
  const [activeSection, setActiveSection] = useState(() => {
    if (typeof window === "undefined") return "#inicio";

    return observedSectionHrefs.includes(
      window.location.hash as (typeof observedSectionHrefs)[number],
    )
      ? window.location.hash
      : "#inicio";
  });
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [languageMenu, setLanguageMenu] = useState<LanguageMenu>(null);
  const desktopLanguageRef = useRef<HTMLDivElement>(null);
  const mobileLanguageRef = useRef<HTMLDivElement>(null);
  const desktopLanguageButtonRef = useRef<HTMLButtonElement>(null);
  const mobileLanguageButtonRef = useRef<HTMLButtonElement>(null);
  const mobileMenuButtonRef = useRef<HTMLButtonElement>(null);

  // Recalculate when translated copy changes the height of the sections.
  useEffect(() => {
    const sections = observedSectionHrefs
      .map((href) => document.querySelector<HTMLElement>(href))
      .filter((section): section is HTMLElement => section !== null);

    if (!sections.length) return;

    let scrollFrame = 0;

    const updateActiveSection = () => {
      scrollFrame = 0;
      const readingLine = window.innerHeight * 0.32;
      let currentSection = sections[0];

      for (const section of sections) {
        if (section.getBoundingClientRect().top <= readingLine) {
          currentSection = section;
          continue;
        }

        break;
      }

      const reachedPageEnd =
        window.scrollY + window.innerHeight >=
        document.documentElement.scrollHeight - 2;

      if (reachedPageEnd) {
        currentSection = sections.at(-1) ?? currentSection;
      }

      setActiveSection(`#${currentSection.id}`);
    };

    const scheduleActiveSectionUpdate = () => {
      if (scrollFrame) return;

      scrollFrame = window.requestAnimationFrame(updateActiveSection);
    };

    updateActiveSection();
    window.addEventListener("scroll", scheduleActiveSectionUpdate, {
      passive: true,
    });
    window.addEventListener("resize", scheduleActiveSectionUpdate);

    return () => {
      window.cancelAnimationFrame(scrollFrame);
      window.removeEventListener("scroll", scheduleActiveSectionUpdate);
      window.removeEventListener("resize", scheduleActiveSectionUpdate);
    };
  }, [language]);

  useEffect(() => {
    let scrollFrame = 0;

    const syncNavigationFromHistory = () => {
      const requestedHash = window.location.hash;
      const isSkipTarget = requestedHash === "#conteudo-principal";
      const hash = isSkipTarget
        ? requestedHash
        : observedSectionHrefs.includes(
              requestedHash as (typeof observedSectionHrefs)[number],
            )
          ? requestedHash
          : "#inicio";

      setActiveSection(isSkipTarget ? "#inicio" : hash);
      setIsMobileMenuOpen(false);
      setLanguageMenu(null);

      window.cancelAnimationFrame(scrollFrame);
      scrollFrame = window.requestAnimationFrame(() => {
        const prefersReducedMotion = window.matchMedia(
          "(prefers-reduced-motion: reduce)",
        ).matches;
        const target = document.querySelector<HTMLElement>(hash);

        target?.scrollIntoView({
          behavior: prefersReducedMotion || isSkipTarget ? "auto" : "smooth",
          block: "start",
        });
        target?.focus({ preventScroll: true });
      });
    };

    window.addEventListener("popstate", syncNavigationFromHistory);
    window.addEventListener("hashchange", syncNavigationFromHistory);

    if (window.location.hash) {
      syncNavigationFromHistory();
    }

    return () => {
      window.cancelAnimationFrame(scrollFrame);
      window.removeEventListener("popstate", syncNavigationFromHistory);
      window.removeEventListener("hashchange", syncNavigationFromHistory);
    };
  }, []);

  useEffect(() => {
    if (!isMobileMenuOpen) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key !== "Escape" || languageMenu) return;

      event.preventDefault();
      setIsMobileMenuOpen(false);
      mobileMenuButtonRef.current?.focus();
    };

    document.addEventListener("keydown", handleEscape);

    return () => document.removeEventListener("keydown", handleEscape);
  }, [isMobileMenuOpen, languageMenu]);

  useEffect(() => {
    if (!languageMenu) return;

    const menuContainer =
      languageMenu === "desktop"
        ? desktopLanguageRef.current
        : mobileLanguageRef.current;
    const focusFrame = window.requestAnimationFrame(() => {
      menuContainer
        ?.querySelector<HTMLButtonElement>(
          `[role="menuitemradio"][data-language="${language}"]`,
        )
        ?.focus();
    });

    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target;

      if (
        target instanceof Node &&
        !desktopLanguageRef.current?.contains(target) &&
        !mobileLanguageRef.current?.contains(target)
      ) {
        setLanguageMenu(null);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;

      event.preventDefault();
      setLanguageMenu(null);

      const trigger =
        languageMenu === "desktop"
          ? desktopLanguageButtonRef.current
          : mobileLanguageButtonRef.current;
      trigger?.focus();
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleEscape);

    return () => {
      window.cancelAnimationFrame(focusFrame);
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [language, languageMenu]);

  const handleNavigation = (href: string) => {
    setActiveSection(href);
    setIsMobileMenuOpen(false);
    setLanguageMenu(null);

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (window.location.hash !== href) {
      window.history.pushState(null, "", href);
    }

    const target = document.querySelector<HTMLElement>(href);

    target?.scrollIntoView({
      behavior: prefersReducedMotion ? "auto" : "smooth",
      block: "start",
    });
    target?.focus({ preventScroll: true });
  };

  const handleMobileMenuToggle = () => {
    const willOpen = !isMobileMenuOpen;
    setIsMobileMenuOpen(willOpen);

    if (!willOpen) {
      setLanguageMenu(null);
    }
  };

  const handleLanguageSelect = (
    nextLanguage: Language,
    menu: Exclude<LanguageMenu, null>,
  ) => {
    setLanguage(nextLanguage);
    setLanguageMenu(null);

    window.requestAnimationFrame(() => {
      const trigger =
        menu === "desktop"
          ? desktopLanguageButtonRef.current
          : mobileLanguageButtonRef.current;
      trigger?.focus();
    });
  };

  const handleLanguageMenuKeyDown = (
    event: ReactKeyboardEvent<HTMLDivElement>,
  ) => {
    if (!["ArrowDown", "ArrowUp", "Home", "End"].includes(event.key)) {
      return;
    }

    event.preventDefault();
    const options = Array.from(
      event.currentTarget.querySelectorAll<HTMLButtonElement>(
        '[role="menuitemradio"]',
      ),
    );
    const currentIndex = options.indexOf(
      document.activeElement as HTMLButtonElement,
    );
    let nextIndex = currentIndex;

    if (event.key === "Home") nextIndex = 0;
    if (event.key === "End") nextIndex = options.length - 1;
    if (event.key === "ArrowDown") {
      nextIndex = currentIndex < 0 ? 0 : (currentIndex + 1) % options.length;
    }
    if (event.key === "ArrowUp") {
      nextIndex =
        currentIndex < 0
          ? options.length - 1
          : (currentIndex - 1 + options.length) % options.length;
    }

    options[nextIndex]?.focus();
  };

  const handleLanguageMenuBlur = (event: ReactFocusEvent<HTMLDivElement>) => {
    const nextTarget = event.relatedTarget;

    if (
      !(nextTarget instanceof Node) ||
      !event.currentTarget.contains(nextTarget)
    ) {
      setLanguageMenu(null);
    }
  };

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-5">
      <nav
        aria-label={content.navigationLabel}
        className="mx-auto w-full max-w-6xl"
      >
        {/* NAVBAR */}
        <div className=" relative flex min-h-14.5 w-full items-center rounded-full border border-white/10 bg-black px-2">
          {/* IDENTIDADE MOBILE */}
          <a
            href="#inicio"
            onClick={(event) => {
              event.preventDefault();
              handleNavigation("#inicio");
            }}
            className="flex min-w-0 items-center gap-2 px-3 text-sm font-semibold tracking-tight text-white lg:hidden"
          >
            <span className=" flex h-7 w-7 items-center justify-center rounded-full bg-white text-xs font-bold text-black">
              W
            </span>

            <span className="truncate">Werik Santos</span>
          </a>

          {/* DESKTOP */}
          <ul className="hidden items-center gap-1 lg:flex">
            {navigationItems.map((item) => {
              const isActive = activeSection === item.href;

              return (
                <li key={item.href}>
                  <a
                    href={item.href}
                    onClick={(event) => {
                      event.preventDefault();
                      handleNavigation(item.href);
                    }}
                    aria-current={isActive ? "location" : undefined}
                    className={cn(
                      "flex items-center justify-center rounded-full px-4 py-2.5 text-sm font-medium transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white",
                      isActive
                        ? "bg-white text-black"
                        : "text-zinc-300 hover:bg-white/10 hover:text-white",
                    )}
                  >
                    <span className="whitespace-nowrap">
                      {content.navigation[item.key]}
                    </span>
                  </a>
                </li>
              );
            })}
          </ul>

          {/* DESKTOP ACTIONS */}
          <div className="ml-auto hidden items-center lg:flex">
            <span aria-hidden="true" className="mx-3 h-6 w-px bg-white/10" />

            {/* Idioma */}
            <div ref={desktopLanguageRef} className="relative">
              <button
                ref={desktopLanguageButtonRef}
                id="desktop-language-trigger"
                type="button"
                onClick={() =>
                  setLanguageMenu((current) =>
                    current === "desktop" ? null : "desktop",
                  )
                }
                aria-label={content.selectLanguage}
                aria-haspopup="menu"
                aria-expanded={languageMenu === "desktop"}
                aria-controls="desktop-language-menu"
                className="group flex items-center gap-1.5 rounded-full px-3 py-2.5 text-sm font-medium text-zinc-400 transition-all duration-300 hover:bg-white hover:text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                <Languages className="h-4 w-4" aria-hidden="true" />

                <span>{content.shortLanguage}</span>

                <ChevronDown
                  className={`h-3.5 w-3.5 transition-transform duration-300 ${
                    languageMenu === "desktop"
                      ? "rotate-180"
                      : "group-hover:translate-y-0.5"
                  }`}
                  aria-hidden="true"
                />
              </button>

              {languageMenu === "desktop" && (
                <div
                  id="desktop-language-menu"
                  role="menu"
                  aria-label={content.languageMenuLabel}
                  onKeyDown={handleLanguageMenuKeyDown}
                  onBlur={handleLanguageMenuBlur}
                  className="absolute right-0 top-[calc(100%+0.5rem)] z-50 min-w-48 rounded-2xl border border-white/10 bg-black p-1.5"
                >
                  {languageOptions.map((option) => {
                    const isSelected = option.value === language;

                    return (
                      <button
                        key={option.value}
                        type="button"
                        role="menuitemradio"
                        aria-checked={isSelected}
                        tabIndex={isSelected ? 0 : -1}
                        data-language={option.value}
                        onClick={() =>
                          handleLanguageSelect(option.value, "desktop")
                        }
                        className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium text-zinc-300 transition-colors hover:bg-white hover:text-black focus-visible:bg-white focus-visible:text-black focus-visible:outline-none"
                      >
                        <span>{option.label}</span>
                        <span
                          aria-hidden="true"
                          className={`ml-auto h-1.5 w-1.5 rounded-full ${
                            isSelected ? "bg-current" : "bg-transparent"
                          }`}
                        />
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Contato */}
            <a
              href="#contato"
              onClick={(event) => {
                event.preventDefault();
                handleNavigation("#contato");
              }}
              aria-current={
                activeSection === "#contato" ? "location" : undefined
              }
              className={cn(
                "ml-2 inline-flex items-center justify-center rounded-full border px-4 py-2.5 text-sm font-medium transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white",
                activeSection === "#contato"
                  ? "border-white bg-white text-black"
                  : "border-white/15 bg-white/10 text-white hover:border-white/40 hover:bg-white/15",
              )}
            >
              {content.contact}
            </a>
          </div>

          {/* MOBILE MENU BUTTON */}
          <button
            ref={mobileMenuButtonRef}
            type="button"
            onClick={handleMobileMenuToggle}
            aria-label={isMobileMenuOpen ? content.closeMenu : content.openMenu}
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-navigation"
            className="ml-auto flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-zinc-200 transition-all duration-300 hover:bg-white hover:text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white lg:hidden"
          >
            {isMobileMenuOpen ? (
              <X className="h-5 w-5" aria-hidden="true" />
            ) : (
              <Menu className="h-5 w-5" aria-hidden="true" />
            )}
          </button>
        </div>

        {/* MOBILE NAVIGATION */}
        <div
          id="mobile-navigation"
          aria-hidden={!isMobileMenuOpen}
          className={`mt-2 overflow-hidden rounded-3xl border border-white/10 bg-black transition-all duration-300 lg:hidden
            ${
              isMobileMenuOpen
                ? "visible max-h-125 translate-y-0 opacity-100"
                : "invisible max-h-0 -translate-y-2 opacity-0"
            }
          `}
        >
          <ul className="p-2">
            {navigationItems.map((item) => {
              const isActive = activeSection === item.href;

              return (
                <li key={item.href}>
                  <a
                    href={item.href}
                    onClick={(event) => {
                      event.preventDefault();
                      handleNavigation(item.href);
                    }}
                    aria-current={isActive ? "location" : undefined}
                    className={cn(
                      "group flex w-full items-center rounded-2xl px-4 py-3.5 text-sm font-medium transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-white",
                      isActive
                        ? "bg-white text-black"
                        : "text-zinc-200 hover:bg-white/10 hover:text-white",
                    )}
                  >
                    <span>{content.navigation[item.key]}</span>

                    {isActive && (
                      <span
                        aria-hidden="true"
                        className="ml-auto h-1.5 w-1.5 rounded-full bg-current"
                      />
                    )}
                  </a>
                </li>
              );
            })}
          </ul>

          {/* Divisor */}
          <div className="mx-3 h-px bg-white/10" />

          <div className="p-2">
            {/* Idioma */}
            <div ref={mobileLanguageRef}>
              <button
                ref={mobileLanguageButtonRef}
                id="mobile-language-trigger"
                type="button"
                onClick={() =>
                  setLanguageMenu((current) =>
                    current === "mobile" ? null : "mobile",
                  )
                }
                aria-label={content.selectLanguage}
                aria-haspopup="menu"
                aria-expanded={languageMenu === "mobile"}
                aria-controls="mobile-language-menu"
                className="flex w-full items-center gap-2 rounded-2xl px-4 py-3.5 text-sm font-medium text-zinc-200 transition-all duration-300 hover:bg-white hover:text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                <Languages className="h-4 w-4" aria-hidden="true" />

                <span>{content.currentLanguage}</span>

                <ChevronDown
                  className={`ml-auto h-4 w-4 transition-transform duration-300 ${
                    languageMenu === "mobile" ? "rotate-180" : ""
                  }`}
                  aria-hidden="true"
                />
              </button>

              {languageMenu === "mobile" && (
                <div
                  id="mobile-language-menu"
                  role="menu"
                  aria-label={content.languageMenuLabel}
                  onKeyDown={handleLanguageMenuKeyDown}
                  onBlur={handleLanguageMenuBlur}
                  className="mt-1 rounded-2xl border border-white/10 p-1.5"
                >
                  {languageOptions.map((option) => {
                    const isSelected = option.value === language;

                    return (
                      <button
                        key={option.value}
                        type="button"
                        role="menuitemradio"
                        aria-checked={isSelected}
                        tabIndex={isSelected ? 0 : -1}
                        data-language={option.value}
                        onClick={() =>
                          handleLanguageSelect(option.value, "mobile")
                        }
                        className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-medium text-zinc-300 transition-colors hover:bg-white hover:text-black focus-visible:bg-white focus-visible:text-black focus-visible:outline-none"
                      >
                        <span>{option.label}</span>
                        <span
                          aria-hidden="true"
                          className={`ml-auto h-1.5 w-1.5 rounded-full ${
                            isSelected ? "bg-current" : "bg-transparent"
                          }`}
                        />
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Contato */}
            <a
              href="#contato"
              onClick={(event) => {
                event.preventDefault();
                handleNavigation("#contato");
              }}
              aria-current={
                activeSection === "#contato" ? "location" : undefined
              }
              className={cn(
                "mt-1 flex w-full items-center justify-center rounded-2xl border px-4 py-3.5 text-sm font-semibold transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white",
                activeSection === "#contato"
                  ? "border-white bg-white text-black"
                  : "border-white/20 bg-white/10 text-white hover:bg-white hover:text-black",
              )}
            >
              {content.contact}
            </a>
          </div>
        </div>
      </nav>
    </header>
  );
}
