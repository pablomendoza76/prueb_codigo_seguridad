// Capa de servicio: aquí está la consulta a la base SQLite
const db = require('../config/database');

// VERSIÓN VULNERABLE (igual a la diapositiva):
// el texto del usuario se concatena dentro de la instrucción SQL.
// Prueba local: ' OR '1'='1 convierte el filtro en una condición verdadera.
function buscarVulnerable(nombre) {
  const sql = "SELECT id, nombre FROM cursos WHERE nombre = '"
            + nombre + "' OR id = '" + nombre + "'";
  try {
    const cursos = db.prepare(sql).all();
    return { modo: 'vulnerable', sql, parametros: [], cursos };
  } catch (error) {
    error.sql = sql;
    throw error;
  }
}

// VERSIÓN SEGURA (2.3 Construcción segura: consultas parametrizadas).
// Equivalente en Java con JDBC:
//   String sql = "SELECT id, nombre FROM cursos WHERE nombre = ?";
//   try (PreparedStatement ps = cn.prepareStatement(sql)) {
//       ps.setString(1, nombre);          // vincula el valor al marcador ?
//       try (ResultSet rs = ps.executeQuery()) { mostrarCursos(rs); }
//   }
// Con la misma entrada (' OR '1'='1) la consulta busca un nombre literal.
function buscarSeguro(nombre) {
  const sql = 'SELECT id, nombre FROM cursos WHERE nombre = ? OR id = ?';
  const cursos = db.prepare(sql).all(nombre, nombre);
  return { modo: 'seguro', sql, parametros: [nombre, nombre], cursos };
}

function contarCursos() {
  return db.prepare('SELECT COUNT(*) AS total FROM cursos').get().total;
}

module.exports = { buscarVulnerable, buscarSeguro, contarCursos };
