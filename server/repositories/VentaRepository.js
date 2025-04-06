import { connection } from '../database/Connection.js';
import { VentaSchema } from '../entities/Venta.js';
import { DetallesVentaSchema } from '../entities/DetallesVenta.js';

class VentaRepository {
    constructor() {
        this.ventaRepo = connection.getRepository(VentaSchema);
        this.detallesRepo = connection.getRepository(DetallesVentaSchema);
    }

    async guardarVenta(venta) {
        try {
            return await this.ventaRepo.save(venta);
        } catch (error) {
            throw new DatabaseError(`Error al guardar la venta: ${error.message}`, error);
        }
    }

    async guardarDetallesVenta(detallesVenta) {
        try {
            return await this.detallesRepo.save(detallesVenta);
        } catch (error) {
            throw new DatabaseError(`Error al guardar los detalles de la venta: ${error.message}`, error);
        }
    }
}

export default VentaRepository;