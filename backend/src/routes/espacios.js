const router = require('express').Router();
const prisma = require('../config/prisma');

// Listar espacios activos (público)
router.get('/', async (_req, res, next) => {
  try {
    const espacios = await prisma.espacio.findMany({
      where: { estado: 'ACTIVO', disciplina: { habilitada: true } },
      include: { disciplina: { select: { nombre: true } } },
    });
    res.json(espacios);
  } catch (err) {
    next(err);
  }
});

// Disponibilidad de un espacio para una fecha dada
// GET /api/espacios/:id/disponibilidad?fecha=2024-06-15
router.get('/:id/disponibilidad', async (req, res, next) => {
  try {
    const id_espacio = parseInt(req.params.id);
    const { fecha } = req.query;
    if (!fecha) return res.status(400).json({ error: 'Parámetro fecha requerido (YYYY-MM-DD)' });

    const inicio = new Date(`${fecha}T00:00:00`);
    const fin = new Date(`${fecha}T23:59:59`);

    const [reservas, bloqueos] = await Promise.all([
      prisma.reserva.findMany({
        where: {
          id_espacio,
          estado: { not: 'CANCELADA' },
          fecha_hora_inicio: { gte: inicio },
          fecha_hora_fin: { lte: fin },
        },
        select: { fecha_hora_inicio: true, fecha_hora_fin: true },
      }),
      prisma.bloqueo.findMany({
        where: {
          id_espacio,
          fecha_hora_inicio: { gte: inicio },
          fecha_hora_fin: { lte: fin },
        },
        select: { fecha_hora_inicio: true, fecha_hora_fin: true, motivo: true },
      }),
    ]);

    // Generar slots de 1 hora entre 08:00 y 23:00
    const slots = [];
    for (let hora = 8; hora < 23; hora++) {
      const slotInicio = new Date(`${fecha}T${String(hora).padStart(2, '0')}:00:00`);
      const slotFin = new Date(`${fecha}T${String(hora + 1).padStart(2, '0')}:00:00`);

      const ocupadoReserva = reservas.some(
        (r) => r.fecha_hora_inicio < slotFin && r.fecha_hora_fin > slotInicio
      );
      const ocupadoBloqueo = bloqueos.some(
        (b) => b.fecha_hora_inicio < slotFin && b.fecha_hora_fin > slotInicio
      );

      slots.push({
        hora_inicio: slotInicio.toISOString(),
        hora_fin: slotFin.toISOString(),
        disponible: !ocupadoReserva && !ocupadoBloqueo,
        motivo_bloqueo: ocupadoBloqueo
          ? bloqueos.find((b) => b.fecha_hora_inicio < slotFin && b.fecha_hora_fin > slotInicio)?.motivo
          : null,
      });
    }

    res.json({ id_espacio, fecha, slots });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
