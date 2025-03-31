import { Not } from 'typeorm';
import { connection } from '../database/Connection';
import { VarianteProductoSchema } from '../entities/VarianteProducto';
import { DatabaseError } from '../errors/DatabaseError';

class VarianteProductoRepository {
    constructor() {
        this.repo = connection.getRepository(VarianteProductoSchema);
    }

    async guardarVarianteProducto(VarianteProducto) {
        try {
            const variante = await this.repo.save(VarianteProducto)
            return variante;
        } catch (error) {
            throw new DatabaseError(`Error al guardar la variante: ${error.message}`, error);
        }
    }

    async obtenerVariantesPorIdDelProducto(idProducto) {
        try {
            return await this.repo.find({ where: {producto: { id: idProducto } } });
        } catch (error) {
            throw new DatabaseError(`Error al obtener variantes del producto con ID ${idProducto}: ${error}`, error);
        }
    }

    async obtenerVariantePorId(id) {
        try {
            return await this.repo.findOneBy({ id });
        } catch (error) {
            throw new DatabaseError(`Error al obtener VarianteProducto con ID ${id}: ${error}`, error);
        }
    }

    async actualizarVariante(id, varianteActualizada) {
        try {
            return await this.repo.update(id, varianteActualizada);
        } catch (error) {
            throw new DatabaseError(`Error al intentar actualizar VarianteProducto con ID ${id}: ${error}`, error);
        }
    }

    async eliminarVariante(id) {
        try {
            return await this.repo.delete({ id });
        } catch (error) {
            throw new DatabaseError(`Error al intentar eliminar VarianteProducto con ID ${id}: ${error}`, error);
        }
    }
}