import { EntitySchema, JoinColumn } from "typeorm";

class VarianteJoinConsumible {
    constructor(varianteProducto, consumible, cantidadConsumible) {
        this.variante_id = varianteProducto;
        this.consumible_id = consumible;
        this.cantidad_consumible = cantidadConsumible;
    }
}

export const VarianteJoinConsumibleSchema = new EntitySchema({
    name: "VarianteJoinConsumible",
    tableName: "variante_join_consumible",
    target: VarianteJoinConsumible,
    columns: {
        id: {
            primary: true,
            type: "int",
            generated: true
        },
        variante_id: {
            type: "int"
        },
        consumible_id: {
            type: "int"
        },
        cantidad_consumible: {
            type: "int",
            nullable: false
        }
    },
    uniques: [
        { columns: ["variante_id", "consumible_id"] } // garantiza que la combinación sea unica
    ],
    relations: {
        varianteProducto: {
            target: "VarianteProducto",
            type: "many-to-one",
            joinColumn: {
                name: "variante_id",
                referencedColumnName: "id"
            }
        },
        consumible: {
            target: "Consumible",
            type: "many-to-one",
            joinColumn: {
                name: "consumible_id",
                referencedColumnName: "id"
            }
        }
    }
});

export default VarianteJoinConsumible;