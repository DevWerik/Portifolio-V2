import { CodeXmlIcon, LightbulbIcon } from "lucide-react";
import { useLanguage, type Language } from "@/i18n/language-context";
import type { ExperienceItemType } from "./work-experience";
import { WorkExperience } from "./work-experience";

export function Experience01() {
  const { language } = useLanguage();
  const copy = EXPERIENCE_COPY[language];

  return (
    <div className="max-w-screen overflow-x-clip">
      <div className="container mx-auto px-4">
        <div className="border-x border-line py-8">
          <h2
            id="experience-title"
            className="screen-line-top screen-line-bottom ml-4 font-heading text-3xl font-medium tracking-tight"
          >
            {copy.heading}
          </h2>

          <WorkExperience
            className="bg-transparent *:screen-line-bottom"
            experiences={createExperiences(copy)}
          />
        </div>
      </div>
    </div>
  );
}

type ExperienceCopy = {
  heading: string;
  sim: {
    title: string;
    employmentType: string;
    description: string;
  };
  pizza: {
    endTitle: string;
    startTitle: string;
    employmentType: string;
    description: string;
  };
  financialApi: {
    companyName: string;
    title: string;
    employmentType: string;
    description: string;
  };
};

const EXPERIENCE_COPY = {
  pt: {
    heading: "Experiência",
    sim: {
      title: "Desenvolvedor Frontend",
      employmentType: "Tempo parcial",
      description: `- Atuei no desenvolvimento e na manutenção da plataforma web do Instituto Social Sertão, lidando com funcionalidades de front-end e back-end, integrações de API e melhorias na experiência do usuário.
\n- Desenvolvi um chatbot inteligente *full-stack* utilizando React, TypeScript, Context API, Node.js e a API da OpenAI (GPT-4o-mini), possibilitando suporte automatizado e respostas em tempo real.
\n- Criei um servidor Node.js para intermediar a comunicação entre o front-end e a API da OpenAI, centralizando requisições, protegendo credenciais e gerenciando respostas e erros.
\n- Implementei a integração com API REST utilizando requisições assíncronas, gerenciando estados de carregamento, sucesso e erro, bem como validação e feedback ao usuário.
\n- Utilizei a Context API para gerenciar globalmente mensagens, histórico de conversas, status de carregamento e compartilhamento de dados entre componentes.
\n- Atualizei e refatorei funcionalidades da plataforma utilizando React e TypeScript, corrigindo bugs, aprimorando a tipagem e melhorando a organização do código.`,
    },
    pizza: {
      endTitle: "Fim",
      startTitle: "Início",
      employmentType: "Tempo parcial",
      description:
        "- Navegação, interface estilo dashboard, gráficos, tabelas, skeletons (efeito de carregamento), interface otimista, consumo de API, requisições HTTP, cache, gerenciamento de estado, testes unitários, mocks HTTP e testes E2E.",
    },
    financialApi: {
      companyName: "API de controle financeiro",
      title: "Backend",
      employmentType: "Tempo parcial",
      description:
        "- Esta aplicação é o back-end para uma plataforma de controle financeiro, onde os usuários podem gerenciar suas finanças, criar orçamentos, acompanhar gastos e muito mais. O sistema é desenhado para ser escalável e manutenível, utilizando uma arquitetura limpa para separar as preocupações e facilitar o desenvolvimento e testes.",
    },
  },
  en: {
    heading: "Experience",
    sim: {
      title: "Frontend Developer",
      employmentType: "Part-time",
      description: `- Worked on the development and maintenance of the Instituto Social Sertão web platform, handling front-end and back-end features, API integrations, and user experience improvements.
\n- Developed an intelligent *full-stack* chatbot using React, TypeScript, Context API, Node.js, and the OpenAI API (GPT-4o-mini), enabling automated support and real-time responses.
\n- Built a Node.js server to mediate communication between the front end and the OpenAI API, centralizing requests, protecting credentials, and handling responses and errors.
\n- Integrated a REST API using asynchronous requests, managing loading, success, and error states, as well as validation and user feedback.
\n- Used the Context API to globally manage messages, conversation history, loading status, and data sharing between components.
\n- Updated and refactored platform features using React and TypeScript, fixing bugs, improving type safety, and enhancing code organization.`,
    },
    pizza: {
      endTitle: "End",
      startTitle: "Start",
      employmentType: "Part-time",
      description:
        "- Navigation, a dashboard-style interface, charts, tables, skeleton loading states, optimistic UI, API consumption, HTTP requests, caching, state management, unit tests, HTTP mocks, and end-to-end tests.",
    },
    financialApi: {
      companyName: "Financial Management API",
      title: "Backend",
      employmentType: "Part-time",
      description:
        "- This application is the back end for a financial management platform where users can manage their finances, create budgets, track expenses, and much more. The system is designed to be scalable and maintainable, using clean architecture to separate concerns and facilitate development and testing.",
    },
  },
} satisfies Record<Language, ExperienceCopy>;

function createExperiences(copy: ExperienceCopy): ExperienceItemType[] {
  return [
    {
      id: "sim-instituto-social-frontend-2025",
      companyName: "SIM Instituto Social",
      companyLogo: "/Logo.jpeg",
      companyWebsite: "https://simsertaosocial.org/",
      positions: [
        {
          id: "1",
          title: copy.sim.title,
          employmentPeriod: {
            start: "03.2025",
          },
          employmentType: copy.sim.employmentType,
          icon: <CodeXmlIcon />,
          description: copy.sim.description,
          skills: [
            "React",
            "Typescript",
            "Tailwind CSS",
            "shadcn/ui",
            "Context API",
            "React Hook Form",
            "Zod",
            "API Openai",
            "Chatbot",
          ],
          isExpanded: true,
        },
      ],
      isCurrentEmployer: true,
    },
    {
      id: "pizza-shop-2025-2026",
      companyName: "Pizza Shop",
      companyLogo: "pizza.svg",
      companyWebsite: "https://github.com/DevWerik/pizzashop-web",
      positions: [
        {
          id: "2",
          title: copy.pizza.endTitle,
          employmentPeriod: {
            start: "03.2026",
          },
          employmentType: copy.pizza.employmentType,
          icon: <CodeXmlIcon />,
          description: copy.pizza.description,
          skills: [
            "Zod",
            "React Hook Form",
            "React Router DOM",
            "React Query",
            "React Helmet(SEO)",
            "Vitest",
          ],
        },
        {
          id: "1",
          title: copy.pizza.startTitle,
          employmentPeriod: {
            start: "01.2025",
          },
          employmentType: copy.pizza.employmentType,
          icon: <LightbulbIcon />,
          skills: ["React", "TypeScript", "TailwindCss", "Shadcn/ui"],
        },
      ],
      isCurrentEmployer: true,
    },
    {
      id: "API de controle financeiro-2026",
      companyName: copy.financialApi.companyName,
      companyLogo: "/rocket.svg",
      companyWebsite: "https://github.com/DevWerik/Api-Node",
      positions: [
        {
          id: "1",
          title: copy.financialApi.title,
          employmentPeriod: {
            start: "05.2026",
          },
          employmentType: copy.financialApi.employmentType,
          icon: <CodeXmlIcon />,
          description: copy.financialApi.description,
          skills: [
            "Node.js",
            "TypeScript",
            "Cookies",
            "PostgreSQL",
            "Fastify",
            "Vitest",
            "Zod",
          ],
          isExpanded: true,
        },
      ],
      isCurrentEmployer: true,
    },
  ];
}
