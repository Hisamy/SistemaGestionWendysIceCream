import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Swal from 'sweetalert2';
import NavLeft from '../../../../components/nav_left/NavLeft';
import PinkRectangle from '../../../../components/main_content/PinkRectangle';
import DimensionesFormEditable from './DimensionesFormEditable';
import productoController from '../../../../controllers/ProductoController';

const ModificarVariablesProducto = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const productId = location.state?.productId;

    const [datosProducto, setDatosProducto] = useState({ id: productId, variantes: [] });
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // Utilizamos useCallback para memoizar la función de fetch
    const fetchProductData = useCallback(async (id) => {
        if (!id) {
            setError('No se recibió el ID del producto a modificar');
            setIsLoading(false);
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            const data = await productoController.obtenerVariantesPorIdDeProducto(id);
            setDatosProducto({ id: id, variantes: Array.isArray(data) ? data : [data] });
            setIsLoading(false);
        } catch (err) {
            console.error('Error al cargar las variantes del producto:', err);
            setError('No se pudo cargar la información del producto');
            setIsLoading(false);
        }
    }, [productoController]);

    useEffect(() => {
        fetchProductData(productId);
    }, [fetchProductData, productId]);

    const updateVariantData = useCallback((index, field, value) => {
        setDatosProducto(prev => ({
            ...prev,
            variantes: prev.variantes.map((variant, i) =>
                i === index ? { ...variant, [field]: value } : variant
            ),
        }));
    }, []);

    const addVariant = useCallback((newVariant) => {
        setDatosProducto(prev => ({
            ...prev,
            variantes: [...prev.variantes, newVariant],
        }));
    }, []);

    const removeVariant = useCallback((index) => {
        setDatosProducto(prev => ({
            ...prev,
            variantes: prev.variantes.filter((_, i) => i !== index),
        }));
    }, []);

    const handleSelectConsumibles = useCallback((index) => {
        const variant = datosProducto.variantes[index];
        navigate('/modificar-consumibles', {
            state: {
                productId: datosProducto.id,
                variantIndex: index,
                variant: {
                    tamanio: variant.tamanio,
                    consumibles: variant.consumibles || {},
                },
            },
        });
    }, [navigate, datosProducto]);

    const handleGuardarCambiosVariantes = useCallback(async () => {
        if (datosProducto.variantes.length === 0) {
        Swal.fire({ title: 'Error', text: 'Debe agregar al menos una variante', icon: 'error', confirmButtonText: 'Entendido', confirmButtonColor: '#A2576C' });
        return;
    }

    const variantesInvalidas = datosProducto.variantes.some(v => !v.tamanio || v.precio === null || v.precio === undefined);
    if (variantesInvalidas) {
        Swal.fire({ title: 'Error', text: 'Todas las variantes deben tener tamaño y precio', icon: 'error', confirmButtonText: 'Entendido', confirmButtonColor: '#A2576C' });
        return;
    }

    setIsLoading(true);
    setError(null);

    try {
     
                await productoController.actualizarVariantes(datosProducto.id, datosProducto.variantes);


        // Hacer un nuevo fetch de los datos actualizados
        const newData = datosProducto.variantes;
        setDatosProducto({ id: datosProducto.id, variantes: Array.isArray(newData) ? newData : [newData] });

        
        // Si la petición fue exitosa (no lanzó un error), mostramos el SweetAlert de éxito
        Swal.fire({ title: 'Éxito', text: 'Cambios guardados correctamente', icon: 'success', confirmButtonText: 'Volver', confirmButtonColor: '#A2576C' })
            .then(() => navigate(-1));
        } catch (error) {
            console.error('Error al guardar cambios:', error);
            setError('No se pudieron guardar los cambios');
            Swal.fire({ title: 'Error', text: 'No se pudieron guardar los cambios', icon: 'error', confirmButtonText: 'Entendido', confirmButtonColor: '#A2576C' });
        } finally {
            setIsLoading(false); // Ocultar carga después de la operación
        }
    }, [navigate, productoController, datosProducto]); // Dependencias importantes: navigate, productoController, datosProducto

    const handleCancelar = useCallback(() => {
        Swal.fire({ title: '¿Estás seguro?', text: 'Perderás todos los cambios realizados', icon: 'warning', showCancelButton: true, confirmButtonText: 'Sí, cancelar', cancelButtonText: 'No, continuar editando', confirmButtonColor: '#A2576C' })
            .then((result) => {
                if (result.isConfirmed) {
                    navigate(-1);
                }
            });
    }, [navigate]);

    const navLeftButtons = [
        { label: 'Guardar Cambios', onClick: handleGuardarCambiosVariantes, variant: 'primary' },
        { label: 'Cancelar', onClick: handleCancelar, variant: 'primary' },
    ];

    if (isLoading) {
        return <div className="loading">Cargando datos del producto...</div>;
    }

    if (error) {
        return <div className="error">Error: {error}</div>;
    }

    return (
        <div className="container">
            <div className='nav-left'>
                <NavLeft instruction="Modificar las variables del producto" buttons={navLeftButtons} />
            </div>
            <div className="fit-parent">
                <div className="modificar-variables-content">
                    <PinkRectangle>
                        <div className="form-container">
                            <form id="modificar-form" className="producto-form">
                                <label className="section-label">Dimensiones</label>
                                <div className="dimensiones-container">
                                    {datosProducto.variantes.map((variant, index) => (
                                        <DimensionesFormEditable
                                            key={index}
                                            index={index}
                                            variant={{ ...variant, productId: datosProducto.id }}
                                            onUpdate={updateVariantData}
                                            onRemove={removeVariant}
                                            onSelectConsumibles={handleSelectConsumibles}
                                        />
                                    ))}
                                    <div className="add-button-container">
                                        <button
                                            type="button"
                                            className="add-variant-button"
                                            onClick={() => addVariant({ tamanio: '', precio: 0, consumibles: {} })}
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