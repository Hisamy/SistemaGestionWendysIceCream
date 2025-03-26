import { Not } from 'typeorm';
import { connection } from '../database/Connection.js';
import { ConsumibleSchema } from '../entities/Consumible.js';

class GestionarInventarioRepository {
    
    constructor(){
        this.repo = connection.getRepository(ConsumibleSchema);
    }

    //HECHO
    async guardarConsumible(consumible) {
        try {
        const consumibleExistente = await this.obtenerConsumiblePorNombre(consumible.nombre);

        if(consumibleExistente){
            throw new Error('El consumible ya existe');
        }    
        return await this.repo.save(consumible);
        } catch (error) {
            console.error("Error al guardar consumible:", error);
            throw error;
        }
    }

    //HECHO
    async editarConsumible(id, consumible) {
        try {
            const consumibleExistente = await this.repo.findOneBy({ id });
                
            if (!consumibleExistente) {
                throw new Error('Consumible no encontrado');
            }
    
            if (consumible.nombre || consumible.cantidad) {
                if (consumible.nombre) {
                    consumibleExistente.nombre = consumible.nombre;
                }
                if (consumible.cantidad) {
                    consumibleExistente.cantidad = consumible.cantidad;
                }
                //Buscar nombre para ver si no existe
                const consumibleExistenteNombre = await this.obtenerConsumiblePorNombre(consumible.nombre, id, Not(id));
                if(consumibleExistenteNombre){
                    throw new Error('El consumible ya existe');
                }
            }
            const resultado = await this.repo.save(consumibleExistente);
            return resultado;
         } catch (error) {
            console.error('Error al editar consumible:', error);
            throw error;
        }
    }

    //HECHO
    async obtenerConsumiblePorId(id) {
        try {
            const consumible = await this.repo.findOneBy({ id });
            return consumible;
        } catch (error) {
            console.error('Error al obtener consumible:', error);
            throw error;
        }
    }
   

    //HECHO    
    async obtenerTodosLosConsumibles() {
        try {
            const consumibles = await this.repo.find();
            return consumibles;
        } catch (error) {
            console.error('Error al obtener todos los consumibles:', error);
            throw error;
        }
    }

    //HECHO    
    async obtenerConsumiblePorNombre(nombre) {
        try {
            return await this.repo.findOne({ where: { nombre } });
        } catch (error) {
            console.error("Error al obtener consumible por nombre:", error);
            throw error;
        }
    }

    //HECHO
    async eliminarConsumible(id) {
        try {
            const consumible = await this.repo.findOneBy({ id });
            if (!consumible) {
                throw new Error('Consumible no encontrado');
            }
            return await this.repo.delete(consumible);
        } catch (error) {
            console.error('Error al eliminar consumible:', error);
            throw error;
        }
    }

}

export default GestionarInventarioRepository;