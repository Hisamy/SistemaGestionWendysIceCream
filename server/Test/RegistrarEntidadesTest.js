import GestionarInventarioService from "../services/GestionarInventarioService.js";
import GestionarProductosService from "../services/GestionarProductosService.js"
import GestionarVentaService from "../services/GestionarVentaService.js";

const consumibles = [
    {
        nombre: "Servilletas",
        cantidad: 40
    },
    {
        nombre: "Vasos pequeños",
        cantidad: 100
    },
    {
        nombre: "Vasos medianos",
        cantidad: 80
    },
    {
        nombre: "Vasos grandes",
        cantidad: 60
    },
    {
        nombre: "Cucharitas de plástico",
        cantidad: 200
    },
    {
        nombre: "Conos de helado",
        cantidad: 150
    },
    {
        nombre: "Tapas para vasos",
        cantidad: 120
    },
    {
        nombre: "Popotes",
        cantidad: 90
    },
    {
        nombre: "Guantes desechables",
        cantidad: 300
    },
    {
        nombre: "Toallas húmedas",
        cantidad: 50
    }
];

const productos = [
    {
        nombre: "Nieve",
        variantes: [
            {
                precio: 30.0,
                tamanio: "CHICO",
                consumibles: [
                    {
                        id: 1,
                        cantidad: 1
                    },
                    {
                        id: 6,
                        cantidad: 1
                    }
                ]
            },
            {
                precio: 40.0,
                tamanio: "MEDIANO",
                consumibles: [
                    {
                        id: 1,
                        cantidad: 1
                    },
                    {
                        id: 3,
                        cantidad: 1
                    },
                    {
                        id: 5,
                        cantidad: 1
                    }
                ]
            }
        ]
    }
];

const gestionarInventarioServ = new GestionarInventarioService();
const gestionarProductosServ = new GestionarProductosService();
const gestionarVentaServ = new GestionarVentaService();

async function init() {
    try {
        registrarConsumibles();
        registrarProductos();
    } catch (error) {
        console.log(error.message);
    }
}

const registrarConsumibles = async () => {
    try {
        let tabla = "Consumibles";
        for (const consumible of consumibles) {
            const consumibleGuardado = await gestionarInventarioServ.registrarConsumible(consumible);
            tabla += `\n${consumibleGuardado.id}: ${consumibleGuardado.nombre}`;
        }
        console.log(tabla);
    } catch (error) {
        console.log(error.message);
    }
};

const registrarProductos = async () => {
    try {
        let tabla = "Productos";
        for (const producto of productos) {
            const productoGuardado = await gestionarProductosServ.registrarProducto(producto);
            tabla += `\n${productoGuardado.id}: ${productoGuardado.nombre}`;
        }
        console.log(tabla);
    } catch (error) {
        console.log(error.message);
    }
};


init();