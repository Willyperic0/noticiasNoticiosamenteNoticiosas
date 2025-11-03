Para comenzar a trabajar con este proyecto, asegúrate de tener **Node.js** y **npm** correctamente instalados en tu entorno.

Una vez clonado el repositorio, instala todas las dependencias necesarias ejecutando:

```bash
npm install
```

> Este paso es **obligatorio** después de clonar el repositorio, ya que la carpeta `node_modules/` está incluida en `.gitignore` y no se versiona en Git.

---

### Iniciar el servidor en modo desarrollo

Para levantar el entorno local con recarga automática (hot-reload), utiliza:

```bash
npm run dev
```

Este comando ejecuta el proyecto con **ts-node-dev**, ideal para desarrollo activo en TypeScript.

---

### Ejecutar pruebas unitarias

Para validar la funcionalidad del código con Jest, corre:

```bash
npm run test
```

Esto ejecuta las pruebas unitarias definidas en la carpeta `test/` y muestra resultados detallados en consola.

---

### Ejecutar pruebas E2E (End-to-End)

Para simular flujos completos del usuario en el navegador mediante **Puppeteer**, usa:

```bash
npm run test:e2e -- e2e/main.e2e.test.js
```

Estas pruebas garantizan que las rutas, vistas y funcionalidades del sitio funcionen correctamente de extremo a extremo.
