import React, { useState, useCallback } from 'react';
import NavLeft from '../../components/nav_left/NavLeft.jsx';
import { useNavigate } from 'react-router-dom';

import ProductosRectanguloGrid from '../../components/main_content/productos-grid/ProductosRectanguloGrid.jsx';
import iceCreamCone from '../../assets/Images/productos/ice-cream-cone.png'
import fresasCrema from '../../assets/Images/productos/fresas-crema.png'
import frappe from '../../assets/Images/productos/frappe.png'
import iceCreamVaso from '../../assets/Images/productos/ice-cream-vaso.png'
import sundae from '../../assets/Images/productos/sundae.png'
import bananaSplit from '../../assets/Images/productos/banana-split.png'


const PRODUCTOS_MOCK = [
    { id: 1, name: 'Fresada', image: fresasCrema },
    { id: 2, name: 'Nieve cono', image: iceCreamCone },
    { id: 3, name: 'Frappe', image: frappe },
    { id: 4, name: 'Nieve vaso', image: iceCreamVaso },
    { id: 5, name: 'Sundae', image: sundae },
    { id: 6, name: 'Banana Split', image: bananaSplit },
];

function RegistrarVenta() {
    const navigate = useNavigate();
    const [selectedProductId, setSelectedProductId] = useState(null);
    
    const handleProductoClick = useCallback((producto) => {
        setSelectedProductId(producto.id);
        navigate('/producto-detalles', { state: { productoData: producto } });
    }, [navigate]);
  
    return (
        <div className="container">
            <div className='nav-left'>
                <NavLeft
                    instruction="Selecciona producto a vender."
                />
            </div>
            <div className="fit-parent">
                <div className="content">
                    <ProductosRectanguloGrid
                        productos={PRODUCTOS_MOCK}
                        onProductoClick={handleProductoClick}
                        selectedId={selectedProductId} 
                        searchable={true}
                    />
                </div>
            </div>
        </div>
    );
}

export default RegistrarVenta;