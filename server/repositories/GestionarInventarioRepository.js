import AppDataSource, {initializeConnection} from '../database/Connection.js';
import Consumible from '../entities/Consumible.js';

class GestionarInventarioRepository {
    constructor() {
        this.initialize();
    }

    async initialize() {
        if (!AppDataSource.isInitialized) {
            await initializeConnection();
        }
        this.consumibleRepository = AppDataSource.getRepository(Consumible);
    }

    async guardarConsumible(consumibleData) {
        try {
            // Si consumibleData es un JSON, lo parseamos a objeto
            const consumible = consumibleData instanceof Consumible 
                ? consumibleData 
                : new Consumible().crearConsumible(JSON.stringify(consumibleData));
            
            const resultado = await this.consumibleRepository.save(consumible);
            return resultado;
        } catch (error) {
            console.error('Error al guardar consumible:', error);
            throw error;
        }
    }

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
            const consumibles = await this.consumibleRepository.find();
            return consumibles;
        } catch (error) {
            console.error('Error al obtener todos los consumibles:', error);
            throw error;
        }
    }
}

export default GestionarInventarioRepository;