import type { Language } from "@/i18n/language-context";

type LocalizedText = Record<Language, string>;
export type ProjectStatus = "completed" | "inProgress" | "delivered";

export type Project = {
  id: string;
  title: LocalizedText;
  category: LocalizedText;
  summary: LocalizedText;
  challenge: LocalizedText;
  solution: LocalizedText;
  outcome: LocalizedText;
  role: LocalizedText;
  deliveries: Record<Language, readonly string[]>;
  technologies: readonly string[];
  sourceUrl?: string;
  references: { label: LocalizedText; url: string }[];
  status: ProjectStatus;
  visual: {
    label: string;
    layers: { technology: string; role: LocalizedText }[];
  } | { image: string; alt: LocalizedText; width: number; height: number };
};

export const PROJECTS: Project[] = [
  {
    id: "extraok",
    title: { pt: "ExtraOK", en: "ExtraOK" },
    category: { pt: "Produto próprio · Full Stack", en: "Personal product · Full stack" },
    summary: {
      pt: "Gestão de clientes, atendimentos e aprovação de serviços extras para prestadores de serviço.",
      en: "Client, job, and extra-service approval management for service providers.",
    },
    challenge: {
      pt: "Conectar o trabalho do prestador à aprovação do cliente, mantendo os dados e o histórico de cada atendimento organizados.",
      en: "Connect a provider's work to client approval while keeping each job's data and history organized.",
    },
    solution: {
      pt: "Desenvolvi um monorepo com interface React, API Fastify e persistência com Prisma e PostgreSQL, incluindo sessões e links de aprovação com expiração.",
      en: "I built a monorepo with a React interface, a Fastify API, and Prisma/PostgreSQL persistence, including sessions and expiring approval links.",
    },
    outcome: {
      pt: "O MVP conecta login, cadastro de clientes, atendimentos e aprovação de extras a uma API com dados persistidos. O produto segue em evolução.",
      en: "The MVP connects sign-in, clients, jobs, and extra-service approvals to an API with persisted data. The product is still evolving.",
    },
    role: { pt: "Desenvolvimento da interface, API e modelagem de dados.", en: "Interface, API, and data-model development." },
    deliveries: {
      pt: ["Fluxo de clientes, atendimentos e serviços extras integrado à API.", "Sessões persistidas e aprovação por links com token e expiração.", "Execução documentada com Docker Compose, migrações e verificações de saúde da API."],
      en: ["Client, job, and extra-service flows integrated with the API.", "Persisted sessions and approval links with expiring tokens.", "Documented Docker Compose setup, migrations, and API health checks."],
    },
    technologies: ["React", "TypeScript", "Node.js", "Fastify", "Prisma", "PostgreSQL", "Docker"],
    sourceUrl: "https://github.com/DevWerik/extraok",
    references: [{ label: { pt: "Documentação do projeto", en: "Project documentation" }, url: "https://github.com/DevWerik/extraok#readme" }],
    status: "inProgress",
    visual: { label: "extraok / app", layers: [
      { technology: "React", role: { pt: "Interface do prestador", en: "Provider interface" } },
      { technology: "Fastify + Prisma", role: { pt: "Regras e persistência", en: "Rules and persistence" } },
      { technology: "PostgreSQL", role: { pt: "Clientes e atendimentos", en: "Clients and jobs" } },
    ] },
  },
  {
    id: "sim-chatbot",
    title: { pt: "Chatbot · SIM Instituto Social", en: "Chatbot · SIM Instituto Social" },
    category: { pt: "Experiência profissional · Full Stack", en: "Professional work · Full stack" },
    summary: {
      pt: "Interface de conversa integrada à plataforma de uma organização de impacto social.",
      en: "A conversational interface integrated with a social-impact organization's platform.",
    },
    challenge: {
      pt: "Integrar respostas de IA à interface sem expor a credencial do provedor no navegador e com feedback durante o envio.",
      en: "Integrate AI responses into the interface without exposing the provider credential in the browser, with feedback while sending.",
    },
    solution: {
      pt: "Implementei a interface em React e TypeScript e uma camada Node.js que recebe as mensagens, consulta a API da OpenAI e trata falhas da integração.",
      en: "I implemented the interface in React and TypeScript and a Node.js layer that receives messages, calls the OpenAI API, and handles integration failures.",
    },
    outcome: {
      pt: "O fluxo mantém o histórico da conversa na interface, apresenta estados de envio e erro e concentra o acesso ao provedor no servidor.",
      en: "The flow keeps conversation history in the interface, displays sending and error states, and centralizes provider access on the server.",
    },
    role: { pt: "Interface de chat e integração com a camada de servidor.", en: "Chat interface and server integration." },
    deliveries: {
      pt: ["Componente de conversa com histórico e controle de envio.", "Validação de mensagens e feedback em falhas de conexão ou resposta.", "Credencial do provedor lida no servidor, fora do código entregue ao navegador."],
      en: ["Conversation component with message history and submission state.", "Message validation and feedback for connection or response failures.", "Provider credentials read on the server, outside the browser bundle."],
    },
    technologies: ["React", "TypeScript", "Node.js", "OpenAI API", "Tailwind CSS"],
    references: [{ label: { pt: "Conhecer a organização", en: "About the organization" }, url: "https://simsertaosocial.org/" }],
    status: "delivered",
    visual: { label: "SIM / chatbot", layers: [
      { technology: "React + TypeScript", role: { pt: "Conversa e feedback", en: "Conversation and feedback" } },
      { technology: "Node.js", role: { pt: "Integração no servidor", en: "Server integration" } },
      { technology: "OpenAI API", role: { pt: "Geração de respostas", en: "Response generation" } },
    ] },
  },
  {
    id: "pizza-shop",
    title: { pt: "Pizza Shop", en: "Pizza Shop" },
    category: { pt: "Estudo prático · Front-end", en: "Practice project · Front end" },
    summary: { pt: "Interface de dashboard e pedidos para a operação de um restaurante.", en: "Dashboard and order interface for restaurant operations." },
    challenge: { pt: "Organizar indicadores, gráficos e informações dos pedidos em telas fáceis de consultar.", en: "Organize indicators, charts, and order information into readable screens." },
    solution: { pt: "Construí telas de dashboard, pedidos e autenticação, com React Router, componentes de formulário e gráficos Recharts.", en: "I built dashboard, order, and authentication screens with React Router, form components, and Recharts visualizations." },
    outcome: { pt: "O código reúne cartões de indicadores, gráficos de receita e produtos, tabela de pedidos, filtros e visualização de detalhes. O foco do case é a interface.", en: "The code brings together indicator cards, revenue and product charts, an order table, filters, and a details view. This case focuses on the interface." },
    role: { pt: "Implementação das telas e componentes do front-end.", en: "Front-end screens and component implementation." },
    deliveries: {
      pt: ["Dashboard com indicadores e gráficos de receita e produtos.", "Tela de pedidos com componentes de filtros e detalhes.", "Rotas separadas para a aplicação e para login e cadastro."],
      en: ["Dashboard with indicators and revenue/product charts.", "Orders screen with filter and detail components.", "Separate application, sign-in, and registration routes."],
    },
    technologies: ["React", "TypeScript", "Tailwind CSS", "Radix UI", "React Router", "Recharts", "React Hook Form", "Zod"],
    sourceUrl: "https://github.com/DevWerik/pizzashop-web",
    references: [{ label: { pt: "Explorar as telas no código", en: "Explore the screen implementations" }, url: "https://github.com/DevWerik/pizzashop-web/tree/main/src/pages" }],
    status: "completed",
    visual: { image: "Projeto.png", alt: { pt: "Dashboard do Pizza Shop com métricas, gráfico de receita e produtos populares", en: "Pizza Shop dashboard with metrics, revenue chart, and popular products" }, width: 1911, height: 888 },
  },
  {
    id: "financial-api",
    title: { pt: "API de transações financeiras", en: "Financial Transactions API" },
    category: { pt: "Estudo prático · Back-end", en: "Practice project · Back end" },
    summary: { pt: "API para registrar entradas e saídas, consultar transações e calcular o saldo de uma sessão.", en: "An API to record credits and debits, query transactions, and calculate a session's balance." },
    challenge: { pt: "Validar os dados financeiros e consultar apenas as transações associadas à sessão enviada pelo cliente.", en: "Validate transaction data and query only transactions associated with the client's session." },
    solution: { pt: "Implementei rotas Fastify, schemas Zod, consultas com Knex e identificação de sessão por cookie, com cenários de integração em Vitest e Supertest.", en: "I implemented Fastify routes, Zod schemas, Knex queries, and cookie-based session identification, with Vitest and Supertest integration scenarios." },
    outcome: { pt: "O repositório contém criação, listagem, consulta individual e resumo de transações, além de quatro cenários de teste para esses fluxos.", en: "The repository contains transaction creation, listing, individual lookup, and balance summary, plus four test scenarios for these flows." },
    role: { pt: "Rotas HTTP, validação, persistência e testes de integração.", en: "HTTP routes, validation, persistence, and integration tests." },
    deliveries: {
      pt: ["POST /transactions registra créditos e débitos.", "GET /transactions e GET /transactions/:id consultam os dados da sessão.", "GET /transactions/summary retorna o saldo; os cenários de teste estão disponíveis no repositório."],
      en: ["POST /transactions records credits and debits.", "GET /transactions and GET /transactions/:id query session data.", "GET /transactions/summary returns the balance; test scenarios are available in the repository."],
    },
    technologies: ["Node.js", "TypeScript", "Fastify", "Knex", "PostgreSQL", "Zod", "Vitest", "Supertest"],
    sourceUrl: "https://github.com/DevWerik/Api-Node",
    references: [{ label: { pt: "Ver testes de integração", en: "View integration tests" }, url: "https://github.com/DevWerik/Api-Node/blob/main/src/test/transactions.spec.ts" }],
    status: "inProgress",
    visual: { label: "transactions / API", layers: [
      { technology: "Fastify + Zod", role: { pt: "Rotas e validação", en: "Routes and validation" } },
      { technology: "Knex", role: { pt: "Consultas por sessão", en: "Session-scoped queries" } },
      { technology: "Vitest + Supertest", role: { pt: "Cenários de integração", en: "Integration scenarios" } },
    ] },
  },
];
