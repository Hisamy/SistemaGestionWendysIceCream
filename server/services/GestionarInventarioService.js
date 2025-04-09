import Consumible from "../entities/Consumible.js";
import { BusinessError } from "../errors/BusinessError.js";
import GestionarInventarioRepository from "../repositories/GestionarInventarioRepository.js";
import { ValidationError } from "../errors/ValidationError.js";
import VarianteProductoRepository from "../repositories/VarianteProductoRepository.js";

const errorEncabezado = "\nError de servicio en GestionarProductosService:";

class GestionarInventarioService {

    constructor() {
        this.consumibleRepo = new GestionarInventarioRepository();
        this.varianteProductoRepo = new VarianteProductoRepository();
    }

    async registrarConsumible(datosConsumible) {
        try {
            const consumible = new Consumible(datosConsumible.nombre, datosConsumible.cantidad);

            if (!consumible.nombre || !consumible.cantidad) {
                throw new ValidationError('Faltan campos obligatorios');
            }
            if (typeof consumible.cantidad !== 'number' || isNaN(consumible.cantidad) || !Number.isInteger(consumible.cantidad)) {
                throw new ValidationError('La cantidad debe ser un número entero válido');
            }
            const consumibleExistente = await this.consumibleRepo.obtenerConsumiblePorNombre(consumible.nombre);
            if (consumibleExistente) {
                throw new ValidationError('Ya existe un consumible con ese nombre');
            }

            const registroConsumible = await this.consumibleRepo.guardarConsumible(consumible);
            return registroConsumible;
        } catch (error) {
            if (error instanceof ValidationError) {
                throw error;
            }
            throw new BusinessError(`${errorEncabezado} Falló al intentar registrar consumible: ${error.message}`, error);
        }
    }

    async obtenerConsumibles() {
        try {
            const consumiblesObtenidos = await this.consumibleRepo.obtenerTodosLosConsumibles();
            return consumiblesObtenidos;
        } catch (error) {
            throw new BusinessError(`${errorEncabezado} Falló al intentar obtener consumibles: ${error.message}`, error);
        }
    }

    async obtenerConsumible(id) {
        try {
            const consumibleObtenido = await this.consumibleRepo.obtenerConsumiblePorId(id);
            if (!consumibleObtenido) {
                throw new ValidationError('Consumible no encontrado');
            }
            return consumibleObtenido;
        } catch (error) {
            if (error instanceof ValidationError) {
                throw error;
            }
            throw new BusinessError(`${errorEncabezado} Falló al intentar obtener consumible por id: ${error.message}`, error);
        }
    }

    async editarConsumible(id, datosEntrantes) {
        try {
            // Validar existencia del consumible
            const consumibleExistente = await this.consumibleRepo.obtenerConsumiblePorId(id);
            if (!consumibleExistente) {
                throw new ValidationError('Consumible no encontrado');
            }

            // Validar que el nombre sea único si se modifica
            if (datosEntrantes.nombre && datosEntrantes.nombre !== consumibleExistente.nombre) {
                const consumibleConMismoNombre = await this.consumibleRepo.obtenerConsumiblePorNombre(datosEntrantes.nombre);
                if (consumibleConMismoNombre) {
                    throw new ValidationError('Ya existe un consumible con ese nombre');
                }
            }

            const cantidadActualizada = this.#calcularCantidadActualizada(consumibleExistente.cantidad, datosEntrantes.cantidad);

            const datosCombinados = {
                ...consumibleExistente,
                ...datosEntrantes,
                cantidad: cantidadActualizada
            };

            const consumibleActualizado = new Consumible(datosCombinados.nombre, datosCombinados.cantidad);

            return await this.consumibleRepo.actualizarConsumible(id, consumibleActualizado);
        } catch (error) {
            if (error instanceof ValidationError) {
                throw error;
            }
            throw new BusinessError(`${errorEncabezado} Falló al intentar modificar consumible: ${error.message}`, error);
        }
    }

    // METODOS AUXILIARES QUE REQUIERE EL EDITAR CONSUMIBLE
    #calcularCantidadActualizada(cantidadActual, cantidadEntrante) {
        if (cantidadEntrante !== undefined) {
            this.#validarCantidad(cantidadEntrante);
            return cantidadActual + cantidadEntrante;
        }
        return cantidadActual;
    }

    #validarCantidad(cantidad) {
        if (typeof cantidad !== 'number' || cantidad <= 0 || !Number.isInteger(cantidad)) {
            throw new ValidationError('La cantidad debe ser un número valido mayor a cero');
        }
    }

    async eliminarConsumible(id) {
        try {
            if (!id) {
                throw new ValidationError('Consumible no encontrado');
            }
            return await this.consumibleRepo.eliminarConsumible(id);
        } catch (error) {
            if (error instanceof ValidationError) {
                throw error;
            }
            throw new BusinessError(`${errorEncabezado} Falló al intentar eliminar consumible: ${error.message}`, error);
        }
    }

}

export default GestionarInventarioService;