import Consumible from "../entities/Consumible.js";
import { BusinessError } from "../errors/BusinessError.js";
import GestionarInventarioRepository from "../repositories/GestionarInventarioRepository.js";
import { ValidationError } from "../errors/ValidationError.js";

class GestionarInventarioService {

    constructor() {
        this.repository = new GestionarInventarioRepository();
    }

    async registrarConsumible(datosConsumible) {
        try {
            const consumible = Consumible.crearConsumible(JSON.stringify(datosConsumible));

            if (!consumible.nombre || !consumible.cantidad) {
                throw new ValidationError('Faltan campos obligatorios');
            }
            if (typeof consumible.cantidad !== 'number' || isNaN(consumible.cantidad)) {
                throw new ValidationError('La cantidad debe ser un número válido');
            }
            const consumibleExistente = await this.repository.obtenerConsumiblePorNombre(consumible.nombre);
            if (consumibleExistente) {
                throw new ValidationError('Ya existe un consumible con ese nombre');
            }

            const registroConsumible = await this.repository.guardarConsumible(consumible);
            return registroConsumible;
        } catch (error) {
            if (error instanceof ValidationError) {
                throw error;
            }
            throw new BusinessError("Error del servicio al registrar los datos", error);
        }
    }

    async obtenerConsumibles() {
        try {
            const consumiblesObtenidos = await this.repository.obtenerTodosLosConsumibles();
            return consumiblesObtenidos;
        } catch (error) {
            throw new BusinessError("Error del servicio al obtener los datos", error);
        }
    }

    async obtenerConsumible(id) {
        try {
            const consumibleObtenido = await this.repository.obtenerConsumiblePorId(id);
            if (!consumibleObtenido) {
                throw new ValidationError('Consumible no encontrado');
            }
            return consumibleObtenido;
        } catch (error) {
            if (error instanceof ValidationError) {
                throw error;
            }
            throw new BusinessError("Error del servicio al obtener los datos", error);
        }
    }

    async editarConsumible(id, datosEntrantes) {
        try {
            // Validar existencia del consumible
            const consumibleExistente = await this.repository.obtenerConsumiblePorId(id);
            if (!consumibleExistente) {
                throw new ValidationError('Consumible no encontrado');
            }

            // Validar que el nombre sea único si se modifica
            if (datosEntrantes.nombre && datosEntrantes.nombre !== consumibleExistente.nombre) {
                const consumibleConMismoNombre = await this.repository.obtenerConsumiblePorNombre(datosEntrantes.nombre);
                if (consumibleConMismoNombre) {
                    throw new ValidationError('Ya existe un consumible con ese nombre');
                }
            }

            const cantidadActualizada = this.#calcularCantidadActualizada(consumibleExistente.cantidad, datosEntrantes.cantidad);

            const consumibleActualizado = Consumible.crearConsumible(JSON.stringify({
                ...consumibleExistente,
                ...datosEntrantes,
                cantidad: cantidadActualizada
            }));

            return await this.repository.actualizarConsumible(id, consumibleActualizado);
        } catch (error) {
            if (error instanceof ValidationError) {
                throw error;
            }
            throw new BusinessError("Error del servicio al modificar datos", error);
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
        if (typeof cantidad !== 'number' || cantidad <= 0) {
            throw new ValidationError('La cantidad debe ser un número mayor a cero');
        }
    }

    async eliminarConsumible(id) {
        try {
            if (!id) {
                throw new ValidationError('Consumible no encontrado');
            }
            return await this.repository.eliminarConsumible(id);
        } catch (error) {
            if (error instanceof ValidationError) {
                throw error;
            }
            throw new BusinessError("Error del servicio al eliminar datos", error);
        }
    }

}

export default GestionarInventarioService;