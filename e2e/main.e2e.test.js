const puppeteer = require('puppeteer');

jest.setTimeout(60000);

describe('Noticias Noticiosamente Noticiosas - E2E', () => {
  let browser;
  let page;

  beforeAll(async () => {
    browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    page = await browser.newPage();
    page.setDefaultNavigationTimeout(30000);
    page.setDefaultTimeout(30000);

    // Log de consola del navegador para depurar
    page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  });

  afterAll(async () => {
    await browser.close();
  });

  test('Home muestra noticias destacadas y carruseles', async () => {
    const response = await page.goto('http://localhost:3000/', { waitUntil: 'networkidle2' });
    expect(response.status()).toBeLessThan(400);

    // Verificar que existe el buscador
    await page.waitForSelector('input[name="term"]', { visible: true, timeout: 10000 });
    
    // Verificar que hay al menos una noticia destacada (hero)
    await page.waitForSelector('.hero .card', { visible: true, timeout: 15000 });
    
    // Verificar que existen secciones de jornadas
    const jornadaSections = await page.$$('.jornada-section');
    expect(jornadaSections.length).toBeGreaterThan(0);

    // Verificar que hay cards de noticias en los carruseles
    const cards = await page.$$('.jornada-section .card');
    expect(cards.length).toBeGreaterThan(0);

    const title = await page.title();
    expect(title.toLowerCase()).toContain('noticia');
  });

  test('Detalle de noticia muestra título y contenido completo', async () => {
    const response = await page.goto('http://localhost:3000/news/1', { waitUntil: 'networkidle2' });
    expect(response.status()).toBe(200);

    // Esperar por el título de la noticia
    await page.waitForSelector('h2', { visible: true, timeout: 10000 });
    
    // Verificar elementos de la noticia detallada
    const h2 = await page.$eval('h2', el => el.textContent.trim());
    expect(h2).toBeTruthy();

    // Verificar que existe la fecha
    await page.waitForSelector('.article-date', { visible: true });
    
    // Verificar que hay contenido del artículo
    const content = await page.$eval('.article-body', el => el.textContent.toLowerCase());
    expect(content.length).toBeGreaterThan(10);
  });

  test('Búsqueda muestra resultados filtrados', async () => {
    await page.goto('http://localhost:3000/', { waitUntil: 'networkidle2' });
    
    // Esperar por el input de búsqueda
    await page.waitForSelector('input[name="term"]', { visible: true, timeout: 10000 });
    
    // Escribir término de búsqueda
    await page.type('input[name="term"]', 'eldar', { delay: 100 });
    
    // Enviar formulario y esperar navegación
    await Promise.all([
      page.click('button[type="submit"]'),
      page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 15000 })
    ]);

    // Verificar que estamos en la página de resultados
    const currentUrl = page.url();
    expect(currentUrl).toContain('/search');

    // Verificar que hay resultados (pueden ser cards o mensaje de no resultados)
    try {
      await page.waitForSelector('.news-card', { timeout: 10000 });
      const cards = await page.$$('.news-card');
      expect(cards.length).toBeGreaterThan(0);
    } catch (error) {
      // Si no hay cards, verificar que hay un mensaje de no resultados
      const noResultsText = await page.$eval('body', el => el.textContent.toLowerCase());
      expect(noResultsText).toContain('no hay noticias');
    }
  });


  test('Página About muestra información del equipo y contacto', async () => {
    const response = await page.goto('http://localhost:3000/about', { waitUntil: 'networkidle2' });
    expect(response.status()).toBe(200);

    // Verificar título principal
    await page.waitForSelector('h1', { visible: true });
    const h1 = await page.$eval('h1', el => el.textContent.toLowerCase());
    expect(h1).toContain('acerca');

    // Verificar información del autor
    const aboutContent = await page.$eval('body', el => el.textContent.toLowerCase());
    expect(aboutContent).toMatch(/william sanabria|equipo|contacto|colaboraciones|misión|valores/i);

    // Verificar que existe la sección de contacto
    const contactLink = await page.$('a[href*="youtu.be"]');
    expect(contactLink).toBeTruthy();

    // Verificar sidebar de autor
    const authorInfo = await page.$eval('aside', el => el.textContent.toLowerCase());
    expect(authorInfo).toContain('william sanabria');
  });

  test('Formulario de nueva noticia muestra campos requeridos', async () => {
    const response = await page.goto('http://localhost:3000/news/new', { waitUntil: 'networkidle2' });
    expect(response.status()).toBe(200);

    // Verificar título de la página
    await page.waitForSelector('h1', { visible: true });
    
    // Verificar que existe el formulario
    await page.waitForSelector('form[action="/news/new"]', { visible: true });
    
    // Verificar campos del formulario
    const formFields = await page.$$('form input, form textarea');
    expect(formFields.length).toBeGreaterThanOrEqual(5); // título, resumen, contenido, imagen, fecha

    // Verificar campos específicos
    const titleInput = await page.$('input[name="title"]');
    expect(titleInput).toBeTruthy();

    const summaryTextarea = await page.$('textarea[name="summary"]');
    expect(summaryTextarea).toBeTruthy();

    const contentTextarea = await page.$('textarea[name="content"]');
    expect(contentTextarea).toBeTruthy();

    const imageInput = await page.$('input[name="image"]');
    expect(imageInput).toBeTruthy();

    const dateInput = await page.$('input[name="date"]');
    expect(dateInput).toBeTruthy();

    // Verificar botón de envío
    const submitButton = await page.$('button[type="submit"]');
    expect(submitButton).toBeTruthy();
  });

  test('Ruta inexistente muestra error 404', async () => {
    const response = await page.goto('http://localhost:3000/esta-ruta-no-existe', { waitUntil: 'networkidle2' });
    expect(response.status()).toBe(404);

    const text = await page.evaluate(() => document.body.textContent.toLowerCase());
    expect(text).toMatch(/cannot get|no encontrada|not found|error 404/i);
  });
});