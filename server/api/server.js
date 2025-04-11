import express from 'express';
import cors from "cors";
import path from "path";
import { fileURLToPath } from 'url';
import gestionarInventarioRouter from '../routers/GestionarInventarioRouter.js';
import gestionarProductosRouter from '../routers/GestionarProductosRouter.js';
import gestionarVentaRouter from '../routers/GestionarVentaRouter.js';

// Crear equivalentes a __dirname y __filename para ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Servir imágenes estáticas de la carpeta 'images'
app.use('/images', express.static(path.join(__dirname, 'images')));

// Routers
app.use('/gestionarInventario', gestionarInventarioRouter);
app.use('/gestionarProductos', gestionarProductosRouter);
app.use("/gestionarVenta", gestionarVentaRouter);

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor activo en puerto ${PORT}`);
  console.log(`Puedes entrar clickeando http://localhost:${PORT}`);
});