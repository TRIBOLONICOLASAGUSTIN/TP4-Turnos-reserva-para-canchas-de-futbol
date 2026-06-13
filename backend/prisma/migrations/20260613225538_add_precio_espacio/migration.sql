-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Espacio" (
    "id_espacio" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "id_disciplina" INTEGER NOT NULL,
    "nombre" TEXT NOT NULL,
    "estado" TEXT NOT NULL DEFAULT 'ACTIVO',
    "capacidad" INTEGER NOT NULL,
    "precio_por_hora" REAL NOT NULL DEFAULT 0,
    CONSTRAINT "Espacio_id_disciplina_fkey" FOREIGN KEY ("id_disciplina") REFERENCES "Disciplina" ("id_disciplina") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Espacio" ("capacidad", "estado", "id_disciplina", "id_espacio", "nombre") SELECT "capacidad", "estado", "id_disciplina", "id_espacio", "nombre" FROM "Espacio";
DROP TABLE "Espacio";
ALTER TABLE "new_Espacio" RENAME TO "Espacio";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
