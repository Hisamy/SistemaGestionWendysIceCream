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

class GestionarProductosService {
    constructor() {
        this.ProductoRepo = new ProductoRepository()
        this.VarianteProductoRepo = new VarianteProductoRepository();
        this.GestionarInventarioRepo = new GestionarInventarioRepository();
    }

    async buscarProductoExistentePorNombre(nombre) {
        try {
            const ProductoEncontrado = await this.ProductoRepo.obtenerProductosPorNombre(nombre);
            return Boolean(ProductoEncontrado);
        } catch (error) {
            throw new BusinessError(`Error del servicio al buscar producto con nombre "${nombre}: ${error.message}"`, error);
        }
    }

    async obtenerTodosLosTamanios() {
        try {
            return TAMANIOS;
        } catch (error) {
            throw new BusinessError(`Error del servicio al obtener los tamaños para los VarianteProducto: ${error.message}`, error);
        }
    }

    async obtenerTamanioDefault() {
        try {
            return TAMANIOS.UNICO;
        } catch (error) {
            throw new BusinessError(`Error del servicio al obtener el tamaño default para los VarianteProducto: ${error.message}`, error);
        }
    }

    async sePuedeAgregarMasVariantes(cantidadVariantesProductoAgregados) {
        try {
            const cantidadTamanios = Object.keys(TAMANIOS).length;
            return Boolean((cantidadTamanios - cantidadVariantesProductoAgregados) > 1);
        } catch (error) {
            throw new BusinessError(`Error del servicio al verificar si se pueden agregar más VarianteProducto: ${error.message}`, error);
        }
    }

    async registrarProducto(datosProducto) {
        try {
            const nuevoProducto = new Producto(datosProducto.nombre);
            if(!nuevoProducto.nombre) {
                throw new ValidationError(`Faltan campos obligatorios, debe ingresarse el nombre del producto.`);
            }

            // Guarda el producto
            const productoGuardado = this.ProductoRepo.guardarProducto(nuevoProducto);

            // Asigna el producto padre a cada variante de producto
            const variantesProducto = datosProducto.variantes.map(vp => {
                const precio = vp.precio;
                const tamanio = vp.tamanio;
                if(!precio) throw new ValidationError(`Faltan campos obligatorios, debe ingresarse el precio de todas las variantes.`);
                if(!tamanio) throw new ValidationError(`Faltan campos obligatorios, debe ingresarse el tamaño de todas las variantes.`);
                return new VarianteProducto(precio, tamanio, productoGuardado, vp.consumibles);
            });;

            const tamaniosSet = new Set();
            // Verifica que no haya tamaños repetidos
            for(const vp of variantesProducto) {
                if(tamaniosSet.has(vp.tamanio)) {
                    throw new ValidationError(`No se pueden repetir tamaños en las variantes, el tamaño "${vp.tamanio} está repetido."`);
                }
                tamaniosSet.add(vp.tamanio);
            }

            // Verifica que si hay más de una variante, no haya tamaños "unico"
            if(variantesProducto.length > 1 && tamaniosSet.has(TAMANIOS.UNICO)) {
                throw new ValidationError(`No puede haber tamaños "${TAMANIOS.UNICO}" si hay más de una variante.`);
            }

            // Guarda las variantes con sus consumibles asignados
            for(const vp of variantesProducto) {
                const varianteGuardada = await this.VarianteProductoRepo.guardarVarianteProducto(vp);

                const joinsVarianteConsumible = vp.consumibles.map(consumibleRequerido => {

                    const consumibleEncontrado = this.GestionarInventarioRepo.obtenerConsumiblePorId(consumibleRequerido.id);
                    return new VarianteJoinConsumible(varianteGuardada, consumibleEncontrado, consumibleRequerido.cantidad);
                });
            }

        } catch (error) {
            if (error instanceof ValidationError) {
                throw error;
            }
            throw new BusinessError(`Error del servicio al intentar registrar el producto: ${error.message}`, error);
        }
    }
}