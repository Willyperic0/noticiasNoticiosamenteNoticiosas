import { Response } from "express";

export default class AboutView {
  render(res: Response): void {
    res.render("about/about", { title: "Acerca de" });
  }
}
