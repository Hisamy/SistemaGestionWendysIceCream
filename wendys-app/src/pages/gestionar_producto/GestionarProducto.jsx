import React, { useState, useCallback, useEffect } from 'react';
import NavLeft from '../../components/nav_left/NavLeft.jsx';
import ProductosRectanguloGrid from '../../components/main_content/productos-grid/ProductosRectanguloGrid.jsx';
import { useNavigate } from 'react-router-dom';
import productoController from '../../controllers/ProductoController.js';




function GestionarProducto() {
  const navigate = useNavigate();
  const [selectedProducto, setSelectedProducto] = useState(null);
  const [productos, setProductos] = useState([]);

  // Obtener productos del servidor
  useEffect(() => {
    const fetchConsumibles = async () => {
      try {
        const productosEncontrados = await productoController.obtenerProductos();
        setProductos(productosEncontrados);
      } catch (error) {
        console.error("Error fetching productos:", error);
      }
    };
    fetchConsumibles();
  }, []);

  const handleProductoClick = useCallback((producto) => {
    setSelectedProducto(producto.id);
    navigate('/editar-producto', { state: { productoData: producto } });
  }, [navigate]);

  const handleRegistrarProducto = useCallback(() => {
    console.log('Registrando producto...');
    navigate('/registrar-producto');
  }, [navigate]);

  const navLeftButtons = [
    {
      label: 'Registrar Producto',
      onClick: handleRegistrarProducto,
      variant: 'primary'
    },
  ];

  return (
    <div className="container">
      <div className='nav-left'>
        <NavLeft
          instruction="Selecciona producto que se desee gestionar."
          buttons={navLeftButtons}
        />
      </div>
      <div className="fit-parent">
        <div className="content">
          <ProductosRectanguloGrid
            productos={productos}
            onProductoClick={handleProductoClick}
            selectedId={selectedProducto?.id}
            searchable={true}
          />
        </div>
      </div>
    </div>
  );
}

export default GestionarProducto;