import { Routes, Route } from 'react-router-dom';
import { ProductosVentaProvider } from './pages/registrar_venta/registrar-venta-contexto/ProductosVentaContext.jsx';
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
import EditarProducto from './pages/gestionar_producto/registrar-producto/editar-producto/EditarProducto.jsx';
import ModificarConsumibles from './pages/gestionar_producto/registrar-producto/editar-producto/ModificarConsumibles.jsx';
import ModificarVariablesProducto from './pages/gestionar_producto/registrar-producto/editar-producto/ModificarVariablesProducto.jsx';
import Inicio from './pages/inicio/inicio.jsx';

function App() {
  return (
    <>
      <Header />
      <main className="main-content">
        <ProductosVentaProvider>
          <Routes>
            <Route path="/" element={<Inicio />} />
            <Route path="/gestionar-producto" element={<GestionarProducto />} />
            <Route path="/registrar-venta" element={<RegistrarVenta />} />
            <Route path="/producto-detalles" element={<ProductoDetalles />} />
            <Route path="/registrar-venta-total" element={<RegistrarVentaTotal />} />
            <Route path="/gestionar-inventario" element={<GestionarInventario />} />
            <Route path="/gestionar-venta" element={<div>Gestionar Venta (En desarrollo)</div>} />
            <Route path="/registrar-consumible" element={<RegistrarConsumible />} />
            <Route path="/gestionar-consumible" element={<GestionarConsumible />} />
            <Route path="/registrar-producto" element={<RegistrarProducto />} />
            <Route path="/modificar-variable" element={<ModificarVariablesProducto />} />
            <Route path="/modificar-consumibles" element={<ModificarConsumibles />} />
            <Route path="/editar-producto" element={<EditarProducto />} />
            <Route path="/elegir-consumibles" element={<ElegirConsumibles />} />

          </Routes>
        </ProductosVentaProvider>
      </main>

    </>
  );
}

export default App;



