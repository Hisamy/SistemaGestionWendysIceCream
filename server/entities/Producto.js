import { EntitySchema } from "typeorm";

class Producto {
    constructor(nombre){
        this.nombre = nombre;
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
        }
    },
    relations: {
        variantes: {
            target: "VarianteProducto",
            type: "one-to-many",
            inverseSide: "producto",
            cascade: true,
            eager: true
        }
    }
});

export default Producto;