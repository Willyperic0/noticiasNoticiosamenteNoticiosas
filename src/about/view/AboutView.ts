import { Response } from "express";

/*
  AboutView
  ---------
  Encapsula la lógica de presentación para la página "Acerca de".

  Método principal:
  - render(res): renderiza la plantilla `about.ejs` pasando el título.

  Notas:
  - Mantener la lógica de render en una clase dedicada permite testear
    y reutilizar la vista desde diferentes routers si fuera necesario.
*/
export default class AboutView {
  render(res: Response): void {
    // Renderiza la plantilla `about` con un objeto de contexto mínimo.
    res.render("about", { title: "Acerca de" });
  }
}
