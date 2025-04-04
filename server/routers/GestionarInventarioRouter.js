import { Router } from 'express';
import GestionarInventarioService from '../services/GestionarInventarioService.js';
import { BusinessError } from '../errors/BusinessError.js';
import { ValidationError } from '../errors/ValidationError.js';

const gestionarInventarioRouter = Router();
const service = new GestionarInventarioService();

gestionarInventarioRouter.post("/registrar", async (req, res) => {
    const datosConsumible = req.body;
    try {
        await service.registrarConsumible(datosConsumible);
        res.status(201).send("Consumible registrado correctamente");
    } catch (error) {
        mandarRespuestaError(error, res);
    }
});

gestionarInventarioRouter.get("/consumibles", async (req, res) => {
    try {
        const consumibles = await service.obtenerConsumibles();
        res.status(200).json(consumibles);
    } catch (error) {
        mandarRespuestaError(error, res);
    }
});

gestionarInventarioRouter.get("/consumible/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const consumible = await service.obtenerConsumible(id);
        res.status(200).json(consumible);
    } catch (error) {
        mandarRespuestaError(error, res);
    }
});

gestionarInventarioRouter.put("/editar/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const datosEntrantes = req.body;
        await service.editarConsumible(id, datosEntrantes);
        res.status(200).send("Consumible editado correctamente");
    } catch (error) {
        mandarRespuestaError(error, res);
    }
});

gestionarInventarioRouter.delete("/eliminar/:id", async (req, res) => {
    try {
        const id = req.params.id;
        await service.eliminarConsumible(id);
        res.status(200).send("Consumible eliminado correctamente");
    } catch (error) {
        mandarRespuestaError(error, res);
    }
});

const mandarRespuestaError = (error, res) => {
    if(error instanceof BusinessError){
        res.status(500).send(error.message);
    } else if(error instanceof ValidationError){
        res.status(400).send(error.message);
    } else {
        res.status(500).send(`Error con la conexión: ${error.message}`);
    }
}

export default gestionarInventarioRouter;