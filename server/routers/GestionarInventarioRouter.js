/**
 * @module gestionarInventarioRouter
 * Router que maneja las solicitudes HTTP relacionadas con la gestión de inventarios de consumibles.
 */

import { Router } from 'express';
import GestionarInventarioService from '../services/GestionarInventarioService.js';
import { BusinessError } from '../errors/BusinessError.js';
import { ValidationError } from '../errors/ValidationError.js';

// Instancia del enrutador y del servicio de gestión de inventario
const gestionarInventarioRouter = Router();
const service = new GestionarInventarioService();

/**
 * Ruta POST para registrar un nuevo consumible.
 * 
 * @name POST /registrar
 * @param {object} datosConsumible - Datos del consumible a registrar.
 * @returns {string} - Mensaje indicando que el consumible fue registrado correctamente.
 */
gestionarInventarioRouter.post("/registrar", async (req, res) => {
    const datosConsumible = req.body;
    try {
        await service.registrarConsumible(datosConsumible);
        res.status(201).send("Consumible registrado correctamente");
    } catch (error) {
        mandarRespuestaError(error, res);
    }
});

/**
 * Ruta GET para obtener todos los consumibles registrados.
 * 
 * @name GET /consumibles
 * @returns {array} - Lista de consumibles registrados.
 */
gestionarInventarioRouter.get("/consumibles", async (req, res) => {
    try {
        const consumibles = await service.obtenerConsumibles();
        res.status(200).json(consumibles);
    } catch (error) {
        mandarRespuestaError(error, res);
    }
});

/**
 * Ruta GET para obtener un consumible específico por su ID.
 * 
 * @name GET /consumible/:id
 * @param {string} id - ID del consumible a obtener.
 * @returns {object} - Datos del consumible solicitado.
 */
gestionarInventarioRouter.get("/consumible/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const consumible = await service.obtenerConsumible(id);
        res.status(200).json(consumible);
    } catch (error) {
        mandarRespuestaError(error, res);
    }
});

/**
 * Ruta PUT para editar los detalles de un consumible existente.
 * 
 * @name PUT /editar/:id
 * @param {string} id - ID del consumible a editar.
 * @param {object} datosEntrantes - Datos actualizados del consumible.
 * @returns {string} - Mensaje indicando que el consumible fue editado correctamente.
 */
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

/**
 * Ruta DELETE para eliminar un consumible por su ID.
 * 
 * @name DELETE /eliminar/:id
 * @param {string} id - ID del consumible a eliminar.
 * @returns {string} - Mensaje indicando que el consumible fue eliminado correctamente.
 */
gestionarInventarioRouter.delete("/eliminar/:id", async (req, res) => {
    try {
        const id = req.params.id;
        await service.eliminarConsumible(id);
        res.status(200).send("Consumible eliminado correctamente");
    } catch (error) {
        mandarRespuestaError(error, res);
    }
});

/**
 * Función para manejar los errores y enviar una respuesta adecuada al cliente.
 * 
 * @param {Error} error - El error que ocurrió.
 * @param {Response} res - Objeto de respuesta HTTP.
 */
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
