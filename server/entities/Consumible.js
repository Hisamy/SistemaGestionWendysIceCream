import { EntitySchema } from "typeorm";

class Consumible {
    constructor(nombre, cantidad) {
        this.nombre = nombre;
        this.cantidad = cantidad;
    }

    static crearConsumible(json) {
        const obj = JSON.parse(json);
        const consumible = new Consumible(obj.nombre, obj.cantidad); 
        return consumible;
    }

}

export const ConsumibleSchema = new EntitySchema({
    name: "Consumible",
    tableName: "consumibles",
    target: Consumible,
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
        cantidad: {
            type: "int"
        }
    }
});

export default Consumible;