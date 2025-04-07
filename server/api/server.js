import express from 'express';
import gestionarInventarioRouter from '../routers/GestionarInventarioRouter.js';
import gestionarProductosRouter from '../routers/GestionarProductosRouter.js'

const app = express();
const PORT = 3000;

app.use(express.json());
app.use('/gestionarInventario', gestionarInventarioRouter);
app.use('/gestionarProductos', gestionarProductosRouter);


app.listen(PORT, () => {
  console.log(`Servidor activo en puerto ${PORT}`);
  console.log(`Puedes entrar clicleando http://localhost:${PORT}`);
  
});