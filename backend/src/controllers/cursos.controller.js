// Capa de controlador: recibe la petición HTTP y llama al servicio
const cursosService = require('../services/cursos.service');

function buscar(req, res) {
  const nombre = String(req.query.nombre ?? '');
  const modo = req.query.modo === 'seguro' ? 'seguro' : 'vulnerable';
  const total = cursosService.contarCursos();

  try {
    const resultado = modo === 'seguro'
      ? cursosService.buscarSeguro(nombre)
      : cursosService.buscarVulnerable(nombre);

    console.log(`[${modo}] ${resultado.sql}`);
    res.json({ ...resultado, total });
  } catch (error) {
    console.log(`[${modo}] ERROR en: ${error.sql}`);
    res.status(400).json({ modo, sql: error.sql, error: error.message, total });
  }
}

module.exports = { buscar };
