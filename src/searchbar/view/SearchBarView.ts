import { Response } from "express";

/*
  SearchBarView
  --------------
  Vista dedicada para la página de búsqueda de noticias.

  Método:
  - render(res, search): renderiza la plantilla `search` pasando el
    título y el término de búsqueda actual.

  Nota: actualmente la plantilla `search` no existe en `src/template`.
  Si se desea mantener una página de búsqueda dedicada, es conveniente
  crear `search.ejs` o actualizar el método para usar la plantilla
  `searchbar.ejs` existente.
*/
export default class SearchBarView {
  render(res: Response, search: string): void {
    res.render("search", { title: "Buscar noticias", search });
  }
}
