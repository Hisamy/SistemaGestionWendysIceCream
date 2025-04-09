import express from 'express';
import cors from "cors";
import gestionarInventarioRouter from '../routers/GestionarInventarioRouter.js';
import gestionarProductosRouter from '../routers/GestionarProductosRouter.js';
import gestionarVentaRouter from '../routers/GestionarVentaRouter.js';

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());
app.use('/gestionarInventario', gestionarInventarioRouter);
app.use('/gestionarProductos', gestionarProductosRouter);
app.use("/gestionarVenta", gestionarVentaRouter);


app.listen(PORT, () => {
  console.log(`Servidor activo en puerto ${PORT}`);
  console.log(`Puedes entrar clickeando http://localhost:${PORT}`);
});