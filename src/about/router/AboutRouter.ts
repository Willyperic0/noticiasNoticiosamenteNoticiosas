import { Router, Request, Response } from "express";
import AboutView from "../view/AboutView";

/*
  AboutRouter
  -----------
  Router responsable de exponer la ruta `/about`.

  Funcionalidad:
  - Maneja peticiones GET a la ruta raíz del módulo y delega en AboutView
    para renderizar la plantilla correspondiente.

  Observaciones:
  - La clase aloja su instancia de `Router` en la propiedad pública `router`
    para que el servidor principal la monte con `app.use("/about", ...)`.
*/
export default class AboutRouter {
  public readonly router: Router;

  constructor(private readonly aboutView: AboutView) {
    this.router = Router();
    this.routes();
  }

  /*
    routes
    - Define las rutas públicas del módulo About.
    - Actualmente expone solo GET / que renderiza la vista "about".
  */
  private routes(): void {
    this.router.get("/", (_req: Request, res: Response) => {
      this.aboutView.render(res);
    });
  }
}
