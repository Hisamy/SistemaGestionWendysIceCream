import { connection } from '../database/Connection.js';
import { VentaSchema } from '../entities/Venta.js';
import { DetallesVentaSchema } from '../entities/DetallesVenta.js';

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
        this.detallesRepo = connection.getRepository(DetallesVentaSchema);
    }

    async guardarVenta(venta) {
        try {
            return await this.ventaRepo.save(venta);
        } catch (error) {
            throw new DatabaseError(`${errorEncabezado} Falló al intentar guardar la venta: ${error.message}`, error);
        }
    }

    async guardarDetallesVenta(detallesVenta) {
        try {
            return await this.detallesRepo.save(detallesVenta);
        } catch (error) {
            throw new DatabaseError(`${errorEncabezado} Falló al intentar guardar los detalles de la venta: ${error.message}`, error);
        }
    }
}

export default VentaRepository;