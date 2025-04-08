import VentaRepository from '../repositories/VentaRepository.js';
import VarianteProductoRepository from '../repositories/VarianteProductoRepository.js';
import Venta from '../entities/Venta.js';
import DetallesVenta from '../entities/DetallesVenta.js';
import DetallesVentaRepository from '../repositories/DetallesVentaRepository.js';
import ConsumibleRepository from '../repositories/GestionarInventarioRepository.js';
import VarianteJoinConsumibleRepository from '../repositories/VarianteJoinRepository.js';
import { ValidationError } from '../errors/ValidationError.js';
import { BusinessError } from '../errors/BusinessError.js';


const errorEncabezado = "\nError de servicio en GestionarVentaService:";

class GestionarVentaService {
    constructor() {
        this.ventaRepo = new VentaRepository();
        this.varianteProductoRepo = new VarianteProductoRepository();
        this.detallesVentaRepo = new DetallesVentaRepository();
        this.consumibleRepo = new ConsumibleRepository();
        this.varianteJoinConsumibleRepo = new VarianteJoinConsumibleRepository();
    }

    async registrarVenta(pedido) {
        try {
            const productosPedido = [...pedido];

            const now = new Date();
            const fecha = now.toISOString().split('T')[0]; 
            const hora = `${now.getHours().toString().padStart(2, '0')}:` +
                `${now.getMinutes().toString().padStart(2, '0')}:` +
                `${now.getSeconds().toString().padStart(2, '0')}`;
                
            const venta = new Venta(fecha, hora, null, null);
            const ventaGuardada = await this.ventaRepo.guardarVenta(venta);

            for (const productoPedido of productosPedido) {
                const idVariante = productoPedido.id_variante;

                // Verificar si se cuenta con suficientes consumibles
                await this.verificarConsumiblesSuficientes(idVariante);

                const varianteEncontrada = await this.varianteProductoRepo.obtenerVariantePorId(idVariante);
                const detallesVenta = new DetallesVenta(productoPedido.precio, varianteEncontrada, ventaGuardada);
                await this.detallesVentaRepo.guardarDetallesVenta(detallesVenta);

                // Resta los consumibles del inventario
                const joins = [...await this.varianteJoinConsumibleRepo.obtenerPorVarianteId(idVariante)];
                joins.forEach(async join => {
                    const consumible = await this.consumibleRepo.obtenerConsumiblePorId(join.consumible_id);
                    consumible.cantidad -= join.cantidad_consumible;
                    await this.consumibleRepo.actualizarConsumible(join.consumible_id, consumible);
                });
            }

            return ventaGuardada;

        } catch (error) {
            throw new BusinessError(`${errorEncabezado} Falló al intentar registrar una nueva venta: ${error.message}`, error);
        }
    }

    async verificarConsumiblesSuficientes(idVariante) {
        try {
            // Validar parámetros de entrada
            if (!idVariante) {
                throw new ValidationError('El ID de la variante es obligatorio');
            }

            // Obtener la variante del producto
            const variante = await this.varianteProductoRepo.obtenerVariantesPorIdDelProducto(idVariante);
            if (!variante) {
                throw new ValidationError('La variante especificada no existe');
            }

            // Obtener las relaciones de consumibles asociadas a la variante
            const relaciones = await this.varianteProductoRepo.obtenerRelacionesConsumiblesPorIdVariante(idVariante);
            if (!relaciones || relaciones.length === 0) {
                throw new ValidationError('No hay consumibles asociados a esta variante');
            }

            // Verificar si hay suficientes consumibles para la cantidad solicitada
            for (const relacion of relaciones) {
                const consumible = await this.consumibleRepo.obtenerConsumiblePorId(relacion.consumible_id);
                if (!consumible) {
                    throw new ValidationError(`El consumible con ID ${relacion.consumible_id} no existe`);
                }

                const cantidadRequerida = relacion.cantidad_consumible;
                if (consumible.cantidad < cantidadRequerida) {
                    throw new ValidationError(`No hay suficiente cantidad del consumible "${consumible.nombre}". Se requieren ${cantidadRequerida}, pero solo hay ${consumible.cantidad}`);
                }
            }

            return true; // Consumibles suficientes
        } catch (error) {
            if (error instanceof ValidationError) {
                throw error;
            }
            throw new BusinessError(`${errorEncabezado} Falló al intentar verificar consumibles suficientes: ${error.message}`, error);
        }
    }

}

export default GestionarVentaService;
