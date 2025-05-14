import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Swal from 'sweetalert2';
import NavLeft from '../../../../components/nav_left/NavLeft';
import PinkRectangle from '../../../../components/main_content/PinkRectangle';
import DimensionesFormEditable from './DimensionesFormEditable';


const ModificarVariablesProducto = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const productId = location.state?.productId;

    const [datosProducto, setDatosProducto] = useState({
        id: productId,
        variantes: []
    });

    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!productId) {
            Swal.fire({
                title: 'Error',
                text: 'No se recibió el ID del producto a modificar',
                icon: 'error',
                confirmButtonText: 'Volver',
                confirmButtonColor: '#A2576C'
            }).then(() => {
                navigate(-1);
            });
            return;
        }
        const mockProductData = {
            id: productId,
            variantes: [
                {
                    precio: 30.0,
                    tamanio: 'CHICO',
                    consumibles: [
                        { id: 1, nombre: 'vaso', cantidad: 1 },
                        { id: 2, nombre: 'cuchara', cantidad: 1 }
                    ]
                },
                {
                    precio: 60.0,
                    tamanio: 'MEDIANO',
                    consumibles: [
                        { id: 3, nombre: 'vasoMediano', cantidad: 1 },
                        { id: 4, nombre: 'cucharaMediana', cantidad: 1 }
                    ]
                }
            ]
        };

        setDatosProducto(mockProductData);
        setIsLoading(false);

        // Implementación real debería ser algo como:
        /*
        const fetchProductData = async () => {
          try {
            setIsLoading(true);
            const response = await fetch(`/api/productos/${productId}`);
            if (!response.ok) throw new Error('Error al cargar el producto');
            const data = await response.json();
            setDatosProducto(data);
          } catch (error) {
            console.error('Error:', error);
            Swal.fire({
              title: 'Error',
              text: 'No se pudo cargar la información del producto',
              icon: 'error',
              confirmButtonText: 'Reintentar',
              confirmButtonColor: '#A2576C'
            });
          } finally {
            setIsLoading(false);
          }
        };
        
        fetchProductData();
        */
    }, [productId, navigate]);
    const updateVariantData = (index, field, value) => {
        const updatedVariantes = [...datosProducto.variantes];
        updatedVariantes[index] = {
            ...updatedVariantes[index],
            [field]: value
        };
        setDatosProducto(prev => ({
            ...prev,
            variantes: updatedVariantes
        }));
    };

    const addVariant = (newVariant) => {
        setDatosProducto(prev => ({
            ...prev,
            variantes: [...prev.variantes, newVariant]
        }));
    };

    const removeVariant = (index) => {
        const updatedVariantes = datosProducto.variantes.filter((_, i) => i !== index);
        setDatosProducto(prev => ({
            ...prev,
            variantes: updatedVariantes
        }));
    };

    const handleSelectConsumibles = (index) => {
        const variant = datosProducto.variantes[index];

        navigate('/modificar-consumibles', {
            state: {
                productId: datosProducto.id,
                variantIndex: index,
                variant: {
                    tamanio: variant.tamanio,
                    consumibles: variant.consumibles || {}
                }
            }
        });
    };

    const handleGuardar = async () => {
        // Validaciones básicas
        if (datosProducto.variantes.length === 0) {
            Swal.fire({
                title: 'Error',
                text: 'Debe agregar al menos una variante',
                icon: 'error',
                confirmButtonText: 'Entendido',
                confirmButtonColor: '#A2576C'
            });
            return;
        }

        // Validar que todas las variantes tengan precio y tamaño
        const variantesInvalidas = datosProducto.variantes.some(
            v => !v.tamanio || v.precio === null || v.precio === undefined
        );

        if (variantesInvalidas) {
            Swal.fire({
                title: 'Error',
                text: 'Todas las variantes deben tener tamaño y precio',
                icon: 'error',
                confirmButtonText: 'Entendido',
                confirmButtonColor: '#A2576C'
            });
            return;
        }

        try {
            // Aquí iría el código para enviar los datos al servidor
            console.log('Datos a guardar:', datosProducto);

            // Simular éxito
            Swal.fire({
                title: 'Éxito',
                text: 'Variables del producto actualizadas correctamente',
                icon: 'success',
                confirmButtonText: 'Continuar',
                confirmButtonColor: '#A2576C'
            }).then(() => {
                navigate(-1); // Volver a la pantalla anterior
            });
        } catch (error) {
            console.error('Error al guardar:', error);
            Swal.fire({
                title: 'Error',
                text: 'No se pudieron guardar los cambios',
                icon: 'error',
                confirmButtonText: 'Entendido',
                confirmButtonColor: '#A2576C'
            });
        }
    };

    const handleGuardarCambiosVariantes = () => {
        Swal.fire({
            title: '¿Estás seguro?',
            text: 'Guardar Cambios en las variantes del producto',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Guardar cambios',
            cancelButtonText: 'Cancelar',
            confirmButtonColor: '#A2576C'
        }).then((result) => {
            if (result.isConfirmed) {
                navigate(-1);
            }
        });
    };


    const handleCancelar = () => {
        Swal.fire({
            title: '¿Estás seguro?',
            text: 'Perderás todos los cambios realizados',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Cancelar',
            cancelButtonText: 'No, continuar editando',
            confirmButtonColor: '#A2576C'
        }).then((result) => {
            if (result.isConfirmed) {
                navigate(-1);
            }
        });
    };

    const navLeftButtons = [
        {
            label: 'Guardar Cambios',
            onClick: handleGuardarCambiosVariantes,
            variant: 'primary'
        },
        {
            label: 'Cancelar',
            onClick: handleCancelar,
            variant: 'primary'
        },

    ];

    if (isLoading) {
        return <div className="loading">Cargando datos del producto...</div>;
    }

    return (
        <div className="container">
            <div className='nav-left'>
                <NavLeft
                    instruction="Modificar las variables del producto"
                    buttons={navLeftButtons}
                />
            </div>
            <div className="fit-parent">
                <div className="modificar-variables-content">
                    <PinkRectangle>
                        <div className="form-container">
                            <form id="modificar-form" className="producto-form">
                                <label className="section-label">Dimensiones</label>
                                <div className="dimensiones-container">
                                    {datosProducto.variantes && datosProducto.variantes.length > 0 ? (
                                        datosProducto.variantes.map((variant, index) => (
                                            <DimensionesFormEditable
                                                key={index}
                                                index={index}
                                                variant={{
                                                    ...variant,
                                                    productId: datosProducto.id
                                                }}
                                                onUpdate={updateVariantData}
                                                onRemove={removeVariant}
                                                onSelectConsumibles={handleSelectConsumibles}
                                            />
                                        ))
                                    ) : (
                                        <p className="no-variants-message">No hay variantes agregadas</p>
                                    )}
                                    <div className="add-button-container">
                                        <button
                                            type="button"
                                            className="add-variant-button"
                                            onClick={() => addVariant({
                                                tamanio: '',
                                                precio: 0,
                                                consumibles: {}
                                            })}
                                        >
                                            +
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </PinkRectangle>
                </div>
            </div>
        </div>
    );
};


export default ModificarVariablesProducto;