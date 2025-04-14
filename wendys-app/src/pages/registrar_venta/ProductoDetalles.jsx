import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import NavLeft from '../../components/nav_left/NavLeft.jsx';
import PinkRectangle from '../../components/main_content/PinkRectangle.jsx';
import FormDetallesProducto from './form-especificaciones-producto/FormDetallesProducto.jsx';
import {useProductosVenta } from './registrar-venta-contexto/ProductosVentaContext.jsx'
import './ProductoDetalles.css'
import productoController from '../../controllers/ProductoController.js';

function ProductoDetalles() {
    const navigate = useNavigate();
    const location = useLocation();
    const [producto, setProducto] = useState(null);
    const [formValues, setFormValues] = useState({});
    const [variantes, setVariantes] = useState([]);
    const [tamanioSeleccionado, setTamanioSeleccionado] = useState(null);
    const [precioActual, setPrecioActual] = useState(0);
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
        
        // Actualizar el precio basado en el tamaño seleccionado
        if (values.tamano && variantes.length > 0) {
            const varianteSeleccionada = variantes.find(v => v.tamanio === values.tamano);
            if (varianteSeleccionada) {
                setPrecioActual(varianteSeleccionada.precio);
                setTamanioSeleccionado(values.tamano);
            }
        }
    };

    // Cargar las variantes del producto
    const cargarVariantes = async (idProducto) => {
        try {
            const response = await productoController.obtenerVariantesPorIdDeProducto(idProducto);
            if (response && response.length>0) {
                setVariantes(response);
                
                    const primerVariante = response[0];
                    setPrecioActual(primerVariante.precio);
                    setTamanioSeleccionado(primerVariante.tamanio);
                    
                    // Inicializar los formValues con el primer tamaño
                    setFormValues(prev => ({
                        ...prev,
                        tamano: primerVariante.tamanio
                    }));
                
            }
        } catch (error) {
            console.error('Error al cargar variantes:', error);
        }
    };

      useEffect(() => {
        if (location.state?.productoData) {
            const productoActual = location.state.productoData;
            setProducto(productoActual);

            // Cargar las variantes al recibir el producto
            if (productoActual.id) {
                cargarVariantes(productoActual.id);
            }
        } else {
            navigate('/registrar-venta');
        }
    }, [location.state, navigate]);

    if (!producto) {
        return <div>Cargando producto...</div>;
    }

    const opcionesTamanio = variantes.map(variante => variante.tamanio);

    const formFields = [
        {
          id: 'tamano',
          type: 'buttons',
          label: 'Tamaño',
          options: opcionesTamanio.length > 0 ? opcionesTamanio : ['Chico', 'Mediano', 'Grande'],
          formRef: formRef,
        },
        {
          id: 'notas',
          type: 'textarea',
          label: 'Notas',
          formRef: formRef
        },
    ];



    const handleAceptar = () => {
        // Obtener los valores del formulario
        let detalles = {};
        
        if (formRef.current && formRef.current.getFormValues) {
            detalles = formRef.current.getFormValues();
        } else {
            detalles = formValues;
        }
        
        const varianteSeleccionada = variantes.find(v => v.tamanio === detalles.tamano);

        // Agregar el producto al contexto
        addProducto({
            ...producto,
            price: precioActual,
            varianteId: varianteSeleccionada ? varianteSeleccionada.id : null
        }, detalles);
        
       
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
                        <p>{formatPrice(precioActual)}</p>
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
                            <FormDetallesProducto 
                            fields={formFields}
                            onValuesChange={handleFormValuesChange}
                            ref={formRef} 
                            />
                        </div>

                        </div>
                        

                    </PinkRectangle>

                </div>

            </div>
            </div>
           
        
    );
}

export default ProductoDetalles;