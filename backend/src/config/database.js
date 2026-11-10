// Capa de datos: abre (o crea) la base SQLite y carga los cursos de ejemplo
const path = require('path');
const fs = require('fs');
const { DatabaseSync } = require('node:sqlite'); // SQLite integrado en Node, sin compilar

const carpetaDatos = path.join(__dirname, '..', '..', 'data');
fs.mkdirSync(carpetaDatos, { recursive: true });

const db = new DatabaseSync(path.join(carpetaDatos, 'cursos.db'));

db.exec(`
  CREATE TABLE IF NOT EXISTS cursos (
    id     INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL
  )
`);

const { total } = db.prepare('SELECT COUNT(*) AS total FROM cursos').get();
if (total === 0) {
  const insertar = db.prepare('INSERT INTO cursos (nombre) VALUES (?)');
  [
    'Bases de Datos',
    'Seguridad de la Información',
    'Sistemas Inteligentes',
    'Tecnologías Emergentes',
    'Gestión de Proyectos',
    'Estadística',
    'Computación Paralela y Distribuida',
    'Ingeniería de Software'
  ].forEach((nombre) => insertar.run(nombre));
}

module.exports = db;
