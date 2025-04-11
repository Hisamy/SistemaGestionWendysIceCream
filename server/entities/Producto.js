import { EntitySchema } from "typeorm";

class Producto {
    constructor(nombre, imagenPath){
        this.nombre = nombre;
        this.imagenPath = imagenPath;
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
        imagenPath: {
            type: "varchar",
            length: 150
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