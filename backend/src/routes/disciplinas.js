const router = require('express').Router();
const prisma = require('../config/prisma');

// Listar disciplinas habilitadas (público)
router.get('/', async (_req, res, next) => {
  try {
    const disciplinas = await prisma.disciplina.findMany({
      where: { habilitada: true },
      include: {
        espacios: {
          where: { estado: 'ACTIVO' },
          select: { id_espacio: true, nombre: true, capacidad: true, precio_por_hora: true },
        },
      },
    });
    res.json(disciplinas);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
