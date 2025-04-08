import { connection } from '../database/Connection.js';
import { DetallesVentaSchema } from '../entities/DetallesVenta.js';

const errorEncabezado = "\nError de acceso a datos en VentaRepository:";

const verificarIdValido = (id) => {
    if (id === undefined || id === null) {
        throw new Error("El id no puede ser nulo ni indefinido.");
    } else if (isNaN(id)) {
        throw new Error("El id debe ser un número entero válido.");
    }
}

class DetallesVentaRepository {
    constructor() {
        this.detallesRepo = connection.getRepository(DetallesVentaSchema);
    }

    async guardarDetallesVenta(detallesVenta) {
        try {
            return await this.detallesRepo.save(detallesVenta);
        } catch (error) {
            throw new DatabaseError(`${errorEncabezado} Falló al intentar guardar los detalles de la venta: ${error.message}`, error);
        }
    }
}

export default DetallesVentaRepository;