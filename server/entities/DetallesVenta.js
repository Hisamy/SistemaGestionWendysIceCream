import { EntitySchema } from "typeorm";

class DetallesVenta {
    constructor(cantidad, importe, variante, venta) {
        this.cantidad = cantidad;
        this.importe = importe;
        this.variante = variante;
        this.venta = venta;
    }
}

export const DetallesVentaSchema = new EntitySchema({
    name: "DetallesVenta",
    tableName: "detalles_venta",
    target: DetallesVenta,
    columns: {
       id: {
            primary: true,
            type: "int",
            generated: true
        },
        cantidad: {
            type: "float"
        },
        importe: {
            type: "float"
        } 
    },
    relations: {
        variante: {
            type: "many-to-one",
            target: "VarianteProducto",
            joinColumn: true
        },
        venta: {
            type: "many-to-one",
            target: "Venta",
            joinColumn: true,
            onDelete: "CASCADE"
        }
    }
});

export default DetallesVenta;