
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import NavLeft from '../../../../components/nav_left/NavLeft';
import PinkRectangle from '../../../../components/main_content/PinkRectangle';
import ElegirConsumiblesGrid from '../elegir-consumibles/ElegirConsumibleGrid';
import Swal from 'sweetalert2';

const ModificarConsumibles = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [consumibles, setConsumibles] = useState([]);
    const [consumiblesSeleccionados, setConsumiblesSeleccionados] = useState({});
    const [isLoading, setIsLoading] = useState(true);

    // Datos recibidos de la pantalla anterior
    const { productId, variantIndex, variant } = location.state || {};

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
        console.log("Datos recibidos:", location.state);
        // Verificar que tengamos datos válidos
        if (!productId || variantIndex === undefined || !variant) {
            Swal.fire({
                title: 'Error',
                text: 'No se recibieron los datos necesarios',
                icon: 'error',
                confirmButtonText: 'Volver',
                confirmButtonColor: '#A2576C'
            }).then(() => {
                navigate(-1);
            });
            return;
        }

        // Cargar todos los consumibles de la BD
        const cargarConsumibles = async () => {
            try {
                setIsLoading(true);

                const consumiblesDB = [
                    { id: 1, nombre: 'Vaso' },
                    { id: 2, nombre: 'Cuchara' },
                    { id: 3, nombre: 'Vaso Mediano' },
                    { id: 4, nombre: 'Cuchara Mediana' },
                    { id: 5, nombre: 'Vaso Grande' },
                    { id: 6, nombre: 'Cuchara Grande' },
                    { id: 7, nombre: 'Servilleta' },
                    { id: 8, nombre: 'Popote' },
                    { id: 9, nombre: 'Tapa' },
                    { id: 10, nombre: 'Bolsa' }
                ];

                setConsumibles(consumiblesDB);

                // Inicializar todas las cantidades a 0
                const cantidadesIniciales = {};

                if (variant.consumibles && typeof variant.consumibles === 'object' && !Array.isArray(variant.consumibles)) {
                    Object.entries(variant.consumibles).forEach(([id, consumible]) => {
                        cantidadesIniciales[id] = consumible.cantidad;
                    });
                }

                setConsumiblesSeleccionados(cantidadesIniciales);
                setIsLoading(false);
            } catch (error) {
                console.error("Error al cargar consumibles:", error);
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
    }, [productId, variantIndex, variant, navigate]);

    const handleCantidadChange = (id, cantidad) => {
        setConsumiblesSeleccionados(prev => ({
            ...prev,
            [id]: cantidad
        }));
    };

    const handleGuardar = () => {
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
                const consumiblesActualizados = Object.keys(consumiblesSeleccionados)
                    .filter(id => consumiblesSeleccionados[id] > 0)
                    .map(id => {
                        const idNumerico = parseInt(id, 10);
                        const consumible = consumibles.find(c => c.id === idNumerico);
                        return {
                            id: idNumerico,
                            nombre: consumible.nombre,
                            cantidad: consumiblesSeleccionados[id]
                        };
                    });

                navigate(-1, {
                    state: {
                        productId,
                        variantIndex,
                        consumiblesActualizados
                    }
                });
            }
        });
    };

    const handleCancelar = () => {
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
    };

    if (isLoading) {
        return <div className="loading">Cargando consumibles...</div>;
    }

    return (
        <div className="container">
            <div className="nav-left">
                <NavLeft
                    instruction={`Modificar consumibles para tamaño ${variant.tamanio}`}
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