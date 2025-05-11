import React, { useState, useCallback, useEffect } from 'react';
import NavLeft from '../../components/nav_left/NavLeft.jsx';
import ProductosRectanguloGrid from '../../components/main_content/productos-grid/ProductosRectanguloGrid.jsx';
import { useNavigate } from 'react-router-dom';
import productoController from '../../controllers/ProductoController.js';

import iceCreamCone from '../../assets/Images/productos/ice-cream-cone.png'
import fresasCrema from '../../assets/Images/productos/fresas-crema.png'
import frappe from '../../assets/Images/productos/frappe.png'
import iceCreamVaso from '../../assets/Images/productos/ice-cream-vaso.png'
import sundae from '../../assets/Images/productos/sundae.png'
import bananaSplit from '../../assets/Images/productos/banana-split.png'



// Datos de ejemplo - podrías obtenerlos de una API o desde props
const PRODUCTOS_MOCK = [
  { id: 1, name: 'Fresada', image: fresasCrema },
  { id: 2, name: 'Nieve cono', image: iceCreamCone },
  { id: 3, name: 'Frappe', image: frappe },
  { id: 4, name: 'Nieve vaso', image: iceCreamVaso },
  { id: 5, name: 'Sundae', image: sundae },
  { id: 6, name: 'Banana Split', image: bananaSplit },
];

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
    navigate('/editar-producto', { state: { id: producto.id } });
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