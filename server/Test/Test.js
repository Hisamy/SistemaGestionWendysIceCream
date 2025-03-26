import GestionarInventarioRepository from '../repositories/GestionarInventarioRepository.js';
import Consumible from '../entities/Consumible.js';
import { connection } from '../database/Connection.js';

async function init() {
    try {

        const consumiblePrueba = new Consumible('Coñito', 5);
        const repo = new GestionarInventarioRepository();
        await repo.guardarConsumible(consumiblePrueba);
    
        console.log("Objeto creado en prueba:");
        console.log(consumiblePrueba.nombre);
        

            const consumibleObtenidos = await repo.obtenerTodosLosConsumibles();
        
            console.log("Consumibles obtenidos de la base de sqlito");
            
            console.log(consumibleObtenidos.nombre);


    } catch (error) {
        console.error("Error durante la ejecución de los servicios: ", error);
    }
    
};

init();
