import React, { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import NavLeft from '../../../../components/nav_left/NavLeft';
import PinkRectangle from '../../../../components/main_content/PinkRectangle';
import ElegirConsumiblesGrid from '../elegir-consumibles/ElegirConsumibleGrid';
import Swal from 'sweetalert2';
import productoController from '../../../../controllers/ProductoController'; 
import inventarioController from '../../../../controllers/InventarioController';

const ModificarConsumibles = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [consumibles, setConsumibles] = useState([]);
    const [consumiblesSeleccionados, setConsumiblesSeleccionados] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // Datos recibidos de la pantalla anterior
    const { variantId, productId, variant } = location.state || {};

    // Botones para la navegación
    const navLeftButtons = [
        {
            label: 'Guardar',
            onClick: () => handleGuardar(),
            variant: 'primary'
        },
        {
            label: 'Cancelar',
            onClick: () => handleCancelar(),
            variant: 'primary'
        }
    ];

    useEffect(() => {
        console.log("Datos recibidos en ModificarConsumibles:", location.state);

        if (!variantId) {
            Swal.fire({
                title: 'Error',
                text: 'No se recibió el ID de la variante',
                icon: 'error',
                confirmButtonText: 'Volver',
                confirmButtonColor: '#A2576C'
            }).then(() => {
                navigate(-1);
            });
            return;
        }

        const cargarConsumibles = async () => {
            setIsLoading(true);
            setError(null);
            try {
                // 1. Obtener todos los consumibles disponibles
                const todosLosConsumibles = await inventarioController.obtenerConsumibles();
                setConsumibles(todosLosConsumibles);

                // 2. Obtener los consumibles específicos de la variante (si existen)
                const consumiblesDeVariante = await productoController.obtenerJoinsDeVarianteYConsumiblesPorId(variantId);
                const cantidadesIniciales = {};

                // Mapear las cantidades de los consumibles de la variante
                if (consumiblesDeVariante && Array.isArray(consumiblesDeVariante)) {
                    consumiblesDeVariante.forEach(item => {
                        cantidadesIniciales[item.consumible_id] = item.cantidad_consumible || 0;
                    });
                } else {
                    // Si no hay consumibles para la variante, inicializar todos a 0
                    todosLosConsumibles.forEach(consumible => {
                        cantidadesIniciales[consumible.id] = 0;
                    });
                }

                setConsumiblesSeleccionados(cantidadesIniciales);
                setIsLoading(false);
            } catch (error) {
                console.error("Error al cargar consumibles:", error);
                setError('Error al cargar los consumibles');
                Swal.fire({
                    title: 'Error',
                    text: 'Error al cargar los consumibles',
                    icon: 'error',
                    confirmButtonText: 'Reintentar',
                    confirmButtonColor: '#A2576C'
                });
                setIsLoading(false);
            }
        };

        cargarConsumibles();
    }, [navigate, productoController, location.state?.variantId]);

    const handleCantidadChange = useCallback((id, cantidad) => {
        setConsumiblesSeleccionados(prev => ({
            ...prev,
            [id]: cantidad
        }));
    }, []);

    const handleGuardar = useCallback(() => {
        Swal.fire({
            title: '¿Guardar cambios?',
            text: "¿Estás seguro de querer guardar los cambios en los consumibles?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#A2576C',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, guardar',
            cancelButtonText: 'Cancelar',
            cancelButtonColor: '#fbd275'
        }).then((result) => {
            if (result.isConfirmed) {
                const consumiblesParaGuardar = Object.keys(consumiblesSeleccionados)
                    .filter(id => parseInt(consumiblesSeleccionados[id], 10) > 0)
                    .map(id => ({
                        consumible_id: parseInt(id, 10),
                        cantidad: parseInt(consumiblesSeleccionados[id], 10)
                    }));

                // Aquí llamarías a la función para guardar los consumibles en el backend
                console.log("Consumibles a guardar para variante ID", variantId, ":", consumiblesParaGuardar);
                // TODO: Llamar a productoController.actualizarConsumiblesDeVariante(variantId, consumiblesParaGuardar)
                // .then(() => {
                //     Swal.fire('Guardado!', 'Los consumibles han sido actualizados.', 'success')
                //         .then(() => navigate(-1));
                // })
                // .catch(error => {
                //     console.error("Error al guardar consumibles:", error);
                //     Swal.fire('Error', 'No se pudieron guardar los consumibles.', 'error');
                // });

                // Por ahora, simulamos el guardado y volvemos
                Swal.fire('Simulado!', 'Los consumibles serían actualizados.', 'info')
                    .then(() => navigate(-1));
            }
        });
    }, [navigate, productId, variantId, consumiblesSeleccionados]);

    const handleCancelar = useCallback(() => {
        Swal.fire({
            title: '¿Estás seguro?',
            text: 'Perderás todos los cambios realizados',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, cancelar',
            cancelButtonText: 'No, continuar editando',
            confirmButtonColor: '#A2576C'
        }).then((result) => {
            if (result.isConfirmed) {
                navigate(-1);
            }
        });
    }, [navigate]);

    if (isLoading) {
        return <div className="loading">Cargando consumibles...</div>;
    }

    return (
        <div className="container">
            <div className="nav-left">
                <NavLeft
                    instruction={`Modificar consumibles para tamaño ${variant?.tamanio}`}
                    buttons={navLeftButtons}
                />
            </div>
            <div className="fit-parent">
                <div className="content">
                    <div className="elegir-consumible-content">
                        <PinkRectangle searchable={true}>
                            <ElegirConsumiblesGrid
                                consumibles={consumibles}
                                cantidades={consumiblesSeleccionados}
                                onCantidadChange={handleCantidadChange}
                            />
                        </PinkRectangle>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ModificarConsumibles;