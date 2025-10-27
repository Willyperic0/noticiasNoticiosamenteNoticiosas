// searchbar/router/SearchBarRouter.ts
import { Router, Request, Response } from "express";
import NewsModel from "../../news/model/NewsModel";
import NewsView from "../../news/view/NewsView";

/*
  SearchBarRouter
  ---------------
  Proporciona una ruta simple para realizar búsquedas sobre las noticias
  por título.

  Implementación:
  - GET /search?term=... -> filtra noticias cuyo título incluya el término
    (case-insensitive) y reutiliza `NewsView.list` para renderizar los
    resultados. De esta forma se mantiene un único template para la lista.

  Observaciones:
  - El filtrado se realiza en memoria leyendo todas las noticias. Para
    datasets grandes esto no escala; en tal caso, delegar la búsqueda a
    la base de datos es recomendable.
*/
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
    // Buscar por título con paginación
    this.router.get("/", (req: Request, res: Response): void => {
      const term = (req.query["term"] as string)?.toLowerCase() ?? "";
      const page = parseInt(req.query["page"] as string) || 1;
      const limit = 6; // cantidad de noticias por página

      const allNews = this.newsModel.getAll();

      // Filtrado
      const filtered = term
        ? allNews.filter(n => n.title.toLowerCase().includes(term))
        : allNews;

      // Paginación
      const totalPages = Math.ceil(filtered.length / limit);
      const start = (page - 1) * limit;
      const paginatedNews = filtered.slice(start, start + limit);

      this.newsView.list(res, paginatedNews, {
        title: term ? `Resultados para "${term}"` : "Noticias",
        search: term,
        page,
        totalPages
      });
    });
  }

}
