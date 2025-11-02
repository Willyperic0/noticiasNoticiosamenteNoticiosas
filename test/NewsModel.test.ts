import fs from 'fs';
import path from 'path';
import NewsModel from '../src/news/model/NewsModel';

const TEST_DB_DIR = path.resolve('test/temp');
const TEST_DB_PATH = path.join(TEST_DB_DIR, 'test-news.json');

describe('NewsModel (file-backed)', () => {
  /**
   * beforeAll()
   * ----------
   * Se ejecuta una sola vez antes de todos los tests.
   *
   * - Crea el directorio temporal si no existe.
   */
  beforeAll(() => {
    if (!fs.existsSync(TEST_DB_DIR)) {
      fs.mkdirSync(TEST_DB_DIR, { recursive: true });
    }
  });

  /**
   * beforeEach()
   * ------------
   * Se ejecuta antes de cada test individual.
   *
   * - Reinicia el archivo JSON con un arreglo vacío,
   *   garantizando que cada prueba parta desde un
   *   entorno limpio y aislado.
   */
  beforeEach(() => {
    fs.writeFileSync(TEST_DB_PATH, JSON.stringify([], null, 2));
  });

  /**
   * afterAll()
   * ----------
   * Se ejecuta una sola vez al finalizar todas las pruebas.
   *
   * - Elimina los archivos temporales creados.
   * - Restaura cualquier mock o espía que Jest haya podido alterar.
   */
  afterAll(() => {
    if (fs.existsSync(TEST_DB_DIR)) {
      fs.rmSync(TEST_DB_DIR, { recursive: true, force: true });
    }
    jest.restoreAllMocks();
  });

  /**
   * Test 1: Creación y recuperación de noticias
   * ------------------------------------------
   * Verifica que:
   * - Se pueda crear una noticia correctamente.
   * - La noticia creada posea un `id` autogenerado.
   * - Pueda recuperarse posteriormente con `getById()`.
   */
  test('create and retrieve news', () => {
    const model = new NewsModel(TEST_DB_PATH);

    const created = model.create({
      title: 'Prueba Jest',
      summary: 'Resumen de prueba',
      content: 'Contenido de prueba',
      image: '/img/test.jpg',
      date: '2025-10-25',
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

  /**
   * Test 2: Recuperación de ID inexistente
   * --------------------------------------
   * Verifica que al solicitar una noticia con un ID que no existe,
   * el método `getById()` retorne `undefined` en lugar de lanzar un error.
   */
  test('returns undefined for non-existent news ID', () => {
    const model = new NewsModel(TEST_DB_PATH);
    const result = model.getById(99999);
    expect(result).toBeUndefined();
  });

  /**
   * Test 3: Generación incremental de IDs
   * -------------------------------------
   * Comprueba que el modelo asigne IDs consecutivos a medida que se
   * crean nuevas noticias, garantizando un incremento de +1 entre ellas.
   */
  test('generates incremental IDs', () => {
    const model = new NewsModel(TEST_DB_PATH);

    const news1 = model.create({
      title: 'First News',
      summary: 'First Summary',
      content: 'Content',
      image: '/img/1.jpg',
      date: '2025-10-25',
    });

    const news2 = model.create({
      title: 'Second News',
      summary: 'Second Summary',
      content: 'Content',
      image: '/img/2.jpg',
      date: '2025-10-25',
    });

    expect(news2.id).toBe(news1.id + 1);
  });

  /**
   * Test 4: Persistencia entre operaciones
   * --------------------------------------
   * Verifica que las noticias creadas permanezcan almacenadas en disco
   * y puedan ser leídas incluso al reinicializar el modelo
   * (simulando un reinicio del servidor o aplicación).
   */
  test('maintains data persistence between operations', () => {
    const model = new NewsModel(TEST_DB_PATH);
    const initialCount = model.getAll().length;

    const testNews = {
      title: 'Test Persistence',
      summary: 'Test',
      content: 'Content',
      image: '/img/test.jpg',
      date: '2025-10-25',
    };

    model.create(testNews);

    const newModel = new NewsModel(TEST_DB_PATH);
    const all = newModel.getAll();

    expect(all.length).toBe(initialCount + 1);
    expect(all.some((news) => news.title === testNews.title)).toBe(true);
  });

  /**
   * Test 5: Manejo de base de datos corrupta
   * ----------------------------------------
   * Simula un archivo JSON con datos inválidos para comprobar
   * que `getAll()` no lance una excepción y devuelva un arreglo vacío.
   */
  test('handles corrupted database file gracefully', () => {
    fs.writeFileSync(TEST_DB_PATH, '{invalid json,,}');
    const model = new NewsModel(TEST_DB_PATH);

    const all = model.getAll();
    expect(Array.isArray(all)).toBe(true);
    expect(all.length).toBe(0);
  });

  /**
   * Test 6: Validación de estructura mínima
   * ---------------------------------------
   * Asegura que al crear una noticia se guarden todos los campos
   * esperados y ninguno quede ausente en el JSON resultante.
   */
  test('ensures all required fields are saved', () => {
    const model = new NewsModel(TEST_DB_PATH);

    const data = {
      title: 'Pokémon News',
      summary: 'Nueva expansión disponible',
      content: 'Detalles sobre la nueva expansión...',
      image: 'https://www.pokemon.com/static-assets/img.jpg',
      date: '2025-11-01',
    };

    const created = model.create(data);
    const reloaded = model.getById(created.id);

    expect(reloaded).toMatchObject(data);
  });

  /**
   * Test 7: Orden natural de inserción
   * ----------------------------------
   * Verifica que las noticias se mantengan en el orden
   * en el que fueron agregadas al archivo JSON.
   */
  test('maintains insertion order', () => {
    const model = new NewsModel(TEST_DB_PATH);

    model.create({
      title: 'First',
      summary: 'S1',
      content: 'C1',
      image: '/img/1.jpg',
      date: '2025-10-25',
    });

    model.create({
      title: 'Second',
      summary: 'S2',
      content: 'C2',
      image: '/img/2.jpg',
      date: '2025-10-25',
    });

    const all = model.getAll();

    // Se usa optional chaining por seguridad ante un array vacío
    expect(all[0]?.title).toBe('First');
    expect(all[1]?.title).toBe('Second');
  });
});
