import {Column, Entity, PrimaryGeneratedColumn} from 'typeorm';

@Entity({name: 'consumibles'})
class Consumible {

    @PrimaryGeneratedColumn()
    id;

    @Column({type: 'varchar', length: 100})
    nombre;

    @Column({type: 'int'})
    cantidad;

    @Column({type: 'timestamp'}) 
    fechaIngreso;
    
    constructor(id, nombre, cantidad, fechaIngreso) {
        this.id = id;
        this.nombre = nombre;
        this.cantidad = cantidad;
        this.fechaIngreso = fechaIngreso;
    }

    crearConsumible(json){
        const obj = JSON.parse(json);
        const consumible = new Consumible(obj.id, obj.nombre, obj.cantidad, new Date()); 
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
