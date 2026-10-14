# Fontes dos estudos de caso

Revisão de conteúdo em 2 de outubro de 2026. O conteúdo do site fica em `src/data/projects.ts`; o currículo em `src/data/resume.json`.

## ExtraOK

- [Repositório e documentação](https://github.com/DevWerik/extraok#readme): monorepo React/Fastify, Prisma/PostgreSQL, clientes, atendimentos, extras, sessões e aprovação por links com expiração.
- A documentação apresenta o núcleo como um MVP persistente e autenticado, com requisitos de hospedagem ainda dependentes do ambiente.
- Classificado como produto próprio em evolução. Não foram afirmados números de clientes, receita, disponibilidade em produção ou cobertura de testes.

Atualização do card em 14 de outubro de 2026:

- Captura da página inicial fornecida pelo proprietário em `public/projects/extraok.png`, preservada em 1440 × 826 pixels e exibida sem recorte, com texto alternativo em português e inglês.
- Incluído o link [Acessar projeto](https://app.extraok.workers.dev), preservando os links de código e documentação. O endereço consta no relatório técnico da cópia local do ExtraOK (`docs/relatorio-post-extraok.md`).
- Conteúdo e tecnologias conferidos no README, nos manifests de `apps/web` e `apps/api` e no relatório técnico local: aprovação por link sem cadastro do cliente, relatórios/exportações conforme o plano, TanStack Query, Tailwind CSS e configuração de publicação com Cloudflare Workers e Render.
- O card continua classificado como produto em evolução. A inclusão do link não representa uma validação dos fluxos autenticados ou dos pagamentos em produção.
- Validação desta atualização: lint e build aprovados; os dois testes existentes de cases, links, PDFs e overflow passaram em desktop e mobile. A conferência do build também confirmou o carregamento da captura, os links e textos alternativos em PT/EN e a ausência de overflow horizontal em 1440 e 393 pixels, com revisão visual das capturas.

## Chatbot do SIM Instituto Social

- Experiência profissional, vínculo e data preservados de `src/components/experience-01.tsx`.
- Implementação conferida na cópia local do projeto `sim-instituto2`: `src/hooks/useAiAgent.ts`, `src/components/agente-ia/agente.tsx`, `src/config/openai.ts` e `server.js`.
- Foram confirmados histórico na interface, estados de envio/erro, requisição à camada de servidor e uso de credencial por variável de ambiente no servidor. A integração recebe a resposta em JSON; não foi descrita como streaming.
- O link do case leva à [organização](https://simsertaosocial.org/), sem apresentá-lo como demonstração validada do chatbot. O repositório público `Lulu-IA` não foi vinculado como se fosse o código da implementação atual.
- Sem publicação de código privado, conversas, credenciais ou dados de usuários.

## Pizza Shop

- [Código](https://github.com/DevWerik/pizzashop-web) e [telas](https://github.com/DevWerik/pizzashop-web/tree/main/src/pages): dashboard, gráficos, pedidos, filtros, detalhes e telas de autenticação.
- Stack conferida no `package.json`. A captura já existente em `public/Projeto.png` foi preservada.
- Apresentado como estudo de interface, sem alegar operação real de restaurante, backend integrado ou métricas de impacto.
- Nenhuma URL de demonstração foi encontrada no campo `homepage` do repositório. O botão oferece acesso ao código e às telas implementadas.

## API de transações financeiras

- [Código](https://github.com/DevWerik/Api-Node).
- [Rotas](https://github.com/DevWerik/Api-Node/blob/main/src/routes/transactions.ts): criar, listar, consultar uma transação e retornar o saldo, com consultas limitadas ao cookie de sessão.
- [Testes](https://github.com/DevWerik/Api-Node/blob/main/src/test/transactions.spec.ts): quatro cenários de integração. A existência dos cenários foi confirmada; a suíte desse outro repositório não foi executada nesta revisão.
- Stack conferida no `package.json`: Fastify, Knex, PostgreSQL/SQLite, Zod, Vitest e Supertest.
- Removidas alegações sobre orçamentos e arquitetura desacoplada que não eram sustentadas pelo código consultado. Mantido o estado em evolução, sem inferir conclusão pela data do último commit.

## Critérios editoriais

- O campo automático de meses foi retirado dos cards: tempo desde uma data não comprova esforço de desenvolvimento. Datas de criação e último push do GitHub também não foram convertidas em períodos de trabalho.
- Entregas observáveis substituem resultados genéricos; métricas de impacto só devem entrar quando houver medição.
- Currículos PT/EN derivados das informações profissionais já presentes e dos projetos verificados. Não foram acrescentados graduação, nível de inglês, telefone, disponibilidade, senioridade ou resultados comerciais.
- LinkedIn `linkedin.com/in/werik-santos/` confirmado pelo proprietário durante a revisão; mantido no site e nos currículos.
- Testes do formulário usam respostas simuladas. O recebimento de e-mail no serviço real ainda exige validação após a publicação.

## Validação local desta alteração

- `pnpm lint`: aprovado com ESLint 10, sem avisos.
- `pnpm build`: TypeScript e build Vite aprovados, incluindo a tipagem dos testes.
- `pnpm test`: 13 testes aprovados; um caso exclusivo de mobile é ignorado no projeto desktop. Cobertura de idioma/persistência, metadados, navegação/foco, validação do formulário, envio simulado, erro com nova tentativa, timeout, links dos cases e arquivos PDF.
- Chromium em desktop e mobile; revisão visual das capturas e dos currículos PT/EN rasterizados a partir dos PDFs. Ambos têm uma página, texto extraível e links clicáveis.
- A execução restrita no Windows ficou presa ao encerrar o servidor Vite. Após encerrar somente esse servidor, a suíte foi repetida com permissão para gerenciar seus processos e terminou normalmente em 20,6 segundos.
- Workflow de CI criado, mas ainda não executado no GitHub. A validação não cobre entrega real de e-mail, comportamento em outros navegadores ou uma nova publicação em produção.
