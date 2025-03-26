import GestionarInventarioRepository from '../repositories/GestionarInventarioRepository.js';
import Consumible from '../entities/Consumible.js';

async function init() {
    const consumiblePrueba = new Consumible('Perche', 5);
    const repo = new GestionarInventarioRepository();
    repo.consumibleRepository(consumiblePrueba);

    console.log("Objeto creado en prueba:");
    
    console.log(consumiblePrueba);
    
    const consumibleObtenidos = repo.obtenerTodosLosConsumibles();

    console.log("Consumibles obtenidos de la base de sqlito");
    
    console.log(consumibleObtenidos);
    
};

init();
