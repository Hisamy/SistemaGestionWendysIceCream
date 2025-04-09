import NavLeft from "../../../../components/nav_left/NavLeft";
import { useNavigate } from 'react-router-dom';
import React, { useState, useCallback } from 'react';
import PinkRectangle from "../../../../components/main_content/PinkRectangle";
import ElegirConsumiblesGrid from "./ElegirConsumibleGrid";

function ElegirConsumibles(){
    const navigate = useNavigate();
    const [consumiblesSeleccionados, setConsumiblesSeleccionados] = useState({});

    const MOCK_CONSUMIBLES = [
        { id : '01', name: 'Cuchara mini'},
        { id : '02', name: 'Cuchara mediana'},
        { id : '03', name: 'Cuchara grande'},
        { id : '04', name: 'Popote'},
        { id : '05', name: 'Servilletas'},
        { id : '06', name: 'Cono'},

    ];


    const getConsumiblesAmount = () => {
        return Object.entries(consumiblesSeleccionados)
            .filter(([_, cantidad]) => cantidad > 0)
            .map(([id, cantidad]) => {
                const consumible = MOCK_CONSUMIBLES.find(c => c.id === id);
                return {
                    id,
                    name: consumible.name,
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
                                consumibles={MOCK_CONSUMIBLES}
                            />
                        </PinkRectangle> 
                    </div>
                </div>
                

            </div>
           
            

        </div>
    );

}

export default ElegirConsumibles;