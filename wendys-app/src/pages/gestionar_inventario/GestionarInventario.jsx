import React, { useState, useCallback } from 'react';
import PinkRectangle from '../../components/main_content/PinkRectangle.jsx';
import ConsumiblesGrid from './ConsumiblesGrid.jsx';
import ActionButton from '../../components/main_content/ActionButton.jsx';
import NavLeft from '../../components/nav_left/NavLeft.jsx';
import './GestionarInventario.css';

const CONSUMIBLES_MOCK = [
  { id: 1, name: 'Cuchara mini' },
  { id: 2, name: 'Cuchara mediana' },
  { id: 3, name: 'Cuchara grande' },
  { id: 4, name: 'Popote' },
  { id: 5, name: 'Servilletas' },
  { id: 6, name: 'Cono' },
  { id: 7, name: 'Canasta' },
  { id: 8, name: 'Vaso litro' },
  { id: 9, name: 'Vaso #201' },
];

function GestionarInventario() {

  const [selectedConsumible, setSelectedConsumible] = useState(null);

  const handleConsumibleClick = useCallback((id) => {
    setSelectedConsumible(id);
    console.log(`Consumible seleccionado: ${id}`);
  }, []);

  const handleRegistrarConsumible = useCallback(() => {
    console.log('Registrando consumible...');
  }, []);

  const handleGenerarReporte = useCallback(() => {
    console.log('Generando reporte...');
  }, []);

  const buttons = [
    {
      label: 'Registrar Consumible',
      onClick: handleRegistrarConsumible,
      variant: 'primary'
    },
    {
      label: 'Generar Reporte',
      onClick: handleGenerarReporte,
      variant: 'secondary'
    }
  ];

  return (
    <div className="inventario-container">
      <div className='nav-left'>
        <NavLeft
          instruction="Selecciona el consumible a gestionar."
          buttons={buttons}
        />
      </div>
      <div className="fit-parent">
        <div className="inventario-content">

          <PinkRectangle searchable={true}>
            <ConsumiblesGrid
              consumibles={CONSUMIBLES_MOCK}
              onConsumibleClick={handleConsumibleClick}
              selectedId={selectedConsumible}
            />
          </PinkRectangle>

        </div>
      </div>

    </div>
  );
}
export default GestionarInventario;