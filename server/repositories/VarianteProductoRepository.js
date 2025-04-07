import { Not } from 'typeorm';
import { connection } from '../database/Connection.js';
import { VarianteProductoSchema } from '../entities/VarianteProducto.js';
import { VarianteJoinConsumibleSchema } from '../entities/VarianteJoinConsumible.js';
import { DatabaseError } from '../errors/DatabaseError.js';

const errorEncabezado = "\nError de acceso a datos en VarianteProductoRepository:";

const verificarIdValido = (id) => {
    if (id === undefined || id === null) {
        throw new Error("El id no puede ser nulo ni indefinido.");
    } else if (isNaN(id)) {
        throw new Error("El id debe ser un número entero válido.");
    }
}

class VarianteProductoRepository {
    constructor() {
        this.varianteProductoRepo = connection.getRepository(VarianteProductoSchema);
        this.varianteJoinConsumibleRepo = connection.getRepository(VarianteJoinConsumibleSchema);
    }

    async guardarVarianteProducto(VarianteProducto) {
        try {
            const variante = await this.varianteProductoRepo.save(VarianteProducto)
            return variante;
        } catch (error) {
            throw new DatabaseError(`${errorEncabezado} Falló al guardar la variante: ${error.message}`, error);
        }
    }

    async agregarConsumibleAVarianteProducto(VarianteJoinConsumible) {
        try {
            const join = await this.varianteJoinConsumibleRepo.save(VarianteJoinConsumible);
            return join;
        } catch (error) {
            throw new DatabaseError(`${errorEncabezado} Falló al agregar consumible a variante de producto: ${error.message}`, error)
        }
    }

    async editarConsumibleDeVarianteProducto(id, VarianteJoinConsumibleActualizado) {
        try {
            verificarIdValido(id);

            return await this.varianteJoinConsumibleRepo.update(id, VarianteJoinConsumibleActualizado);
        } catch (error) {
            throw new DatabaseError(`${errorEncabezado} Falló al intentar actualizar los consumibles del VarianteProducto con ID ${id}: ${error.message}`, error);
        }
    }

    async eliminarRelacionDeConsumibleConVarianteProductoPorId(idVarianteJoinConsumible) {
        try {
            verificarIdValido(idVarianteJoinConsumible);

            return await this.varianteJoinConsumibleRepo.delete({ idVarianteJoinConsumible });
        } catch (error) {
            throw new DatabaseError(`${errorEncabezado} Falló al intentar eliminar el VarianteJoinConsumible con ID ${id}: ${error.message}`, error);
        }
    }

    async obtenerVariantesPorIdDelProducto(idProducto) {
        try {
            verificarIdValido(idProducto);
            
            const variantesProductoEncontrados = await this.varianteProductoRepo.find({ where: { producto: { id: idProducto } } }) || [];
            return variantesProductoEncontrados;
        } catch (error) {
            throw new DatabaseError(`${errorEncabezado} Falló al intentar encontrar las variantes del producto con id ${idProducto}: ${error.message}`, error);
        }
    }

    async obtenerVariantePorId(id) {
        try {
            verificarIdValido(id);
            
            return await this.varianteProductoRepo.findOneBy({ id });
        } catch (error) {
            throw new DatabaseError(`${errorEncabezado} Falló al obtener VarianteProducto con ID ${id}: ${error.message}`, error);
        }
    }

    async obtenerRelacionesConsumiblesPorIdVariante(idVariante) {
        try {
            verificarIdValido(idVariante);
            
            return await this.varianteJoinConsumibleRepo.find({ where: { varianteProducto: { id: idVariante } } });
        } catch (error) {
            throw new DatabaseError(`${errorEncabezado} Falló al obtener relaciones de consumibles para VarianteProducto con ID ${idVariante}: ${error.message}`, error);
        }
    }

    async actualizarVariante(id, varianteActualizada) {
        try {
            verificarIdValido(id);
            
            return await this.varianteProductoRepo.update(id, varianteActualizada);
        } catch (error) {
            throw new DatabaseError(`${errorEncabezado} Falló al intentar actualizar VarianteProducto con ID ${id}: ${error.message}`, error);
        }
    }

    async eliminarVariante(id) {
        try {
            verificarIdValido(id);
            
            return await this.varianteProductoRepo.delete({ id });
        } catch (error) {
            throw new DatabaseError(`${errorEncabezado} Falló al intentar eliminar VarianteProducto con ID ${id}: ${error.message}`, error);
        }
    }
}


export default VarianteProductoRepository;