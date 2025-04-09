import { Routes, Route } from 'react-router-dom';
import Header from './components/header/Header.jsx';
import GestionarInventario from './pages/gestionar_inventario/GestionarInventario.jsx';
import GestionarProducto from './pages/gestionar_producto/GestionarProducto.jsx';
import RegistrarConsumible from './pages/gestionar_inventario/registrar_consumible/RegistrarConsumible.jsx';
import GestionarConsumible from './pages/gestionar_inventario/gestionar_consumible/GestionarConsumible.jsx';
import RegistrarProducto from './pages/gestionar_producto/registrar-producto/RegistrarProducto.jsx';
import ElegirConsumibles from './pages/gestionar_producto/registrar-producto/elegir-consumibles/ElegirConsumibles.jsx';
import RegistrarVenta from './pages/registrar_venta/RegistrarVenta.jsx';
import ProductoDetalles from './pages/registrar_venta/ProductoDetalles.jsx';
import RegistrarVentaTotal from './pages/registrar_venta/RegistrarVentaTotal.jsx';

function App() {
  return (
    <>
        <Header />
        <main className="main-content">
          <Routes>
            <Route path="/gestionar-producto" element={<GestionarProducto />} />
            <Route path="/registrar-venta" element={<RegistrarVenta/>} />
            <Route path="/producto-detalles" element={<ProductoDetalles/>} />
            <Route path="/registrar-venta-total" element={<RegistrarVentaTotal />} />
            <Route path="/gestionar-inventario" element={<GestionarInventario />} />
            <Route path="/gestionar-venta" element={<div>Gestionar Venta (En desarrollo)</div>} />
            <Route path="/registrar-consumible" element={<RegistrarConsumible />} />
            <Route path="/gestionar-consumible" element={<GestionarConsumible />} />
            <Route path="/registrar-producto" element={<RegistrarProducto />} />
            <Route path="/elegir-consumibles" element={<ElegirConsumibles />} />
          </Routes>
        </main> 
      
    </>
  );
}

export default App;



