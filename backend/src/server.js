// Punto de entrada del backend
const express = require('express');
const cursosRoutes = require('./routes/cursos.routes');

const app = express();
const PUERTO = 3000;

app.use(express.json());
app.use('/api/cursos', cursosRoutes);

app.listen(PUERTO, () => {
  console.log(`Backend listo en http://localhost:${PUERTO}/api/cursos`);
});
