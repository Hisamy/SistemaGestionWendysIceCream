import React, {useState, useCallback, useEffect } from 'react';
import NavLeft from '../../components/nav_left/NavLeft.jsx';
import { useNavigate, useLocation } from 'react-router-dom';
import { useProductosVenta } from './registrar-venta-contexto/ProductosVentaContext.jsx';
import MostrarProductosVenta from './productos-venta/MostrarProductosVenta.jsx';

import ProductosRectanguloGrid from '../../components/main_content/productos-grid/ProductosRectanguloGrid.jsx';
import iceCreamCone from '../../assets/Images/productos/ice-cream-cone.png'
import fresasCrema from '../../assets/Images/productos/fresas-crema.png'
import frappe from '../../assets/Images/productos/frappe.png'
import iceCreamVaso from '../../assets/Images/productos/ice-cream-vaso.png'
import sundae from '../../assets/Images/productos/sundae.png'
import bananaSplit from '../../assets/Images/productos/banana-split.png'
import productoController from '../../controllers/ProductoController.js';


// const PRODUCTOS_MOCK = [
//     { id: 1, name: 'Fresada', image: fresasCrema, price: 55 },
//     { id: 2, name: 'Nieve cono', image: iceCreamCone, price: 30 },
//     { id: 3, name: 'Frappe', image: frappe, price: 45 },
//     { id: 4, name: 'Nieve vaso', image: iceCreamVaso, price: 35 },
//     { id: 5, name: 'Sundae', image: sundae, price: 40 },
//     { id: 6, name: 'Banana Split', image: bananaSplit, price: 65 },
//   ];

function RegistrarVenta() {
    const navigate = useNavigate();
    const location = useLocation();
    const [selectedProductId, setSelectedProductId] = useState(null);
    const [showNextButton, setShowNextButton] = useState(false);
    const [showProductosVenta, setShowProductosVenta] = useState(false);
    const [productos, setProductos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    // Obtener el contexto de productos de venta
    const { productosVenta, hayProductos } = useProductosVenta();

    useEffect(() => {

        const cargarProductos = async () => {
            try {
                const data = await productoController.obtenerProductos();
                const productosMapeados = data.map(item => ({
                    id: item.id,
                    name: item.nombre,
                    image: item.imagenPath
                }));
                setProductos(productosMapeados);
                setLoading(false);
            } catch (error) {
                console.error("Error al cargar productos:", error);
                setError("Error al cargar los productos. Por favor, intenta de nuevo.");
                setLoading(false);
            }
        };
        cargarProductos();
    }, []);

    useEffect(() => {
        // Mostrar el botón siguiente si hay productos en la lista o si viene indicado en el estado
        if (hayProductos || location.state?.showNextButton) {
            setShowNextButton(true);
            setShowProductosVenta(true)
        }
    }, [hayProductos, location.state]);
    
    const handleNextClick = () => {
        navigate('/registrar-venta-total', { 
            state: { productosVenta } 
        });
    };


    const handleProductoClick = useCallback((producto) => {
        setSelectedProductId(producto.id);
        navigate('/producto-detalles', { state: { productoData: producto } });
    }, [navigate]);
  
    const navLeftButtons = showNextButton ? [
        {
            label: 'Siguiente', 
            onClick: handleNextClick, 
            variant: 'primary' 
        }
    ] : [];

    const showComponentProductosVenta = showProductosVenta
    ? () => <MostrarProductosVenta />
    : () => null;



    return (
        <div className="container">
            <div className='nav-left'>
                <NavLeft
                    instruction="Selecciona producto a vender."
                    buttons={navLeftButtons}
                />
                <div className='producto-venta-tabla'>
                    {showComponentProductosVenta()}
                </div>
            </div>
            <div className="fit-parent">
                <div className="content">
                    <ProductosRectanguloGrid
                        productos={productos}
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