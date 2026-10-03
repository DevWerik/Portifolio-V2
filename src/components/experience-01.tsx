import { CodeXmlIcon } from "lucide-react";

import { useLanguage, type Language } from "@/i18n/language-context";
import { publicAsset } from "@/lib/public-asset";
import type { ExperienceItemType } from "./work-experience";
import { WorkExperience } from "./work-experience";

export function Experience01() {
  const { language } = useLanguage();
  const copy = EXPERIENCE_COPY[language];

  return (
    <div className="grid gap-12 lg:grid-cols-[minmax(240px,0.7fr)_1.3fr] lg:gap-20">
      <header className="lg:sticky lg:top-28 lg:self-start">
        <div className="flex items-center gap-4 text-xs uppercase tracking-[0.28em] text-zinc-400">
          <span aria-hidden="true" className="h-px w-8 bg-zinc-600" />
          {copy.eyebrow}
        </div>

        <h2
          id="experience-title"
          className="mt-5 text-4xl font-medium tracking-tight text-white sm:text-5xl"
        >
          {copy.heading}
        </h2>

        <p className="mt-5 max-w-md text-base leading-7 text-zinc-400">
          {copy.description}
        </p>
      </header>

      <div className="border-t border-white/10">
        <WorkExperience
          className="bg-transparent px-0 *:border-b *:border-white/10 *:py-8"
          experiences={createExperiences(copy)}
        />
      </div>
    </div>
  );
}

type ExperienceCopy = {
  eyebrow: string;
  heading: string;
  description: string;
  sim: {
    title: string;
    employmentType: string;
    description: readonly string[];
  };
};

const EXPERIENCE_COPY = {
  pt: {
    eyebrow: "Atuação profissional",
    heading: "Experiência",
    description:
      "Contribuição contínua em produto digital, integrações e experiência do usuário em uma organização de impacto social.",
    sim: {
      title: "Desenvolvedor Front-end",
      employmentType: "Tempo parcial",
      description: [
        "Desenvolvo e mantenho funcionalidades da plataforma web do SIM Instituto Social, atuando na interface, nas integrações com APIs e na experiência do usuário.",
        "Implementei um chatbot com React, TypeScript, Node.js e a API da OpenAI, reunindo histórico da conversa, controle de envio e apresentação das respostas na interface.",
        "Estruturei a camada de servidor responsável por centralizar requisições, proteger credenciais e tratar respostas e falhas da integração.",
        "Implementei estados de carregamento, sucesso e erro, além de validação e feedback para tornar os fluxos mais claros e confiáveis.",
        "Refatorei componentes e fluxos em React e TypeScript, aprimorando tipagem, organização e manutenibilidade do código.",
      ],
    },
  },
  en: {
    eyebrow: "Professional work",
    heading: "Experience",
    description:
      "Ongoing product, integration, and user-experience contributions for a social-impact organization.",
    sim: {
      title: "Front-End Developer",
      employmentType: "Part-time",
      description: [
        "Develop and maintain features for the SIM Instituto Social web platform, working across the interface, API integrations, and user experience.",
        "Implemented a chatbot with React, TypeScript, Node.js, and the OpenAI API, bringing together conversation history, submission state, and responses in the interface.",
        "Structured the server layer that centralizes requests, protects credentials, and handles integration responses and failures.",
        "Implemented loading, success, and error states, along with validation and user feedback, to make flows clearer and more reliable.",
        "Refactored React and TypeScript components and flows to improve type safety, code organization, and maintainability.",
      ],
    },
  },
} satisfies Record<Language, ExperienceCopy>;

function createExperiences(copy: ExperienceCopy): ExperienceItemType[] {
  return [
    {
      id: "sim-instituto-social-frontend-2025",
      companyName: "SIM Instituto Social",
      companyLogo: publicAsset("Logo.jpeg"),
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
            "TypeScript",
            "Tailwind CSS",
            "shadcn/ui",
            "Context API",
            "React Hook Form",
            "Zod",
            "OpenAI API",
            "Node.js",
            "Chatbot",
          ],
          isExpanded: true,
        },
      ],
      isCurrentEmployer: true,
    },
  ];
}
