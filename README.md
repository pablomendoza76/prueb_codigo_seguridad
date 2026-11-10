# Demo: inyección SQL por concatenación

Frontend en Angular, backend local en Node.js (Express) y base de datos SQLite.

## Requisitos
- Node.js 22.22 o superior (o 24.15 o superior). Verifica con `node -v`.
- Visual Studio Code.

## Cómo ejecutar
1. Abre esta carpeta en VS Code (Archivo > Abrir carpeta).
2. Abre una terminal (Terminal > Nueva terminal) y ejecuta una sola vez:
   ```
   npm run instalar
   ```
3. Levanta backend y frontend a la vez:
   ```
   npm start
   ```
4. Se abre http://localhost:4200. El backend queda en http://localhost:3000/api/cursos.

## Prueba
- Escribe `Bases de Datos` y devuelve un solo curso.
- Escribe `' OR '1'='1` en modo vulnerable y devuelve todos los cursos.
- Cambia a modo seguro y la misma entrada devuelve 0 cursos.

## Estructura por capas
```
backend/
  src/
    server.js                       Punto de entrada (Express, puerto 3000)
    routes/cursos.routes.js         Rutas: GET /api/cursos
    controllers/cursos.controller.js  Recibe la petición y llama al servicio
    services/cursos.service.js      Consulta a SQLite (versión vulnerable y segura)
    config/database.js              Crea data/cursos.db y carga los cursos
frontend/
  proxy.conf.json                   Redirige /api al backend
  src/app/
    models/curso.model.ts           Interfaces de datos
    services/cursos.service.ts      Llama al backend con HttpClient
    components/buscador-cursos/     Página de búsqueda
```

La base `backend/data/cursos.db` se crea sola la primera vez que arranca el backend.
