import { EntitySchema, JoinColumn } from "typeorm";

class VarianteJoinConsumible {
    constructor(varianteProducto, consumible, cantidad) {
        this.varianteProducto = varianteProducto;
        this.consumible = consumible;
        this.cantidad = cantidad;
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
            type: "int",
            primary: true
        },
        consumible_id: {
            type: "int",
            primary: true
        },
        cantidad_consumible: {
            type: "int",
            nullable: false
        }
    },
    relations: {
        varianteProducto: {
            target: "VarianteProducto",
            type: "many-to-one",
            JoinColumn: {
                name: "variante_id",
                referencedColumnName: "id"
            }
        },
        consumible: {
            target: "Consumible",
            type: "many-to-one",
            JoinColumn: {
                name: "consumible_id",
                referencedColumnName: "id"
            }
        }
    }
});

export default VarianteJoinConsumible;