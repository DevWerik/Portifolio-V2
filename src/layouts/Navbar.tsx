import {
  useEffect,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
} from "react";
import { ChevronDown, Languages, Menu, X } from "lucide-react";
import { useLanguage, type Language } from "@/i18n/language-context";

const navigationItems = [
  { key: "home", href: "#inicio" },
  { key: "experience", href: "#experiencia" },
  { key: "projects", href: "#projetos" },
  { key: "certificates", href: "#certificados" },
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
  const [activeSection, setActiveSection] = useState("#inicio");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [languageMenu, setLanguageMenu] = useState<LanguageMenu>(null);
  const desktopLanguageRef = useRef<HTMLDivElement>(null);
  const mobileLanguageRef = useRef<HTMLDivElement>(null);
  const desktopLanguageButtonRef = useRef<HTMLButtonElement>(null);
  const mobileLanguageButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const sections = navigationItems
      .map(({ href }) => document.querySelector(href))
      .filter((section): section is Element => section !== null);

    if (!sections.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleSection = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (visibleSection) {
          setActiveSection(`#${visibleSection.target.id}`);
        }
      },
      {
        rootMargin: "-25% 0px -55% 0px",
        threshold: [0.1, 0.25, 0.5, 0.75],
      },
    );

    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, []);

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

    document.querySelector(href)?.scrollIntoView({
      behavior: prefersReducedMotion ? "auto" : "smooth",
      block: "start",
    });
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
            className=" flex items-center gap-2 px-3 text-sm font-semibold tracking-tight text-white md:hidden"
          >
            <span className=" flex h-7 w-7 items-center justify-center rounded-full bg-white text-xs font-bold text-black">
              W
            </span>

            <span>Werik Santos</span>
          </a>

          {/* DESKTOP */}
          <ul className=" hidden items-center gap-1 md:flex">
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
                    className=" group relative isolate flex items-center justify-center overflow-hidden rounded-full px-4 py-2.5 text-sm font-medium text-zinc-300 transition-all duration-300 hover:text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                  >
                    {/* Fundo branco animado */}
                    <span
                      aria-hidden="true"
                      className=" absolute inset-0 -z-10 scale-75 rounded-full bg-white opacity-0 transition-all duration-300 ease-out group-hover:scale-100 group-hover:opacity-100 group-focus-visible:scale-100 group-focus-visible:opacity-100 "
                    />

                    <span className="relative z-10 whitespace-nowrap">
                      {content.navigation[item.key]}
                    </span>
                  </a>
                </li>
              );
            })}
          </ul>

          {/* DESKTOP ACTIONS */}
          <div className="ml-auto hidden items-center md:flex">
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
              className=" ml-2 inline-flex items-center justify-center rounded-full border border-white/12 bg-white/12 px-4 py-2.5 text-sm font-medium text-white transition-all duration-300 hover:border-white hover:bg-white hover:text-black"
            >
              {content.contact}
            </a>
          </div>

          {/* MOBILE MENU BUTTON */}
          <button
            type="button"
            onClick={handleMobileMenuToggle}
            aria-label={isMobileMenuOpen ? content.closeMenu : content.openMenu}
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-navigation"
            className=" ml-auto flex h-10 w-10 items-center justify-center rounded-full text-zinc-300 transition-all duration-300 hover:bg-white hover:text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white md:hidden"
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
          className={` mt-2 overflow-hidden rounded-3xl border border-white/10 bg-black transition-all duration-300 md:hidden
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
                    className=" group flex w-full items-center rounded-2xl px-4 py-3.5 text-sm font-medium text-zinc-300 transition-all duration-300 hover:bg-white hover:text-black
                    "
                  >
                    <span>{content.navigation[item.key]}</span>

                    {isActive && (
                      <span
                        aria-hidden="true"
                        className=" ml-auto h-1.5 w-1.5 rounded-full bg-white transition-colors duration-300 group-hover:bg-black"
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
                className="flex w-full items-center gap-2 rounded-2xl px-4 py-3.5 text-sm font-medium text-zinc-400 transition-all duration-300 hover:bg-white hover:text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
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
              className=" mt-1 flex w-full items-center justify-center rounded-2xl bg-white px-4 py-3.5 text-sm font-semibold text-black transition-all duration-300 hover:bg-zinc-200"
            >
              {content.contact}
            </a>
          </div>
        </div>
      </nav>
    </header>
  );
}
