import NavLeft from "../../../../components/nav_left/NavLeft";
import { useNavigate, useLocation } from 'react-router-dom';
import React, { useState, useCallback, useEffect } from 'react';
import PinkRectangle from "../../../../components/main_content/PinkRectangle";
import ElegirConsumiblesGrid from "./ElegirConsumibleGrid";
import inventarioController from '../../../../controllers/InventarioController.js';

function ElegirConsumibles() {
    const navigate = useNavigate();
    const location = useLocation();
    const { variantIndex, consumiblesActuales = [] } = location.state || {};

    const [consumiblesSeleccionados, setConsumiblesSeleccionados] = useState(() => {
        const inicial = {};
        consumiblesActuales.forEach(c => {
            inicial[c.id] = c.cantidad;
        });
        return inicial;
    });
    const [consumibles, setConsumibles] = useState([]);

    // Obtener consumibles del servidor
    useEffect(() => {
        const fetchConsumibles = async () => {
            try {
                const consumiblesEncontrados = await inventarioController.obtenerConsumibles();
                setConsumibles(consumiblesEncontrados);
            } catch (error) {
                console.error("Error fetching consumibles:", error);
            }
        };
        fetchConsumibles();
    }, []);

    const handleCantidadChange = (id, cantidad) => {
        setConsumiblesSeleccionados(prev => ({
            ...prev,
            [id]: Math.max(0, cantidad)
        }));
    };

    const handleAceptar = () => {
        const consumiblesParaVariante = Object.entries(consumiblesSeleccionados)
            .filter(([_, cantidad]) => cantidad > 0)
            .map(([id, cantidad]) => ({
                id: parseInt(id),
                cantidad: parseInt(cantidad)
            }));

        // Navegar enviando los consumibles actualizados
        navigate('/registrar-producto', {
            state: {
                variantIndex,
                consumibles: consumiblesParaVariante,
                preserveState: true 
            }
        });
    };

    const handleCancelar = () => {
        navigate('/registrar-producto');
    };

    const navLeftButtons = [
        {
            label: 'Aceptar',
            onClick: handleAceptar,
            variant: 'primary'
        },
        {
            label: 'Cancelar',
            onClick: handleCancelar,
            variant: 'primary'
        },
    ];

    return (
        <div className="container">
            <div className="nav-left">
                <NavLeft
                    instruction="Selecciona los consumibles a utilizar en el producto."
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

}

export default ElegirConsumibles;