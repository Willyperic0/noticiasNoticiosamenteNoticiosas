import express from 'express';
import path from 'path';
import request from 'supertest';
import AboutView from '../src/about/view/AboutView';
import AboutRouter from '../src/about/router/AboutRouter';

describe('AboutRouter', () => {
  test('GET /about renders about page', async () => {
    // Given (Dado)
    // - Un AboutRouter configurado con su vista
    // - Una aplicación Express con el motor EJS configurado
    const aboutView = new AboutView();
    const aboutRouter = new AboutRouter(aboutView);

    const app = express();
    app.set('view engine', 'ejs');
    app.set('views', path.join(__dirname, '..', 'src', 'template'));
    app.use('/about', aboutRouter.router);

    const res = await request(app).get('/about');
    expect(res.status).toBe(200);
    expect(res.headers['content-type']).toMatch(/html/);
    // Then (Entonces)
    // - La respuesta debe ser exitosa (200)
    // - El contenido debe ser HTML
    // - Debe incluir el texto "Acerca de" en cualquier capitalización
    expect(res.text).toMatch(/Acerca de/i);
  });

  test('AboutRouter handles non-existent routes', async () => {
    // Given (Dado)
    // - Un AboutRouter configurado con su vista
    // - Una aplicación Express con el motor EJS configurado
    const aboutView = new AboutView();
    const aboutRouter = new AboutRouter(aboutView);

    const app = express();
    app.set('view engine', 'ejs');
    app.set('views', path.join(__dirname, '..', 'src', 'template'));
    app.use('/about', aboutRouter.router);

    const res = await request(app).get('/about/nonexistent');
    // Then (Entonces)
    // - La respuesta debe ser 404 para rutas no existentes
    expect(res.status).toBe(404);
  });

  test('AboutRouter serves page with correct encoding', async () => {
    // Given (Dado)
    // - Un AboutRouter configurado con su vista
    // - Una aplicación Express con el motor EJS configurado
    const aboutView = new AboutView();
    const aboutRouter = new AboutRouter(aboutView);

    const app = express();
    app.set('view engine', 'ejs');
    app.set('views', path.join(__dirname, '..', 'src', 'template'));
    app.use('/about', aboutRouter.router);

    const res = await request(app).get('/about');
    expect(res.headers['content-type']).toMatch(/charset=utf-8/i);
  });
});
