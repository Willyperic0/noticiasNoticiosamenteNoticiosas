const puppeteer = require('puppeteer');

describe('App E2E', () => {
  let browser;
  let page;

  beforeAll(async () => {
    browser = await puppeteer.launch({ headless: true });
    page = await browser.newPage();
  });

  afterAll(async () => {
    await browser.close();
  });

  test('should display the main page', async () => {
    await page.goto('http://localhost:3000');
    await page.waitForSelector('body');
    const text = await page.$eval('body', (e) => e.textContent);
    expect(text).toBeDefined();
  });

  // Puedes agregar más tests E2E aquí según la funcionalidad de tu app
});
