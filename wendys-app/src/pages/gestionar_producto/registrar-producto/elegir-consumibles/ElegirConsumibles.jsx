import NavLeft from "../../../../components/nav_left/NavLeft";
import { useNavigate } from 'react-router-dom';
import React, { useState, useCallback, useEffect } from 'react';
import PinkRectangle from "../../../../components/main_content/PinkRectangle";
import ElegirConsumiblesGrid from "./ElegirConsumibleGrid";
import inventarioController from '../../../../controllers/InventarioController.js';

function ElegirConsumibles(){
    const navigate = useNavigate();
    const [consumiblesSeleccionados, setConsumiblesSeleccionados] = useState({});
    const [consumibles, setConsumibles] = useState([]);

    // Busca por consumibles
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

    const MOCK_CONSUMIBLES = [
        { id : '01', nombre: 'Cuchara mini'},
        { id : '02', nombre: 'Cuchara mediana'},
        { id : '03', nombre: 'Cuchara grande'},
        { id : '04', nombre: 'Popote'},
        { id : '05', nombre: 'Servilletas'},
        { id : '06', nombre: 'Cono'},

    ];


    // Aun no se que debe retornar
    const getConsumiblesAmount = () => {
        return Object.entries(consumiblesSeleccionados)
            .filter(([_, cantidad]) => cantidad > 0)
            .map(([id, cantidad]) => {
                const consumible = consumibles.find(c => c.id === id);
                return {
                    id,
                    nombre: consumible.nombre,
                    cantidad
                };
            });
    };

    

    const handleAceptar = () =>{
        const consumiblesParaProducto = getConsumiblesAmount();
        console.log('Consumibles seleccionados:', consumiblesParaProducto);
        localStorage.setItem('consumiblesSeleccionados', JSON.stringify(consumiblesParaProducto));
        navigate('/registrar-producto');

    }
    const handleCancelar = () =>{
        navigate('/registrar-producto');
    }

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
    return(
        <div className="container">
            <div className="nav-left">
            <NavLeft
                instruction="Selecciona los consumibles a utilizar en el producto."
                buttons= {navLeftButtons}
            />
            </div>
            <div className="fit-parent">
                <div className="content">
                    <div className="elegir-consumible-content">
                        <PinkRectangle searchable={true}>
                            <ElegirConsumiblesGrid 
                                consumibles={consumibles}
                            />
                        </PinkRectangle> 
                    </div>
                </div>
                

            </div>
           
            

        </div>
    );

}

export default ElegirConsumibles;