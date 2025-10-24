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
    // 📰 Lista completa de noticias
    this.router.get("/", (_req: Request, res: Response): void => {
      const news = this.newsModel.getAll();
      this.newsView.list(res, news, { title: "Todas las Noticias" });
    });

    // 🆕 Formulario para crear nueva noticia
    this.router.get("/new", (_req: Request, res: Response): void => {
      this.newsView.form(res);
    });

    // 💾 Guardar nueva noticia
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

// 📰 Noticias por jornada (filtrado por fecha)
this.router.get("/jornada/:num", (req: Request, res: Response): void => {
  // Acceso seguro a req.params['num']
  const numStr = req.params['num'] ?? "0";
  const num = parseInt(numStr, 10);

  let fecha = "";

  // Formato ISO (YYYY-MM-DD) que coincide con el JSON
  switch (num) {
    case 1:
      fecha = "2025-10-28";
      break;
    case 2:
      fecha = "2025-10-29";
      break;
    case 3:
      fecha = "2025-10-30";
      break;
    default:
      res.status(404).send("Jornada no encontrada");
      return;
  }

  const allNews = this.newsModel.getAll();
  const filtered = allNews.filter(n => n.date === fecha);

  // Renderizamos la lista filtrada
  this.newsView.list(res, filtered, { title: `Jornada ${num}` });
});


    // 🧾 Detalle de una noticia
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
