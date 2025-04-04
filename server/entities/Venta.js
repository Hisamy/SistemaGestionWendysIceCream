import { EntitySchema } from "typeorm";

class Venta {
    constructor(fecha, hora, precioTotal, notas) {
        this.fecha = fecha;
        this.hora = hora;
        this.precioTotal = precioTotal;
        this.notas = notas;
    }
}

export const VentaSchema = new EntitySchema({
    name: "Venta",
    tableName: "ventas",
    target: Venta,
    columns: {
        id: {
            primary: true,
            type: "int",
            generated: true
        },
        fecha: {
            type: "date"
        },
        hora: {
            type: "time"
        },
        precioTotal: {
            type: "decimal",
            precision: 10,
            scale: 2
        },
        notas: {
            type: "text",
            nullable: true
        }
    },
    relations: {
        detalles: {
            type: "one-to-many",
            target: "DetallesVenta",
            inverseSide: "venta"
        }
    }
});

export default Venta;