import Tamanio from "./Tamanio.js"; 
import { EntitySchema } from "typeorm";

class VarianteProducto {
    constructor(precio, tamanio, producto) {
        this.precio = precio;
        this.tamanio = tamanio;
        this.producto = producto;
    }
}

export const VarianteProductoSchema = new EntitySchema({
    name: "VarianteProducto",
    tableName: "variantes_producto",
    target: VarianteProducto,
    columns: {
        id: {
            primary: true,
            type: "int",
            generated: true
        },
        precio: {
            type: "decimal",
            precision: 10,
            scale: 2
        },
        tamanio: {
            type: "text",
            default: Tamanio.UNICO
        }
    },
    relations: {
        producto: {
            type: "many-to-one",
            target: "Producto",
            joinColumn: true,
            onDelete: "CASCADE"
        },
        varianteJoinConsumible: {
            target: "VarianteJoinConsumible",
            type: "one-to-many",
            inverseSide: "VarianteProducto"
        }
    }
});

export default VarianteProducto;