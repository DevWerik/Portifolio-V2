# Portfólio — Werik Santos

Portfólio profissional bilíngue (português e inglês) desenvolvido com React, TypeScript, Vite e Tailwind CSS.

## Tecnologias

- React e TypeScript
- Vite e Tailwind CSS
- GSAP para animações com suporte a movimento reduzido
- React Hook Form e Zod para validação
- Web3Forms para o formulário de contato

## Executando localmente

Requisitos: Node.js 22.12 ou superior e pnpm.

```bash
pnpm install
cp .env.example .env.local
pnpm dev
```

No Windows PowerShell, use `Copy-Item .env.example .env.local`. Depois, preencha:

- `VITE_SITE_URL`: URL pública completa, com HTTPS e barra final. Inclua a subpasta, se houver.
- `VITE_WEB3FORMS_ACCESS_KEY`: access key do formulário no Web3Forms.

## Verificações

```bash
pnpm lint
pnpm typecheck
pnpm build
```

## Formulário de contato

O formulário utiliza uma access key pública do Web3Forms, validação dos campos e um honeypot como camada adicional contra bots. Antes de publicar:

1. No painel do Web3Forms, mantenha `Captcha Protection` desativado e o `Advanced Spam Filter` ativado.
2. Configure `VITE_WEB3FORMS_ACCESS_KEY` no provedor de hospedagem.
3. Faça um envio real no endereço final, com um assunto identificado como teste, e confirme o recebimento.

## Deploy na Vercel

O arquivo `vercel.json` fixa o preset Vite, o comando de build, a pasta de saída e headers básicos de segurança. No painel da Vercel, em **Project > Settings > Environment Variables**, configure para **Production**:

- `VITE_SITE_URL=https://wasportifolio.vercel.app/`
- `VITE_WEB3FORMS_ACCESS_KEY`: access key do formulário

A Vercel pode manter o Node.js 24.x padrão; o projeto aceita qualquer versão a partir da 22.12. Após criar ou alterar uma variável, faça um novo deploy, pois mudanças de ambiente não afetam builds anteriores.

Se um domínio próprio for conectado, troque `VITE_SITE_URL` pela nova URL canônica, mantendo HTTPS e a barra final. A mesma URL define o caminho base do Vite; em uma hospedagem por subpasta, ela deve incluir o caminho completo.

O build gera `robots.txt` e `sitemap.xml` com a URL configurada e preenche automaticamente canonical, Open Graph e JSON-LD. A arte social editável fica em `public/og-image.svg`; o arquivo publicado é `public/og-image.png` (1200 × 630).

## Conteúdo

Projetos, certificados e experiência ficam tipados junto aos respectivos componentes. URLs de demonstração ou credenciais só devem ser publicadas quando forem verificáveis.
