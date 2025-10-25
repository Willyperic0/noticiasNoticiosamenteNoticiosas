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

/*
  Server
  ------
  Clase que encapsula la configuración y el arranque del servidor Express.

  Responsabilidades:
  - Configurar middlewares comunes (CORS, logging, parsing de body).
  - Establecer el motor de plantillas EJS y la carpeta de vistas.
  - Registrar rutas principales (news, search, about) delegando a routers
    especializados.
  - Proveer un método `start` para arrancar el servidor.

  Diseño: la clase recibe sus routers/depencias por inyección en el
  constructor. Esto facilita testing y separación de responsabilidades.
*/
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

  /*
    configure
    - Registra middlewares globales y configura el motor de vistas.
    - Url-encoded y json body parser para soportar formularios y APIs.
  */
  private readonly configure = (): void => {
    this.app.use(cors());
    this.app.use(morgan("dev"));
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(express.json());
    this.app.set("view engine", "ejs");
    // Las vistas se encuentran en `src/template` después de la
    // compilación/transpilación a JavaScript (ruta relativa desde dist)
    this.app.set("views", path.join(__dirname, "./template"));
    // Archivos estáticos (CSS, JS cliente, imágenes)
    this.app.use(express.static(path.join(__dirname, "../public")));
  };

  /*
    routes
    - Monta los routers de cada módulo bajo el prefijo correspondiente.
    - Define una ruta raíz que redirige a la lista de noticias.
  */
  private readonly routes = (): void => {
    this.app.use("/news", this.newsRouter.router);
    this.app.use("/search", this.searchBarRouter.router);
    this.app.use("/about", this.aboutRouter.router);

    // Redirección principal a la lista de noticias
    this.app.get("/", (_req, res) => res.redirect("/news"));
  };

  /*
    start
    - Arranca el servidor en el puerto 3000 y escucha conexiones.
    - En un entorno real se podrían leer variables de entorno para puerto.
  */
  readonly start = (): void => {
    const port = 3000;
    const host = "localhost";
    this.app.listen(port, () =>
      console.log(`Servidor corriendo en http://${host}:${port}`)
    );
  };
}

/*
  Inicialización de dependencias y arranque
  - Aquí se construyen las instancias del modelo, vistas y routers y se
    pasa todo al servidor principal.
  - En una arquitectura más compleja esto podría extraerse a un container
    de inyección de dependencias o fábrica.
*/
const newsModel = new NewsModel();
const newsView = new NewsView();
const searchBarRouter = new SearchBarRouter(newsModel, newsView);
const newsRouter = new NewsRouter(newsView, newsModel);
const aboutView = new AboutView();
const aboutRouter = new AboutRouter(aboutView);

const server = new Server(newsRouter, searchBarRouter, aboutRouter);
server.start();
