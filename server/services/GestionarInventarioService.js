import Consumible from "../entities/Consumible.js";
import { BusinessError } from "../errors/BusinessError.js";
import GestionarInventarioRepository from "../repositories/GestionarInventarioRepository.js";

class GestionarInventarioService {

    constructor(){
        this.repository = new GestionarInventarioRepository();
    }

    async registrarConsumible(datosConsumible){
        try {
            const consumible = Consumible.crearConsumible(JSON.stringify(datosConsumible));

            const consumibleExistente = await this.repository.obtenerConsumiblePorNombre(consumible.nombre);
            if(consumibleExistente){
                throw new ValidationError('Ya existe un consumible con ese nombre');
            }  

            const registroConsumible = await this.repository.guardarConsumible(consumible);
            return registroConsumible;
        } catch (error) {
            throw new BusinessError("Error del servicio al registrar los datos", error);
        }
    }

    async obtenerConsumibles(){
        try {
            const consumiblesObtenidos = await this.repository.obtenerTodosLosConsumibles();
            return consumiblesObtenidos;
        } catch (error) {
            throw new BusinessError("Error del servicio al obtener los datos", error);
        }
    }

    async obtenerConsumible(id) {
        try {
            const consumibleObtenido = await this.repository.obtenerConsumiblePorId(id);
            if (!consumibleObtenido) {
                throw new ValidationError('Consumible no encontrado');
            }
            return consumibleObtenido;
        } catch (error) {
            throw new BusinessError("Error del servicio al obtener los datos", error);
        }
    }

    async editarConsumible(id, datosConsumible ){
        try {
            const consumibleExistente = await this.repository.obtenerConsumiblePorId(id);                            
            if (!consumibleExistente) {
                throw new ValidationError('Consumible no encontrado');
            }
                
            this.#validarDatosConsumible(datosConsumible, consumibleExistente);

            const consumibleActualizado = Consumible.crearConsumible(JSON.stringify({
                ...consumibleExistente,
                ...datosConsumible
            }))

            await this.repository.guardarConsumible(consumibleActualizado);
            return consumibleActualizado;
        } catch (error) {
            throw new BusinessError("Error del servicio al modificar datos", error);
        }
    }

    // Metodo auxiliar
    #validarDatosConsumible(datosConsumible, consumibleExistente) {
        if (!datosConsumible.nombre && !datosConsumible.cantidad) {
            throw new ValidationError('Debe proporcionar al menos un dato para actualizar el consumible');
        }

        if (datosConsumible.nombre === consumibleExistente.nombre && 
            datosConsumible.cantidad === consumibleExistente.cantidad) {
            throw new ValidationError('No se realizaron cambios en los datos del consumible');
        }
    }

    async eliminarConsumible(id){
        try {
            if (!id) {
                throw new ValidationError('Consumible no encontrado');
            }
            return await this.repository.eliminarConsumible(id);
        } catch (error) {
            throw new BusinessError("Error del servicio al eliminar datos", error);
        }
    }

}

export default GestionarInventarioService;