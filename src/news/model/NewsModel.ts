import fs from "fs";
import path from "path";
import { News } from "../types/News";

/*
  NewsModel
  ---------
  Implementación mínima de acceso a datos basada en un archivo JSON local.

  Responsabilidades:
  - getAll: devuelve todas las noticias almacenadas (array de News).
  - getById: busca y devuelve una noticia por su id.
  - create: añade una noticia nueva generando un id incremental y persiste
    el conjunto en disco.

  Notas de producción:
  - Este modelo es apropiado para prototipos o ejercicios; en un sistema
    en producción debe sustituirse por una capa de datos (DB) con
    concurrencia, validaciones y manejo de errores más robusto.
*/
export default class NewsModel {
  private dbPath: string;

  constructor(dbPath?: string) {
    this.dbPath = dbPath ?? path.resolve("database/news.json");
  }
  /*
    getAll
    - Lee el fichero JSON y devuelve el array de noticias.
    - Si el fichero no existe retorna un array vacío.
    - Atrapa errores de parseo y devuelve [] en caso de datos corruptos.
  */
  getAll(): News[] {
    if (!fs.existsSync(this.dbPath)) return [];
    const data = fs.readFileSync(this.dbPath, "utf-8");
    try {
      return JSON.parse(data || "[]");
    } catch {
      // En caso de JSON inválido, devolvemos listado vacío para no romper
      // la experiencia de usuario. En producción deberíamos loggear el error.
      return [];
    }
  }

  /*
    getById
    - Parámetro: id (number)
    - Retorna la noticia cuyo campo `id` coincida, o undefined si no existe.
  */
  getById(id: number): News | undefined {
    const news = this.getAll();
    return news.find(n => n.id === id);
  }

  /*
    create
    - Parámetros: newNews (objeto News sin el id)
    - Proceso: calcula un id incremental tomando el último id disponible
      y escribe el array actualizado al fichero JSON.
    - Retorna el objeto creado (con id).

    Riesgos/Limitaciones:
    - No hay manejo de concurrencia; si se realizan múltiples escrituras
      simultáneas pueden producirse pérdidas de datos.
    - No hay validación de campos; suponer que la capa de routing/validación
      previene datos inválidos.
  */
  create(newNews: Omit<News, "id">): News {
    const news = this.getAll();
    const last = news[news.length - 1];
    const id = last ? last.id + 1 : 1;
    const created = { id, ...newNews };
    news.push(created);

    fs.writeFileSync(this.dbPath, JSON.stringify(news, null, 2));
    return created;
  }
}
