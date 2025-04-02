import { Routes, Route } from 'react-router-dom';
import Header from './components/header/Header.jsx';
import GestionarInventario from './pages/gestionar_inventario/GestionarInventario.jsx';
import GestionarProducto from './pages/GestionarProducto.jsx';

function App() {
  return (
    <>
        <Header />
        <main className="main-content">
          <Routes>
            <Route path="/gestionar-producto" element={<GestionarProducto />} />
            <Route path="/registrar-venta" element={<div>Registrar Venta (En desarrollo)</div>} />
            <Route path="/gestionar-inventario" element={<GestionarInventario />} />
            <Route path="/gestionar-venta" element={<div>Gestionar Venta (En desarrollo)</div>} />
          </Routes>
        </main> 
      
    </>
  );
}

export default App;



