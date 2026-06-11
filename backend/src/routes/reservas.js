const router = require('express').Router();
const prisma = require('../config/prisma');
const { authenticateJWT } = require('../middleware/auth');

const HORAS_MIN_CANCELACION = 2;

router.use(authenticateJWT);

// Mis reservas
router.get('/mis-reservas', async (req, res, next) => {
  try {
    const reservas = await prisma.reserva.findMany({
      where: { id_usuario: req.user.id_usuario },
      include: {
        espacio: {
          select: { nombre: true, disciplina: { select: { nombre: true } } },
        },
      },
      orderBy: { fecha_hora_inicio: 'desc' },
    });
    res.json(reservas);
  } catch (err) {
    next(err);
  }
});

// Crear reserva
router.post('/', async (req, res, next) => {
  try {
    const { id_espacio, fecha_hora_inicio, fecha_hora_fin } = req.body;
    if (!id_espacio || !fecha_hora_inicio || !fecha_hora_fin) {
      return res.status(400).json({ error: 'Campos requeridos: id_espacio, fecha_hora_inicio, fecha_hora_fin' });
    }

    const inicio = new Date(fecha_hora_inicio);
    const fin = new Date(fecha_hora_fin);

    if (inicio >= fin) return res.status(400).json({ error: 'La hora de fin debe ser posterior a la de inicio' });
    if (inicio < new Date()) return res.status(400).json({ error: 'No se pueden reservar turnos en el pasado' });

    // Verificar espacio activo
    const espacio = await prisma.espacio.findFirst({
      where: { id_espacio, estado: 'ACTIVO', disciplina: { habilitada: true } },
    });
    if (!espacio) return res.status(404).json({ error: 'Espacio no disponible' });

    // Verificar solapamiento con reservas existentes
    const solapamiento = await prisma.reserva.findFirst({
      where: {
        id_espacio,
        estado: { not: 'CANCELADA' },
        fecha_hora_inicio: { lt: fin },
        fecha_hora_fin: { gt: inicio },
      },
    });
    if (solapamiento) return res.status(409).json({ error: 'El horario ya está reservado' });

    // Verificar solapamiento con bloqueos
    const bloqueo = await prisma.bloqueo.findFirst({
      where: {
        id_espacio,
        fecha_hora_inicio: { lt: fin },
        fecha_hora_fin: { gt: inicio },
      },
    });
    if (bloqueo) return res.status(409).json({ error: `Horario bloqueado: ${bloqueo.motivo}` });

    const reserva = await prisma.reserva.create({
      data: {
        id_usuario: req.user.id_usuario,
        id_espacio,
        fecha_hora_inicio: inicio,
        fecha_hora_fin: fin,
        estado: 'CONFIRMADA',
      },
      include: {
        espacio: { select: { nombre: true, disciplina: { select: { nombre: true } } } },
      },
    });
    res.status(201).json(reserva);
  } catch (err) {
    next(err);
  }
});

// Cancelar reserva propia
router.patch('/:id/cancelar', async (req, res, next) => {
  try {
    const id_reserva = parseInt(req.params.id);
    const reserva = await prisma.reserva.findFirst({
      where: { id_reserva, id_usuario: req.user.id_usuario },
    });
    if (!reserva) return res.status(404).json({ error: 'Reserva no encontrada' });
    if (reserva.estado === 'CANCELADA') return res.status(400).json({ error: 'La reserva ya está cancelada' });

    const ahora = new Date();
    const horasHastaInicio = (reserva.fecha_hora_inicio - ahora) / (1000 * 60 * 60);
    if (horasHastaInicio < HORAS_MIN_CANCELACION) {
      return res.status(400).json({
        error: `Solo se puede cancelar con al menos ${HORAS_MIN_CANCELACION} horas de anticipación`,
      });
    }

    const actualizada = await prisma.reserva.update({
      where: { id_reserva },
      data: { estado: 'CANCELADA' },
    });
    res.json(actualizada);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
