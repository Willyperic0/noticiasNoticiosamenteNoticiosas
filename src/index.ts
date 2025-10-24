import express, { Application } from "express";
import morgan from "morgan";
import cors from "cors";
import path from "path";

import NewsRouter from "./news/router/NewsRouter";
import NewsModel from "./news/model/NewsModel";
import NewsView from "./news/view/NewsView";

import SearchBarRouter from "./searchbar/router/SearchBarRouter";

import AboutRouter from "./about/router/AboutRouter";
import AboutView from "./about/view/AboutView";

export default class Server {
  private readonly app: Application;

  constructor(
    private readonly newsRouter: NewsRouter,
    private readonly searchBarRouter: SearchBarRouter,
    private readonly aboutRouter: AboutRouter
  ) {
    this.app = express();
    this.configure();
    this.routes();
  }

  private readonly configure = (): void => {
    this.app.use(cors());
    this.app.use(morgan("dev"));
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(express.json());
    this.app.set("view engine", "ejs");
    this.app.set("views", path.join(__dirname, "./template")); // Plantillas en src/template
    this.app.use(express.static(path.join(__dirname, "../public"))); // Archivos estáticos
  };

  private readonly routes = (): void => {
    this.app.use("/news", this.newsRouter.router);
    this.app.use("/search", this.searchBarRouter.router);
    this.app.use("/about", this.aboutRouter.router);

    // Redirección principal
    this.app.get("/", (_req, res) => res.redirect("/news"));
  };

  readonly start = (): void => {
    const port = 3000;
    const host = "localhost";
    this.app.listen(port, () =>
      console.log(`📰 Servidor corriendo en http://${host}:${port}`)
    );
  };
}

// Inicialización de dependencias
const newsModel = new NewsModel();
const newsView = new NewsView();
const searchBarRouter = new SearchBarRouter(newsModel, newsView); // ✅ solo 2 argumentos
const newsRouter = new NewsRouter(newsView, newsModel);
const aboutView = new AboutView();
const aboutRouter = new AboutRouter(aboutView);

const server = new Server(newsRouter, searchBarRouter, aboutRouter);
server.start();
