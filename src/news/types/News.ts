/*
  Tipado para el dominio "News"
  -----------------------------
  Define la forma esperada de una noticia en la aplicación.

  Campos:
  - id: identificador numérico único
  - title: título de la noticia
  - summary: texto breve resumido para listados
  - content: cuerpo o contenido principal
  - image: URL o ruta de la imagen asociada
  - date: fecha asociada a la noticia (string en formato local)

  Observación: en una app real, `date` podría representarse con `Date`
  y/o almacenarse en formato ISO en la base de datos.
*/
export interface News {
  id: number;
  title: string;
  summary: string;
  content: string;
  image: string;
  date: string;
}
