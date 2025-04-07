import { Router } from "express";
import GestionarProductosService from '../services/GestionarProductosService.js';
import { BusinessError } from '../errors/BusinessError.js';
import { ValidationError } from '../errors/ValidationError.js';

const gestionarProductosRouter = Router();
const service = new GestionarProductosService();
const mandarRespuestaError = (error, res) => {
    if(error instanceof BusinessError){
        res.status(500).send(error.message);
    } else if(error instanceof ValidationError){
        res.status(400).send(error.message);
    } else {
        res.status(500).send(`Error con la conexión: ${error.message}`);
    }
}

gestionarProductosRouter.get('/existe', async (req, res) => {
    const nombre = req.query.nombre;
    try {
        const existe = await service.buscarProductoExistentePorNombre(nombre);
        if(existe) {
            res.status(409).send(`El producto con nombre "${nombre}" ya existe.`);
        } else {
            res.status(200).send(`El nombre "${nombre}" está disponible.`);
        }
    } catch (error) {
        mandarRespuestaError(error, res);
    }
});

gestionarProductosRouter.get('/tamanios', async (req, res) => {
    try {
        const tamanios = await service.obtenerTodosLosTamanios();
        res.status(200).json(tamanios);
    } catch (error) {
        mandarRespuestaError(error, res);
    }
});

gestionarProductosRouter.get('/tamanios/default', async (req, res) => {
    try {
        const tamanioDefault = await service.obtenerTamanioDefault();
        res.status(200).send(tamanioDefault);
    } catch (error) {
        mandarRespuestaError(error, res);
    }
});

gestionarProductosRouter.get('/variantesUsadas', async (req, res) => {
    const variantesAgregadas = req.query.variantesAgregadas;
    try {
        const variantesDisponibles = await service.sePuedeAgregarMasVariantes();
        if(variantesDisponibles) {
            res.status(200).send(`Quedan tamaños suficientes para agregar más variantes`);
        } else {
            res.status(409).send(`No quedan tamaños suficientes para agregar más variantes.`);
        }
    } catch (error) {
        mandarRespuestaError(error, res);
    }
});

gestionarProductosRouter.post('/registrar', async (req, res) => {
    const producto = req.body;
    try {
        await service.registrarProducto(producto);
        res.status(201).send(`El producto "${producto.nombre}" fué registrado correctamente.`);
    } catch (error) {
        mandarRespuestaError(error, res);
    }
});

gestionarProductosRouter.get('/productos', async (req, res) => {
    try {
        const productos = await service.obtenerTodosLosProductos();
        res.status(200).json(productos);
    } catch (error) {
        mandarRespuestaError(error, res);
    }
});



export default gestionarProductosRouter;