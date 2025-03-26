import { Router } from 'express';
import Consumible from '../entities/Consumible.js';
import GestionarInventarioService from '../services/GestionarInventarioService.js';

const gestionarInventarioRouter = Router();
const service = new GestionarInventarioService();

gestionarInventarioRouter.post("/registrar", async (req, res) => {
    const cuerpoObtenido = req.body;
    try {
        const consumible = Consumible.crearConsumible(JSON.stringify(cuerpoObtenido));
        await service.registrarConsumible(consumible);
        res.status(201).send("Consumible registrado correctamente");
    } catch (error) {
        res.status(400).send(error.message);
    }
});

gestionarInventarioRouter.get("/consumibles", async (req, res) => {
    try {
        const consumibles = await service.obtenerConsumibles();
        res.status(200).json(consumibles);
    } catch (error) {
        res.status(400).send(error.message);
    }
});

gestionarInventarioRouter.get("/consumible/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const consumible = await service.obtenerConsumible(id);
        res.status(200).json(consumible);
    } catch (error) {
        res.status(400).send(error.message);
    }
});

gestionarInventarioRouter.put("/editar/:id", async (req, res) => {
    const id = req.params.id;
    const cuerpoObtenido = req.body;
    try {
        const consumible = Consumible.crearConsumible(JSON.stringify(cuerpoObtenido));
        await service.editarConsumible(id, consumible);
        res.status(200).send("Consumible editado correctamente");
    } catch (error) {
        res.status(400).send(error.message);
    }
});

gestionarInventarioRouter.delete("/eliminar/:id", async (req, res) => {
    try {
        const id = req.params.id;
        await service.eliminarConsumible(id);
        res.status(200).send("Consumible eliminado correctamente");
    } catch (error) {
        res.status(400).send(error.message);
    }
});

export default gestionarInventarioRouter;