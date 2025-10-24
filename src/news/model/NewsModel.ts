import fs from "fs";
import path from "path";
import { News } from "../types/News";

const DB_PATH = path.resolve("database/news.json");

export default class NewsModel {
  // 📰 Obtener todas las noticias
  getAll(): News[] {
    if (!fs.existsSync(DB_PATH)) return [];
    const data = fs.readFileSync(DB_PATH, "utf-8");
    try {
      return JSON.parse(data || "[]");
    } catch {
      return [];
    }
  }

  // 🔍 Buscar una noticia por ID
  getById(id: number): News | undefined {
    const news = this.getAll();
    return news.find(n => n.id === id);
  }

  // ➕ Crear una nueva noticia
  create(newNews: Omit<News, "id">): News {
    const news = this.getAll();
    const last = news[news.length - 1];
    const id = last ? last.id + 1 : 1;
    const created = { id, ...newNews };
    news.push(created);

    fs.writeFileSync(DB_PATH, JSON.stringify(news, null, 2));
    return created;
  }
}
