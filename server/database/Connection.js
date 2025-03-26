import "reflect-metadata"; // Permite almacenar y recuperar metadatos en tiempo de ejecución.
import "dotenv/config";
import { DataSource } from "typeorm";
import {ConsumibleSchema } from '../entities/Consumible.js';
import { DATABASE } from "../utils/Config.js";


export const connection = new DataSource({
    type: "sqlite",
    database: DATABASE,
    entities: [ConsumibleSchema],
    synchronize: true,
    logging: true,
    
});

await connection.initialize();