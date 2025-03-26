import {Column, Entity, PrimaryGeneratedColumn} from 'typeorm';

@Entity({name: 'consumibles'})
export class Consumible {

    @PrimaryGeneratedColumn()
    id;

    @Column({type: 'varchar', length: 100})
    nombre;

    @Column({type: 'int'})
    cantidad;

    constructor(nombre, cantidad) {
        this.nombre = nombre;
        this.cantidad = cantidad;
    }

    crearConsumible(json){
        const obj = JSON.parse(json);
        const consumible = new Consumible(obj.id, obj.nombre, obj.cantidad); 
        consumible.validarCampos();
        return consumible;
    }

    validarCampos(){
        if(!this.nombre || !this.cantidad){
            throw new Error('Faltan campos obligatorios');
        }
    }
}

export default Consumible;
