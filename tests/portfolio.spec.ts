import { expect, test, type Page } from "@playwright/test";

const submitUrl = "https://api.web3forms.com/submit";

async function selectEnglish(page: Page, mobile: boolean) {
  if (mobile) await page.getByRole("button", { name: "Abrir menu", exact: true }).click();
  await page.getByRole("button", { name: /Selecionar idioma/ }).click();
  await page.getByRole("menuitemradio", { name: "English", exact: true }).click();
  if (mobile) await page.getByRole("button", { name: "Close menu", exact: true }).click();
}

async function fillContact(page: Page) {
  await page.getByLabel("Nome", { exact: true }).fill("Pessoa de teste");
  await page.getByLabel("E-mail", { exact: true }).fill("portfolio@example.com");
  await page.getByLabel("Assunto", { exact: true }).fill("Contato sobre projeto");
  await page.getByLabel("Mensagem", { exact: true }).fill("Gostaria de conversar sobre uma oportunidade de desenvolvimento.");
}

test.beforeEach(async ({ page }) => {
  // A test can override this route with a mock response; real messages never leave the browser.
  await page.route(submitUrl, (route) => route.abort());
  await page.goto("/");
});

test("idioma persiste, atualiza metadados e seleciona o currículo correspondente", async ({ page, isMobile }) => {
  await expect(page.locator("html")).toHaveAttribute("lang", "pt-BR");
  await expect(page.getByRole("link", { name: "Baixar currículo (PDF)" })).toHaveAttribute("href", /werik-santos-pt\.pdf$/);
  await selectEnglish(page, isMobile);
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  await expect(page).toHaveTitle("Werik Santos | Full-Stack Developer");
  await expect(page.getByRole("link", { name: "Download résumé (PDF)" })).toHaveAttribute("href", /werik-santos-en\.pdf$/);
  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("React interfaces");
});

test("navegação mobile fecha com Escape e move o foco para a seção escolhida", async ({ page, isMobile }) => {
  test.skip(!isMobile, "Fluxo específico do menu mobile");
  const openMenu = page.getByRole("button", { name: "Abrir menu", exact: true });
  await openMenu.click();
  await page.keyboard.press("Escape");
  await expect(openMenu).toBeFocused();
  await expect(openMenu).toHaveAttribute("aria-expanded", "false");
  await openMenu.click();
  await page.getByRole("navigation").getByRole("link", { name: "Projetos", exact: true }).click();
  await expect(page).toHaveURL(/#projetos$/);
  await expect(page.locator("#projetos")).toBeFocused();
  await expect(openMenu).toHaveAttribute("aria-expanded", "false");
});

test("formulário inválido não envia e traduz os erros já exibidos", async ({ page, isMobile }) => {
  const requests: string[] = [];
  page.on("request", (request) => { if (request.url() === submitUrl) requests.push(request.url()); });
  await page.getByRole("button", { name: "Enviar mensagem", exact: true }).click();
  await expect(page.getByText("Informe seu nome com pelo menos 2 caracteres.")).toBeVisible();
  await expect(page.getByLabel("Nome", { exact: true })).toBeFocused();
  await selectEnglish(page, isMobile);
  await expect(page.getByText("Enter your name using at least 2 characters.")).toBeVisible();
  expect(requests).toHaveLength(0);
});

test("envio bem-sucedido inclui os dados e limpa o formulário", async ({ page }) => {
  let payload = "";
  await page.route(submitUrl, async (route) => {
    payload = route.request().postData() ?? "";
    await route.fulfill({ json: { success: true } });
  });
  await fillContact(page);
  await page.getByRole("button", { name: "Enviar mensagem", exact: true }).click();
  await expect(page.getByRole("status")).toContainText("Mensagem enviada com sucesso!");
  expect(payload).toContain("portfolio-e2e-test-key");
  expect(payload).toContain("portfolio@example.com");
  expect(payload).toContain("[Portfólio] Contato sobre projeto");
  await expect(page.getByLabel("Nome", { exact: true })).toHaveValue("");
  await expect(page.getByLabel("Mensagem", { exact: true })).toHaveValue("");
});

test("falha de envio preserva a mensagem e permite nova tentativa", async ({ page }) => {
  await page.route(submitUrl, (route) => route.fulfill({ status: 503, json: { success: false } }));
  await fillContact(page);
  await page.getByRole("button", { name: "Enviar mensagem", exact: true }).click();
  await expect(page.getByRole("alert")).toContainText("Não foi possível enviar");
  await expect(page.getByLabel("Mensagem", { exact: true })).not.toHaveValue("");
  await expect(page.getByRole("button", { name: "Enviar mensagem", exact: true })).toBeEnabled();
  await page.route(submitUrl, (route) => route.fulfill({ json: { success: true } }));
  await page.getByRole("button", { name: "Enviar mensagem", exact: true }).click();
  await expect(page.getByRole("status")).toContainText("Mensagem enviada com sucesso!");
});

test("timeout encerra o envio sem apagar o conteúdo", async ({ page }) => {
  await page.clock.install();
  await page.route(submitUrl, () => { /* Keep the mocked request pending until the app aborts it. */ });
  await fillContact(page);
  await page.getByRole("button", { name: "Enviar mensagem", exact: true }).click();
  await expect(page.getByRole("button", { name: "Enviando...", exact: true })).toBeDisabled();
  await page.clock.fastForward(16_000);
  await expect(page.getByRole("alert")).toContainText("O envio demorou mais que o esperado");
  await expect(page.getByLabel("Mensagem", { exact: true })).not.toHaveValue("");
});

test("cases, links e PDFs estão disponíveis sem erros de renderização ou overflow", async ({ page, request }, testInfo) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => { if (message.type() === "error") errors.push(message.text()); });
  await page.reload();
  const projects = page.locator("#projetos article");
  await expect(projects).toHaveCount(4);
  await expect(page.locator('#inicio')).toBeVisible();
  await expect(page.locator('#financial-api').getByRole('link', { name: /Ver código/ })).toHaveAttribute('href', 'https://github.com/DevWerik/Api-Node');
  await page.locator("#financial-api summary").click();
  await expect(page.locator("#financial-api")).toContainText("POST /transactions");
  for (const language of ["pt", "en"]) {
    const response = await request.get(`/cv/werik-santos-${language}.pdf`);
    expect(response.ok()).toBeTruthy();
    expect((await response.body()).subarray(0, 5).toString()).toBe("%PDF-");
  }
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBeTruthy();
  expect(errors).toEqual([]);
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.screenshot({ path: testInfo.outputPath("portfolio.png"), fullPage: true, scale: "css" });
  await page.screenshot({ path: testInfo.outputPath("hero.png"), scale: "css" });
});
