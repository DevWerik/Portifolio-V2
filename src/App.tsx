import { useLanguage } from "./i18n/language-context";
import { Footer } from "./layouts/Footer";
import { Home } from "./layouts/home";
import { Navbar } from "./layouts/Navbar";

export function App() {
  const { language } = useLanguage();

  return (
    <div className="min-h-screen">
      <a
        href="#conteudo-principal"
        className="fixed left-4 top-4 z-100 -translate-y-24 rounded-full bg-white px-5 py-3 text-sm font-semibold text-black transition-transform focus:translate-y-0 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-4 focus:ring-offset-black"
      >
        {language === "pt" ? "Pular para o conteúdo" : "Skip to content"}
      </a>
      <Navbar />
      <Home />
      <Footer />
    </div>
  );
}
