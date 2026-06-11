const router = require('express').Router();
const prisma = require('../config/prisma');
const { authenticateJWT, requireAdmin } = require('../middleware/auth');

router.use(authenticateJWT, requireAdmin);

// ── Reservas ──────────────────────────────────────────────

router.get('/reservas', async (req, res, next) => {
  try {
    const { estado, fecha } = req.query;
    const where = {};
    if (estado) where.estado = estado;
    if (fecha) {
      where.fecha_hora_inicio = {
        gte: new Date(`${fecha}T00:00:00`),
        lte: new Date(`${fecha}T23:59:59`),
      };
    }
    const reservas = await prisma.reserva.findMany({
      where,
      include: {
        usuario: { select: { nombre: true, apellido: true, email: true } },
        espacio: { select: { nombre: true, disciplina: { select: { nombre: true } } } },
      },
      orderBy: { fecha_hora_inicio: 'asc' },
    });
    res.json(reservas);
  } catch (err) {
    next(err);
  }
});

router.post('/reservas', async (req, res, next) => {
  try {
    const { id_usuario, id_espacio, fecha_hora_inicio, fecha_hora_fin } = req.body;
    const reserva = await prisma.reserva.create({
      data: {
        id_usuario,
        id_espacio,
        fecha_hora_inicio: new Date(fecha_hora_inicio),
        fecha_hora_fin: new Date(fecha_hora_fin),
        estado: 'CONFIRMADA',
      },
    });
    res.status(201).json(reserva);
  } catch (err) {
    next(err);
  }
});

router.patch('/reservas/:id', async (req, res, next) => {
  try {
    const id_reserva = parseInt(req.params.id);
    const { estado } = req.body;
    const reserva = await prisma.reserva.update({
      where: { id_reserva },
      data: { estado },
    });
    res.json(reserva);
  } catch (err) {
    next(err);
  }
});

// ── Espacios ──────────────────────────────────────────────

router.get('/espacios', async (_req, res, next) => {
  try {
    const espacios = await prisma.espacio.findMany({
      include: { disciplina: { select: { nombre: true, habilitada: true } } },
      orderBy: { id_espacio: 'asc' },
    });
    res.json(espacios);
  } catch (err) {
    next(err);
  }
});

router.post('/espacios', async (req, res, next) => {
  try {
    const { id_disciplina, nombre, estado, capacidad } = req.body;
    const espacio = await prisma.espacio.create({
      data: { id_disciplina, nombre, estado: estado || 'ACTIVO', capacidad },
    });
    res.status(201).json(espacio);
  } catch (err) {
    next(err);
  }
});

router.patch('/espacios/:id', async (req, res, next) => {
  try {
    const id_espacio = parseInt(req.params.id);
    const { nombre, estado, capacidad } = req.body;
    const espacio = await prisma.espacio.update({
      where: { id_espacio },
      data: { ...(nombre && { nombre }), ...(estado && { estado }), ...(capacidad && { capacidad }) },
    });
    res.json(espacio);
  } catch (err) {
    next(err);
  }
});

// ── Bloqueos ──────────────────────────────────────────────

router.get('/bloqueos', async (_req, res, next) => {
  try {
    const bloqueos = await prisma.bloqueo.findMany({
      include: {
        espacio: { select: { nombre: true } },
        admin: { select: { nombre: true, apellido: true } },
      },
      orderBy: { fecha_hora_inicio: 'asc' },
    });
    res.json(bloqueos);
  } catch (err) {
    next(err);
  }
});

router.post('/bloqueos', async (req, res, next) => {
  try {
    const { id_espacio, fecha_hora_inicio, fecha_hora_fin, motivo } = req.body;
    if (!id_espacio || !fecha_hora_inicio || !fecha_hora_fin || !motivo) {
      return res.status(400).json({ error: 'Todos los campos son requeridos' });
    }
    const bloqueo = await prisma.bloqueo.create({
      data: {
        id_espacio,
        id_admin: req.user.id_usuario,
        fecha_hora_inicio: new Date(fecha_hora_inicio),
        fecha_hora_fin: new Date(fecha_hora_fin),
        motivo,
      },
    });
    res.status(201).json(bloqueo);
  } catch (err) {
    next(err);
  }
});

router.delete('/bloqueos/:id', async (req, res, next) => {
  try {
    const id_bloqueo = parseInt(req.params.id);
    await prisma.bloqueo.delete({ where: { id_bloqueo } });
    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

// ── Disciplinas ───────────────────────────────────────────

router.get('/disciplinas', async (_req, res, next) => {
  try {
    const disciplinas = await prisma.disciplina.findMany({
      include: { _count: { select: { espacios: true } } },
    });
    res.json(disciplinas);
  } catch (err) {
    next(err);
  }
});

router.patch('/disciplinas/:id', async (req, res, next) => {
  try {
    const id_disciplina = parseInt(req.params.id);
    const { habilitada, nombre } = req.body;
    const disciplina = await prisma.disciplina.update({
      where: { id_disciplina },
      data: {
        ...(nombre !== undefined && { nombre }),
        ...(habilitada !== undefined && { habilitada }),
      },
    });
    res.json(disciplina);
  } catch (err) {
    next(err);
  }
});

// ── Usuarios ──────────────────────────────────────────────

router.get('/usuarios', async (_req, res, next) => {
  try {
    const usuarios = await prisma.usuario.findMany({
      select: { id_usuario: true, nombre: true, apellido: true, email: true, rol: true, fecha_registro: true },
      orderBy: { fecha_registro: 'desc' },
    });
    res.json(usuarios);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
