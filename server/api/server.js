import express from 'express';
import gestionarInventarioRouter from '../routers/GestionarInventarioRouter.js';

const app = express();
const PORT = 3000;

app.use(express.json());
app.use('/gestionarInventario', gestionarInventarioRouter);


app.listen(PORT, () => {
  console.log(`Servidor activo en puerto ${PORT}`);
});