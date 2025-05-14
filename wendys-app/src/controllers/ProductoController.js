import { api } from "../utils/api.js";

const productoController = {
    buscarSiProductoExiste: async (nombre) => {
        return await api.get(`/gestionarProductos/existe/${nombre}`);
    },

    obtenerTamanios: async () => {
        return await api.get('/gestionarProductos/tamanios');
    },

    obtenerTamanioDefult: async () => {
        return await api.get('/gestionarProductos/tamanios/default');
    },

    verificarSiSePuedeAgregarMasVariantes: async (cantidadVariantesAgregadas) => {
        return await api.get(`/gestionarProductos/quedanTamanios/${cantidadVariantesAgregadas}`);
    },

    registrarProducto: async (formData) => {
        return await api.postFormData('/gestionarProductos/registrar', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
    },

    actualizarProducto: async (idProducto, formData) => {
        return await api.put(`/gestionarProductos/actualizarProducto/${idProducto}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
    },

    obtenerProductos: async () => {
        return await api.get('/gestionarProductos/productos');
    },

    obtenerVariantesPorIdDeProducto: async (idProducto) => {
        return await api.get(`/gestionarProductos/variantesProducto/${idProducto}`);
    },

    obtenerJoinsDeVarianteYConsumiblesPorId: async (id) => {
        return await api.get(`/gestionarProductos/variantejoinconsumibles/${id}`)
    },

    obtenerProductoPorId: async (idProducto) => {
        return await api.get(`/gestionarProductos/producto/${idProducto}`)
    }
}

export default productoController;