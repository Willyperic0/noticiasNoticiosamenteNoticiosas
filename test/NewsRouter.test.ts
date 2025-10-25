import express from 'express';
import path from 'path';
import request from 'supertest';
import NewsModel from '../src/news/model/NewsModel';
import NewsView from '../src/news/view/NewsView';
import NewsRouter from '../src/news/router/NewsRouter';

// Mock NewsModel para evitar manipular la base de datos real
jest.mock('../src/news/model/NewsModel');

describe('NewsRouter (integration - minimal)', () => {
  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();
    
    // Mock de datos de prueba
    const mockArticle = { 
      id: 1, 
      title: 'Noticia de prueba', 
      summary: 'sum', 
      content: 'c', 
      image: '/img/x.jpg', 
      date: '2025-10-25' 
    };
    
    // Configurar el mock para retornar los datos de prueba
    (NewsModel as jest.MockedClass<typeof NewsModel>).prototype.getAll.mockReturnValue([mockArticle]);
    (NewsModel as jest.MockedClass<typeof NewsModel>).prototype.getById.mockImplementation((id) => {
      return id === 1 ? mockArticle : undefined;
    });
  });

  test('GET /news responds with HTML and includes the news title', async () => {
    // Given (Dado)
    // - Un NewsRouter configurado con modelo y vista mockeados
    // - Una noticia de prueba en el modelo
    const newsModel = new NewsModel();
    const newsView = new NewsView();
    const newsRouter = new NewsRouter(newsView, newsModel);

    const app = express();
    app.set('view engine', 'ejs');
    app.set('views', path.join(__dirname, '..', 'src', 'template'));
    app.use('/news', newsRouter.router);

    const res = await request(app).get('/news');
    expect(res.status).toBe(200);
    expect(res.headers['content-type']).toMatch(/html/);
    expect(res.text).toMatch(/Noticia de prueba/);
  });

  test('GET /news/:id shows a specific news article', async () => {
    // Given (Dado)
    // - Un NewsRouter configurado con modelo y vista mockeados
    // - Una noticia específica con ID=1 en el modelo
    const newsModel = new NewsModel();
    const newsView = new NewsView();
    const newsRouter = new NewsRouter(newsView, newsModel);

    const app = express();
    app.set('view engine', 'ejs');
    app.set('views', path.join(__dirname, '..', 'src', 'template'));
    app.use('/news', newsRouter.router);

    const res = await request(app).get('/news/1');
    expect(res.status).toBe(200);
    expect(res.headers['content-type']).toMatch(/html/);
    expect(res.text).toMatch(/Noticia de prueba/);
  });

  test('GET /news/:id with invalid ID shows 404', async () => {
    const newsModel = new NewsModel();
    const newsView = new NewsView();
    const newsRouter = new NewsRouter(newsView, newsModel);

    const app = express();
    app.set('view engine', 'ejs');
    app.set('views', path.join(__dirname, '..', 'src', 'template'));
    app.use('/news', newsRouter.router);

    const res = await request(app).get('/news/99999');
    expect(res.status).toBe(404);
  });

  test('GET /news/new returns the news creation form', async () => {
    const newsModel = new NewsModel();
    const newsView = new NewsView();
    const newsRouter = new NewsRouter(newsView, newsModel);

    const app = express();
    app.set('view engine', 'ejs');
    app.set('views', path.join(__dirname, '..', 'src', 'template'));
    app.use('/news', newsRouter.router);

    const res = await request(app).get('/news/new');
    expect(res.status).toBe(200);
    expect(res.headers['content-type']).toMatch(/html/);
    expect(res.text).toMatch(/form/i);
  });
});
