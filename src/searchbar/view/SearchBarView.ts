import { Response } from "express";

export default class SearchBarView {
  render(res: Response, search: string): void {
    res.render("search", { title: "Buscar noticias", search });
  }
}
