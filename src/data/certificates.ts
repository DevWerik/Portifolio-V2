import type { Language } from "@/i18n/language-context";
import { publicAsset } from "@/lib/public-asset";

export type Certificate = {
  id: string;
  name: string;
  studied: string;
  platform: string;
  year: number;
  completedAt?: string;
  hours?: number;
  certificateUrl?: string;
  validationUrl?: string;
};

type LocalizedCertificate = Omit<Certificate, "name" | "studied"> & {
  name: Record<Language, string>;
  studied: Record<Language, string>;
};

export const CERTIFICATES: LocalizedCertificate[] = [
  {
    id: "rocketseat-react",
    name: {
      pt: "React",
      en: "React",
    },
    studied: {
      pt: "Componentes, hooks, Context API, React Query, roteamento, Tailwind CSS, Radix UI e validação com Zod.",
      en: "Components, hooks, Context API, React Query, routing, Tailwind CSS, Radix UI, and validation with Zod.",
    },
    platform: "Rocketseat",
    year: 2026,
    completedAt: "2026-10-20",
    hours: 35,
    certificateUrl: publicAsset("Certificado_React.pdf"),
    validationUrl:
      "https://app.rocketseat.com.br/certificates/ce15c659-a712-4d62-9f8f-1ffdffea42cd",
  },
  {
    id: "rocketseat-reactjs-training",
    name: {
      pt: "Formação em ReactJS",
      en: "ReactJS Training",
    },
    studied: {
      pt: "Fundamentos do ReactJS, SPAs, consumo de APIs, performance, Next.js, Design System, Storybook e aplicações full stack.",
      en: "ReactJS fundamentals, SPAs, API consumption, performance, Next.js, design systems, Storybook, and full-stack applications.",
    },
    platform: "Rocketseat",
    year: 2026,
    completedAt: "2026-10-20",
    hours: 50,
    certificateUrl: publicAsset("Certificado_React - 2022.pdf"),
    validationUrl:
      "https://app.rocketseat.com.br/certificates/c7fe1b75-4d1c-4bd2-8761-ad7828cdd651",
  },
  {
    id: "rocketseat-nodejs-training",
    name: {
      pt: "Formação em Node.js",
      en: "Node.js Training",
    },
    studied: {
      pt: "Node.js, TypeScript, APIs REST com Fastify, Prisma e Knex, autenticação JWT, SOLID, DDD, Clean Architecture e testes com Vitest.",
      en: "Node.js, TypeScript, REST APIs with Fastify, Prisma and Knex, JWT authentication, SOLID, DDD, Clean Architecture, and testing with Vitest.",
    },
    platform: "Rocketseat",
    year: 2026,
    completedAt: "2026-07-20",
    hours: 50,
    certificateUrl: publicAsset("Certificado_Node.js.pdf"),
    validationUrl:
      "https://app.rocketseat.com.br/certificates/2a60cae3-4976-4318-88a8-38e185497b2e",
  },
  {
    id: "rocketseat-nestjs",
    name: {
      pt: "NestJS",
      en: "NestJS",
    },
    studied: {
      pt: "NestJS, injeção de dependência, controllers, services, validação com Zod e testes com Vitest.",
      en: "NestJS, dependency injection, controllers, services, validation with Zod, and testing with Vitest.",
    },
    platform: "Rocketseat",
    year: 2026,
    completedAt: "2026-07-20",
    hours: 12,
    certificateUrl: publicAsset("Certificado_NestJS.pdf"),
    validationUrl:
      "https://app.rocketseat.com.br/certificates/1ba33e1d-78dc-4c14-a6d3-c428434dca7b",
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
  {
    id: "devclub-front-end",
    name: {
      pt: "Desenvolvimento Front End",
      en: "Front-End Development",
    },
    studied: {
      pt: "Componentização, hooks, gerenciamento de estado, responsividade e acessibilidade.",
      en: "Component architecture, hooks, state management, responsive design, and accessibility.",
    },
    platform: "DevClub",
    year: 2025,
    certificateUrl: publicAsset(
      "Certificado - Front End - José Werik dos Anjos de Jesus Santos.pdf",
    ),
  },
  {
    id: "rocketseat-fullstack-81f16",
    name: {
      pt: "Fullstack",
      en: "Full-Stack",
    },
    studied: {
      pt: "Formação em desenvolvimento de aplicações web com tecnologias de front-end e back-end.",
      en: "Web application development training covering front-end and back-end technologies.",
    },
    platform: "Rocketseat",
    year: 2025,
    certificateUrl:
      "https://app.rocketseat.com.br/certificates/81f16ba3-0210-4487-9691-3e3ebc2b08ee",
  },
];
