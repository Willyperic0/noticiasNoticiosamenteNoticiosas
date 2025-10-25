import { Router, Request, Response } from "express";
import NewsModel from "../model/NewsModel";
import NewsView from "../view/NewsView";

/*
  NewsRouter
  ----------
  Encapsula todas las rutas relacionadas con el recurso "news".

  Rutas expuestas:
  - GET /news             => lista paginada de noticias
  - GET /news/new         => formulario para crear una noticia
  - POST /news/new        => persiste la nueva noticia y redirige
  - GET /news/jornada/:num => listado filtrado por una "jornada" (fecha)
  - GET /news/:id         => detalle de una noticia

  Notas de diseño:
  - El router delega en `NewsModel` para acceder a los datos y en `NewsView`
    para renderizar las plantillas. Esto mantiene separación de responsabilidades.
  - La paginación se realiza en memoria sobre el array devuelto por el modelo.
    En aplicaciones reales con DB, la paginación debería realizarse mediante
    consultas limit/offset.
*/
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
    const PER_PAGE = 6; // Items por página para la paginación simple

    // Lista completa de noticias con paginación.
    this.router.get("/", (req: Request, res: Response): void => {
      const page = parseInt((req.query['page'] as string) ?? "1", 10);
      const allNews = this.newsModel.getAll();

      const totalPages = Math.ceil(allNews.length / PER_PAGE);
      const startIndex = (page - 1) * PER_PAGE;
      const paginatedNews = allNews.slice(startIndex, startIndex + PER_PAGE);

      this.newsView.list(res, paginatedNews, {
        title: "Todas las Noticias",
        page,
        totalPages
      });
    });

    // Formulario para crear nueva noticia (GET /news/new)
    this.router.get("/new", (_req: Request, res: Response): void => {
      this.newsView.form(res);
    });

    // Guardar nueva noticia (POST /news/new)
    this.router.post("/new", (req: Request, res: Response): void => {
      const { title, summary, content, image, date } = req.body;

      // Si el cliente no envía fecha, asignamos la fecha actual formateada
      const finalDate =
        date && date.trim() !== "" ? date : new Date().toLocaleDateString("es-ES");

      this.newsModel.create({
        title,
        summary,
        content,
        image,
        date: finalDate,
      });

      // Redirigir a la lista principal después de crear
      res.redirect("/news");
    });

    // Noticias por jornada con paginación
    // Nota: las fechas y jornadas están codificadas; en una app real deberían
    // venir de una fuente dinámica o de la base de datos.
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
