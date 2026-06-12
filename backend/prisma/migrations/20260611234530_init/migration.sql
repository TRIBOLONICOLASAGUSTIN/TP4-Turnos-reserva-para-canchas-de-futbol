-- CreateTable
CREATE TABLE "Usuario" (
    "id_usuario" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nombre" TEXT NOT NULL,
    "apellido" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "contrasena_hash" TEXT NOT NULL,
    "rol" TEXT NOT NULL DEFAULT 'CLIENTE',
    "fecha_registro" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Disciplina" (
    "id_disciplina" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nombre" TEXT NOT NULL,
    "habilitada" BOOLEAN NOT NULL DEFAULT false
);

-- CreateTable
CREATE TABLE "Espacio" (
    "id_espacio" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "id_disciplina" INTEGER NOT NULL,
    "nombre" TEXT NOT NULL,
    "estado" TEXT NOT NULL DEFAULT 'ACTIVO',
    "capacidad" INTEGER NOT NULL,
    CONSTRAINT "Espacio_id_disciplina_fkey" FOREIGN KEY ("id_disciplina") REFERENCES "Disciplina" ("id_disciplina") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Reserva" (
    "id_reserva" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "id_usuario" INTEGER NOT NULL,
    "id_espacio" INTEGER NOT NULL,
    "fecha_hora_inicio" DATETIME NOT NULL,
    "fecha_hora_fin" DATETIME NOT NULL,
    "estado" TEXT NOT NULL DEFAULT 'PENDIENTE',
    "fecha_creacion" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Reserva_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "Usuario" ("id_usuario") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Reserva_id_espacio_fkey" FOREIGN KEY ("id_espacio") REFERENCES "Espacio" ("id_espacio") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Bloqueo" (
    "id_bloqueo" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "id_espacio" INTEGER NOT NULL,
    "id_admin" INTEGER NOT NULL,
    "fecha_hora_inicio" DATETIME NOT NULL,
    "fecha_hora_fin" DATETIME NOT NULL,
    "motivo" TEXT NOT NULL,
    CONSTRAINT "Bloqueo_id_espacio_fkey" FOREIGN KEY ("id_espacio") REFERENCES "Espacio" ("id_espacio") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Bloqueo_id_admin_fkey" FOREIGN KEY ("id_admin") REFERENCES "Usuario" ("id_usuario") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_email_key" ON "Usuario"("email");
