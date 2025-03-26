import GestionarInventarioRepository from '../repositories/GestionarInventarioRepository.js';
import Consumible from '../entities/Consumible.js';
import { connection } from '../database/Connection.js';

async function init() {
    try {

        //const consumiblePrueba = new Consumible('Cucharas', 5);
        const repo = new GestionarInventarioRepository();
        //await repo.guardarConsumible(consumiblePrueba);
    
        //console.log("Objeto creado en prueba:");
        //console.log(consumiblePrueba.nombre);
        

        const consumibleObtenidos = await repo.obtenerTodosLosConsumibles();
        
        console.log("Consumibles obtenidos de la base de sqlito");    
        console.log(consumibleObtenidos.map(consumible => consumible.nombre));

        const consumibleEspecifico = await repo.obtenerConsumiblePorId(1);
        console.log("Consumible obtenido por id: ", consumibleEspecifico.nombre);

        //const consumibleEditado = await repo.editarConsumible(1, {nombre: "Pañales", cantidad: 10});
        //console.log("Consumible editado: ", consumibleEditado.nombre);

        const consumibleEliminado = await repo.eliminarConsumible(1);
        console.log("Consumible eliminado: ", consumibleEliminado.nombre);


    } catch (error) {
        console.error("Error durante la ejecución de los servicios: ", error);
    }
    
};

init();
