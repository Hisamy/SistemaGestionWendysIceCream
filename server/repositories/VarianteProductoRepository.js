import { Not } from 'typeorm';
import { connection } from '../database/Connection.js';
import { VarianteProductoSchema } from '../entities/VarianteProducto.js';
import { VarianteJoinConsumibleSchema } from '../entities/VarianteJoinConsumible.js';
import { DatabaseError } from '../errors/DatabaseError.js';

class VarianteProductoRepository {
    constructor() {
        this.varianteProductoRepo = connection.getRepository(VarianteProductoSchema);
        this.varianteJoinConsumibleRepo = connection.getRepository(VarianteJoinConsumibleSchema);
    }

    async guardarVarianteProducto(VarianteProducto) {
        try {
            const variante = await this.VarianteProductoRepo.save(VarianteProducto)
            return variante;
        } catch (error) {
            throw new DatabaseError(`Error al guardar la variante: ${error.message}`, error);
        }
    }

    async agregarConsumibleAVarianteProducto(VarianteJoinConsumible) {
        try {
            const join = await this.varianteJoinConsumibleRepo.save(VarianteJoinConsumible);
            return join;
        } catch (error) {
            throw new DatabaseError(`Error al agregar consumible a variante de producto: ${error.message}`, error)
        }
    }

    async editarConsumibleDeVarianteProducto(id, VarianteJoinConsumibleActualizado) {
        try {
            return await this.varianteJoinConsumibleRepo.update(id, VarianteJoinConsumibleActualizado);
        } catch (error) {
            throw new DatabaseError(`Error al intentar actualizar los consumibles del VarianteProducto con ID ${id}: ${error.message}`, error);
        }
    }

    async eliminarRelacionDeConsumibleConVarianteProductoPorId(idVarianteJoinConsumible) {
        try {
            return await this.varianteJoinConsumibleRepo.delete({ idVarianteJoinConsumible });
        } catch (error) {
            throw new DatabaseError(`Error al intentar eliminar el VarianteJoinConsumible con ID ${id}: ${error.message}`, error);
        }
    }

    async obtenerVariantesPorIdDelProducto(idProducto) {
        try {
            return await this.VarianteProductoRepo.find({ where: {producto: { id: idProducto } } });
        } catch (error) {
            throw new DatabaseError(`Error al obtener variantes del producto con ID ${idProducto}: ${error.message}`, error);
        }
    }

    async obtenerVariantePorId(id) {
        try {
            return await this.VarianteProductoRepo.findOneBy({ id });
        } catch (error) {
            throw new DatabaseError(`Error al obtener VarianteProducto con ID ${id}: ${error.message}`, error);
        }
    }

    async actualizarVariante(id, varianteActualizada) {
        try {
            return await this.VarianteProductoRepo.update(id, varianteActualizada);
        } catch (error) {
            throw new DatabaseError(`Error al intentar actualizar VarianteProducto con ID ${id}: ${error.message}`, error);
        }
    }

    async eliminarVariante(id) {
        try {
            return await this.VarianteProductoRepo.delete({ id });
        } catch (error) {
            throw new DatabaseError(`Error al intentar eliminar VarianteProducto con ID ${id}: ${error.message}`, error);
        }
    }
}

export default VarianteProductoRepository;