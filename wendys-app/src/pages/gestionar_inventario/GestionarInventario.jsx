import React, { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; 
import PinkRectangle from '../../components/main_content/PinkRectangle.jsx';
import ConsumiblesGrid from './ConsumiblesGrid.jsx';
import NavLeft from '../../components/nav_left/NavLeft.jsx';
import inventarioController from '../../controllers/InventarioController.js';

function GestionarInventario() {

  const navigate = useNavigate();
  const [selectedConsumible, setSelectedConsumible] = useState(null);
  const [consumibles, setConsumibles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(()=> {
    const cargarConsumibles = async () => {
      try {
        const data = await inventarioController.obtenerConsumibles();
        const consumiblesMapeados = data.map(item => ({
          id: item.id,
          name: item.nombre
        }));
        setConsumibles(consumiblesMapeados);
        setLoading(false);
      } catch (error) {
        console.error("Error al cargar consumibles:", error);
        setError("Error al cargar los consumibles. Por favor, intenta de nuevo.");
        setLoading(false);
      }
    };
    cargarConsumibles();
  }, []);

  const handleConsumibleClick = useCallback((consumible) => {
    setSelectedConsumible(consumible.id);
    navigate('/gestionar-consumible', { state: { id: consumible.id } });
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
    <div className="container">
      <div className='nav-left'>
        <NavLeft
          instruction="Selecciona el consumible a gestionar."
          buttons={buttons}
        />
      </div>
      <div className="fit-parent">
        <div className="content">

        <PinkRectangle searchable={true}>
            {loading ? (
              <div className="loading-message">Cargando consumibles...</div>
            ) : error ? (
              <div className="error-message">{error}</div>
            ) : (
              <ConsumiblesGrid
                consumibles={consumibles}
                onConsumibleClick={handleConsumibleClick}
                selectedId={selectedConsumible}
              />
            )}
          </PinkRectangle>

        </div>
      </div>

    </div>
  );
}

export default GestionarInventario;