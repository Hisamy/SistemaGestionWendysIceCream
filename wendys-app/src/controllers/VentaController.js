import { api } from "../utils/api.js";

const ventaController = {
    registrarVenta: async (datosVenta) => {
        return await api.post('/gestionarVenta/registrar', datosVenta);
    },

    obtenerVentas: async () => {
        return await api.get('/gestionarVenta/ventas');
    }
}

export default ventaController;