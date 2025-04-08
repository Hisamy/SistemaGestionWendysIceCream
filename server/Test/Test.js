import GestionarInventarioRepository from '../repositories/GestionarInventarioRepository.js';
import Consumible from '../entities/Consumible.js';
import GestionarInventarioService from '../services/GestionarInventarioService.js';
import { connection } from '../database/Connection.js';
import GestionarVentaService from '../services/GestionarVentaService.js';

async function init() {
    try {

        const serv = new GestionarVentaService();

        const pedido = [
            {
                "precio": 23.5,
                "tamanio": "CHICO",
                "id": 1
            },
            {
                "precio": 38.5,
                "tamanio": "GRANDE",
                "id": 2
            }
        ];

        const resultado = await serv.registrarVenta(pedido);
        console.log("Venta registrada correctamente:", resultado);


        //const serv = new GestionarInventarioService();
        /**
            const consumiblePrueba = new Consumible('Roblox', 5);
    
            await serv.registrarConsumible(consumiblePrueba);
    
            console.log("El servicio registró correctamente el consumible");
            console.log(consumiblePrueba);
        */
        

        /**
            const obtenidos = await serv.obtenerConsumibles();
            console.log("Estos son los consumibles obtenidos del servicio");
            console.log(obtenidos.map(consumible => consumible.nombre));
        */

        /**
            const obtenido = await serv.obtenerConsumible(2);
            console.log("Este consumible se obtuvo del servicio", obtenido.nombre);
    
            await serv.editarConsumible(3,{nombre:"Papel", cantidad:32});
            console.log("Se editó el consumible correctamente");
    
            const obtenidosNuevos = await serv.obtenerConsumibles();
            console.log("Estos son los consumibles obtenidos del servicio");
            console.log(obtenidosNuevos.map(consumible => consumible.nombre));
        */

        /**
            await serv.eliminarConsumible(3);
            const obtenidosFinal = await serv.obtenerConsumibles();
            console.log("Estos son los consumibles obtenidos del servicio");
            console.log(obtenidosFinal.map(consumible => consumible.nombre));
        */


        //const repo = new GestionarInventarioRepository();
        //await repo.guardarConsumible(consumiblePrueba);
    
        //console.log("Objeto creado en prueba:");
        //console.log(consumiblePrueba.nombre);
        

        /**
            const consumibleObtenidos = await repo.obtenerTodosLosConsumibles();
            
            console.log("Consumibles obtenidos de la base de sqlito");    
            console.log(consumibleObtenidos.map(consumible => consumible.nombre));
    
            const consumibleEspecifico = await repo.obtenerConsumiblePorId(1);
            console.log("Consumible obtenido por id: ", consumibleEspecifico.nombre);
    
            //const consumibleEditado = await repo.editarConsumible(1, {nombre: "Pañales", cantidad: 10});
            //console.log("Consumible editado: ", consumibleEditado.nombre);
    
            const consumibleEliminado = await repo.eliminarConsumible(1);
            console.log("Consumible eliminado: ", consumibleEliminado.nombre);
        */


    } catch (error) {
        console.error("Error durante la ejecución de los servicios: ", error);
    }
    
};

init();
