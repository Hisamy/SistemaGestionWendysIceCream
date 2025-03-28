import Tamanio from "./Tamanio.js"; 
import { EntitySchema } from "typeorm";

class VarianteProducto {
    constructor(precio, tamanio, producto, consumibles) {
        this.precio = precio;
        this.tamanio = tamanio;
        this.producto = producto;
        this.consumibles = consumibles;
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
            eager: true
        },
        consumibles: {
            target: "Consumible",
            type: "many-to-many",
            joinTable: {
                name: "variante_consumibles",
                joinColumn: {
                    name: "variante_id",
                    referencedColumnName: "id"
                },
                inverseJoinColumn: {
                    name: "consumible_id",
                    referencedColumnName: "id"
                }
            }
        }
    }
});

export default VarianteProducto;