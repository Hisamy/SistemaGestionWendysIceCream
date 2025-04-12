import React from 'react';
import PropTypes from 'prop-types';
import ConsumibleButton from '../../../gestionar_inventario/ConsumibleButton';
import AmountConsumibleButton from '../../../../components/main_content/AmountConsumibleButton.jsx';
import './ElegirConsumibleGrid.css'

const ElegirConsumiblesGrid = ({ 
  consumibles, 
  cantidades, 
  onCantidadChange 
}) => {
  return (
    <div className="elegir-consumibles-grid">
      {consumibles.map(consumible => (
        <div key={consumible.id} className="elegir-consumible-container">
          <ConsumibleButton
            key={consumible.id}
            label={consumible.nombre}
          />
          <AmountConsumibleButton
            quantity={cantidades[consumible.id] || 0}
            onIncrement={() => 
              onCantidadChange(
                consumible.id, 
                (cantidades[consumible.id] || 0) + 1
              )
            }
            onDecrement={() => 
              onCantidadChange(
                consumible.id, 
                Math.max(0, (cantidades[consumible.id] || 0) - 1)
              )
            }
          />
        </div>
      ))}
    </div>
  );
};

ElegirConsumiblesGrid.propTypes = {
  consumibles: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      nombre: PropTypes.string.isRequired, // Corregido de 'name' a 'nombre'
    })
  ).isRequired,
  cantidades: PropTypes.object.isRequired,
  onCantidadChange: PropTypes.func.isRequired
};

export default ElegirConsumiblesGrid;