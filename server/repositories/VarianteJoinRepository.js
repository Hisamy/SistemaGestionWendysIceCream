import { connection } from '../database/Connection.js';
import { VarianteJoinConsumibleSchema } from '../entities/VarianteJoinConsumible.js';
import { DatabaseError } from '../errors/DatabaseError.js';

const errorEncabezado = "\nError de acceso a datos en VarianteJoinConsumibleRepository:";

class VarianteJoinConsumibleRepository {
    constructor() {
        this.varianteJoinConsumibleRepo = connection.getRepository(VarianteJoinConsumibleSchema);
    }

    async agregarConsumibleAVarianteProducto(varianteJoinConsumible) {
        try {
            if (!varianteJoinConsumible.varianteProducto) {
                throw new Error("El ID de la variante de producto no es válido");
            }

            if (!varianteJoinConsumible.consumible) {
                throw new Error("El ID del consumible no es válido");
            }

            if (typeof varianteJoinConsumible.cantidadConsumible !== 'number' || varianteJoinConsumible.cantidadConsumible <= 0) {
                throw new Error("La cantidad de consumible debe ser un número mayor a cero");
            }

            return await this.varianteJoinConsumibleRepo.save(varianteJoinConsumible);
        } catch (error) {
            throw new DatabaseError(`${errorEncabezado} Falló al agregar consumible a variante de producto: ${error.message}`, error)
        }
    }

    async obtenerPorVarianteId(varianteId) {
        try {
            return await this.varianteJoinConsumibleRepo.find({
                where: { variante_id: varianteId },
                relations: ['consumible'] // Para cargar también la información del consumible
            });
        } catch (error) {
            throw new DatabaseError(`${errorEncabezado} Falló al obtener relaciones para la variante ${varianteId}: ${error.message}`, error);
        }
    }
}

export default VarianteJoinConsumibleRepository;