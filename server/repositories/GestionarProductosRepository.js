import { ILike, Not } from 'typeorm';
import { connection } from '../database/Connection.js';
import { ProductoSchema } from '../entities/Producto.js';
import { DatabaseError } from '../errors/DatabaseError.js';

class GestionarInventarioRepository {

    constructor() {
        this.repo = connection.getRepository(ProductoSchema);
    }

    async guardarProducto(producto) {
        try {
            return await this.repo.save(producto)
        } catch (error) {
            throw new DatabaseError(`Error al guardar consumible: ${error.message}`, error);
        }
    }

    async obtenerProductoPorId(id) {
        try {
            const producto = await this.repo.findOneBy({ id });
            return producto;
        } catch (error) {
            throw new DatabaseError(`Error al obtener consumible con ID ${id}: ${error.message}`, error);
        }
    }

    async obtenerTodosLosProductos() {
        try {
            const productos = await this.repo.find() || [];
            return productos;
        } catch (error) {
            throw new DatabaseError(`Error al obtener todos los productos: ${error.message}`, error);
        }
    }

    async obtenerProductosPorNombre(nombre) {
        try {
            const productos = await this.repo.find({ where: {nombre: ILike(`%${nombre}%`) } }) || [];
            return productos;
        } catch (error) {
            throw new DatabaseError(`Error al obtener productos con nombre similar a "${nombre}": ${error.message}`, error);
        }
    }

    async actualizarProducto(id, productoActualizado) {
        try {
            return await this.repo.update(id, productoActualizado);
        } catch (error) {
            throw new DatabaseError(`Error al intentar actualizar el producto con ID ${id}: ${error}`, error);
        }
    }

    async eliminarProducto(id) {
        try {
            return await this.repo.delete({ id });
        } catch (error) {
            throw new DatabaseError(`Error al intentar eliminar el producto con ID ${id}: ${error}`, error);
        }
    }
}