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

    registrarProducto: async (datosProducto, imagen) => {
        const formData = new FormData();
        formData.append('datosProducto', JSON.stringify(datosProducto));
        formData.append('imagen', imagen);
        return await api.postFormData('/gestionarProductos/registrar', formData);
    },

    obtenerProductos: async () => {
        return await api.get('/gestionarProductos/productos');
    },

    obtenerVariantesPorIdDeProducto: async (idProducto) => {
        return await api.get(`/gestionarProductos/variantesProducto/${idProducto}`);
    },

    obtenerJoinsDeVarianteYConsumiblesPorId: async (id) => {
        return await api.get(`/gestionarProductos/variantejoinconsumibles/${id}`)
    }
}

export default productoController;