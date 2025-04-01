import { useCallback } from 'react';
import NavLeft from '../components/nav_left/NavLeft';
 

function GestionarInventario() {
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
    <div className="inventario-page">
      <NavLeft 
        instruction="Selecciona el consumible a gestionar."
        buttons={buttons}
      />
      <div className="inventario-content">
       
      </div>
    </div>
  );
}

export default GestionarInventario;