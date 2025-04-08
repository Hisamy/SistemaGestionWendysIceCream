import React, { useState, useCallback } from 'react';
import NavLeft from '../../components/nav_left/NavLeft.jsx';
import ProductosRectanguloGrid from '../../components/main_content/productos-grid/ProductosRectanguloGrid.jsx';
import { useNavigate } from 'react-router-dom';
import './GestionarProducto.css'

// Datos de ejemplo - podrías obtenerlos de una API o desde props
const PRODUCTOS_MOCK = [
  { id: 1, name: 'Fresada' },
  { id: 2, name: 'Nieve cono' },
  { id: 3, name: 'Frappe' },
  { id: 4, name: 'Nieve vaso' },
  { id: 5, name: 'Sundae'},
  { id: 6, name: 'Banana Split'},
];

function GestionarProducto() {
  const navigate = useNavigate();
  const [selectedProducto, setSelectedProducto] = useState(null);

  const handleProductoClick = useCallback((producto) => {
    setSelectedProducto(producto);
    console.log('Producto seleccionado:', producto);
  }, []);

  const handleRegistrarProducto = useCallback(() => {
    console.log('Registrando producto...');
    navigate('/');
  }, [navigate]);

  const navLeftButtons = [
    {
      label: 'Registrar Producto',
      onClick: handleRegistrarProducto,
      variant: 'primary'
    },
  ];

  return (
    <div className="productos-container">
      <div className='nav-left'>
        <NavLeft
          instruction="Selecciona producto que se desee gestionar."
          buttons={navLeftButtons}
        />
      </div>
      <div className="productos-content">
        <ProductosRectanguloGrid
          productos={PRODUCTOS_MOCK}
          onProductoClick={handleProductoClick}
          selectedId={selectedProducto?.id}
          searchable={true}
        />
      </div>
    </div>
  );
}

export default GestionarProducto;