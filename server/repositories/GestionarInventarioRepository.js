import { connection } from '../database/Connection.js';
import { ConsumibleSchema } from '../entities/Consumible.js';

class GestionarInventarioRepository {
    
    constructor(){
        this.repo = connection.getRepository(ConsumibleSchema);
    }

    async guardarConsumible(consumible) {
        try {
            await this.repo.save(consumible);
        } catch (error) {
            console.error("Error al guardar consumible:", error);
            throw error;
        }
    }

    /**
        async guardarConsumible(consumibleData) {
            try {    
                // Verificamos si el consumible ya existe por nombre
                const consumibleExistente = await this.obtenerConsumiblePorNombre(consumibleData.nombre);
                
                if (consumibleExistente) {
                    throw new Error('El consumible ya existe');
                }
    
                // Si consumibleData es un JSON, lo parseamos a objeto
                const consumible = consumibleData instanceof Consumible 
                    ? consumibleData 
                    : new Consumible().crearConsumible(JSON.stringify(consumibleData));
                
                const resultado = await repoConsumibles.save(consumible);
                return resultado;
            } catch (error) {
                console.error('Error al guardar consumible:', error);
                throw error;
            }
        }
    */

    async editarConsumible(id, consumibleData) {
        try {
            // Verificamos si el consumible existe
            const consumibleExistente = await this.consumibleRepository.findOneBy({ id });
            
            if (!consumibleExistente) {
                throw new Error('Consumible no encontrado');
            }

            // Actualizamos los campos
            if (consumibleData.nombre) {
                consumibleExistente.nombre = consumibleData.nombre;
            }
            if (consumibleData.cantidad) {
                consumibleExistente.cantidad = consumibleData.cantidad;
            }
            
            // Guardamos los cambios
            const resultado = await this.consumibleRepository.save(consumibleExistente);
            return resultado;
        } catch (error) {
            console.error('Error al editar consumible:', error);
            throw error;
        }
    }

    async obtenerConsumiblePorId(id) {
        try {
            const consumible = await this.consumibleRepository.findOneBy({ id });
            return consumible;
        } catch (error) {
            console.error('Error al obtener consumible:', error);
            throw error;
        }
    }

    async obtenerTodosLosConsumibles() {
        try {
            const consumibles = await this.repo.find();
            return consumibles;
        } catch (error) {
            console.error('Error al obtener todos los consumibles:', error);
            throw error;
        }
    }

    async obtenerConsumiblePorNombre(nombre) {
        try {
            return await this.repo.findOne({ where: { nombre } });
        } catch (error) {
            console.error("Error al obtener consumible por nombre:", error);
            throw error;
        }
    }
}

export default GestionarInventarioRepository;