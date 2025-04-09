import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';

function ProductoDetalles(){
    const navigate = useNavigate();
    const location = useLocation();
    const [producto, setProducto] = useState({});

    useEffect(() => {
        if (location.state?.productoData) {
            setProducto(location.state.productoData);
          } else {
            navigate('/registrar-venta'); 
          }
    
        datosConsumible();
      }, [location.state, navigate]);


}

export default ProductoDetalles;