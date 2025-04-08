import VentaRepository from '../repositories/VentaRepository.js';
import VarianteProductoRepository from '../repositories/VarianteProductoRepository.js';

class GestionarVentaService {
    constructor() {
        this.ventaRepo = new VentaRepository();
        this.varianteProductoRepo = new VarianteProductoRepository();
    }


}

export default GestionarVentaService;