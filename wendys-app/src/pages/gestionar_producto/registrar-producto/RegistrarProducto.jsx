import React, { useState, useCallback } from 'react';
import NavLeft from '../../../components/nav_left/NavLeft.jsx';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

function RegistrarProducto(){
    const navigate = useNavigate();
    
      const handleRegistrarProducto = useCallback(() => {
        console.log('Registrando producto...');

        Swal.fire({
            icon: 'success',
            title: '¡Producto Registrado!',
            text: 'El producto se ha registrado correctamente.',
            confirmButtonText: 'Continuar', 
            confirmButtonColor: '#A2576C',
            showCancelButton: false})
            .then((result) => {
                if (result.isConfirmed) {
                  navigate('/gestionar-producto');
                }
              });
            }, [navigate]);

    const navLeftButtons = [
        {
          label: 'Registrar',
          onClick: handleRegistrarProducto,
          variant: 'primary'
        },
      ];

      return(
         <div className='nav-left'>
                <NavLeft
                  instruction="Ingresar los datos del nuevo producto a registrar"
                  buttons={navLeftButtons}
                />
              </div>

      );
}

export default RegistrarProducto;