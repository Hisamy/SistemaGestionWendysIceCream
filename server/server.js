import express from 'express';
import gestionarInventarioRouter from './routers/GestionarInventarioRouter.js';

const app = express();
const port = 3000;

app.use(express.json());
app.use('/gestionarInventario', gestionarInventarioRouter);


app.listen(port, () => {
  console.log(`Servidor activo en puerto ${port}`);
});