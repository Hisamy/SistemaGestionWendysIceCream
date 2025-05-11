import { Not } from 'typeorm';
import { connection } from '../database/Connection.js';
import { ConsumibleSchema } from '../entities/Consumible.js';
import { DatabaseError } from '../errors/DatabaseError.js';

const errorEncabezado = "\nError de acceso a datos en ProductoRepository:";

const verificarIdValido = (id) => {
    if (id === undefined || id === null) {
        throw new Error("El id no puede ser nulo ni indefinido.");
    } else if (isNaN(id)) {
        throw new Error("El id debe ser un número entero válido.");
    }
}

class GestionarInventarioRepository {

    constructor() {
        this.repo = connection.getRepository(ConsumibleSchema);
    }

    async guardarConsumible(consumible) {
        try {
            return await this.repo.save(consumible);
        } catch (error) {
            throw new DatabaseError(`${errorEncabezado} Falló al guardar consumible: ${error.message}`, error);
        }
    }

    async obtenerConsumiblePorId(id) {
        try {
            verificarIdValido(id);
            
            const consumible = await this.repo.findOneBy({ id });
            return consumible;
        } catch (error) {
            throw new DatabaseError(`${errorEncabezado} Falló al intentar obtener consumible: ${error.message}`, error);
        }
    }
 
    async obtenerTodosLosConsumibles() {
        try {
            const consumibles = await this.repo.find();
            return consumibles;
        } catch (error) {
            throw new DatabaseError(`${errorEncabezado} Falló al intentar obtener todos los consumibles: ${error.message}`, error);
        }
    }
  
    async obtenerConsumiblePorNombre(nombre) {
        try {
            return await this.repo.findOne({ where: { nombre } });
        } catch (error) {
            throw new DatabaseError(`${errorEncabezado} Falló al intentar obtener consumible por nombre "${nombre}": ${error.message}`, error);
        }
    }

    async eliminarConsumible(id) {
        try {
            verificarIdValido(id);
            
            return await this.repo.delete({ id });
        } catch (error) {
            throw new DatabaseError(`${errorEncabezado} Falló al intentar eliminar consumible: ${error.message}`, error);
        }
    }

    async actualizarConsumible(id, consumibleActualizado) {
        try {
            verificarIdValido(id);
            
            return await this.repo.update(id, consumibleActualizado);
        } catch (error) {
            throw new DatabaseError(`${errorEncabezado} Falló al intentar actualizar consumible: ${error.message}`, error);
        }
    }

}

export default GestionarInventarioRepository;