// searchbar/router/SearchBarRouter.ts
import { Router, Request, Response } from "express";
import NewsModel from "../../news/model/NewsModel";
import NewsView from "../../news/view/NewsView";

export default class SearchBarRouter {
  public readonly router: Router;

  constructor(
    private readonly newsModel: NewsModel,
    private readonly newsView: NewsView
  ) {
    this.router = Router();
    this.routes();
  }

  private routes(): void {
    // 🔍 Buscar por título
    this.router.get("/", (req: Request, res: Response): void => {
      const term = (req.query["term"] as string)?.toLowerCase() ?? "";
      const allNews = this.newsModel.getAll();

      const filtered = term
        ? allNews.filter(n => n.title.toLowerCase().includes(term))
        : allNews;

      // Pasa un tercer parámetro opcional con información de búsqueda
      this.newsView.list(res, filtered, {
        title: term ? `Resultados para "${term}"` : "Noticias",
        search: term
      });
    });
  }
}
