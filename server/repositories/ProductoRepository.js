import { ILike, Not } from 'typeorm';
import { connection } from '../database/Connection.js';
import { ProductoSchema } from '../entities/Producto.js';
import { DatabaseError } from '../errors/DatabaseError.js';

const errorEncabezado = "\nError de acceso a datos en ProductoRepository:";

const verificarIdValido = (id) => {
    if (id === undefined || id === null) {
        throw new Error("El id no puede ser nulo ni indefinido.");
    } else if (isNaN(id)) {
        throw new Error("El id debe ser un número entero válido.");
    }
}

class ProductoRepository {

    constructor() {
        this.repo = connection.getRepository(ProductoSchema);
    }

    async guardarProducto(producto) {
        try {
            return await this.repo.save(producto);
        } catch (error) {
            throw new DatabaseError(`${errorEncabezado} Falló al guardar consumible: ${error.message}`, error);
        }
    }

    async obtenerProductoPorId(id) {
        try {
            verificarIdValido(id);

            const producto = await this.repo.findOneBy({ id });
            return producto;
        } catch (error) {
            throw new DatabaseError(`${errorEncabezado} Falló al obtener consumible con ID ${id}: ${error.message}`, error);
        }
    }

    async obtenerTodosLosProductos() {
        try {
            const productos = await this.repo.find() || [];
            return productos;
        } catch (error) {
            throw new DatabaseError(`${errorEncabezado} Falló al obtener todos los productos: ${error.message}`, error);
        }
    }

    async obtenerProductosPorNombreSimilar(nombre) {
        try {
            const productos = await this.repo.find({ where: {nombre: ILike(`%${nombre}%`) } }) || [];
            return productos;
        } catch (error) {
            throw new DatabaseError(`${errorEncabezado} Falló al obtener productos con nombre similar a "${nombre}": ${error.message}`, error);
        }
    }

    async obtenerProductosPorNombre(nombre) {
        try {
            const productos = await this.repo.findOneBy({ nombre });
            return productos;
        } catch (error) {
            throw new DatabaseError(`${errorEncabezado} Falló al obtener productos con nombre similar a "${nombre}": ${error.message}`, error);
        }
    }

    async actualizarProducto(id, productoActualizado) {
        try {
            verificarIdValido(id);
            
            return await this.repo.update(id, productoActualizado);
        } catch (error) {
            throw new DatabaseError(`${errorEncabezado} Falló al intentar actualizar el producto con ID ${id}: ${error.message}`, error);
        }
    }

    async eliminarProducto(id) {
        try {
            verificarIdValido(id);
            
            return await this.repo.delete({ id });
        } catch (error) {
            throw new DatabaseError(`${errorEncabezado} Falló al intentar eliminar el producto con ID ${id}: ${error.message}`, error);
        }
    }

}

export default ProductoRepository;