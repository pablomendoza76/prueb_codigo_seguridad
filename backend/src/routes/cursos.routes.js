// Capa de rutas: define los endpoints de cursos
const { Router } = require('express');
const cursosController = require('../controllers/cursos.controller');

const router = Router();

// GET /api/cursos?nombre=Bases de Datos&modo=vulnerable|seguro
router.get('/', cursosController.buscar);

module.exports = router;
