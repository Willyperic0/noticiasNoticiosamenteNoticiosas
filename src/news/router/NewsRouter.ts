import { Router, Request, Response } from "express";
import NewsModel from "../model/NewsModel";
import NewsView from "../view/NewsView";

export default class NewsRouter {
  public readonly router: Router;

  constructor(
    private readonly newsView: NewsView,
    private readonly newsModel: NewsModel
  ) {
    this.router = Router();
    this.routes();
  }

  private routes(): void {
    const PER_PAGE = 6;

    // 🔹 HOME - todas las noticias (usa home.ejs)
    this.router.get("/", (_req: Request, res: Response): void => {
      const allNews = this.newsModel.getAll(); // todas las noticias
      this.newsView.home(res, allNews, { title: "Inicio - Noticias" });
    });

    // Formulario para crear nueva noticia
    this.router.get("/new", (_req: Request, res: Response): void => {
      this.newsView.form(res);
    });

    // Guardar nueva noticia
    this.router.post("/new", (req: Request, res: Response): void => {
      const { title, summary, content, image, date } = req.body;

      const finalDate =
        date && date.trim() !== "" ? date : new Date().toLocaleDateString("es-ES");

      this.newsModel.create({
        title,
        summary,
        content,
        image,
        date: finalDate,
      });

      res.redirect("/news");
    });

    // Noticias por jornada
    this.router.get("/jornada/:num", (req: Request, res: Response): void => {
      const numStr = req.params['num'] ?? "0";
      const num = parseInt(numStr, 10);

      let fecha = "";
      switch (num) {
        case 1: fecha = "2025-10-28"; break;
        case 2: fecha = "2025-10-29"; break;
        case 3: fecha = "2025-10-30"; break;
        default:
          res.status(404).send("Jornada no encontrada");
          return;
      }

      const page = parseInt((req.query['page'] as string) ?? "1", 10);
      const allNews = this.newsModel.getAll();
      const filtered = allNews.filter(n => n.date === fecha);

      const totalPages = Math.ceil(filtered.length / PER_PAGE);
      const startIndex = (page - 1) * PER_PAGE;
      const paginatedNews = filtered.slice(startIndex, startIndex + PER_PAGE);

      this.newsView.list(res, paginatedNews, {
        title: `Jornada ${num}`,
        page,
        totalPages
      });
    });

    // Detalle de una noticia por id
    this.router.get("/:id", (req: Request, res: Response): void => {
      const id = parseInt(req.params["id"] ?? "0", 10);
      const article = this.newsModel.getById(id);

      if (!article) {
        res.status(404).send("Noticia no encontrada");
        return;
      }

      this.newsView.detail(res, article);
    });
  }
}
