// news/view/NewsView.ts
import { Response } from "express";
import { News } from "../types/News";

interface ListOptions {
  title?: string;
  search?: string;
  page?: number;
  totalPages?: number;
}

export default class NewsView {
  // 📋 Lista de noticias
  list(res: Response, news: News[], options?: ListOptions): void {
    res.render("news-list", {
      title: options?.title ?? "Noticias",
      news,
      search: options?.search ?? "",
      page: options?.page ?? 1,
      totalPages: options?.totalPages ?? 1
    });
  }

  // 🧾 Detalle de una noticia
  detail(res: Response, article: News): void {
    res.render("news-detail", { title: article.title, article });
  }

  // 📝 Formulario para nueva noticia
  form(res: Response): void {
    res.render("news-form", { title: "Nueva noticia" });
  }
}
