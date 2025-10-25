import fs from 'fs';
import path from 'path';
import NewsModel from '../src/news/model/NewsModel';

const TEST_DB_DIR = path.resolve('test/temp');
const TEST_DB_PATH = path.join(TEST_DB_DIR, 'test-news.json');

describe('NewsModel (file-backed)', () => {
  beforeAll(() => {
    // Crear directorio temporal si no existe
    if (!fs.existsSync(TEST_DB_DIR)) {
      fs.mkdirSync(TEST_DB_DIR, { recursive: true });
    }
    // Iniciar con una base de datos vacía para aislamiento de pruebas
    fs.writeFileSync(TEST_DB_PATH, JSON.stringify([], null, 2));

    // El directorio de pruebas ya está creado y el archivo inicializado
  });

  afterAll(() => {
    // Limpiar archivos de prueba
    if (fs.existsSync(TEST_DB_PATH)) {
      fs.unlinkSync(TEST_DB_PATH);
    }
    if (fs.existsSync(TEST_DB_DIR)) {
      fs.rmSync(TEST_DB_DIR, { recursive: true });
    }
    jest.restoreAllMocks();
  });

  test('create and retrieve news', () => {
    // Given (Dado)
    // - Un NewsModel inicializado con base de datos temporal vacía
    // - Una noticia de prueba válida para crear
    const model = new NewsModel(TEST_DB_PATH);

    const created = model.create({
      title: 'Prueba Jest',
      summary: 'Resumen de prueba',
      content: 'Contenido de prueba',
      image: '/img/test.jpg',
      date: '2025-10-25'
    });

    expect(created).toHaveProperty('id');
    expect(created.title).toBe('Prueba Jest');

    const all = model.getAll();
    expect(Array.isArray(all)).toBe(true);
    expect(all.length).toBeGreaterThanOrEqual(1);

    const found = model.getById(created.id);
    expect(found).toBeDefined();
    expect(found?.title).toBe(created.title);
  });

  test('returns undefined for non-existent news ID', () => {
    // Given (Dado)
    // - Un NewsModel inicializado con base de datos temporal
    // - Un ID que no existe en la base de datos
    const model = new NewsModel(TEST_DB_PATH);
    const result = model.getById(99999);
    expect(result).toBeUndefined();
  });

  test('generates incremental IDs', () => {
    // Given (Dado)
    // - Un NewsModel inicializado con base de datos temporal vacía
    // - Dos noticias para crear secuencialmente
    const model = new NewsModel(TEST_DB_PATH);
    const news1 = model.create({
      title: 'First News',
      summary: 'First Summary',
      content: 'Content',
      image: '/img/1.jpg',
      date: '2025-10-25'
    });

    const news2 = model.create({
      title: 'Second News',
      summary: 'Second Summary',
      content: 'Content',
      image: '/img/2.jpg',
      date: '2025-10-25'
    });

    expect(news2.id).toBe(news1.id + 1);
  });

  test('maintains data persistence between operations', () => {
    const model = new NewsModel(TEST_DB_PATH);
    const initialCount = model.getAll().length;
    
    const testNews = {
      title: 'Test Persistence',
      summary: 'Test',
      content: 'Content',
      image: '/img/test.jpg',
      date: '2025-10-25'
    };
    
    model.create(testNews);

    const newModel = new NewsModel(TEST_DB_PATH); // Create new instance
    const all = newModel.getAll();
    expect(all.length).toBe(initialCount + 1);
    expect(all.some(news => news.title === testNews.title)).toBe(true);
  });
});
