import VentaRepository from '../repositories/VentaRepository.js';
import VarianteProductoRepository from '../repositories/VarianteProductoRepository.js';
import Venta from '../entities/Venta.js';
import DetallesVenta from '../entities/DetallesVenta.js';
import DetallesVentaRepository from '../repositories/DetallesVentaRepository.js';

const errorEncabezado = "\nError de servicio en GestionarVentaService:";
let productosPedido;

class GestionarVentaService {
    constructor() {
        this.ventaRepo = new VentaRepository();
        this.varianteProductoRepo = new VarianteProductoRepository();
        this.detallesVentaRepo = new DetallesVentaRepository();
    }

    async registrarVenta(pedido) {
        try {
            const productosPedido = [...pedido];

            const fecha = new Date().toLocaleDateString();
            const now = new Date();
            const hora = `${now.getHours().toString().padStart(2, '0')}:` +
             `${now.getMinutes().toString().padStart(2, '0')}:` +
             `${now.getSeconds().toString().padStart(2, '0')}`;
            const venta = new Venta(fecha, hora, null, null);
            const ventaGuardada = this.ventaRepo.guardarVenta(venta);

            productosPedido.forEach((productoPedido) => {
                const idVariante = productoPedido.idVariante;
                const varianteEncontrada = this.varianteProductoRepo.obtenerVariantePorId(idVariante);
                const detallesVenta = new DetallesVenta(1, productoPedido.precio, varianteEncontrada, ventaGuardada);
                this.detallesVentaRepo.guardarDetallesVenta(detallesVenta);
            });

        } catch (error) {
            throw new BusinessError(`${errorEncabezado} Falló al intentar registrar una nueva venta: ${error.message}`, error);
        }
    }

}

export default GestionarVentaService;
