import { EntitySchema } from "typeorm";

class Producto {
    constructor(nombre, descripcion){
        this.nombre = nombre;
        this.descripcion = descripcion;
    }
}
export const ProductoSchema = new EntitySchema({
    name: "Producto",
    tableName: "productos",
    target: Producto,
    columns: {
        id: {
            primary: true,
            type: "int",
            generated: true
        },
        nombre: {
            type: "varchar",
            length: 100
        },
        descripcion: {
            type: "text",
            nullable: true
        }
    },
    relations: {
        variantes: {
            target: "VarianteProducto",
            type: "one-to-many",
            inverseSide: "producto"
        }
    }
});

export default Producto;