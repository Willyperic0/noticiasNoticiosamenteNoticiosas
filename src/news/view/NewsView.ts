// news/view/NewsView.ts
import { Response } from "express";
import { News } from "../types/News";

/*
  NewsView
  --------
  Responsable de renderizar las plantillas relacionadas con noticias.
  Separa la lógica de presentación de la lógica de routing y del modelo.

  Métodos públicos:
  - list(res, news, options): renderiza la lista de noticias con paginación
    y parámetros de búsqueda opcionales.
  - detail(res, article): renderiza la vista de detalle para una noticia.
  - form(res): renderiza el formulario para crear una nueva noticia.

  Observaciones:
  - Los métodos reciben el objeto `Response` de Express y delegan a EJS
    pasando un contexto simple (POJO). Esto facilita testing y reutilización.
*/
interface ListOptions {
  title?: string;
  search?: string;
  page?: number;
  totalPages?: number;
}

export default class NewsView {
  /*
    list
    - Parámetros:
      res: Express Response
      news: array de objetos News a renderizar
      options: objeto opcional con título, término de búsqueda, página y totalPages
    - Renderiza `news-list` con los datos necesarios para el paginador y la
      barra de búsqueda.
  */
  list(res: Response, news: News[], options?: ListOptions): void {
    res.render("news-list", {
      title: options?.title ?? "Noticias",
      news,
      search: options?.search ?? "",
      page: options?.page ?? 1,
      totalPages: options?.totalPages ?? 1
    });
  }

  /*
    detail
    - Renderiza una plantilla de detalle para una noticia concreta.
    - El contexto incluye `title` (para <title>) y `article` con toda la noticia.
  */
  detail(res: Response, article: News): void {
    res.render("news-detail", { title: article.title, article });
  }

  /*
    form
    - Renderiza el formulario "news-form" para crear nuevas noticias.
    - No requiere datos del modelo por ahora.
  */
  form(res: Response): void {
    res.render("news-form", { title: "Nueva noticia" });
  }
}
