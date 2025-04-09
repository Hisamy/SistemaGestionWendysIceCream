import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import NavLeft from '../../components/nav_left/NavLeft';
import PinkRectangle from '../../components/main_content/PinkRectangle';
import FormDetallesProducto from './form-especificaciones-producto/FormDetallesProducto';
import './ProductoDetalles.css'

function ProductoDetalles() {
    const navigate = useNavigate();
    const location = useLocation();
    const [producto, setProducto] = useState(null);

    const formFields = [
        {
          id: 'tamano',
          type: 'buttons',
          label: 'Tamaño',
          options: ['Chico', 'Mediano', 'Grande']
        },
        {
          id: 'notas',
          type: 'textarea',
          label: 'Notas'
        },
      ];

    useEffect(() => {
        if (location.state?.productoData) {
            setProducto(location.state.productoData);
        } else {
            navigate('/registrar-venta');
        }
    }, [location.state, navigate]);

    if (!producto) {
        return <div>Cargando producto...</div>;
    }

    const handleAceptar = () => {
        navigate('/registrar-venta-total');
    };
    const handleCancelar= () => {
        navigate('/registrar-venta');
    };

    const navLeftButtons = [
        {
            label:'Aceptar',
            onClick: handleAceptar,
            variant: 'primary',

        },
        {
            label:'Cancelar',
            onClick: handleCancelar,
            variant: 'primary',

        }
    ]

    return (
        <div className='container' >
            <div className='nav-left'>
                <NavLeft 
                    instruction='Agrega las especificaciones.'
                    buttons={navLeftButtons}
                />
            </div>
            <div className='fit-parent'>
                <div className="content">
                    <PinkRectangle>
                        <div className='content-detalles'>
                        <div className='image-name-container'> 
                            <div className='image-container'>
                            {producto.image && (
                                <img 
                                src={producto.image} 
                                alt={producto.name} />
                            )}  
                            </div>
                            <p>{producto.name}</p>
                        </div>
                        
                        <div className='detalles-container'>
                            <FormDetallesProducto fields={formFields} />

                        </div>

                        </div>
                        

                    </PinkRectangle>

                </div>

            </div>

              
        </div>
    );
}

export default ProductoDetalles;