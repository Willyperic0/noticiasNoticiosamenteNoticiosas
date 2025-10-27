const puppeteer = require('puppeteer');

describe('Noticias Noticiosamente Noticiosas - E2E', () => {
  let browser;
  let page;

  beforeAll(async () => {
    browser = await puppeteer.launch({ headless: true });
    page = await browser.newPage();
  });

  afterAll(async () => {
    await browser.close();
  });

  test('Home redirige a /news y muestra noticias', async () => {
    await page.goto('http://localhost:3000/');
    await page.waitForSelector('.news-card');
    const title = await page.title();
    expect(title).toContain('Todas las Noticias');
    const cards = await page.$$('.news-card');
    expect(cards.length).toBeGreaterThan(0);
  });

  test('Detalle de noticia muestra título y contenido', async () => {
    await page.goto('http://localhost:3000/news/1');
    await page.waitForSelector('h2');
    const h2 = await page.$eval('h2', el => el.textContent);
    expect(h2).toContain('VIZLA');
    const content = await page.$eval('.article-body', el => el.textContent);
    expect(content).toContain('cartas holográficas');
  });

  test('Búsqueda muestra resultados filtrados', async () => {
    await page.goto('http://localhost:3000/news');
    await page.type('input[name=term]', 'eldar');
    await page.click('button[type=submit]');
    await page.waitForSelector('.news-card');
    const cardTitles = await page.$$eval('.news-card .card-title', els => els.map(el => el.textContent.toLowerCase()));
    expect(cardTitles.length).toBeGreaterThan(0);
    expect(cardTitles.some(title => title.includes('eldar'))).toBe(true);
  });

  test('Página About muestra información del equipo', async () => {
    const response = await page.goto('http://localhost:3000/about');
    if (!response || !response.ok()) {
      throw new Error('No se pudo cargar la página About. ¿Está el servidor corriendo?');
    }
    await page.waitForSelector('h1');
    const h1 = await page.$eval('h1', el => el.textContent);
    expect(h1).toContain('Acerca de');
    const equipo = await page.$eval('aside', el => el.textContent);
    expect(equipo).toContain('Editor:');
  });

  test('Ruta inexistente muestra error 404', async () => {
    const response = await page.goto('http://localhost:3000/esto-no-existe');
    expect(response.status()).toBe(404);
    const text = await page.evaluate(() => document.body.textContent);
    expect(text).toMatch(/cannot get|no encontrada|not found|error/i);
  });
});
