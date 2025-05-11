import "reflect-metadata"; // Permite almacenar y recuperar metadatos en tiempo de ejecución.
import "dotenv/config";
import { DataSource } from "typeorm";
import { ConsumibleSchema } from '../entities/Consumible.js';
import { ProductoSchema } from "../entities/Producto.js";
import { VarianteProductoSchema } from "../entities/VarianteProducto.js";
import { VarianteJoinConsumibleSchema } from "../entities/VarianteJoinConsumible.js";
import { DATABASE } from "../utils/Config.js";
import { VentaSchema } from "../entities/Venta.js";
import { DetallesVentaSchema } from "../entities/DetallesVenta.js";


export const connection = new DataSource({
    type: "sqlite",
    database: DATABASE,
    entities: [
        ConsumibleSchema,
        ProductoSchema,
        VarianteProductoSchema,
        VarianteJoinConsumibleSchema,
        VentaSchema,
        DetallesVentaSchema
    ],
    synchronize: true,
    logging: false,

});

await connection.initialize();
