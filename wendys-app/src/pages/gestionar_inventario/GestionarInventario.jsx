import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom'; 
import PinkRectangle from '../../components/main_content/PinkRectangle.jsx';
import ConsumiblesGrid from './ConsumiblesGrid.jsx';
import NavLeft from '../../components/nav_left/NavLeft.jsx';
import './GestionarInventario.css';

const CONSUMIBLES_MOCK = [
  { id: 1, name: 'Cuchara mini', cantidad: 7, merma: 0 },
  { id: 2, name: 'Cuchara mediana', cantidad: 15, merma: 3  },
  { id: 3, name: 'Cuchara grande', cantidad: 25, merma: 2  },
  { id: 4, name: 'Popote', cantidad: 30, merma: 1  },
  { id: 5, name: 'Servilletas', cantidad: 100, merma: 0  },
  { id: 6, name: 'Cono', cantidad: 15, merma: 0  },
  { id: 7, name: 'Canasta', cantidad: 5, merma: 5  },
  { id: 8, name: 'Vaso litro', cantidad: 50, merma: 2  },
  { id: 9, name: 'Vaso #201', cantidad: 20, merma: 0  },
];

function GestionarInventario() {

  const navigate = useNavigate();
  const [selectedConsumible, setSelectedConsumible] = useState(null);

  const handleConsumibleClick = useCallback((consumible) => {
    setSelectedConsumible(consumible.id);
    navigate('/gestionar-consumible', { state: { consumibleData: consumible } });
  }, [navigate]);

  const handleRegistrarConsumible = useCallback(() => {
    console.log('Registrando consumible...');
    navigate('/registrar-consumible');
  }, [navigate]);

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
              selectedId={selectedConsumible?.id}
            />
          </PinkRectangle>

        </div>
      </div>

    </div>
  );
}
export default GestionarInventario;