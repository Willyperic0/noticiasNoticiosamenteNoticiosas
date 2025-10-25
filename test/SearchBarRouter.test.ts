import express from 'express';
import path from 'path';
import request from 'supertest';
import NewsModel from '../src/news/model/NewsModel';
import NewsView from '../src/news/view/NewsView';
import SearchBarRouter from '../src/searchbar/router/SearchBarRouter';

// Mock NewsModel para evitar manipular la base de datos real
jest.mock('../src/news/model/NewsModel');

describe('SearchBarRouter', () => {
  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();
    
    // Mock de datos de prueba
    const mockData = [
      { id: 1, title: 'Alpha test', summary: 's', content: 'c', image: '/img/x.jpg', date: '2025-10-25' },
      { id: 2, title: 'Beta test', summary: 's', content: 'c', image: '/img/x.jpg', date: '2025-10-25' }
    ];
    
    // Configurar el mock para retornar los datos de prueba
    (NewsModel as jest.MockedClass<typeof NewsModel>).prototype.getAll.mockReturnValue(mockData);
  });

  test('GET /search?term=test returns filtered results', async () => {
    // Given (Dado)
    // - Un SearchBarRouter configurado con modelo mockeado
    // - Dos noticias de prueba con "test" en el título
    const newsModel = new NewsModel();
    const newsView = new NewsView();
    const searchRouter = new SearchBarRouter(newsModel, newsView);

    const app = express();
    app.set('view engine', 'ejs');
    app.set('views', path.join(__dirname, '..', 'src', 'template'));
    app.use('/search', searchRouter.router);

    const res = await request(app).get('/search').query({ term: 'test' });
    expect(res.status).toBe(200);
    expect(res.text).toMatch(/Alpha test/);
    expect(res.text).toMatch(/Beta test/);
  });

  test('GET /search without term returns empty results', async () => {
    // Given (Dado)
    // - Un SearchBarRouter configurado con modelo mockeado
    // - No se proporciona término de búsqueda
    const newsModel = new NewsModel();
    const newsView = new NewsView();
    const searchRouter = new SearchBarRouter(newsModel, newsView);

    const app = express();
    app.set('view engine', 'ejs');
    app.set('views', path.join(__dirname, '..', 'src', 'template'));
    app.use('/search', searchRouter.router);

    const res = await request(app).get('/search');
    expect(res.status).toBe(200);
    // Just verify that it renders the search form without results
    expect(res.text).toMatch(/Buscar por título/);
  });

  test('GET /search?term=NonExistent returns no results', async () => {
    // Given (Dado)
    // - Un SearchBarRouter configurado con modelo mockeado
    // - Un término de búsqueda que no coincide con ninguna noticia
    const newsModel = new NewsModel();
    const newsView = new NewsView();
    const searchRouter = new SearchBarRouter(newsModel, newsView);

    const app = express();
    app.set('view engine', 'ejs');
    app.set('views', path.join(__dirname, '..', 'src', 'template'));
    app.use('/search', searchRouter.router);

    const res = await request(app).get('/search').query({ term: 'NonExistentArticle' });
    expect(res.status).toBe(200);
    expect(res.text).toMatch(/No hay noticias disponibles/);
  });

  test('Search finds partial matches', async () => {
    // Given (Dado)
    // - Un SearchBarRouter configurado con modelo mockeado
    // - Noticias de prueba donde una contiene "bet" en el título
    const newsModel = new NewsModel();
    const newsView = new NewsView();
    const searchRouter = new SearchBarRouter(newsModel, newsView);

    const app = express();
    app.set('view engine', 'ejs');
    app.set('views', path.join(__dirname, '..', 'src', 'template'));
    app.use('/search', searchRouter.router);

    const res = await request(app).get('/search').query({ term: 'bet' });
    expect(res.status).toBe(200);
    expect(res.text).toMatch(/Beta test/);
    expect(res.text).not.toMatch(/Alpha test/);
    expect(res.text).not.toMatch(/No hay noticias disponibles/);
  });
});
