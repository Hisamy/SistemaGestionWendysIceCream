import { Not } from 'typeorm';
import { connection } from '../database/Connection.js';
import { ConsumibleSchema } from '../entities/Consumible.js';
import { DatabaseError } from '../errors/DatabaseError.js';

class GestionarInventarioRepository {

    constructor() {
        this.repo = connection.getRepository(ConsumibleSchema);
    }

    //HECHO
    async guardarConsumible(consumible) {
        try {
            return await this.repo.save(consumible);
        } catch (error) {
            throw new DatabaseError('Error al guardar consumible', error);
        }
    }

    //HECHO
    async obtenerConsumiblePorId(id) {
        try {
            const consumible = await this.repo.findOneBy({ id });
            return consumible;
        } catch (error) {
            throw new DatabaseError('Error al obtener consumible', error);
        }
    }


    //HECHO    
    async obtenerTodosLosConsumibles() {
        try {
            const consumibles = await this.repo.find();
            return consumibles;
        } catch (error) {
            throw new DatabaseError('Error al obtener todos los consumibles', error);
        }
    }

    //HECHO    
    async obtenerConsumiblePorNombre(nombre) {
        try {
            return await this.repo.findOne({ where: { nombre } });
        } catch (error) {
            throw new DatabaseError('Error al obtener consumible por nombre', error);
        }
    }

    //HECHO
    async eliminarConsumible(id) {
        try {
            return await this.repo.delete({ id });
        } catch (error) {
            throw new DatabaseError('Error al eliminar consumible:', error);
        }
    }

    //HECHO
    async actualizarConsumible(id, consumibleActualizado) {
        try {
            return await this.repo.update(id, consumibleActualizado);
        } catch (error) {
            throw new DatabaseError('Error al actualizar consumible:', error);
        }
    }

}

export default GestionarInventarioRepository;