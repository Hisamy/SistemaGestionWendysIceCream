/**
 * @module gestionarProductosRouter
 * Router que maneja las solicitudes HTTP relacionadas con la gestión de productos.
 */

import { Router } from "express";
import multer from 'multer';
import path from "path";
import GestionarProductosService from '../services/GestionarProductosService.js';
import { BusinessError } from '../errors/BusinessError.js';
import { ValidationError } from '../errors/ValidationError.js';

// Configuración básica de multer para recibir el archivo en memoria
const upload = multer({ 
    storage: multer.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024 }, // Limite de 5MB
    fileFilter: function (req, file, cb) {
        // Validar tipos de archivo
        const filetypes = /jpeg|jpg|png|gif/;
        const mimetype = filetypes.test(file.mimetype);
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        
        if (mimetype && extname) {
            return cb(null, true);
        }
        cb(new Error('Solo se permiten imágenes (jpeg, jpg, png, gif)'));
    }
});

// Instancia del enrutador y del servicio de gestión de productos
const gestionarProductosRouter = Router();
const service = new GestionarProductosService();

/**
 * Ruta GET para verificar si un producto con el nombre proporcionado ya existe.
 * 
 * @name GET /existe
 * @param {string} nombre - Nombre del producto a verificar.
 * @returns {string} - Mensaje indicando si el producto existe o está disponible.
 */
gestionarProductosRouter.get('/existe/:nombre', async (req, res) => {
    const {nombre} = req.params;
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

/**
 * Ruta GET para obtener todos los tamaños disponibles de productos.
 * 
 * @name GET /tamanios
 * @returns {array} - Lista de tamaños disponibles.
 */
gestionarProductosRouter.get('/tamanios', async (req, res) => {
    try {
        const tamanios = await service.obtenerTodosLosTamanios();
        res.status(200).json(tamanios);
    } catch (error) {
        mandarRespuestaError(error, res);
    }
});

/**
 * Ruta GET para obtener el tamaño predeterminado de un producto.
 * 
 * @name GET /tamanios/default
 * @returns {string} - Tamaño predeterminado del producto.
 */
gestionarProductosRouter.get('/tamanios/default', async (req, res) => {
    try {
        const tamanioDefault = await service.obtenerTamanioDefault();
        res.status(200).send(tamanioDefault);
    } catch (error) {
        mandarRespuestaError(error, res);
    }
});

/**
 * Ruta GET para verificar si quedan tamaños disponibles para agregar más variantes.
 * 
 * @name GET /quedanTamanios
 * @param {string} cantidadVariantesAgregadas - Cantidad de variantes que ya han sido agregadas.
 * @returns {string} - Mensaje indicando si hay espacio suficiente para agregar más variantes.
 */
gestionarProductosRouter.get('/quedanTamanios/:cantidadVariantesAgregadas', async (req, res) => {
    const {cantidadVariantesAgregadas} = req.params;
    try {
        const cantidadVariantesDisponibles = await service.sePuedeAgregarMasVariantes(cantidadVariantesAgregadas);
        if(cantidadVariantesDisponibles) {
            res.status(200).send(`Quedan tamaños suficientes para agregar más variantes`);
        } else {
            res.status(409).send(`No quedan tamaños suficientes para agregar más variantes.`);
        }
    } catch (error) {
        mandarRespuestaError(error, res);
    }
});

/**
 * Ruta POST para registrar un nuevo producto.
 * 
 * @name POST /registrar
 * @param {object} datosProducto - Información del producto a registrar.
 * @returns {string} - Mensaje indicando si el producto fue registrado correctamente.
 */
gestionarProductosRouter.post('/registrar', upload.single('imagen'), async (req, res) => {
    try {
        const datosProducto = JSON.parse(req.body.datosProducto);
        
        const imagenFile = req.file;
        

        await service.registrarProducto(datosProducto, imagenFile);
        res.status(201).send(`El producto "${datosProducto.nombre}" fue registrado correctamente.`);
    } catch (error) {
        mandarRespuestaError(error, res);
    }
});

/**
 * Ruta GET para obtener todos los productos registrados.
 * 
 * @name GET /productos
 * @returns {array} - Lista de productos registrados.
 */
gestionarProductosRouter.get('/productos', async (req, res) => {
    try {
        const productos = await service.obtenerTodosLosProductos();
        res.status(200).json(productos);
    } catch (error) {
        mandarRespuestaError(error, res);
    }
});

/**
 * Ruta GET para obtener un producto específico dado su ID.
 * 
 * @name PUT /actualizar/:idProducto
 * @param {number} idProducto - ID del producto a actualizar.
 * @param {object} datosProducto - Información actualizada del producto.
 * @returns {string} - Mensaje indicando si el producto fue actualizado correctamente.
 */
gestionarProductosRouter.put('/actualizarProducto/:idProducto', upload.single('imagen'), async (req, res) => {
    const { idProducto } = req.params;
    try {
        const datosProducto = JSON.parse(req.body.datosProducto);
        const imagenFile = req.file;
        await service.actualizarProducto(idProducto, datosProducto, imagenFile);
        return res.status(200).send(`El producto fue actualizado correctamente.`);
    } catch (error) {
        mandarRespuestaError(error, res);
    }
});

/**
 * Ruta PUT para actualizar las variantes de un producto dado su ID.
 *  
 * @name PUT /actualizarVariantes/:idProducto
 * @param {number} idProducto - ID del producto cuyas variantes se actualizarán.
 * @param {array} datosVariantes - Información actualizada de las variantes.
 * @returns {string} - Mensaje indicando si las variantes fueron actualizadas correctamente.
 * */
gestionarProductosRouter.put('/actualizarVariantes/:idProducto', async (req, res) => {
    const { idProducto } = req.params;
    try {
        const datosVariantes = req.body;
        await service.actualizarVariantesDeProducto(idProducto, datosVariantes);
        return res.status(200).send(`Las variantes del producto con ID "${idProducto}" fueron actualizadas correctamente.`);
    } catch (error) {
        mandarRespuestaError(error, res);
    }
});

/**
 * Ruta GET para obtener las variantes de un producto dado su ID.
 * 
 * @name GET /variantesProducto
 * @param {number} idProducto - ID del producto para obtener sus variantes.
 * @returns {array} - Lista de variantes del producto.
 */
gestionarProductosRouter.get('/variantesProducto/:idProducto', async (req, res) => {
    const {idProducto} = req.params;

    // Convertir el idProducto a un número entero
    const idProductoInt = parseInt(idProducto, 10);

    // Verificar si la conversión fue exitosa
    if (isNaN(idProductoInt)) {
        return res.status(400).json({ error: 'El parámetro idProducto debe ser un número entero válido' });
    }

    try {
        const variantesProducto = await service.obtenerVariantesPorIdDelProducto(idProductoInt);
        res.status(200).json(variantesProducto);
    } catch (error) {
        mandarRespuestaError(error, res);
    }
});

gestionarProductosRouter.get("/variantejoinconsumibles/:varianteId", async (req, res) => {
    const {varianteId} = req.params;
    try {
        const varianteJoinConsumible = await service.obtenerVarianteJoinConsumiblePorVarianteId(varianteId);
        res.status(200).json(varianteJoinConsumible);
    } catch (error) {
        mandarRespuestaError(error, res);
    }
});


gestionarProductosRouter.get("/producto/:idProducto", async (req, res) => {
    const {idProducto} = req.params;
    try {
        const producto = await service.obtenerProductoPorId(idProducto);
        res.status(200).json(producto);
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

export default gestionarProductosRouter;
