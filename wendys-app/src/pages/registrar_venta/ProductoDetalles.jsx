import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import NavLeft from '../../components/nav_left/NavLeft.jsx';
import PinkRectangle from '../../components/main_content/PinkRectangle.jsx';
import FormDetallesProducto from './form-especificaciones-producto/FormDetallesProducto.jsx';
import {useProductosVenta } from './registrar-venta-contexto/ProductosVentaContext.jsx'
import './ProductoDetalles.css'

function ProductoDetalles() {
    const navigate = useNavigate();
    const location = useLocation();
    const [producto, setProducto] = useState(null);
    const [formValues, setFormValues] = useState({});
    const formRef = useRef();

    const { addProducto } = useProductosVenta();

    const formatPrice = (price) => {
        return new Intl.NumberFormat('es-MX', {
          style: 'currency',
          currency: 'MXN'
        }).format(price);
      };

    // Manejar cambios en el formulario
    const handleFormValuesChange = (values) => {
        setFormValues(values);
    };

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
        // Obtener los valores del formulario
        let detalles = {};
        
        if (formRef.current && formRef.current.getFormValues) {
            detalles = formRef.current.getFormValues();
        } else {
            detalles = formValues;
        }
        
        // Agregar el producto al contexto
        addProducto(producto, detalles);
        
       
        navigate('/registrar-venta', { 
            state: { showNextButton: true, showProductosVenta:true }
        });
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
                <div className='left-container'>
                    <div className='nav-left'>
                        <NavLeft 
                            instruction='Agrega las especificaciones.'
                            buttons={navLeftButtons}
                        />
                    </div>
                    <hr className="divider" />  
                    <div className='costo-producto'>
                        <h4>COSTO PRODUCTO</h4>
                        <p>{formatPrice(producto.price)}</p>
                    </div>
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