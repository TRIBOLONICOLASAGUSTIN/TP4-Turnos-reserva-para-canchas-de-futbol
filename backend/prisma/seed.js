const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('Sembrando datos de prueba...');

  // Disciplinas
  const futbol = await prisma.disciplina.upsert({
    where: { id_disciplina: 1 },
    update: {},
    create: { nombre: 'Fútbol', habilitada: true },
  });
  const voley = await prisma.disciplina.upsert({
    where: { id_disciplina: 2 },
    update: {},
    create: { nombre: 'Vóley', habilitada: true },
  });
  const padel = await prisma.disciplina.upsert({
    where: { id_disciplina: 3 },
    update: {},
    create: { nombre: 'Pádel', habilitada: false },
  });
  const basquet = await prisma.disciplina.upsert({
    where: { id_disciplina: 4 },
    update: {},
    create: { nombre: 'Básquet 3x3', habilitada: false },
  });
  const social = await prisma.disciplina.upsert({
    where: { id_disciplina: 5 },
    update: {},
    create: { nombre: 'Área Social', habilitada: true },
  });

  // Espacios — Fútbol (12 canchas) — $3000/hora
  for (let i = 1; i <= 12; i++) {
    await prisma.espacio.upsert({
      where: { id_espacio: i },
      update: { precio_por_hora: 3000 },
      create: {
        nombre: `Cancha de Fútbol ${i}`,
        id_disciplina: futbol.id_disciplina,
        estado: 'ACTIVO',
        capacidad: 14,
        precio_por_hora: 3000,
      },
    });
  }

  // Vóley (2 canchas) — $2000/hora
  for (let i = 13; i <= 14; i++) {
    await prisma.espacio.upsert({
      where: { id_espacio: i },
      update: { precio_por_hora: 2000 },
      create: {
        nombre: `Cancha de Vóley ${i - 12}`,
        id_disciplina: voley.id_disciplina,
        estado: 'ACTIVO',
        capacidad: 12,
        precio_por_hora: 2000,
      },
    });
  }

  // Pádel (2 canchas — en construcción) — $2500/hora
  for (let i = 15; i <= 16; i++) {
    await prisma.espacio.upsert({
      where: { id_espacio: i },
      update: { precio_por_hora: 2500 },
      create: {
        nombre: `Cancha de Pádel ${i - 14}`,
        id_disciplina: padel.id_disciplina,
        estado: 'EN_CONSTRUCCION',
        capacidad: 4,
        precio_por_hora: 2500,
      },
    });
  }

  // Básquet 3x3 (1 cancha — en construcción) — $1500/hora
  await prisma.espacio.upsert({
    where: { id_espacio: 17 },
    update: { precio_por_hora: 1500 },
    create: {
      nombre: 'Cancha de Básquet 3x3',
      id_disciplina: basquet.id_disciplina,
      estado: 'EN_CONSTRUCCION',
      capacidad: 6,
      precio_por_hora: 1500,
    },
  });

  // Quincho con asador — $5000/hora
  await prisma.espacio.upsert({
    where: { id_espacio: 18 },
    update: { precio_por_hora: 5000 },
    create: {
      nombre: 'Quincho con Asador',
      id_disciplina: social.id_disciplina,
      estado: 'ACTIVO',
      capacidad: 50,
      precio_por_hora: 5000,
    },
  });

  // Usuario ADMIN
  const adminHash = await bcrypt.hash('admin123', 10);
  await prisma.usuario.upsert({
    where: { email: 'admin@ttcsport.com' },
    update: {},
    create: {
      nombre: 'Admin',
      apellido: 'TTC',
      email: 'admin@ttcsport.com',
      contrasena_hash: adminHash,
      rol: 'ADMIN',
    },
  });

  // Usuario CLIENTE de prueba
  const clienteHash = await bcrypt.hash('cliente123', 10);
  await prisma.usuario.upsert({
    where: { email: 'cliente@ttcsport.com' },
    update: {},
    create: {
      nombre: 'Juan',
      apellido: 'Trogolo',
      email: 'cliente@ttcsport.com',
      contrasena_hash: clienteHash,
      rol: 'CLIENTE',
    },
  });

  console.log('✓ Seed completado');
  console.log('  Admin:   admin@ttcsport.com / admin123');
  console.log('  Cliente: cliente@ttcsport.com / cliente123');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
