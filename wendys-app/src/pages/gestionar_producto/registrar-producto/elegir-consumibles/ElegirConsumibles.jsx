import NavLeft from "../../../../components/nav_left/NavLeft";
import { useNavigate, useLocation } from 'react-router-dom';
import React, { useState, useCallback, useEffect } from 'react';
import PinkRectangle from "../../../../components/main_content/PinkRectangle";
import ElegirConsumiblesGrid from "./ElegirConsumibleGrid";
import inventarioController from '../../../../controllers/InventarioController.js';

function ElegirConsumibles() {
    const navigate = useNavigate();
    const location = useLocation();
    const { variantIndex } = location.state || {}; // Recibimos el índice de la variante
    const [consumiblesSeleccionados, setConsumiblesSeleccionados] = useState({});
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

    // Cargar selección previa si existe
    useEffect(() => {
        const storedSelection = localStorage.getItem('consumiblesSeleccionados');
        if (storedSelection) {
            const { index, consumibles } = JSON.parse(storedSelection);
            if (index === variantIndex) {
                const initialSelection = consumibles.reduce((acc, curr) => {
                    acc[curr.id] = curr.cantidad;
                    return acc;
                }, {});
                setConsumiblesSeleccionados(initialSelection);
            }
        }
    }, [variantIndex]);

    const handleCantidadChange = (id, cantidad) => {
        setConsumiblesSeleccionados(prev => ({
            ...prev,
            [id]: Math.max(0, cantidad)
        }));
    };

    const handleAceptar = () => {
        console.log("Consumibles al momento de aceptar consumibles elegidos:");
        console.log(consumiblesSeleccionados);
        
        
        const consumiblesParaVariante = Object.entries(consumiblesSeleccionados)
            .filter(([_, cantidad]) => cantidad > 0)
            .map(([id, cantidad]) => ({
                id: parseInt(id),
                cantidad: parseInt(cantidad)
            }));

        // Cambiar localStorage por sessionStorage
        sessionStorage.setItem('selectedConsumibles', JSON.stringify({
            variantIndex: variantIndex,
            consumibles: consumiblesParaVariante
        }));

        navigate('/registrar-producto');
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