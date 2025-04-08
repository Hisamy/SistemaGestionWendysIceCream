import { api } from "../utils/api.js";

const inventarioController = {
    obtenerConsumibles: async() => {
        return await api.get("/gestionarInventario/consumibles");
    },

    obtenerConsumible: async(id) => {
        return await api.get(`/gestionarInventario/consumible/${id}`);
    },

    registrarConsumible: async(datosConsumible) => {
        return await api.post("/gestionarInventario/registrar", datosConsumible);
    },

    editarConsumible: async(id, datosConsumible) => {
        return await api.put(`/gestionarInventario/editar/${id}`, datosConsumible);
    },

    eliminarConsumible: async(id) => {
        return await api.delete(`/gestionarInventario/eliminar/${id}`);
    }
};

export default inventarioController;