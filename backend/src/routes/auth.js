const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const prisma = require('../config/prisma');

router.post('/register', async (req, res, next) => {
  try {
    const { nombre, apellido, email, contrasena } = req.body;
    if (!nombre || !apellido || !email || !contrasena) {
      return res.status(400).json({ error: 'Todos los campos son requeridos' });
    }
    const existe = await prisma.usuario.findUnique({ where: { email } });
    if (existe) return res.status(409).json({ error: 'El email ya está registrado' });

    const contrasena_hash = await bcrypt.hash(contrasena, 10);
    const usuario = await prisma.usuario.create({
      data: { nombre, apellido, email, contrasena_hash },
      select: { id_usuario: true, nombre: true, apellido: true, email: true, rol: true },
    });
    const token = jwt.sign(
      { id_usuario: usuario.id_usuario, rol: usuario.rol },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    res.status(201).json({ usuario, token });
  } catch (err) {
    next(err);
  }
});

router.post('/login', async (req, res, next) => {
  try {
    const { email, contrasena } = req.body;
    if (!email || !contrasena) {
      return res.status(400).json({ error: 'Email y contraseña requeridos' });
    }
    const usuario = await prisma.usuario.findUnique({ where: { email } });
    if (!usuario) return res.status(401).json({ error: 'Credenciales inválidas' });

    const valido = await bcrypt.compare(contrasena, usuario.contrasena_hash);
    if (!valido) return res.status(401).json({ error: 'Credenciales inválidas' });

    const token = jwt.sign(
      { id_usuario: usuario.id_usuario, rol: usuario.rol },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    const { contrasena_hash: _, ...usuarioPublico } = usuario;
    res.json({ usuario: usuarioPublico, token });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
