import React, { useState, useCallback } from 'react';
import NavLeft from '../../components/nav_left/NavLeft.jsx';
import ProductosRectanguloGrid from './ProductosRectanguloGrid.jsx';
import { useNavigate } from 'react-router-dom'; 

function GestionarProducto(){
    const navigate = useNavigate();

      const handleRegistrarProducto = useCallback(() => {
        console.log('Registrando producto...');
        navigate('/');
      }, []);

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
                <ProductosRectanguloGrid>
                    
                </ProductosRectanguloGrid>
    
              </div>
          </div>
        );
    
}

export default GestionarProducto;