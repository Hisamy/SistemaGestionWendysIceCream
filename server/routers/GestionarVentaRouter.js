import { Router } from "express";
import GestionarVentaService from "../services/GestionarVentaService.js";
import { BusinessError } from '../errors/BusinessError.js';
import { ValidationError } from '../errors/ValidationError.js';

const gestionarVentaRouter = Router();
const service = new GestionarVentaService();

gestionarVentaRouter.post("/registrar", async (req, res)=> {
    const datosVenta = req.body;
    try {
        await service.registrarVenta(datosVenta);
        res.status(201).send("Venta registrada correctamente");
    } catch (error) {
        mandarRespuestaError(error, res);
    }
});

gestionarVentaRouter.get("/ventas", async (req, res)=> {
    try {
        const ventas = await service.obtenerVentas();
        res.status(200).json(ventas);
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

export default gestionarVentaRouter;
