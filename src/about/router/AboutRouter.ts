import { Router, Request, Response } from "express";
import AboutView from "../view/AboutView";

export default class AboutRouter {
  public readonly router: Router;

  constructor(private readonly aboutView: AboutView) {
    this.router = Router();
    this.routes();
  }

  private routes(): void {
    this.router.get("/", (_req: Request, res: Response) => {
      this.aboutView.render(res);
    });
  }
}
