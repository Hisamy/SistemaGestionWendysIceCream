import GestionarInventarioRepository from "../repositories/GestionarInventarioRepository.js";

class GestionarInventarioService {

    constructor(){
        this.repository = new GestionarInventarioRepository();
    }

    async registrarConsumible(consumible){
        try {
            const registroConsumible = await this.repository.guardarConsumible(consumible);
            return registroConsumible;
        } catch (error) {
            console.error("Error del servicio al registrar los datos", error);
        }
    }

    async obtenerConsumibles(){
        try {
            const consumiblesObtenidos = await this.repository.obtenerTodosLosConsumibles();
            return consumiblesObtenidos;
        } catch (error) {
            console.error("Error del servicio al obtener los datos", error);
        }
    }

    async obtenerConsumible(id){
        try {
            const consumibleObtenido = await this.repository.obtenerConsumiblePorId(id);
            return consumibleObtenido;
        } catch (error) {
            console.error("Error del servicio al obtener los datos", error);
        }
    }

    async editarConsumible(id, consumible){
        try {
            const consumibleObtenido = await this.repository.editarConsumible(id,consumible);
            return consumibleObtenido;
        } catch (error) {
            console.error("Error del servicio al modificar datos", error);
        }
    }

    async eliminarConsumible(id){
        try {
            const consumibleEliminado = await this.repository.eliminarConsumible(id);
            return consumibleEliminado;
        } catch (error) {
            console.error("Error del servicio al modificar datos", error);
        }
    }

}

export default GestionarInventarioService;