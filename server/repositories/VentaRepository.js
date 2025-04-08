import { connection } from '../database/Connection.js';
import { VentaSchema } from '../entities/Venta.js';
import { DatabaseError } from '../errors/DatabaseError.js';

const errorEncabezado = "\nError de acceso a datos en VentaRepository:";

const verificarIdValido = (id) => {
    if (id === undefined || id === null) {
        throw new Error("El id no puede ser nulo ni indefinido.");
    } else if (isNaN(id)) {
        throw new Error("El id debe ser un número entero válido.");
    }
}

class VentaRepository {
    constructor() {
        this.ventaRepo = connection.getRepository(VentaSchema);
    }

    async guardarVenta(venta) {
        try {
            return await this.ventaRepo.save(venta);
        } catch (error) {
            throw new DatabaseError(`${errorEncabezado} Falló al intentar guardar la venta: ${error.message}`, error);
        }
    }

    
}

export default VentaRepository;