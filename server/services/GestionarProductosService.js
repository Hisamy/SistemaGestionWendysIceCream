import ProductoRepository from '../repositories/ProductoRepository.js';
import GestionarInventarioRepository from '../repositories/GestionarInventarioRepository.js';
import VarianteProductoRepository from '../repositories/VarianteProductoRepository.js';
import { BusinessError } from '../errors/BusinessError.js';
import { TAMANIOS } from '../entities/Tamanio.js';
import Consumible from '../entities/Consumible.js';
import Producto from '../entities/Producto.js';
import { ValidationError } from '../errors/ValidationError.js';
import VarianteProducto from '../entities/VarianteProducto.js';
import VarianteJoinConsumible from '../entities/VarianteJoinConsumible.js';
import VarianteJoinConsumibleRepository from '../repositories/VarianteJoinRepository.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { promises as fsPromises } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const NOPICTURE = 'productos/default_no_picture.png';

const errorEncabezado = "\nError de servicio en GestionarProductosService:";

class GestionarProductosService {
    constructor() {
        this.ProductoRepo = new ProductoRepository()
        this.VarianteProductoRepo = new VarianteProductoRepository();
        this.GestionarInventarioRepo = new GestionarInventarioRepository();
        this.varianteJoinConsumibleRepo = new VarianteJoinConsumibleRepository();

        // Ruta a la carpeta de imágenes de productos
        this.imagenesDir = path.join(__dirname, '../images/productos');
        
        // Asegurarse de que el directorio existe
        this.crearDirectorioDeImagenesDeProductosSiNoExiste();
    }

    async crearDirectorioDeImagenesDeProductosSiNoExiste() {
        try {
            await fsPromises.access(this.imagenesDir);
        } catch (error) {
            // Si el directorio no existe, lo creamos
            await fsPromises.mkdir(this.imagenesDir, { recursive: true });
        }
    }

    async guardarImagen(imagenFile, nombreParaArchivo) {
        try {
            // Generar nombre único para el archivo
            const nombreArchivo = this.generarNombreArchivo(imagenFile.originalname, nombreParaArchivo);
            const rutaCompleta = path.join(this.imagenesDir, nombreArchivo);
            
            // Guardar el archivo en el sistema de archivos
            await fsPromises.writeFile(rutaCompleta, imagenFile.buffer);
            
            // Retornar la ruta relativa para guardar en la base de datos
            return `productos/${nombreArchivo}`;
        } catch (error) {
            throw new BusinessError(`Error al guardar la imagen: ${error.message}`, error);
        }
    }
    
    generarNombreArchivo(nombreOriginal, nombreNuevo) {
        // Obtenemos la extensión del archivo original
        const extension = path.extname(nombreOriginal);
        
        // Generamos un nombre único
        const aleatorio = Math.round(Math.random() * 1E9);
        
        return `${nombreNuevo}-${aleatorio}${extension}`;
    }

    async buscarProductoExistentePorNombre(nombre) {
        try {
            const ProductoEncontrado = await this.ProductoRepo.obtenerProductosPorNombre(nombre);
            return Boolean(ProductoEncontrado);
        } catch (error) {
            throw new BusinessError(`${errorEncabezado} Falló al intentar buscar producto con nombre "${nombre}: ${error.message}"`, error);
        }
    }

    async obtenerTodosLosTamanios() {
        try {
            return TAMANIOS;
        } catch (error) {
            throw new BusinessError(`${errorEncabezado} Falló al intentar obtener los tamaños para los VarianteProducto: ${error.message}`, error);
        }
    }

    async obtenerTamanioDefault() {
        try {
            return TAMANIOS.UNICO;
        } catch (error) {
            throw new BusinessError(`${errorEncabezado} Falló al intentar obtener el tamaño default para los VarianteProducto: ${error.message}`, error);
        }
    }

    async sePuedeAgregarMasVariantes(cantidadVariantesProductoAgregados) {
        try {
            const cantidadTamanios = Object.keys(TAMANIOS).length;
            return Boolean((cantidadTamanios - cantidadVariantesProductoAgregados) > 1);
        } catch (error) {
            throw new BusinessError(`${errorEncabezado} Falló al intentar verificar si se pueden agregar más VarianteProducto: ${error.message}`, error);
        }
    }

    async registrarProducto(datosProducto, imagenFile) {
        try {
            if (!datosProducto.nombre) {
                throw new ValidationError(`Faltan campos obligatorios, debe ingresarse el nombre del producto.`);
            }

            // Si hay una imagen, la procesamos y guardamos
            let imagenPath = '';
            if (imagenFile) {
                imagenPath = await this.guardarImagen(imagenFile, datosProducto.nombre);
            } else {
                imagenPath = NOPICTURE;
            }
            const nuevoProducto = new Producto(datosProducto.nombre, imagenPath);

            // Guarda el producto
            const productoGuardado = await this.ProductoRepo.guardarProducto(nuevoProducto);

            if (!datosProducto.variantes || !Array.isArray(datosProducto.variantes) || datosProducto.variantes.length === 0) {
                throw new ValidationError(`Debe ingresar al menos una variante del producto.`);
            }

            const tamaniosSet = new Set();
            // Primero validamos todos los datos antes de guardar
            for (const vp of datosProducto.variantes) {
                const precio = vp.precio;
                const tamanio = vp.tamanio;
                if (!precio) throw new ValidationError(`Faltan campos obligatorios, debe ingresarse el precio de todas las variantes.`);
                if (!tamanio) throw new ValidationError(`Faltan campos obligatorios, debe ingresarse el tamaño de todas las variantes.`);

                // Verificamos duplicados de tamaño
                if (tamaniosSet.has(vp.tamanio)) {
                    throw new ValidationError(`No se pueden repetir tamaños en las variantes, el tamaño "${vp.tamanio}" está repetido.`);
                }
                tamaniosSet.add(vp.tamanio);
            }

            // Verifica que si hay más de una variante, no haya tamaños "unico"
            if (datosProducto.variantes.length > 1 && tamaniosSet.has(TAMANIOS.UNICO)) {
                throw new ValidationError(`No puede haber tamaños "${TAMANIOS.UNICO}" si hay más de una variante.`);
            }

            // Ahora guardamos cada variante y sus relaciones con consumibles
            for (const datosVariante of datosProducto.variantes) {
                // Creamos y guardamos la variante (sin los consumibles en el objeto VarianteProducto)
                const varianteProducto = new VarianteProducto(
                    datosVariante.precio,
                    datosVariante.tamanio,
                    productoGuardado
                );

                const varianteGuardada = await this.VarianteProductoRepo.guardarVarianteProducto(varianteProducto);

                // Ahora procesamos los consumibles desde los datos de entrada
                if (datosVariante.consumibles && Array.isArray(datosVariante.consumibles) && datosVariante.consumibles.length > 0) {
                    for (const consumibleRequerido of datosVariante.consumibles) {
                        const consumibleEncontrado = await this.GestionarInventarioRepo.obtenerConsumiblePorId(consumibleRequerido.id);
                        if (!consumibleEncontrado) {
                            throw new ValidationError(`No se encontró el consumible con ID ${consumibleRequerido.id}`);
                        }

                        const join = new VarianteJoinConsumible(
                            varianteGuardada.id,
                            consumibleEncontrado.id,
                            Number(consumibleRequerido.cantidad)
                        );

                        await this.varianteJoinConsumibleRepo.agregarConsumibleAVarianteProducto(join);
                    }
                }
            }

            return productoGuardado;
        } catch (error) {
            if (error instanceof ValidationError) {
                throw error;
            }
            throw new BusinessError(`${errorEncabezado} Falló al intentar registrar el producto: ${error.message}`, error);
        }
    }

    async obtenerTodosLosProductos() {
        try {
            const productos = await this.ProductoRepo.obtenerTodosLosProductos();
            return productos;
        } catch (error) {
            throw new BusinessError(`${errorEncabezado} Falló al intentar obtener todos los productos: ${error.message}`, error);
        }
    }

    async obtenerVariantesPorIdDelProducto(idProducto) {
        try {
            const variantesProducto = await this.VarianteProductoRepo.obtenerVariantesPorIdDelProducto(idProducto);
            return variantesProducto;
        } catch (error) {
            throw new BusinessError(`${errorEncabezado} Falló al intentar obtener las variantes del producto con id ${idProducto}: ${error.message}`, error);
        }
    }

    async obtenerVariantePorId(idVariante) {
        try {
            const varianteEncontrada = await this.VarianteProductoRepo.obtenerVariantePorId(idVariante);
            return varianteEncontrada;
        } catch (error) {
            throw new BusinessError(`${errorEncabezado} Falló al intentar obtener las variantes del producto con id ${idProducto}: ${error.message}`, error);
        }
    }

    async obtenerVarianteJoinConsumiblePorVarianteId(varianteId) {
        try {
            const varianteJoinConsumibleEncontrada = await this.varianteJoinConsumibleRepo.obtenerPorVarianteId(varianteId);
            return varianteJoinConsumibleEncontrada;
        } catch (error) {
            throw new BusinessError(`${errorEncabezado} Falló al intentar obtener la varianteJoinConsumible con con id de variante ${varianteId}: ${error.message}`, error);
        }
    }

    async actualizarProducto(idProducto, datosProducto, imagenFile) {
        try {
            const id = parseInt(idProducto, 10);
            if (isNaN(id) || id <= 0) {
                throw new ValidationError(`El ID del producto proporcionado no es válido.`);
            }

            let { nombre, imagenPath } = await this.ProductoRepo.obtenerProductoPorId(id);

            if (datosProducto.nombre) {
                const productoConMismoNombre = await this.ProductoRepo.obtenerProductosPorNombre(nombre);
                if (productoConMismoNombre && productoConMismoNombre.id !== id) {
                    throw new BusinessError(`El nombre "${nombre}" ya existe para otro producto.`);
                }
                nombre = datosProducto.nombre;
            }

            if (imagenFile) {
                if (imagenPath !== NOPICTURE) {
                    const rutaImagenAnterior = path.join(__dirname, '../images', imagenPath);
                    try {
                        await fsPromises.unlink(rutaImagenAnterior);
                    } catch (error) {
                        console.warn(`Error al eliminar la imagen anterior "${imagenPath}": ${error.message}`);
                    }
                }
                imagenPath = await this.guardarImagen(imagenFile, datosProducto.nombre || nombre);
            }

            const productoExistente = { nombre, imagenPath };

            await this.ProductoRepo.actualizarProducto(idProducto, productoExistente);
            return productoExistente;

        } catch (error) {
            if (error instanceof ValidationError || error instanceof BusinessError) {
                throw error;
            }
            throw new BusinessError(`${errorEncabezado} Falló al intentar actualizar el producto con ID "${idProducto}": ${error.message}`, error);
        }
    }

    async actualizarVariantesDeProducto(idProducto, variantesData) {
        try {
            const productoExistente = await this.ProductoRepo.obtenerProductoPorId(idProducto);
            if (!productoExistente) {
                throw new BusinessError(`No se encontró ningún producto con el ID "${idProducto}" para actualizar sus variantes.`);
            }

            if (variantesData && Array.isArray(variantesData)) {
                const variantesExistentes = await this.VarianteProductoRepo.obtenerVariantesPorIdDelProducto(idProducto);
                const idsVariantesRecibidas = new Set();
                const tamaniosSet = new Set();

                for (const varianteData of variantesData) {
                    const idVariante = parseInt(varianteData.id, 10);

                    if (idVariante) {
                        // Actualizar variante existente
                        const varianteAActualizar = variantesExistentes.find(v => v.id === idVariante);
                        if (varianteAActualizar) {
                            if (varianteData.precio) varianteAActualizar.precio = varianteData.precio;
                            if (varianteData.tamanio) {
                                if (tamaniosSet.has(varianteData.tamanio)) {
                                    throw new ValidationError(`No se pueden repetir tamaños en las variantes actualizadas, el tamaño "${varianteData.tamanio}" está repetido.`);
                                }
                                varianteAActualizar.tamanio = varianteData.tamanio;
                                tamaniosSet.add(varianteData.tamanio);
                            }
                            await this.VarianteProductoRepo.actualizarVariante(idVariante, varianteAActualizar);
                            idsVariantesRecibidas.add(idVariante);

                            if (varianteData.consumibles && Array.isArray(varianteData.consumibles)) {
                                await this.varianteJoinConsumibleRepo.eliminarPorVarianteId(varianteData.id);
                                for (const consumibleRequerido of varianteData.consumibles) {
                                    const consumibleEncontrado = await this.GestionarInventarioRepo.obtenerConsumiblePorId(consumibleRequerido.id);
                                    if (!consumibleEncontrado) {
                                        throw new ValidationError(`No se encontró el consumible con ID ${consumibleRequerido.id}`);
                                    }
                                    const join = new VarianteJoinConsumible(
                                        varianteData.id,
                                        consumibleEncontrado.id,
                                        Number(consumibleRequerido.cantidad)
                                    );
                                    await this.varianteJoinConsumibleRepo.agregarConsumibleAVarianteProducto(join);
                                }
                            }
                        } else {
                            console.warn(`Se proporcionó un ID de variante "${varianteData.id}" que no existe para el producto "${idProducto}". Se ignorará.`);
                        }
                    } else {
                        if (!varianteData.precio || !varianteData.tamanio) {
                            throw new ValidationError(`Para agregar una nueva variante, se deben proporcionar precio y tamaño.`);
                        }
                        if (tamaniosSet.has(varianteData.tamanio)) {
                            throw new ValidationError(`No se pueden repetir tamaños entre las variantes, el tamaño "${varianteData.tamanio}" está repetido.`);
                        }
                        tamaniosSet.add(varianteData.tamanio);

                        const nuevaVariante = new VarianteProducto(
                            varianteData.precio,
                            varianteData.tamanio,
                            productoExistente
                        );
                        const varianteGuardada = await this.VarianteProductoRepo.guardarVarianteProducto(nuevaVariante);

                        if (varianteData.consumibles && Array.isArray(varianteData.consumibles)) {
                            for (const consumibleRequerido of varianteData.consumibles) {
                                const consumibleEncontrado = await this.GestionarInventarioRepo.obtenerConsumiblePorId(consumibleRequerido.id);
                                if (!consumibleEncontrado) {
                                    throw new ValidationError(`No se encontró el consumible con ID ${consumibleRequerido.id}`);
                                }
                                const join = new VarianteJoinConsumible(
                                    varianteGuardada.id,
                                    consumibleEncontrado.id,
                                    Number(consumibleRequerido.cantidad)
                                );
                                await this.varianteJoinConsumibleRepo.agregarConsumibleAVarianteProducto(join);
                            }
                        }
                    }
                }

                // Validar que no haya tamaños "unico" si hay más de una variante
                const todasLasVariantesActualizadas = await this.VarianteProductoRepo.obtenerVariantesPorIdDelProducto(idProducto);
                const tamaniosActualizadosSet = new Set(todasLasVariantesActualizadas.map(v => v.tamanio));
                if (todasLasVariantesActualizadas.length > 1 && tamaniosActualizadosSet.has(TAMANIOS.UNICO)) {
                    throw new ValidationError(`No puede haber tamaños "${TAMANIOS.UNICO}" si hay más de una variante.`);
                }
            }
        } catch (error) {
            if (error instanceof ValidationError || error instanceof BusinessError) {
                throw error;
            }
            throw new BusinessError(`${errorEncabezado} Falló al intentar actualizar las variantes del producto con ID "${idProducto}": ${error.message}`, error);
        }
    }

    async obtenerProductoPorId(id) {
        try {
            const producto = await this.ProductoRepo.obtenerProductoPorId(id);
            if (!producto) {
                throw new BusinessError(`No se encontró ningún producto con el ID "${id}".`);
            }
            return producto;
        } catch (error) {
            throw new BusinessError(`${errorEncabezado} Falló al intentar obtener el producto con ID "${id}": ${error.message}`, error);
        }
    }

}

export default GestionarProductosService;