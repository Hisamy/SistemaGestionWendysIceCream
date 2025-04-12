import { dirname, resolve } from "path";
import { fileURLToPath } from "url";
import fs from "fs"; // Importamos el módulo 'fs' para manejo de archivos

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Ruta ABSOLUTA a la carpeta 'database'
const dbFolderPath = resolve(__dirname, "../database");
const dbFilePath = resolve(dbFolderPath, "wendysicecream.db");

// Asegura que la carpeta 'database' exista
if (!fs.existsSync(dbFolderPath)) {
    fs.mkdirSync(dbFolderPath, { recursive: true });
}

// Exporta la ruta (sin 'file:')
export const DATABASE = dbFilePath;